// Hand-written to match supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once a live project exists.

export type QuoteStatus = "pending" | "accepted" | "rejected";
export type SampleStatus = "requested" | "in_transit" | "received" | "approved" | "rejected";
export type POStage = "quoting" | "sampling" | "deposit_paid" | "in_production" | "shipping" | "delivered";
export type WorkspacePlan = "starter" | "growth" | "agency";
export type SubscriptionStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled";
export type WorkspaceRole = "owner" | "member";

export interface CommunicationLogEntry {
  date: string;
  source: string;
  summary: string;
}

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          plan: WorkspacePlan;
          subscription_status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["workspaces"]["Row"]> & {
          name: string;
          owner_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          workspace_id: string | null;
          role: WorkspaceRole;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      suppliers: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          location: string | null;
          moq: number | null;
          lead_time_days: number | null;
          contact_email: string | null;
          contact_phone: string | null;
          whatsapp_number: string | null;
          whatsapp_connected: boolean;
          notes: string | null;
          communication_log: CommunicationLogEntry[];
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["suppliers"]["Row"]> & {
          workspace_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Row"]>;
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          workspace_id: string;
          supplier_id: string;
          product_name: string;
          unit_price: number;
          currency: string;
          moq: number | null;
          lead_time_days: number | null;
          date_received: string;
          status: QuoteStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quotes"]["Row"]> & {
          workspace_id: string;
          supplier_id: string;
          product_name: string;
          unit_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "quotes_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      samples: {
        Row: {
          id: string;
          workspace_id: string;
          supplier_id: string;
          product_name: string;
          revision: number;
          status: SampleStatus;
          notes: string | null;
          photo_urls: string[];
          date_updated: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["samples"]["Row"]> & {
          workspace_id: string;
          supplier_id: string;
          product_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["samples"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "samples_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      purchase_orders: {
        Row: {
          id: string;
          workspace_id: string;
          supplier_id: string;
          product_name: string;
          total_amount: number;
          currency: string;
          deposit_amount: number;
          deposit_paid: boolean;
          deposit_due_date: string | null;
          balance_amount: number;
          balance_paid: boolean;
          balance_due_date: string | null;
          stage: POStage;
          order_date: string;
          target_delivery_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["purchase_orders"]["Row"]> & {
          workspace_id: string;
          supplier_id: string;
          product_name: string;
          total_amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_orders"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      whatsapp_messages: {
        Row: {
          id: string;
          workspace_id: string;
          supplier_id: string;
          direction: "inbound" | "outbound";
          body: string;
          timestamp: string;
          synced_via: "api" | "manual";
        };
        Insert: Partial<Database["public"]["Tables"]["whatsapp_messages"]["Row"]> & {
          workspace_id: string;
          supplier_id: string;
          direction: "inbound" | "outbound";
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["whatsapp_messages"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_invites: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          invited_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["workspace_invites"]["Row"]> & {
          workspace_id: string;
          email: string;
          invited_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspace_invites"]["Row"]>;
        Relationships: [];
      };
      waitlist_signups: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["waitlist_signups"]["Row"]> & {
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["waitlist_signups"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      purchase_orders_with_status: {
        Row: Database["public"]["Tables"]["purchase_orders"]["Row"] & {
          is_overdue: boolean;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_workspace: {
        Args: { workspace_name: string };
        Returns: string;
      };
      accept_workspace_invite: {
        Args: { invite_email: string };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
