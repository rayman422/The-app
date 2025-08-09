#!/bin/bash

# Generate local SSL certificates for HTTPS development

set -e

echo "🔐 Generating local SSL certificates for HTTPS development..."

# Create certs directory
mkdir -p certs

# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout certs/localhost-key.pem -out certs/localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Set proper permissions
chmod 600 certs/localhost-key.pem
chmod 644 certs/localhost.pem

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates created in: certs/"
echo "🔒 Private key: certs/localhost-key.pem"
echo "📜 Certificate: certs/localhost.pem"
echo ""
echo "You can now run 'npm run dev' with HTTPS enabled."
echo "Note: You may need to accept the self-signed certificate in your browser."