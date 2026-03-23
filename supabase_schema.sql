-- Create Tours table
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  people INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Admins manage tours" ON tours FOR ALL USING (
  auth.jwt() ->> 'email' = 'duocore0101@gmail.com'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON bookings FOR SELECT USING (
  auth.jwt() ->> 'email' = 'duocore0101@gmail.com'
);

-- Sample Data (Indian Premium Destinations)
INSERT INTO tours (title, description, price, duration, location, image_url) VALUES
('Manali Luxury Adventure', 'Experience the breathtaking beauty of the Himalayas with our premium luxury bus service to Manali. Includes stay at 5-star resorts and guided treks.', 15000, '5 Days', 'Manali, Himachal Pradesh', 'https://images.unsplash.com/photo-1695211199094-1fb9ec70880c?q=80&w=2000&auto=format&fit=crop'),
('Jaipur Heritage & Royalty', 'Explore the Pink City in style. Visit the Hawa Mahal, Amer Fort, and enjoy authentic Rajasthani cuisine. Luxury travel included.', 12000, '4 Days', 'Jaipur, Rajasthan', 'https://images.unsplash.com/photo-1706961121783-4ae6c933983a?q=80&w=2000&auto=format&fit=crop'),
('Goa Beach Bliss', 'The ultimate coastal getaway. Premium bus travel to the finest beaches of North Goa, with exclusive access to private beach clubs.', 18000, '6 Days', 'North Goa', 'https://images.unsplash.com/photo-1744448365250-9b6aa1a7e4a3?q=80&w=2000&auto=format&fit=crop'),
('Rishikesh Spiritual Escape', 'Find your inner peace with our curated spiritual tour. Includes morning yoga sessions by the Ganges and luxury camping experiences.', 10000, '3 Days', 'Rishikesh, Uttarakhand', 'https://images.unsplash.com/photo-1683318528827-9577068cebeb?q=80&w=2000&auto=format&fit=crop'),
('Leh Ladakh Expedition', 'A once-in-a-lifetime journey to the land of high passes. Premium all-terrain luxury vehicles and high-altitude comfort guaranteed.', 25000, '8 Days', 'Leh, Ladakh', 'https://images.unsplash.com/photo-1762707232257-ab6057b4128b?q=80&w=2000&auto=format&fit=crop');
