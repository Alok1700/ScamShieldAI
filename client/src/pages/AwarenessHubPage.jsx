import React, { useState } from 'react';
import { BookOpen, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, XCircle, PhoneCall, ExternalLink, HelpCircle, ChevronDown, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScanStore } from '../store/scanStore';
import { t } from '../utils/i18n';

export default function AwarenessHubPage() {
  const { language } = useScanStore();

  const educationalScenariosData = {
    en: [
      {
        id: 'upi_trap',
        title: 'The UPI Reverse Payment & Cashback Trap',
        category: 'UPI Fraud',
        summary: 'Scammers send a payment request or QR code claiming you will receive cashback or a refund once you enter your UPI PIN.',
        attackMethod: 'The victim is instructed to open Google Pay, PhonePe, or Paytm and "accept" the request or scan a QR code. When the prompt asks for their UPI PIN, the victim types it believing funds will enter their account.',
        reality: 'UPI PIN is exclusively an AUTHORIZATION TO DEBIT money out of your account. You NEVER need to type a PIN to receive incoming money.',
        goldenRule: 'If someone asks for your UPI PIN to send you money, it is 100% a scam.',
        sampleText: 'You have received a payment of Rs 10,000 from PayTM Cashback. Scan this QR code and enter your UPI PIN to claim your refund directly into your bank.'
      },
      {
        id: 'power_cutoff',
        title: 'Electricity Bill Disconnection SMS Scam',
        category: 'Utility Impersonation',
        summary: 'Victim receives an urgent SMS: "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately."',
        attackMethod: 'Panicked victims call the provided unverified mobile number. The fake officer instructs them to install a remote desktop app (like QuickSupport or AnyDesk) or download an APK to pay a token Rs 10 fee. The app captures netbanking credentials or OTPs.',
        reality: 'State Discoms (like Mahadiscom, BSES, TNEB, UPPCL) never issue personal mobile numbers for disconnections, nor do they cut power at 9:30 PM without formal paper notices.',
        goldenRule: 'Always verify bill status directly inside your electricity board\'s official mobile app or monthly physical bill.',
        sampleText: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210.'
      },
      {
        id: 'telegram_job',
        title: 'Work-from-Home Telegram "Like Videos" Scam',
        category: 'Employment Fraud',
        summary: 'Recruiters send WhatsApp messages offering Rs 3,000–8,000 daily for easy tasks like subscribing to YouTube channels or reviewing hotels on Google Maps.',
        attackMethod: 'Victim performs 3 tasks and receives an initial payout of Rs 150 to build trust. They are then invited into a VIP Telegram investment group where they must deposit Rs 5,000 to unlock higher tiered task profits. Once large sums are deposited, the group admins block the victim.',
        reality: 'No genuine company pays thousands of rupees for random YouTube likes or Map reviews. Prepaid task payments are pyramid fraud schemes.',
        goldenRule: 'Never deposit money to "unlock" salary or job commissions.',
        sampleText: 'Earn Rs 3,000 - 8,000 daily by working from home! Just like YouTube videos and write reviews on Google Maps. No experience needed. Join our Telegram channel: https://t.me/parttime_job_official'
      },
      {
        id: 'digital_arrest',
        title: 'Digital Arrest & Law Enforcement Impersonation',
        category: 'Authority Extortion',
        summary: 'Victim receives a video call from someone in a fake police uniform or CBI officer backdrop claiming a parcel with narcotics or SIM card in their name has been seized.',
        attackMethod: 'The caller threatens immediate arrest warrants and orders the victim to remain on a continuous Skype/WhatsApp video call under "digital arrest". They demand transfer of funds into an "RBI verification escrow account" for clearance.',
        reality: 'There is NO SUCH THING AS "DIGITAL ARREST" in Indian criminal procedure. Real police and CBI officers do not conduct investigations, interrogations, or demand money transfers via Skype or WhatsApp.',
        goldenRule: 'Disconnect immediately and dial 1930 or visit your local police station.',
        sampleText: 'Police Department: A cyber crime complaint has been registered against you. Join Skype call immediately for digital arrest inquiry or face warrant.'
      }
    ],
    hi: [
      {
        id: 'upi_trap',
        title: 'UPI रिवर्स पेमेंट व कैशबैक धोखाधड़ी',
        category: 'UPI धोखाधड़ी',
        summary: 'धोखेबाज भुगतान अनुरोध या QR कोड भेजकर दावा करते हैं कि UPI पिन डालने पर आपको कैशबैक या रिफंड मिलेगा।',
        attackMethod: 'पीड़ित को PhonePe, Google Pay या Paytm खोलकर अनुरोध स्वीकार करने या QR स्कैन करने को कहा जाता है। जब UPI पिन मांगा जाता है, तो पीड़ित सोचता है कि पैसे आ रहे हैं, जबकि वास्तव में पैसे कट जाते हैं।',
        reality: 'UPI पिन केवल आपके खाते से पैसे निकालने (DEBIT) का अधिकार पत्र है। खाते में पैसे प्राप्त करने के लिए कभी भी पिन दर्ज करने की आवश्यकता नहीं होती।',
        goldenRule: 'यदि कोई आपको पैसे भेजने के लिए आपका UPI पिन मांगता है, तो वह 100% साइबर धोखाधड़ी है।',
        sampleText: 'आपको PayTM कैशबैक से 10,000 रुपये प्राप्त हुए हैं। पैसे सीधे बैंक में पाने के लिए QR कोड स्कैन करें और अपना UPI पिन डालें।'
      },
      {
        id: 'power_cutoff',
        title: 'बिजली बिल कटने की फर्जी SMS धमकी',
        category: 'बिजली बिल घोटाला',
        summary: 'पीड़ित को तुरंत बिजली कटने का SMS मिलता है: "प्रिय उपभोक्ता, बिल अपडेट न होने के कारण आज रात 9:30 बजे आपकी बिजली काट दी जाएगी।"',
        attackMethod: 'घबराए पीड़ित दिए गए निजी मोबाइल नंबर पर कॉल करते हैं। फर्जी अधिकारी 10 रुपये का टोकन शुल्क भरने के बहाने रिमोट डेस्कटॉप ऐप (AnyDesk) या APK डाउनलोड करवाकर बैंक क्रेडेंशियल और OTP चुरा लेते हैं।',
        reality: 'राज्य बिजली वितरण कंपनियां कभी भी व्यक्तिगत मोबाइल नंबर से बिजली काटने की धमकी नहीं देतीं और न ही रात 9:30 बजे अचानक बिजली काटी जाती है।',
        goldenRule: 'हमेशा बिजली बिल की स्थिति की जांच केवल आधिकारिक बिजली बोर्ड ऐप या अपने मासिक बिल से ही करें।',
        sampleText: 'प्रिय उपभोक्ता, पिछले महीने का बिल अपडेट न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत हमारे बिजली अधिकारी 9876543210 से संपर्क करें।'
      },
      {
        id: 'telegram_job',
        title: 'घर बैठे पार्ट-टाइम जॉब व यूट्यूब वीडियो लाइक घोटाला',
        category: 'फर्जी जॉब टास्क',
        summary: 'धोखेबाज व्हाट्सएप पर संदेश भेजकर यूट्यूब वीडियो लाइक करने के बदले 3,000 से 8,000 रुपये प्रतिदिन देने का लालच देते हैं।',
        attackMethod: 'शुरुआत में भरोसा जीतने के लिए पीड़ित को 150 रुपये ट्रांसफर किए जाते हैं। फिर एक वीआईपी टेलीग्राम ग्रुप में जोड़कर बड़े मुनाफे के लिए 5,000 रुपये जमा करने को कहा जाता है। बड़ी रकम जमा होते ही ब्लॉक कर दिया जाता है।',
        reality: 'कोई भी वास्तविक कंपनी केवल यूट्यूब लाइक या गूगल रिव्यू के हजारों रुपये नहीं देती। प्रीपेड टास्क योजनाएं पोंजी फ्रॉड हैं।',
        goldenRule: 'वेतन, कमीशन या टास्क का पैसा निकालने के लिए कभी भी अपनी जेब से पैसे जमा न करें।',
        sampleText: 'घर बैठे रोजाना 3,000 - 8,000 रुपये कमाएं! यूट्यूब वीडियो लाइक करें और गूगल मैप्स पर रिव्यू दें। हमारे टेलीग्राम से जुड़ें: https://t.me/parttime_job_official'
      },
      {
        id: 'digital_arrest',
        title: 'फर्जी पुलिस व "डिजिटल अरेस्ट" जबरन वसूली',
        category: 'डिजिटल अरेस्ट धमकी',
        summary: 'पीड़ित को वीडियो कॉल आती है जिसमें धोखेबाज पुलिस या सीबीआई अधिकारी बनकर दावा करते हैं कि उनके नाम से नशीले पदार्थों का पार्सल जब्त हुआ है।',
        attackMethod: 'धोखेबाज तुरंत गिरफ्तारी वारंट की धमकी देते हैं और पीड़ित को स्काइप या व्हाट्सएप वीडियो पर "डिजिटल अरेस्ट" रखकर निगरानी में रखते हैं। फिर पैसे "आरबीआई सत्यापन खाते" में ट्रांसफर करने को कहते हैं।',
        reality: 'भारतीय कानून में "डिजिटल अरेस्ट" जैसा कोई प्रावधान नहीं है। वास्तविक पुलिस अधिकारी कभी भी वीडियो कॉल पर पूछताछ या पैसे की मांग नहीं करते।',
        goldenRule: 'तुरंत कॉल काटें और राष्ट्रीय हेल्पलाइन 1930 पर संपर्क करें या नजदीकी पुलिस स्टेशन जाएं।',
        sampleText: 'पुलिस विभाग: आपके खिलाफ साइबर अपराध का मामला दर्ज हुआ है। डिजिटल अरेस्ट पूछताछ के लिए तुरंत स्काइप से जुड़ें या वारंट का सामना करें।'
      }
    ]
  };

  const educationalScenarios = educationalScenariosData[language] || educationalScenariosData.en;

  const [openDropdowns, setOpenDropdowns] = useState({
    upi_trap: true,
    power_cutoff: false,
    telegram_job: false,
    digital_arrest: false
  });

  const [filterCategory, setFilterCategory] = useState('ALL');

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    educationalScenarios.forEach((s) => {
      allOpen[s.id] = true;
    });
    setOpenDropdowns(allOpen);
  };

  const handleCollapseAll = () => {
    const allClosed = {};
    educationalScenarios.forEach((s) => {
      allClosed[s.id] = false;
    });
    setOpenDropdowns(allClosed);
  };

  const filteredScenarios = filterCategory === 'ALL'
    ? educationalScenarios
    : educationalScenarios.filter((s) => s.category === filterCategory);

  const quizQuestionsData = {
    en: [
      {
        q: 'You receive a QR code with a message: "Scan and enter UPI PIN to receive Rs 2,000 cashback". What happens if you enter your PIN?',
        options: [
          'Rs 2,000 will be debited (deducted) from your bank account.',
          'Rs 2,000 will be safely credited into your account.',
          'Nothing happens; it simply verifies your identity.'
        ],
        correct: 0,
        expl: 'A UPI PIN authorizes a DEBIT. Typing your PIN immediately transfers money out of your account to the scammer.'
      },
      {
        q: 'An SMS says your bank account is blocked and asks you to share your OTP with a support agent. What should you do?',
        options: [
          'Share the OTP because customer care needs to unlock your account.',
          'Never share the OTP with anyone, including bank staff.',
          'Reply to the SMS with your PAN number.'
        ],
        correct: 1,
        expl: 'Banks explicitly instruct that no bank employee or system ever asks for your OTP over phone or SMS.'
      }
    ],
    hi: [
      {
        q: 'आपको एक संदेश मिलता है: "2,000 रुपये का कैशबैक पाने के लिए यह QR कोड स्कैन करें और अपना UPI पिन डालें।" यदि आप पिन दर्ज करते हैं तो क्या होगा?',
        options: [
          'आपके बैंक खाते से 2,000 रुपये कट (डेबिट हो) जाएंगे।',
          'आपके खाते में 2,000 रुपये सुरक्षित रूप से जमा हो जाएंगे।',
          'कुछ नहीं होगा; यह केवल आपकी पहचान सत्यापित करता है।'
        ],
        correct: 0,
        expl: 'UPI पिन केवल पैसे निकालने (DEBIT) का आदेश होता है। पिन दर्ज करते ही पैसे धोखेबाज के खाते में चले जाते हैं।'
      },
      {
        q: 'एक SMS आता है कि आपका बैंक खाता ब्लॉक है और सपोर्ट एजेंट को OTP बताने को कहता है। आपको क्या करना चाहिए?',
        options: [
          'OTP बता दें क्योंकि खाता चालू करने के लिए इसकी जरूरत है।',
          'बैंक स्टाफ सहित किसी के साथ भी कभी भी OTP साझा न करें।',
          'SMS के जवाब में अपना पैन नंबर भेजें।'
        ],
        correct: 1,
        expl: 'बैंक स्पष्ट निर्देश देते हैं कि कोई भी बैंक कर्मचारी या प्रणाली कभी भी फोन या SMS पर आपका OTP नहीं मांगती।'
      }
    ]
  };

  const quizQuestions = quizQuestionsData[language] || quizQuestionsData.en;
  const [selectedAnswers, setSelectedAnswers] = useState({});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-accent font-semibold">
          {t('awareness.badge', language)}
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary mt-1">
          {t('awareness.title', language)}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t('awareness.subtitle', language)}
        </p>
      </div>

      {/* Filter and Accordion Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card-bg border border-card-border shadow-cyber">
        {/* Dropdown Filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-cyan-accent" />
          <label htmlFor="category-select" className="text-xs font-semibold text-text-secondary whitespace-nowrap">
            {language === 'hi' ? 'श्रेणी चुनें:' : 'Filter Category:'}
          </label>
          <select
            id="category-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-secondary-bg border border-card-border text-text-primary rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-cyan-accent cursor-pointer"
          >
            <option value="ALL">{t('awareness.filterAll', language)} ({educationalScenarios.length})</option>
            <option value={language === 'hi' ? 'UPI धोखाधड़ी' : 'UPI Fraud'}>{t('awareness.filterUpi', language)}</option>
            <option value={language === 'hi' ? 'बिजली बिल घोटाला' : 'Utility Impersonation'}>{t('awareness.filterUtility', language)}</option>
            <option value={language === 'hi' ? 'फर्जी जॉब टास्क' : 'Employment Fraud'}>{t('awareness.filterEmployment', language)}</option>
            <option value={language === 'hi' ? 'डिजिटल अरेस्ट धमकी' : 'Authority Extortion'}>{t('awareness.filterAuthority', language)}</option>
          </select>
        </div>

        {/* Expand / Collapse All Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExpandAll}
            className="px-3 py-1.5 rounded-lg bg-secondary-bg hover:bg-card-border border border-card-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {t('awareness.expandAll', language)}
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1.5 rounded-lg bg-secondary-bg hover:bg-card-border border border-card-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {t('awareness.collapseAll', language)}
          </button>
        </div>
      </div>

      {/* Dropdown Accordion List of Scenarios */}
      <div className="space-y-4">
        {filteredScenarios.map((scen) => {
          const isOpen = Boolean(openDropdowns[scen.id]);

          return (
            <div
              key={scen.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-card-bg border-primary/50 shadow-cyber'
                  : 'bg-card-bg/70 border-card-border hover:border-card-border/90'
              }`}
            >
              {/* Dropdown Header / Trigger */}
              <button
                type="button"
                onClick={() => toggleDropdown(scen.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-secondary-bg/30 transition-colors select-none"
                aria-expanded={isOpen}
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 text-cyan-accent border border-primary/30 uppercase tracking-wide">
                      {scen.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30 font-semibold">
                      {language === 'hi' ? 'भारत में अत्यधिक प्रचलित' : 'High Prevalence in India'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-display font-bold text-text-primary tracking-tight">
                    {scen.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {scen.summary}
                  </p>
                </div>

                {/* Dropdown Chevron Indicator */}
                <div className="flex items-center gap-2 shrink-0 self-center">
                  <span className="text-xs text-text-secondary/70 font-mono hidden md:inline">
                    {isOpen ? (language === 'hi' ? 'विवरण छिपाएं' : 'Hide Details') : (language === 'hi' ? 'विवरण देखें' : 'Show Details')}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                      isOpen
                        ? 'bg-primary/20 text-cyan-accent border-primary/40 rotate-180'
                        : 'bg-secondary-bg text-text-secondary border-card-border'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Dropdown Expanded Details Container */}
              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 border-t border-card-border/60 pt-5 space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* How the Attack Unfolds */}
                    <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border/60 space-y-2">
                      <div className="flex items-center gap-2 text-danger font-semibold text-xs uppercase tracking-wide font-mono">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{t('awareness.attackMethod', language)}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {scen.attackMethod}
                      </p>
                    </div>

                    {/* The Critical Reality */}
                    <div className="p-4 rounded-xl bg-secondary-bg/60 border border-card-border/60 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-accent font-semibold text-xs uppercase tracking-wide font-mono">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{t('awareness.reality', language)}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-medium">
                        {scen.reality}
                      </p>
                    </div>
                  </div>

                  {/* Golden Rule Callout */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/15 via-cyan-accent/10 to-transparent border border-cyan-accent/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-accent font-bold">
                        {t('awareness.goldenRule', language)}:
                      </span>
                      <p className="text-xs sm:text-sm text-text-primary font-semibold">
                        {scen.goldenRule}
                      </p>
                    </div>

                    {/* Quick Test in Scanner Link */}
                    <Link
                      to="/scanner"
                      state={{ presetText: scen.sampleText, presetTab: 'message' }}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-all shadow-cyber"
                    >
                      <span>{t('awareness.simulateBtn', language)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Micro-Quiz */}
      <div className="bg-secondary-bg/60 border border-card-border rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-accent" />
          <h3 className="text-lg font-bold text-text-primary">
            {t('awareness.quizTitle', language)}
          </h3>
        </div>
        <p className="text-xs text-text-secondary">
          {t('awareness.quizSub', language)}
        </p>

        <div className="space-y-6">
          {quizQuestions.map((quiz, qIdx) => (
            <div key={qIdx} className="space-y-3">
              <p className="text-sm font-semibold text-text-primary">{qIdx + 1}. {quiz.q}</p>
              <div className="space-y-2">
                {quiz.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[qIdx] === oIdx;
                  const isCorrect = quiz.correct === oIdx;
                  const hasAnswered = selectedAnswers[qIdx] !== undefined;

                  let style = 'bg-card-bg border-card-border text-text-secondary hover:text-text-primary';
                  if (hasAnswered) {
                    if (isCorrect) style = 'bg-success/15 border-success/40 text-success font-semibold';
                    else if (isSelected) style = 'bg-danger/15 border-danger/40 text-danger';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={hasAnswered}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx })}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-danger shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {selectedAnswers[qIdx] !== undefined && (
                <p className="text-xs text-text-secondary bg-card-bg p-3 rounded-lg border border-card-border">
                  <strong>{language === 'hi' ? 'व्याख्या:' : 'Explanation:'}</strong> {quiz.expl}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
