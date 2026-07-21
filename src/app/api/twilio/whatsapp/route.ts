import { NextResponse } from "next/server";
import twilio from "twilio";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneNumber } from "@/lib/phone";

const EMPTY_TWIML = new NextResponse("<Response></Response>", {
  status: 200,
  headers: { "Content-Type": "text/xml" },
});

// Inbound WhatsApp messages from Twilio's WhatsApp Business API. Only
// processes messages from numbers a workspace member has explicitly
// connected to a supplier (see WhatsappConnect) — everything else is
// acknowledged and dropped, per the no-auto-import consent requirement.
export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json({ error: "Twilio not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const paramsObject = Object.fromEntries(params.entries());

  const signature = request.headers.get("x-twilio-signature");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const webhookUrl = `${siteUrl}/api/twilio/whatsapp`;

  if (!signature || !twilio.validateRequest(authToken, signature, webhookUrl, paramsObject)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const from = paramsObject.From;
  const body = paramsObject.Body;
  if (!from || !body) {
    return EMPTY_TWIML;
  }

  const fromNumber = normalizePhoneNumber(from);
  const supabase = createAdminClient();

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, workspace_id, communication_log")
    .eq("whatsapp_number", fromNumber)
    .eq("whatsapp_connected", true)
    .maybeSingle();

  if (!supplier) {
    // No workspace has opted this number in — drop the message.
    return EMPTY_TWIML;
  }

  await supabase.from("whatsapp_messages").insert({
    workspace_id: supplier.workspace_id,
    supplier_id: supplier.id,
    direction: "inbound",
    body,
    synced_via: "api",
  });

  const summary = body.length > 140 ? `${body.slice(0, 140)}…` : body;
  await supabase
    .from("suppliers")
    .update({
      communication_log: [
        ...supplier.communication_log,
        { date: new Date().toISOString(), source: "whatsapp", summary },
      ],
    })
    .eq("id", supplier.id);

  return EMPTY_TWIML;
}
