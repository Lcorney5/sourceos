// Hand-written to match supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once a live project exists.

export type QuoteStatus = "pending" | "accepted" | "rejected";
export type SampleStatus = "requested" | "in_transit" | "received" | "approved" | "rejected";
export type POStage = "quoting" | "sampling" | "deposit_paid" | "in_production" | "shipping" | "delivered";
export type WorkspacePlan = "starter" | "growth" | "agency";
export type SubscriptionStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled";
export type WorkspaceRole = "owner" | "member";
export type FeedbackType = "feedback" | "bug" | "feature";

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
      documents: {
        Row: {
          id: string;
          workspace_id: string;
          supplier_id: string | null;
          purchase_order_id: string | null;
          file_name: string;
          storage_path: string;
          file_size: number | null;
          content_type: string | null;
          uploaded_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["documents"]["Row"]> & {
          workspace_id: string;
          file_name: string;
          storage_path: string;
          uploaded_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "documents_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_purchase_order_id_fkey";
            columns: ["purchase_order_id"];
            isOneToOne: false;
            referencedRelation: "purchase_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          sku: string | null;
          category: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          workspace_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      feedback_submissions: {
        Row: {
          id: string;
          workspace_id: string;
          submitted_by: string;
          type: FeedbackType;
          subject: string;
          description: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["feedback_submissions"]["Row"]> & {
          workspace_id: string;
          submitted_by: string;
          type: FeedbackType;
          subject: string;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["feedback_submissions"]["Row"]>;
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          company: string | null;
          role: string | null;
          email: string | null;
          phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contacts"]["Row"]> & {
          workspace_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Row"]>;
        Relationships: [];
      };
      production_logs: {
        Row: {
          id: string;
          workspace_id: string;
          purchase_order_id: string;
          note: string;
          photo_urls: string[];
          created_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["production_logs"]["Row"]> & {
          workspace_id: string;
          purchase_order_id: string;
          note: string;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["production_logs"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "production_logs_purchase_order_id_fkey";
            columns: ["purchase_order_id"];
            isOneToOne: false;
            referencedRelation: "purchase_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_log: {
        Row: {
          id: string;
          workspace_id: string;
          actor_id: string | null;
          actor_label: string;
          action: string;
          entity_type: string;
          entity_label: string | null;
          entity_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["activity_log"]["Row"]> & {
          workspace_id: string;
          actor_label: string;
          action: string;
          entity_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_log"]["Row"]>;
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
      join_workspace_by_id: {
        Args: { target_workspace_id: string };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
