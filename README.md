# MonDeneigeur PWA

A professional Progressive Web Application for snow removal services management, built with React, TypeScript, and Supabase.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mondeneigeur-pwa)
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/mondeneigeur-pwa)

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Structure](#️-project-structure)
- [🔐 Authentication & Roles](#-authentication--roles)
- [🎨 Design System](#-design-system)
- [🔧 Development](#-development)
- [📱 PWA Features](#-pwa-features)
- [🌐 Internationalization](#-internationalization)
- [🔒 Security](#-security)
- [📊 Monitoring](#-monitoring)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🆘 Support](#-support)

## 🚀 Features

### ✅ **Core Features (Implemented)**
- **Multi-Role Authentication**: Superadmin, Admin, Employee, and Client roles
- **Secure Database**: Row Level Security (RLS) with Supabase
- **Modern UI**: Tailwind CSS v4 with responsive design
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack React Query for efficient data management
- **Audit System**: Comprehensive audit logging for all operations
- **File Management**: PDF upload and storage for contracts
- **Role-Based Access**: Secure data access based on user permissions

### ✅ **PWA Features (Implemented)**
- **Offline Support**: Service worker implementation
- **Install Prompt**: Native app-like installation
- **Responsive Design**: Works on all devices
- **Fast Loading**: Optimized bundle size
- **GPS Integration**: Real-time location tracking
- **Mobile-First**: Touch-optimized interface

### ✅ **Advanced Features (Newly Implemented)**

#### **Real-Time Tracking System**
- **Live Employee Location Monitoring**: Supabase Realtime integration
- **Real-Time Map Updates**: Live GPS coordinates with visual indicators
- **Connection Status Monitoring**: Real-time vs cached data differentiation
- **Employee Status Tracking**: Active/inactive status with live updates
- **Service Visit Updates**: Real-time service completion tracking
- **Company-Scoped Subscriptions**: Secure real-time data isolation

#### **Loi 25 Compliance (Québec Privacy Law)**
- **Privacy Consent Management**: Granular consent types (data collection, location tracking, communications, analytics)
- **Data Access Rights**: Access, correction, deletion, and portability requests
- **Data Export Functionality**: Complete user data export in JSON format
- **Right to be Forgotten**: Complete data deletion capability
- **Privacy Settings UI**: User-friendly consent management interface
- **Audit Trail**: Comprehensive privacy-related logging
- **Consent Enforcement**: GPS tracking respects privacy consent

#### **Enhanced Weather Integration**
- **OpenWeather API Integration**: Current weather, forecasts, and alerts
- **Service Adjustment Recommendations**: Weather-based service modifications
- **Fallback Data System**: Graceful degradation when API unavailable
- **Caching Strategy**: Optimized weather data caching
- **Error Handling**: Robust error management and user feedback

#### **Bilingual Support (French/English)**
- **Dynamic Language Switching**: Real-time language changes
- **Complete Translation Coverage**: All UI elements translated
- **Locale Persistence**: Remembers user language preference
- **Fallback Support**: English fallback for missing translations
- **Privacy Translations**: Complete Loi 25 compliance translations

#### **Performance & Monitoring**
- **Sentry Integration**: Real-time error tracking and performance monitoring
- **Web Vitals Monitoring**: LCP, FID, CLS performance metrics
- **Custom Performance Tracking**: Business-specific metrics
- **Bundle Optimization**: Tree shaking and code splitting
- **Memory Leak Detection**: Advanced performance monitoring

#### **Enhanced Database Schema**
- **Privacy Tables**: `privacy_consents` and `data_access_requests`
- **Enhanced GPS Logging**: Improved location tracking with privacy controls
- **Real-Time Subscriptions**: Supabase Realtime integration
- **Audit Logging**: Comprehensive operation tracking
- **Row Level Security**: Advanced data access controls

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety with strict mode
- **Vite**: Fast build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation
- **Lucide React**: Modern icon library

### Backend & Services
- **Supabase**: PostgreSQL database, Auth, Storage, Realtime
- **TanStack React Query**: Data fetching and caching
- **Zustand**: Lightweight state management
- **React i18next**: Internationalization

### Real-Time & Privacy
- **Supabase Realtime**: Live data subscriptions
- **Privacy Service**: Loi 25 compliance implementation
- **GPS Service**: Enhanced location tracking
- **Weather Service**: OpenWeather API integration

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **TypeScript**: Type checking

### Deployment & Monitoring
- **Vercel/Netlify**: Hosting platforms
- **Sentry**: Error tracking and performance monitoring
- **Web Vitals**: Performance metrics

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Package managers
- **Git** - Version control
- **Supabase Account** - [Sign up](https://supabase.com/)
- **OpenWeather API Key** - [Get API key](https://openweathermap.org/api)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd mondeneigeur-pwa
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Weather API
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Monitoring (Optional)
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for production
```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── shared/         # Shared UI components
│   │   ├── privacy-consent-manager.tsx  # Loi 25 compliance UI
│   │   └── weather-widget/              # Weather integration
│   ├── admin/          # Admin-specific components
│   │   └── real-time-map.tsx           # Enhanced real-time map
│   ├── employee/       # Employee-specific components
│   └── client/         # Client-specific components
├── lib/                # Core utilities and configurations
│   ├── supabase.ts     # Supabase client configuration
│   ├── auth.ts         # Authentication service
│   ├── services/       # Service layer
│   │   ├── privacy-service.ts          # Loi 25 compliance
│   │   ├── realtime-service.ts         # Real-time subscriptions
│   │   ├── weather-service.ts          # Weather API integration
│   │   └── gps-service.ts              # Enhanced GPS tracking
│   ├── hooks/          # React Query hooks
│   │   ├── use-privacy.ts              # Privacy management hooks
│   │   ├── use-realtime.ts             # Real-time hooks
│   │   └── use-weather.ts              # Weather hooks
│   ├── validation/     # Zod schemas
│   ├── i18n.ts         # Internationalization
│   └── monitoring.ts   # Performance monitoring
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── admin/          # Admin pages
│   ├── employee/       # Employee pages
│   └── client/         # Client pages
├── stores/             # State management
├── types/              # TypeScript types
└── styles/             # CSS styles
```

## 🔐 Authentication & Roles

### User Roles

1. **Superadmin**: System-wide administration
   - Manage all companies
   - View all users
   - System configuration
   - Access to all audit logs

2. **Admin**: Company-level administration
   - Manage company users (employees, clients)
   - View company services and contracts
   - Route assignment and management
   - Company-specific audit logs
   - **Real-time employee tracking**
   - **Privacy compliance monitoring**

3. **Employee**: Service provider
   - Mobile-first dashboard
   - **Real-time GPS location tracking**
   - Route management and job completion
   - Photo capture for completed work
   - Offline capabilities
   - Access to personal data only
   - **Privacy consent management**

4. **Client**: Service consumer
   - Request services
   - View service history
   - Manage profile
   - Access to own contracts
   - **Privacy settings management**
   - **Data export/deletion requests**

### Database Schema

#### Core Tables
- **companies**: Company information and management
- **profiles**: User profiles with role-based access
- **employees**: Employee records with company association
- **clients**: Client records with company association
- **contracts**: Service contracts with PDF storage
- **routes**: Route assignments for employees
- **service_visits**: Service visit tracking with GPS and photos
- **gps_logs**: GPS location tracking for employees
- **audit_logs**: Comprehensive audit trail

#### **New Privacy Tables (Loi 25 Compliance)**
- **privacy_consents**: User consent management
- **data_access_requests**: Data rights requests (access, correction, deletion, portability)

#### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **Role-Based Permissions**: Granular access control
- **Automatic Audit Logging**: All CRUD operations tracked
- **File Storage Security**: Secure PDF upload and storage
- **GPS Privacy**: Secure location tracking with consent
- **Privacy Compliance**: Loi 25 compliant data handling

## 🎨 Design System

Built with Tailwind CSS v4 featuring:

- **Color Palette**: Blue-based professional theme
- **Typography**: Inter font family
- **Components**: Pre-built card, button, and form components
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant components
- **Data Tables**: Advanced sorting, filtering, and pagination
- **Status Indicators**: Color-coded status badges
- **File Upload**: Drag-and-drop with validation
- **Mobile UI**: Touch-optimized interface for employees
- **Real-Time Indicators**: Connection status and live data indicators
- **Privacy UI**: User-friendly consent management interface

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Line Limit**: 200 lines per file
- **Component Structure**: Functional components with hooks
- **Modular Architecture**: Clean separation of concerns

### Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature-name
   npm run dev
   # Make changes
   npm run lint
   npm run test
   git commit -m "feat: add your feature"
   ```

2. **Testing**
   ```bash
   npm run test:coverage  # Check test coverage
   npm run test:e2e       # Run E2E tests
   ```

3. **Code Review**
   ```bash
   npm run lint           # Check code quality
   npm run type-check     # Check TypeScript
   npm run build          # Ensure build works
   ```

## 📱 PWA Features

### Service Worker
- **Offline Support**: Caches static resources
- **Background Sync**: Preparation for offline data sync
- **Push Notifications**: Real-time notifications
- **App Installation**: Native app-like experience

### Manifest
- **App Icons**: Multiple sizes for different devices
- **Theme Colors**: Consistent branding
- **Display Mode**: Standalone app experience
- **Orientation**: Portrait-primary for mobile

### Performance
- **Code Splitting**: Automatic chunk splitting
- **Tree Shaking**: Unused code elimination
- **Bundle Optimization**: Minified and compressed
- **Caching Strategy**: Optimized for PWA

## 🌐 Internationalization

### Supported Languages
- **French (default)**: Primary language for Québec market
- **English**: Secondary language support

### Features
- **Dynamic Language Switching**: Real-time language changes
- **Locale Persistence**: Remembers user preference
- **Fallback Support**: English fallback for missing translations
- **Number/Date Formatting**: Locale-specific formatting
- **Privacy Translations**: Complete Loi 25 compliance translations

### Adding Translations
```typescript
// Add new translation keys
{
  "newFeature": {
    "title": "Nouvelle fonctionnalité",
    "description": "Description de la nouvelle fonctionnalité"
  }
}
```

## 🔒 Security

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic token refresh
- **Role-Based Access**: Granular permissions
- **Password Security**: Secure password handling

### Data Protection
- **Row Level Security**: Database-level access control
- **Input Validation**: Zod schema validation
- **XSS Protection**: React's built-in protection
- **CSRF Protection**: Supabase built-in protection

### **Privacy Compliance (Loi 25)**
- **Consent Management**: Granular privacy consent tracking
- **Data Access Rights**: Access, correction, deletion, portability
- **Data Export**: Complete user data export functionality
- **Right to be Forgotten**: Complete data deletion capability
- **Audit Logging**: Comprehensive privacy operation tracking
- **Consent Enforcement**: GPS tracking respects privacy settings

## 📊 Monitoring

### Error Tracking
- **Sentry Integration**: Real-time error monitoring
- **Performance Tracking**: Web Vitals monitoring
- **User Session Replay**: Debug user issues
- **Custom Metrics**: Business-specific tracking

### Performance
- **Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Analysis**: Visual bundle size analysis
- **Network Performance**: API call monitoring
- **Memory Usage**: Memory leak detection

### **Real-Time Monitoring**
- **Connection Status**: Real-time subscription monitoring
- **GPS Tracking**: Live location monitoring
- **Privacy Compliance**: Consent and data request tracking
- **Weather Integration**: API performance monitoring

## 🧪 Testing

### Unit Testing
```bash
npm run test              # Run all unit tests
npm run test:ui           # Run with UI
npm run test:coverage     # Coverage report
```

### E2E Testing
```bash
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run with UI
```

### Test Coverage
- **Components**: All React components tested
- **Services**: All service layer functions tested
- **Hooks**: All custom hooks tested
- **Utilities**: All utility functions tested
- **Privacy Features**: Loi 25 compliance testing
- **Real-Time Features**: Supabase Realtime testing

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### Netlify
```bash
npm run deploy:netlify
```

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Environment Variables
Ensure all required environment variables are set in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_OPENWEATHER_API_KEY`
- `VITE_SENTRY_DSN` (optional)

## 📚 Documentation

### API Documentation
- [API Documentation](./docs/API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment instructions
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Database structure
- [Component Library](./docs/COMPONENT_LIBRARY.md) - UI components
- [Testing Guide](./docs/TESTING_GUIDE.md) - Testing strategies
- [Security Guide](./docs/SECURITY_GUIDE.md) - Security best practices
- [Performance Guide](./docs/PERFORMANCE_GUIDE.md) - Performance optimization
- [Contributing Guide](./docs/CONTRIBUTING.md) - Development guidelines
- **[Implementation Review](./docs/IMPLEMENTATION_REVIEW.md) - Comprehensive feature implementation status**

### Quick References
- [Environment Setup](./docs/ENVIRONMENT_SETUP.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [FAQ](./docs/FAQ.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Maintain 200-line file limit
- Ensure privacy compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check the [docs](./docs/) directory
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the development team

### Common Issues
- **Build Errors**: Check environment variables
- **Authentication Issues**: Verify Supabase configuration
- **Performance Issues**: Check bundle size and Web Vitals
- **Deployment Issues**: Review deployment logs
- **Privacy Compliance**: Check Loi 25 implementation
- **Real-Time Issues**: Verify Supabase Realtime setup

### Contact
- **Email**: support@mondeneigeur.com
- **GitHub**: [Create an issue](https://github.com/your-username/mondeneigeur-pwa/issues)
- **Documentation**: [Full documentation](./docs/)

---

**MonDeneigeur PWA** - Professional snow removal services management platform.

*Built with React, TypeScript, Supabase, and modern web technologies.*

*Production-ready with comprehensive testing, monitoring, deployment capabilities, and full Loi 25 compliance.*

*✅ Real-time tracking, privacy compliance, weather integration, and bilingual support fully implemented.*
