# 🎣 Fishing App

A modern fishing application built with React, Firebase, and Tailwind CSS. Track your catches, manage your gear, and connect with fellow anglers.

## 🚀 Quick Start

**See [SETUP.md](./SETUP.md) for complete setup instructions!**

```bash
# Install dependencies
cd app && npm install

# Start development server
npm run dev
```

## ✨ Features

- 🔐 **Authentication**: Email/password, OAuth providers, guest mode
- 🎣 **Catch Tracking**: Log catches with photos, location, and weather data
- 🎒 **Gear Management**: Organize and track your fishing equipment
- 📍 **Location Services**: GPS integration with privacy controls
- 🌤️ **Weather Integration**: Auto-capture weather conditions
- 📊 **Statistics**: Personal fishing analytics and insights
- 🔒 **Privacy Controls**: Public/private profile settings
- 📱 **Responsive Design**: Works on mobile and desktop

## 🏗️ Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Security**: Comprehensive Firestore and Storage rules
- **Multi-Environment**: Development and production configurations

## 📋 Project Status

### ✅ Completed (P0 Tasks)
- Firebase project setup and configuration
- Authentication system (email, OAuth, guest mode)
- Security rules and validation
- CI/CD pipeline
- Cloud Functions for backend logic
- Multi-environment support

### 🔄 In Progress
- Data schemas and database structure
- Core UI components and navigation
- Catch management functionality

### 📅 Planned
- Weather integration
- Map views and location services
- Social features
- Advanced analytics

## 🛠️ Development

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set up projects
cd firebase && ./setup-projects.sh

# Deploy functions
./deploy-functions.sh

# Start development
cd ../app && npm run dev
```

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Complete project setup instructions
- [API Reference](./api/README.md) - Backend API documentation
- [Component Library](./app/src/components/README.md) - Frontend components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [troubleshooting guide](./SETUP.md#troubleshooting)
- Review [Firebase documentation](https://firebase.google.com/docs)
- Open an issue for bugs or feature requests
