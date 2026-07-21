"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { POStage } from "@/lib/supabase/database.types";

function toNullableDate(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  return String(value);
}

function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseFloat(String(value ?? ""));
  return Number.isNaN(parsed) ? fallback : parsed;
}

export async function createPurchaseOrder(formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const supplierId = String(formData.get("supplier_id") ?? "");
  const productName = String(formData.get("product_name") ?? "").trim();
  const totalAmount = toNumber(formData.get("total_amount"), NaN);

  if (!supplierId) throw new Error("Supplier is required");
  if (!productName) throw new Error("Product name is required");
  if (Number.isNaN(totalAmount)) throw new Error("Total amount is required");

  const { data, error } = await supabase
    .from("purchase_orders")
    .insert({
      workspace_id: workspace.id,
      supplier_id: supplierId,
      product_name: productName,
      total_amount: totalAmount,
      currency: String(formData.get("currency") ?? "USD"),
      deposit_amount: toNumber(formData.get("deposit_amount")),
      deposit_due_date: toNullableDate(formData.get("deposit_due_date")),
      balance_amount: toNumber(formData.get("balance_amount")),
      balance_due_date: toNullableDate(formData.get("balance_due_date")),
      order_date: String(formData.get("order_date") ?? new Date().toISOString().slice(0, 10)),
      target_delivery_date: toNullableDate(formData.get("target_delivery_date")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/purchase-orders");
  revalidatePath("/dashboard/timeline");
  redirect(`/dashboard/purchase-orders/${data.id}`);
}

export async function updatePurchaseOrder(poId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const productName = String(formData.get("product_name") ?? "").trim();
  if (!productName) throw new Error("Product name is required");

  const { error } = await supabase
    .from("purchase_orders")
    .update({
      product_name: productName,
      total_amount: toNumber(formData.get("total_amount"), 0),
      currency: String(formData.get("currency") ?? "USD"),
      deposit_amount: toNumber(formData.get("deposit_amount")),
      deposit_paid: formData.get("deposit_paid") === "on",
      deposit_due_date: toNullableDate(formData.get("deposit_due_date")),
      balance_amount: toNumber(formData.get("balance_amount")),
      balance_paid: formData.get("balance_paid") === "on",
      balance_due_date: toNullableDate(formData.get("balance_due_date")),
      stage: String(formData.get("stage") ?? "quoting") as POStage,
      order_date: String(formData.get("order_date") ?? new Date().toISOString().slice(0, 10)),
      target_delivery_date: toNullableDate(formData.get("target_delivery_date")),
    })
    .eq("id", poId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/purchase-orders");
  revalidatePath(`/dashboard/purchase-orders/${poId}`);
  revalidatePath("/dashboard/timeline");
}

export async function setPurchaseOrderStage(poId: string, stage: POStage) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { error } = await supabase
    .from("purchase_orders")
    .update({ stage })
    .eq("id", poId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/purchase-orders");
  revalidatePath("/dashboard/timeline");
}

export async function deletePurchaseOrder(poId: string) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { error } = await supabase
    .from("purchase_orders")
    .delete()
    .eq("id", poId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/purchase-orders");
  revalidatePath("/dashboard/timeline");
  redirect("/dashboard/purchase-orders");
}
