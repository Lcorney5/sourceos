// Normalizes phone numbers (and Twilio's "whatsapp:+1555..." prefix) to a
// bare "+<digits>" form so stored numbers and inbound webhook numbers compare
// reliably regardless of spacing/formatting differences.
export function normalizePhoneNumber(input: string): string {
  const withoutPrefix = input.replace(/^whatsapp:/i, "").trim();
  const digits = withoutPrefix.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
}
