
-- Add a new column to hold an array of receipt URLs
ALTER TABLE public.orders ADD COLUMN receipt_urls TEXT[];

-- Copy any existing receipt URLs into the new array column
UPDATE public.orders
SET receipt_urls = ARRAY[receipt_url]
WHERE receipt_url IS NOT NULL;

-- Remove the old single-URL column
ALTER TABLE public.orders DROP COLUMN receipt_url;
