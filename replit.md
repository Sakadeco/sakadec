# Overview

SakaDeco Group is a comprehensive event decoration and interior design platform offering multiple services through distinct business units. The application provides an e-commerce marketplace for party supplies, custom product personalization, equipment rental, event planning services, home organization, and business coordination. Built as a full-stack web application with React frontend and Express backend, it features a multi-tenant service architecture where each business unit (Shop, Créa, Rent, Events, Home, Co) operates as a specialized service with its own branding and functionality. The modern interface is inspired by professional decoration websites like M&Paillettes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with service-specific pages
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom brand colors for each service unit
- **Authentication**: Integration with Replit Auth for user management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple
- **API Design**: RESTful API with service-specific endpoints for products, orders, rentals, quotes
- **Development Setup**: Vite middleware integration for hot module replacement

## Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon for production scalability
- **ORM**: Drizzle with code-first schema definitions in shared directory
- **Schema Organization**: Separate tables for users, products, orders, rentals, quotes with proper relationships
- **Session Storage**: PostgreSQL-backed session store for authentication persistence
- **File Storage**: Unsplash integration for product imagery (development/demo purposes)

## Authentication and Authorization
- **Authentication Provider**: Replit OpenID Connect integration
- **Session Management**: Secure HTTP-only cookies with PostgreSQL session store
- **Authorization**: Role-based access control with user/admin roles
- **User Management**: Profile management with Stripe customer integration
- **Security**: CSRF protection and secure session configuration

## External Dependencies
- **Database Hosting**: Neon serverless PostgreSQL for scalable data storage
- **Authentication Service**: Replit OIDC for seamless user authentication in Replit environment
- **UI Components**: Radix UI for accessible component primitives
- **Styling Framework**: Tailwind CSS for utility-first styling approach
- **Image Service**: Unsplash API for high-quality product and service imagery
- **Font Integration**: Google Fonts (Playfair Display, Montserrat) for brand typography
- **Development Tools**: TypeScript for type safety, ESLint for code quality
- **Payment Processing**: (Future implementation - currently disabled for development)