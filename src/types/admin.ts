
export interface User {
  id: string;
  email: string | undefined;
  full_name: string | undefined;
  company_name: string | undefined;
  role: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  inquiry_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

export interface Order {
  id: string;
  order_number: string;
  project_name: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  commission: number;
  commission_paid: boolean;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}
