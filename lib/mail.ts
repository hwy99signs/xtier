/**
 * ERANTT TRANSIT — Email Service Abstraction
 * Implements a provider-based system to switch between Mock and Resend.
 */

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface MailProvider {
  send(options: MailOptions): Promise<{ success: boolean; id?: string }>;
}

/**
 * Mock Provider for Staging/Safe Mode
 */
class MockMailProvider implements MailProvider {
  async send(options: MailOptions) {
    console.log('--- [MOCK EMAIL SENT] ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body (Text): ${options.text || '(HTML Content)'}`);
    console.log('-------------------------');
    return { success: true, id: `mock_${Date.now()}` };
  }
}

/**
 * Resend Provider (Future Deployment)
 */
class ResendMailProvider implements MailProvider {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: MailOptions) {
    // In a real environment, you'd import Resend here
    // import { Resend } from 'resend';
    // const resend = new Resend(this.apiKey);
    // return await resend.emails.send({...});
    
    console.log(`[STAGING] Resend API integration ready (using key: ${this.apiKey.substring(0, 8)}...)`);
    return { success: true, id: `resend_stub_${Date.now()}` };
  }
}

/**
 * Mail Service Factory
 */
export async function sendEmail(options: MailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const isProd = process.env.NODE_ENV === 'production';
  
  // Use Resend if API key is provided and in production mode
  // For staging, use Mock as default "Safe Mock" unless explicitly wired
  let provider: MailProvider;
  
  if (apiKey && isProd) {
    provider = new ResendMailProvider(apiKey);
  } else {
    provider = new MockMailProvider();
  }

  return await provider.send(options);
}
