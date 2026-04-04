-- AyurCare+ Database Schema
-- This file represents the SQL equivalent of the current Firebase NoSQL data structure.

-- 1. Users Table (Maps to Firebase Auth & 'users' collection)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Maps to Firebase uid
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Cart Items Table (Maps to the 'cart' array inside the 'users' document)
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    image_url VARCHAR(500),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Heart Rate Logs Table (Maps to 'heart_logs' collection)
CREATE TABLE heart_logs (
    id VARCHAR(255) PRIMARY KEY, -- Unique log ID
    user_id VARCHAR(255) NOT NULL,
    heart_rate INT NOT NULL,
    condition_status VARCHAR(50), -- e.g., 'Normal', 'Elevated'
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Appointments Table (Maps to 'appointments' collection)
CREATE TABLE appointments (
    id VARCHAR(255) PRIMARY KEY, -- Unique appointment ID
    user_id VARCHAR(255) NOT NULL,
    doctor_id VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled', -- e.g., 'Scheduled', 'Completed', 'Cancelled'
    symptoms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Doctors Table (Optional: If doctors are fetched dynamically instead of static config)
CREATE TABLE doctors (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    experience_years INT,
    rating DECIMAL(2,1),
    consultation_fee DECIMAL(10,2),
    availability_status BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500)
);

-- Additional Indexes for Performance
CREATE INDEX idx_user_appointments ON appointments(user_id);
CREATE INDEX idx_user_heart_logs ON heart_logs(user_id);
