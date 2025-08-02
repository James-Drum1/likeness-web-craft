-- Create locations table for admin management
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_categories table for admin management  
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for locations
CREATE POLICY "Everyone can view active locations" 
ON public.locations 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all locations" 
ON public.locations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND user_type = 'admin'
));

-- Create policies for service_categories
CREATE POLICY "Everyone can view active service categories" 
ON public.service_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all service categories" 
ON public.service_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND user_type = 'admin'
));

-- Add triggers for updated_at
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at
BEFORE UPDATE ON public.service_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Irish locations
INSERT INTO public.locations (name, description) VALUES
('Dublin', 'Capital and largest city'),
('Cork', 'Second largest city in Ireland'),
('Galway', 'City on the west coast'),
('Limerick', 'City in the Mid-West'),
('Waterford', 'City in the South-East'),
('Kilkenny', 'Medieval city in the South-East'),
('Wexford', 'County town in the South-East'),
('Athlone', 'Town in the Midlands'),
('Drogheda', 'Port town north of Dublin'),
('Dundalk', 'Town near the Northern Ireland border');

-- Insert default service categories based on current enum values
INSERT INTO public.service_categories (name, description) VALUES
('plumbing', 'Water systems, pipes, and fixtures'),
('electrical', 'Electrical installations and repairs'),
('carpentry', 'Woodworking and furniture making'),
('painting', 'Interior and exterior painting services'),
('roofing', 'Roof installation and repairs'),
('cleaning', 'Professional cleaning services'),
('gardening', 'Landscaping and garden maintenance'),
('handyman', 'General maintenance and repairs');