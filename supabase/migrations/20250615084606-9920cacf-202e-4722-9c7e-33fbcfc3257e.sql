
-- Enable Row Level Security on the inquiries table
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to see their own inquiries
CREATE POLICY "Allow users to view their own inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow users to create inquiries for themselves
CREATE POLICY "Allow users to create their own inquiries"
ON public.inquiries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own inquiries
CREATE POLICY "Allow users to update their own inquiries"
ON public.inquiries
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own inquiries
CREATE POLICY "Allow users to delete their own inquiries"
ON public.inquiries
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow admins to have full access to all inquiries
CREATE POLICY "Allow admins full access to inquiries"
ON public.inquiries
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
