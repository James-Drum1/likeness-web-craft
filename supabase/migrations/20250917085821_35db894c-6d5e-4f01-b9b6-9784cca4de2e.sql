-- Create QR codes table
CREATE TABLE public.qr_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_claimed BOOLEAN DEFAULT false,
  memory_id UUID,
  prefix TEXT
);

-- Create memories table  
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id),
  creator_email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  memory_date DATE,
  photo_urls TEXT[],
  video_urls TEXT[],
  audio_urls TEXT[],
  location TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- QR Codes policies - anyone can view unclaimed codes, admins can manage all
CREATE POLICY "Anyone can view QR codes" 
ON public.qr_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage QR codes" 
ON public.qr_codes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND user_type = 'admin'
));

-- Memories policies
CREATE POLICY "Anyone can view public memories" 
ON public.memories 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Creators can manage their memories" 
ON public.memories 
FOR ALL 
USING (creator_email = auth.email());

CREATE POLICY "Anyone can create memories" 
ON public.memories 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for updating memories timestamp
CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_qr_codes_code ON public.qr_codes(code);
CREATE INDEX idx_qr_codes_email ON public.qr_codes(email);
CREATE INDEX idx_memories_qr_code_id ON public.memories(qr_code_id);
CREATE INDEX idx_memories_creator_email ON public.memories(creator_email);