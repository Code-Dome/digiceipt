import { Json } from "@/integrations/supabase/types";

export interface DatabaseReceipt {
  id: string;
  user_id: string;
  invoice_no: string;
  timestamp: string;
  driver_name: string | null;
  horse_reg: string | null;
  company_name: string | null;
  wash_type: string | null;
  other_wash_type: string | null;
  custom_fields: Json;
  signature: string | null;
  removed_fields: Json;
  removed_custom_fields: Json;
  created_at: string;
  updated_at: string;
  organization_id: string | null;
}