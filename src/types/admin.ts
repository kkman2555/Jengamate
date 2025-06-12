
export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
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
  };
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
  };
}
