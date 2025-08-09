#!/bin/bash

# Firebase Project Setup Script
# This script helps create and configure the dev and prod Firebase projects

set -e

echo "🎣 Setting up Firebase projects for Fishing App..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    echo "   firebase login"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Please login to Firebase first:"
    echo "   firebase login"
    exit 1
fi

# Create dev project
echo "📱 Creating development project..."
firebase projects:create fishing-app-dev --display-name "Fishing App - Development"

# Create prod project
echo "🚀 Creating production project..."
firebase projects:create fishing-app-prod --display-name "Fishing App - Production"

# Enable services on dev project
echo "⚙️  Enabling services on dev project..."
firebase use fishing-app-dev
firebase firestore:databases:create "(default)" --region=us-central1
firebase storage:buckets:create fishing-app-dev.appspot.com --location=us-central1

# Enable services on prod project
echo "⚙️  Enabling services on prod project..."
firebase use fishing-app-prod
firebase firestore:databases:create "(default)" --region=us-central1
firebase storage:buckets:create fishing-app-prod.appspot.com --location=us-central1

# Set up dev project
echo "🔧 Setting up dev project..."
firebase use fishing-app-dev
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

# Set up prod project
echo "🔧 Setting up prod project..."
firebase use fishing-app-prod
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

echo "✅ Firebase projects setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.development with your dev project credentials"
echo "2. Update .env.production with your prod project credentials"
echo "3. Run 'firebase use dev' or 'firebase use prod' to switch projects"
echo "4. Deploy your app with 'firebase deploy'"