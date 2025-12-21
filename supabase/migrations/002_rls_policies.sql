-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cook_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can view cook profiles" ON profiles FOR SELECT USING (role = 'cook');

-- Cooks policies
CREATE POLICY "Anyone can view approved cooks" ON cooks FOR SELECT USING (status = 'approved');
CREATE POLICY "Cooks can view their own profile" ON cooks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Cooks can update their own profile" ON cooks FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Cooks can insert their own profile" ON cooks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all cooks" ON cooks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all cooks" ON cooks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cook documents policies
CREATE POLICY "Cooks can view their own documents" ON cook_documents FOR SELECT USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Cooks can insert their own documents" ON cook_documents FOR INSERT WITH CHECK (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all documents" ON cook_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all documents" ON cook_documents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Kitchens policies
CREATE POLICY "Anyone can view verified kitchens" ON kitchens FOR SELECT USING (verified = true);
CREATE POLICY "Cooks can view their own kitchens" ON kitchens FOR SELECT USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Cooks can manage their own kitchens" ON kitchens FOR ALL USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all kitchens" ON kitchens FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all kitchens" ON kitchens FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Meals policies
CREATE POLICY "Anyone can view available meals from approved cooks" ON meals FOR SELECT USING (
  is_available = true AND cook_id IN (SELECT id FROM cooks WHERE status = 'approved')
);
CREATE POLICY "Cooks can view their own meals" ON meals FOR SELECT USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Cooks can manage their own meals" ON meals FOR ALL USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Cooks can view their orders" ON orders FOR SELECT USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Cooks can update their orders" ON orders FOR UPDATE USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE customer_id = auth.uid() OR cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Customers can insert order items" ON order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments policies
CREATE POLICY "Users can view payments for their orders" ON payments FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE customer_id = auth.uid() OR cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payouts policies
CREATE POLICY "Cooks can view their own payouts" ON payouts FOR SELECT USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view all payouts" ON payouts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage payouts" ON payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews for their orders" ON reviews FOR INSERT WITH CHECK (
  customer_id = auth.uid() AND order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
);
CREATE POLICY "Cooks can respond to their reviews" ON reviews FOR UPDATE USING (
  cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);

-- Safety reports policies
CREATE POLICY "Users can view their own reports" ON safety_reports FOR SELECT USING (
  reporter_id = auth.uid() OR cook_id IN (SELECT id FROM cooks WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create safety reports" ON safety_reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Admins can view all reports" ON safety_reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all reports" ON safety_reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can create audit logs" ON audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Customer addresses policies
CREATE POLICY "Customers can manage their own addresses" ON customer_addresses FOR ALL USING (customer_id = auth.uid());

-- Favorites policies
CREATE POLICY "Customers can manage their own favorites" ON favorites FOR ALL USING (customer_id = auth.uid());
