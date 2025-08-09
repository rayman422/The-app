#!/bin/bash

# Deploy Firebase Functions Script

set -e

echo "🚀 Deploying Firebase Functions..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Please login to Firebase first:"
    echo "   firebase login"
    exit 1
fi

# Install dependencies
echo "📦 Installing function dependencies..."
cd functions
npm install
cd ..

# Deploy functions
echo "🔧 Deploying functions..."
firebase deploy --only functions

echo "✅ Functions deployed successfully!"
echo ""
echo "Available functions:"
echo "- onAuthCreate: Creates default profile on user signup"
echo "- onAuthDelete: Purges user data on account deletion"
echo "- aggregateCatchStats: Aggregates catch statistics"
echo "- getSignedImageUrl: Generates short-lived image URLs"
echo "- scheduledCleanup: Scheduled cleanup job (placeholder)"