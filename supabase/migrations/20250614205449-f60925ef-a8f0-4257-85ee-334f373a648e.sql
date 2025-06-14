
-- 1. Create a public Supabase storage bucket for receipts
insert into storage.buckets (id, name, public) values ('order-receipts', 'order-receipts', true);

-- 2. Add receipt_url, payment_reference, and payment_date to orders
alter table orders add column if not exists receipt_url text;
alter table orders add column if not exists payment_reference text;
alter table orders add column if not exists payment_date date;
