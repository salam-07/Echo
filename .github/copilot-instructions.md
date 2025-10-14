# Echo Development Guide

## Architecture Overview

Echo is a social media platform with **Echos** (posts) organized into **Scrolls** (collections). The architecture follows a clean separation:

- **Backend**: Express.js API with MongoDB (Mongoose ODM), JWT auth via cookies
- **Frontend**: React + Vite with Zustand state management, TailwindCSS + DaisyUI styling

### Core Domain Models

- **Echo**: Posts with content, tags, likes (max 1000 chars)
- **Scroll**: Collections of Echos - either `curation` (manual) or `feed` (filtered)
- **User**: Authentication, profiles, following relationships
- **Tag**: Categorization system for Echos

## Key Patterns & Conventions

### Backend Structure
```
backend/src/
├── controllers/     # Business logic (echo.controller.js, etc.)
├── models/         # Mongoose schemas (echo.model.js, etc.)
├── routes/         # Express route definitions
├── middleware/     # Auth middleware (protectRoute)
└── lib/           # Utilities (sorting.js, db.js)
```

**Route Pattern**: All routes prefixed with `/api/`, protected routes use `protectRoute` middleware
**Error Handling**: Controllers return `{ error: "message" }` format, 500 for server errors
**Auth**: JWT tokens stored in httpOnly cookies, validated in `protectRoute` middleware

### Component Organization & Reusability

**UI Components**: Shared primitives in `components/ui/` (Button, Card, Modal, Input, etc.)
- Consistent props API with `variant`, `size`, `className` patterns
- Built on DaisyUI with utility-first approach
- Example: `<Button variant="primary" size="lg">Create Echo</Button>`

**Feature Components**: Domain-specific components broken into smaller, focused pieces
- `EchoCard` → `EchoHeader` + `EchoContent` + `EchoActions`
- `ScrollCard` → shared base for `CurationScrollCard` and `FeedScrollCard`
- Co-located in feature folders (`features/echo/`, `features/scroll/`)

**Store Utilities**: Reusable async action patterns in `store/utils.js`
- `createAsyncAction()` for loading states and error handling
- `createCrudActions()` for standard CRUD operations
- Consistent toast notifications and state management

### Frontend Structure
```
frontend/src/
├── components/
│   ├── ui/             # Reusable UI primitives (Button, Card, Modal, etc.)
│   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   ├── forms/          # Form components (CurationForm, FeedForm)
│   └── features/       # Feature-specific components
│       ├── echo/       # Echo-related components (EchoCard, EchoActions)
│       └── scroll/     # Scroll-related components (ScrollCard, etc.)
├── pages/             # Route components (HomePage.jsx, etc.)
├── store/             # Zustand stores with shared utilities
├── lib/               # Utilities (axios.js, utils.js)
└── layouts/           # Layout wrappers
```

**Component Architecture**: Modular structure with shared UI primitives and feature-specific components
**State Management**: Zustand stores with reusable async action utilities (`store/utils.js`)
**API Calls**: Centralized in stores using `axiosInstance` and `createAsyncAction` helpers
**Styling**: TailwindCSS with DaisyUI, consistent design system via UI components

### Critical Integrations

**Network Development**: Backend configured for local network access (192.168.10.x range) via CORS
**Build Process**: Root `package.json` orchestrates frontend build and backend start
**Environment Handling**: Frontend adapts API URLs based on hostname for mobile/network testing

## Development Workflows

### Local Development
```bash
# Backend (from /backend)
npm run dev          # Nodemon with hot reload

# Frontend (from /frontend) 
npm run dev          # Vite dev server (localhost:5173)
npm run host         # Network accessible dev server

# Full build (from root)
npm run build        # Install deps + build frontend
npm start           # Start production backend
```

### Key File Relationships

- `backend/src/index.js` → Route registration and CORS setup
- `frontend/src/App.jsx` → Route definitions and auth flow
- `frontend/src/components/ui/` → Reusable component primitives
- `frontend/src/store/utils.js` → Shared async action patterns
- `backend/src/lib/sorting.js` → Reusable query filtering utilities

### Component Development Patterns

**Creating New UI Components**: Follow the established pattern in `components/ui/`
- Use `cn()` utility for conditional className joining
- Support `variant`, `size`, `className` props consistently
- Include forwardRef for form elements

**Breaking Down Large Components**: 
- Extract logical sections (Header, Content, Actions)
- Create feature-specific sub-components
- Maintain single responsibility principle

**Store Integration**:
- Use `createAsyncAction` for async operations with loading states
- Centralize API calls in stores, not components
- Follow `controller → store → component` data flow

### Auth Flow
1. JWT tokens in httpOnly cookies (not localStorage)
2. `useAuthStore.checkAuth()` on app init
3. `protectRoute` middleware validates all protected endpoints
4. Frontend stores user in Zustand, redirects on auth state changes

When implementing features, follow the established patterns:
1. **UI Components**: Use shared primitives from `components/ui/` 
2. **Feature Components**: Break large components into focused sub-components
3. **State Management**: Leverage `store/utils.js` helpers for consistent async actions
4. **Component Organization**: Place components in appropriate feature folders
5. **Data Flow**: Maintain controller → store → component pattern and domain separation between Echos and Scrolls