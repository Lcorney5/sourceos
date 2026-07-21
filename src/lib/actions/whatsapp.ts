"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { getTwilioClient, getTwilioWhatsappNumber } from "@/lib/twilio";
import { normalizePhoneNumber } from "@/lib/phone";

export async function sendWhatsappMessage(supplierId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Message can't be empty");

  const { data: supplier, error: fetchError } = await supabase
    .from("suppliers")
    .select("whatsapp_number, whatsapp_connected, communication_log")
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id)
    .single();

  if (fetchError || !supplier) throw new Error(fetchError?.message ?? "Supplier not found");
  if (!supplier.whatsapp_connected || !supplier.whatsapp_number) {
    throw new Error("Connect WhatsApp for this supplier before sending a message");
  }

  const client = getTwilioClient();
  const fromNumber = getTwilioWhatsappNumber();

  await client.messages.create({
    from: `whatsapp:${normalizePhoneNumber(fromNumber)}`,
    to: `whatsapp:${supplier.whatsapp_number}`,
    body,
  });

  const { error: insertError } = await supabase.from("whatsapp_messages").insert({
    workspace_id: workspace.id,
    supplier_id: supplierId,
    direction: "outbound",
    body,
    synced_via: "api",
  });
  if (insertError) throw new Error(insertError.message);

  const summary = body.length > 140 ? `${body.slice(0, 140)}…` : body;
  await supabase
    .from("suppliers")
    .update({
      communication_log: [
        ...supplier.communication_log,
        { date: new Date().toISOString(), source: "whatsapp", summary: `Sent: ${summary}` },
      ],
    })
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id);

  revalidatePath(`/dashboard/suppliers/${supplierId}`);
}
