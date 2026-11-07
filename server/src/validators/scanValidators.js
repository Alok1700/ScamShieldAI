const { z } = require('zod');

const scanTextSchema = z.object({
  text: z.string().trim().min(1, 'Text content cannot be empty').max(10000, 'Text exceeds 10,000 characters limit'),
  consentToSave: z.boolean().optional().default(false),
  language: z.enum(['en', 'hi']).optional().default('en')
});

const scanUrlSchema = z.object({
  url: z.string().trim().min(3, 'URL cannot be empty').max(2048, 'URL exceeds 2,048 characters limit').regex(/^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,})/i, 'Please provide a valid website address or URL'),
  consentToSave: z.boolean().optional().default(false),
  language: z.enum(['en', 'hi']).optional().default('en')
});

const feedbackSchema = z.object({
  feedbackType: z.enum(['accurate', 'false_positive', 'false_negative', 'unclear']),
  comment: z.string().max(1000).optional()
});

module.exports = {
  scanTextSchema,
  scanUrlSchema,
  feedbackSchema
};
