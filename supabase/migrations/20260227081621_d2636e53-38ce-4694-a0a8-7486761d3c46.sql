
-- Create memories table
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public app, no auth required)
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Allow all operations publicly (no auth)
CREATE POLICY "Anyone can read memories" ON public.memories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert memories" ON public.memories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete memories" ON public.memories FOR DELETE USING (true);
