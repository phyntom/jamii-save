#!/bin/bash

# Better-Auth Migration Script
# This will recreate the database schema with better-auth tables

echo "⚠️  WARNING: This will delete all existing data in the jamii schema!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo "📦 Dropping existing schema..."
psql $DATABASE_URL -c "DROP SCHEMA IF EXISTS jamii CASCADE;"

echo "📦 Creating new schema..."
psql $DATABASE_URL -c "CREATE SCHEMA jamii;"

echo "📦 Creating tables..."
psql $DATABASE_URL -f scripts/001_create_schema.sql

echo "📦 Seeding plans..."
psql $DATABASE_URL -f scripts/002_seed_plans.sql

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Make sure DATABASE_URL is set in .env.local"
echo "2. Run: bun dev"
echo "3. Visit http://localhost:3000/sign-up to test"
