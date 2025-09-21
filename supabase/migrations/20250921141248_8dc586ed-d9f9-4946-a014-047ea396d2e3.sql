-- Create sample QR code first (without user reference)
INSERT INTO public.qr_codes (
  id,
  memorial_url,
  status,
  claimed_at
) VALUES (
  'sample',
  '/memory/sample',
  'claimed',
  now()
) ON CONFLICT (id) DO UPDATE SET
  memorial_url = EXCLUDED.memorial_url,
  status = EXCLUDED.status,
  claimed_at = EXCLUDED.claimed_at;

-- Now create sample memorial (without user reference)
INSERT INTO public.memorials (
  id,
  owner_id,
  title,
  description,
  birth_date,
  death_date,
  profile_picture_url,
  photos,
  is_public,
  created_at,
  updated_at
) VALUES (
  'sample',
  '00000000-0000-0000-0000-000000000000',
  'In Loving Memory of John D. Smith',
  'John was a beloved father, grandfather, and friend who touched the lives of everyone he met. He had a passion for gardening, loved spending time with his family, and was known for his warm smile and generous heart. John served in the community for over 30 years and will be deeply missed by all who knew him.',
  '1945-03-15',
  '2023-11-20',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  ARRAY[
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
  ],
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  birth_date = EXCLUDED.birth_date,
  death_date = EXCLUDED.death_date,
  profile_picture_url = EXCLUDED.profile_picture_url,
  photos = EXCLUDED.photos,
  updated_at = now();

-- Update QR code with memorial_id reference
UPDATE public.qr_codes 
SET memorial_id = 'sample' 
WHERE id = 'sample';

-- Add sample guestbook messages
INSERT INTO public.guestbook_messages (
  memorial_id,
  author_name,
  author_email,
  message,
  is_approved,
  created_at
) VALUES 
(
  'sample',
  'Sarah Johnson',
  'sarah@example.com',
  'John was such a wonderful man. He always had time to help others and his kindness knew no bounds. Our family will miss him dearly.',
  true,
  now() - interval '2 days'
),
(
  'sample',
  'Michael Thompson',
  null,
  'I had the privilege of working with John for many years. He was not only a great colleague but also a true friend. His wisdom and humor brightened every day.',
  true,
  now() - interval '1 day'
),
(
  'sample',
  'Emily Davis',
  'emily.davis@example.com',
  'Mr. Smith was my neighbor for over 20 years. He taught me so much about gardening and life. His legacy lives on in the beautiful flowers he helped me plant.',
  true,
  now() - interval '3 hours'
) ON CONFLICT DO NOTHING;