/**
 * URL Lexical & Heuristic Security Analyzer for ScamShield AI.
 * 
 * STRICT CYBERSECURITY COMPLIANCE:
 * - NEVER fetches, resolves, or opens untrusted user URLs (zero outbound HTTP/DNS requests).
 * - Safe against SSRF, internal network probing, and drive-by malware delivery.
 * - Inspects structure, brand similarity, punycode/IDN, IP hosts, shorteners, and deceptive encoding.
 */

const KNOWN_BRANDS = [
  { name: 'State Bank of India', tokens: ['sbi', 'statebankofindia'], officialDomains: ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com'] },
  { name: 'HDFC Bank', tokens: ['hdfc', 'hdfcbank'], officialDomains: ['hdfcbank.com'] },
  { name: 'ICICI Bank', tokens: ['icici', 'icicibank'], officialDomains: ['icicibank.com'] },
  { name: 'Axis Bank', tokens: ['axis', 'axisbank'], officialDomains: ['axisbank.com'] },
  { name: 'Punjab National Bank', tokens: ['pnb', 'pnbindia'], officialDomains: ['pnbindia.in'] },
  { name: 'Paytm', tokens: ['paytm'], officialDomains: ['paytm.com'] },
  { name: 'PhonePe', tokens: ['phonepe'], officialDomains: ['phonepe.com'] },
  { name: 'Google', tokens: ['google', 'gmail'], officialDomains: ['google.com', 'google.co.in'] },
  { name: 'Amazon', tokens: ['amazon'], officialDomains: ['amazon.com', 'amazon.in'] },
  { name: 'Apple', tokens: ['apple', 'icloud'], officialDomains: ['apple.com', 'icloud.com'] },
  { name: 'Microsoft', tokens: ['microsoft', 'outlook', 'office365'], officialDomains: ['microsoft.com', 'live.com', 'office.com'] },
  { name: 'Netflix', tokens: ['netflix'], officialDomains: ['netflix.com'] },
  { name: 'PayPal', tokens: ['paypal'], officialDomains: ['paypal.com'] },
  { name: 'MetaMask', tokens: ['metamask', 'mitamsk', 'metamusk', 'matamask'], officialDomains: ['metamask.io'] },
  { name: 'Binance', tokens: ['binance'], officialDomains: ['binance.com'] },
  { name: 'Trust Wallet', tokens: ['trustwallet'], officialDomains: ['trustwallet.com'] },
  { name: 'Coinbase', tokens: ['coinbase'], officialDomains: ['coinbase.com'] },
  { name: 'India Post', tokens: ['indiapost', 'speedpost'], officialDomains: ['indiapost.gov.in'] },
  { name: 'Income Tax India', tokens: ['incometax', 'incometaxindia'], officialDomains: ['incometax.gov.in'] },
  { name: 'UIDAI Aadhaar', tokens: ['uidai', 'aadhaar'], officialDomains: ['uidai.gov.in'] }
];

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 
  'cutt.ly', 'rb.gy', 'rebrand.ly', 'tiny.cc', 'bl.ink'
]);

const FREE_HOSTING_PROVIDERS = [
  'godaddysites.com', 'weebly.com', 'wixsite.com', '000webhostapp.com', 
  'firebaseapp.com', 'web.app', 'pages.dev', 'vercel.app', 'github.io', 
  'netlify.app', 'blogspot.com', 'sites.google.com', 'glitch.me'
];

const CREDENTIAL_KEYWORDS = [
  'login', 'lgoin', 'signin', 'verify', 'verification', 'kyc', 'update', 'password',
  'credential', 'otp', 'pan', 'aadhaar', 'unblock', 'suspend', 'security-check',
  'wallet', 'seed', 'phrase', 'airdrop', 'claim'
];

// Offline blocklist of confirmed deceptive patterns
const HIGH_RISK_TLDS = new Set(['.top', '.xyz', '.work', '.click', '.loan', '.fit', '.cfd', '.tk', '.ml', '.ga']);

