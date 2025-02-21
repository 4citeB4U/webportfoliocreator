import { WebClient } from '@slack/web-api';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.warn("Twilio credentials not set. SMS functionality will be disabled.");
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any;

try {
  // Dynamically import twilio only if credentials are available
  if (accountSid && authToken) {
    import('twilio').then((twilio) => {
      twilioClient = twilio(accountSid, authToken);
    });
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
}

interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMS(params: SMSParams): Promise<boolean> {
  if (!twilioClient || !fromNumber) {
    console.warn("Attempted to send SMS but Twilio is not configured");
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: params.message,
      from: fromNumber,
      to: params.to
    });
    return true;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return false;
  }
}
