-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL
);

-- Create files table
CREATE TABLE files (
    fid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    uid UUID NOT NULL,
    type VARCHAR(100) NOT NULL,
    size TEXT NOT NULL,
    path TEXT NOT NULL DEFAULT '/',
    CONSTRAINT files_uid_fkey FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for performance
CREATE INDEX idx_files_uid ON files(uid);