-- Create the user_type enum that's missing
CREATE TYPE user_type AS ENUM ('admin', 'worker', 'customer');