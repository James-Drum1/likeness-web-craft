-- Check existing enums and create only missing ones
DO $$
BEGIN
    -- Create worker_status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'worker_status') THEN
        CREATE TYPE public.worker_status AS ENUM ('pending', 'active', 'inactive', 'suspended');
    END IF;
    
    -- Create payment_status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
    END IF;
    
    -- Create service_category if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_category') THEN
        CREATE TYPE public.service_category AS ENUM (
          'plumbing', 
          'electrical', 
          'carpentry', 
          'painting', 
          'roofing', 
          'gardening', 
          'cleaning', 
          'heating', 
          'construction', 
          'renovation',
          'landscaping',
          'tiling',
          'flooring',
          'plastering',
          'glazing',
          'security',
          'appliance_repair',
          'handyman',
          'other'
        );
    END IF;
END $$;