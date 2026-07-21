import "server-only";
import Twilio from "twilio";

// Lazily constructed so importing this module doesn't throw at build time
// when Twilio env vars aren't set yet (same reasoning as lib/stripe.ts).
let _client: ReturnType<typeof Twilio> | undefined;

export function getTwilioClient() {
  if (!_client) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      throw new Error(
        "WhatsApp isn't connected yet — add your Twilio credentials to the environment first."
      );
    }
    _client = Twilio(sid, token);
  }
  return _client;
}

export function getTwilioWhatsappNumber() {
  const number = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!number) {
    throw new Error(
      "WhatsApp isn't connected yet — add your Twilio WhatsApp number to the environment first."
    );
  }
  return number;
}
