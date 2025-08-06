# LifeOS Kindred Spark

A modern React application built with TypeScript, Vite, and Tailwind CSS. This project provides a foundation for building interactive web applications with authentication and celebration effects.

## 🚀 Features

- **Modern Tech Stack**: Built with React 18, TypeScript, and Vite for fast development
- **Styling**: Tailwind CSS with shadcn-ui components for beautiful, responsive design
- **Authentication**: Integrated authentication system via Supabase
- **Interactive UI**: Celebration effects and smooth animations
- **Database**: Supabase backend with migrations support
- **Type Safety**: Full TypeScript support throughout the application

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui
- **Backend**: Supabase (Database, Auth, Functions)
- **Build Tool**: Vite
- **Package Manager**: Bun/npm
- **Linting**: ESLint

## 📁 Project Structure

```
lifeos-kindred-spark/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Auth.tsx       # Authentication components
│   │   ├── CelebrationEffect.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service integrations
│   ├── lib/               # Utility libraries and configurations
│   ├── pages/             # Page components
│   └── main.tsx           # Application entry point
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── functions/         # Edge functions
│   └── config.toml        # Supabase configuration
└── public/                # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js (18.0 or later) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or Bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd lifeos-kindred-spark
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🗄️ Database Setup

This project uses Supabase as the backend. To set up the database:

1. Create a new Supabase project
2. Configure your environment variables
3. Run the migrations:
   ```bash
   supabase db push
   ```

## 🎨 Styling

The project uses Tailwind CSS with shadcn-ui components. Key styling files:

- [`src/index.css`](src/index.css) - Global styles and Tailwind imports
- [`src/App.css`](src/App.css) - Component-specific styles
- [`tailwind.config.ts`](tailwind.config.ts) - Tailwind configuration
- [`components.json`](components.json) - shadcn-ui configuration

## 🔐 Authentication

Authentication is handled through the [`Auth.tsx`](src/components/Auth.tsx) component, integrated with Supabase Auth for secure user management.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1280px+ containers)
- Tablet and mobile devices
- Reduced motion preferences