/**
 * Analyzes a given URL strictly lexically without network traversal.
 */
function analyzeUrl(rawUrl) {
  const signals = [];
  let parsedUrl = null;
  let normalizedUrl = (rawUrl || '').trim();

  // Prepend https:// if protocol is omitted to allow parsing
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    parsedUrl = new URL(normalizedUrl);
  } catch (err) {
    return {
      isValid: false,
      rawUrl,
      error: 'Malformed URL: Unable to parse URL structure.',
      signals: [{
        type: 'malformed_url',
        severity: 'high',
        evidence: rawUrl,
        explanation: 'The provided string cannot be safely parsed into a valid URL.',
        source: 'url_parser'
      }],
      riskContribution: 40
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullPath = pathname + search;

  // 1. Protocol Inspection
  if (protocol === 'http:') {
    signals.push({
      type: 'insecure_protocol',
      severity: 'medium',
      evidence: parsedUrl.protocol,
      explanation: 'URL uses unencrypted HTTP protocol, leaving transmissions vulnerable to interception.',
      source: 'url_protocol'
    });
  }

  // 2. IP Address Hostname Detection
  const ipv4Regex = /^(?:(?:\d{1,3}\.){3}\d{1,3})$/;
  const isIpv4 = ipv4Regex.test(hostname);
  if (isIpv4 || hostname.startsWith('[') || /^\d+$/.test(hostname)) {
    signals.push({
      type: 'ip_address_host',
      severity: 'high',
      evidence: hostname,
      explanation: 'The URL uses a raw IP address instead of a registered domain name, a hallmark of malicious infrastructure.',
      source: 'url_structure'
    });
  }

  // 3. Punycode & IDN Lookalike Character Detection
  if (hostname.includes('xn--')) {
    signals.push({
      type: 'punycode_domain',
      severity: 'high',
      evidence: hostname,
      explanation: 'Domain uses Punycode (internationalized domain name), which can visually spoof authentic brand names.',
      source: 'url_structure'
    });
  }

  // Check for Cyrillic/Greek Unicode lookalikes
  const hasLookalikes = /[\u0400-\u04FF\u0370-\u03FF]/.test(parsedUrl.href);
  if (hasLookalikes) {
    signals.push({
      type: 'unicode_homograph',
      severity: 'high',
      evidence: parsedUrl.href,
      explanation: 'URL contains non-Latin Unicode characters resembling standard Latin letters (homograph spoofing).',
      source: 'url_structure'
    });
  }

  // 4. Excessive Subdomains Check
  const domainParts = hostname.split('.');
  if (domainParts.length > 4) {
    signals.push({
      type: 'excessive_subdomains',
      severity: 'medium',
      evidence: hostname,
      explanation: `The domain contains ${domainParts.length - 2} subdomain levels, often used to conceal deceptive infrastructure.`,
      source: 'url_structure'
    });
  }

  // 5. URL Shortener Detection
  if (KNOWN_SHORTENERS.has(hostname)) {
    signals.push({
      type: 'url_shortener',
      severity: 'medium',
      evidence: hostname,
      explanation: 'The URL uses a shortening service that obscures the real destination host from the recipient.',
      source: 'url_structure'
    });
  }

  // 5b. Free Website Builder / Disposable Hosting Detection
  for (const provider of FREE_HOSTING_PROVIDERS) {
    if (hostname.endsWith(provider) && hostname !== provider) {
      const subdomain = hostname.slice(0, -(provider.length + 1));
      const hasSuspiciousSubdomainToken = CREDENTIAL_KEYWORDS.some(kw => subdomain.toLowerCase().includes(kw)) ||
        KNOWN_BRANDS.some(b => b.tokens.some(tok => subdomain.toLowerCase().includes(tok)));

      if (hasSuspiciousSubdomainToken) {
        signals.push({
          type: 'free_hosting_phishing_subdomain',
          severity: 'high',
          evidence: `Subdomain: ${subdomain} on ${provider}`,
          explanation: `Disposable free site-builder (${provider}) hosting a sensitive crypto/banking/login credential lure ("${subdomain}").`,
          source: 'url_reputation'
        });
      }
      break;
    }
  }

  // 6. Suspicious / High-Risk TLD
  for (const tld of HIGH_RISK_TLDS) {
    if (hostname.endsWith(tld)) {
      signals.push({
        type: 'high_risk_tld',
        severity: 'medium',
        evidence: tld,
        explanation: `Domain uses top-level domain ${tld}, which exhibits a disproportionate volume of disposable phishing infrastructure.`,
        source: 'url_structure'
      });
      break;
    }
  }

  // 7. Brand Impersonation Analysis
  let matchedBrand = null;
  for (const brand of KNOWN_BRANDS) {
    const brandMatched = brand.tokens.some(token => {
      // Check if token is in hostname or subdomain
      const tokenRegex = new RegExp(`(^|[.-])${token}([.-]|$)`, 'i');
      return tokenRegex.test(hostname) || hostname.includes(token);
    });

    if (brandMatched) {
      // Check if domain is official
      const isOfficial = brand.officialDomains.some(off => hostname === off || hostname.endsWith('.' + off));
      if (!isOfficial) {
        matchedBrand = brand;
        signals.push({
          type: 'brand_impersonation',
          severity: 'high',
          evidence: `Host: ${hostname} (Simulates: ${brand.name})`,
          explanation: `The hostname closely mimics legitimate entity "${brand.name}", but does NOT match its official domains (${brand.officialDomains.join(', ')}).`,
          source: 'url_brand_check'
        });
      }
      break;
    }
  }

  // 8. Credential Harvesting Keywords in Path
  const foundKeywords = CREDENTIAL_KEYWORDS.filter(kw => fullPath.includes(kw));
  if (foundKeywords.length > 0) {
    // Only flag as elevated if combined with an unverified brand or non-standard structure
    const severity = matchedBrand ? 'high' : 'low';
    signals.push({
      type: 'credential_harvesting_path',
      severity,
      evidence: foundKeywords.join(', '),
      explanation: `URL path contains authentication/sensitive keywords: [${foundKeywords.join(', ')}].`,
      source: 'url_path'
    });
  }

  // 9. Excessively Long or Obfuscated URL
  if (parsedUrl.href.length > 180) {
    signals.push({
      type: 'excessive_url_length',
      severity: 'low',
      evidence: `${parsedUrl.href.length} characters`,
      explanation: 'Unusually long URL structure often utilized to hide parameters or deceive preview snippets.',
      source: 'url_structure'
    });
  }

  // 10. Deceptive Character Encoding (@ symbol trick)
  if (parsedUrl.username || rawUrl.includes('@')) {
    signals.push({
      type: 'userinfo_obfuscation',
      severity: 'high',
      evidence: '@ symbol in URL',
      explanation: 'URL contains "@" symbol, which causes browsers to ignore the preceding text and connect to the domain following the "@".',
      source: 'url_structure'
    });
  }

  // Calculate URL Risk Contribution Score (0 - 100)
  let urlRiskScore = 0;
  signals.forEach(sig => {
    if (sig.severity === 'critical') urlRiskScore += 45;
    else if (sig.severity === 'high') urlRiskScore += 30;
    else if (sig.severity === 'medium') urlRiskScore += 15;
    else if (sig.severity === 'low') urlRiskScore += 5;
  });
  urlRiskScore = Math.min(100, urlRiskScore);

  return {
    isValid: true,
    rawUrl,
    parsed: {
      hostname,
      protocol,
      pathname,
      search,
      isHttps: protocol === 'https:'
    },
    signals,
    matchedBrand: matchedBrand ? matchedBrand.name : null,
    riskContribution: urlRiskScore
  };
}

module.exports = {
  analyzeUrl,
  KNOWN_BRANDS,
  KNOWN_SHORTENERS
};
