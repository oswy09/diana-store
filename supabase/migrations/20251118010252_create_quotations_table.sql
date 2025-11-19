/*
  # Create Quotations System

  1. New Tables
    - `quotations`
      - `id` (uuid, primary key) - Unique identifier
      - `customer_name` (text) - Customer full name
      - `customer_phone` (text) - Customer phone number
      - `customer_email` (text, optional) - Customer email
      - `payment_method` (text) - Payment method (1_cuota or 2_cuotas)
      - `total_amount` (numeric) - Total amount of the quotation
      - `items` (jsonb) - Array of products with details
      - `status` (text) - Status of quotation (pending, sent, completed)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `quotations` table
    - Add policy for public to insert quotations (customers)
    - Add policy for authenticated users to read all quotations (admin)
*/

CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  payment_method text NOT NULL DEFAULT '1_cuota',
  total_amount numeric NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create quotations"
  ON quotations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all quotations"
  ON quotations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update quotations"
  ON quotations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);