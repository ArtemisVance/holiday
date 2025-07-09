# Wales Holiday App

## Overview

This is a full-stack web application built for managing and displaying a Wales holiday itinerary. The application showcases a 8-day vacation plan with detailed daily activities, locations, and restaurant recommendations. It features a modern, responsive design with a travel-themed user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and build process
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Theme System**: Custom theme provider with light/dark mode support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Data Storage**: Currently using in-memory storage with plans for PostgreSQL integration

### Key Design Decisions
- **Monorepo Structure**: Shared schema and types between client and server
- **Type Safety**: Full TypeScript coverage across the stack
- **Component Architecture**: Reusable UI components with consistent design system
- **Responsive Design**: Mobile-first approach with desktop enhancements

## Key Components

### Frontend Components
- **Dashboard**: Main application interface with tabbed navigation
- **ItineraryCard**: Displays daily itinerary information with weather and activities
- **LocationCard**: Shows tourist locations with categorized icons
- **RestaurantCard**: Displays dining recommendations with meal type indicators
- **Sidebar**: Navigation component with dashboard controls
- **Header**: Application header with theme toggle and branding
- **ThemeProvider**: Manages light/dark theme state

### Backend Components
- **Routes**: API endpoints for itinerary, locations, and restaurants
- **Storage**: Data access layer with in-memory implementation
- **Schema**: Shared database schema definitions using Drizzle ORM

### Database Schema
- **itinerary_days**: Stores daily itinerary with activities and dining as JSON
- **locations**: Tourist locations with categories and map links
- **restaurants**: Dining options with categories and descriptions

## Data Flow

1. **Client Request**: Frontend makes API calls using TanStack Query
2. **Express Routes**: Server routes handle API requests
3. **Storage Layer**: Currently in-memory storage, designed for database integration
4. **Response**: JSON data returned to client and cached by React Query
5. **UI Updates**: Components re-render with new data automatically

### API Endpoints
- `GET /api/itinerary` - Retrieve all itinerary days
- `GET /api/locations` - Retrieve all tourist locations
- `GET /api/restaurants` - Retrieve all restaurant recommendations

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting

### Backend Dependencies
- **Database**: Neon Database for serverless PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type checking and compilation
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle handles schema migrations

### Environment Configuration
- **Development**: Uses NODE_ENV=development with hot reloading
- **Production**: Serves static files and API from single Express server
- **Database**: Requires DATABASE_URL environment variable

### Hosting Considerations
- **Static Assets**: Served from Express in production
- **API Routes**: Handled by Express server
- **Database**: Serverless PostgreSQL via Neon
- **Replit Integration**: Configured for Replit deployment with dev banner

### Scripts
- `dev`: Development server with hot reloading
- `build`: Production build for both client and server
- `start`: Production server
- `db:push`: Push database schema changes

The application is designed to be easily deployable on platforms like Replit, Vercel, or any Node.js hosting service with minimal configuration changes.