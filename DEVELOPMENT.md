# Development Guide

## Project Structure

```
src/
├── components/          # React components
│   ├── Form.tsx        # Main form component
│   ├── QuestionComponent.tsx
│   ├── SchedulerListComponent.tsx
│   ├── SchedulerInfo.tsx
│   ├── UnknownFeature.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── index.ts        # Barrel exports
├── hooks/              # Custom React hooks
│   └── useFormState.ts
├── models/             # TypeScript interfaces
│   ├── Schedulers.ts
│   └── Answers.ts
├── utils/              # Utility functions
│   ├── helpers.ts
│   └── __tests__/      # Unit tests
├── constants/          # App constants
├── types/              # TypeScript types
├── config/             # Configuration
└── db/                 # JSON data files
```

## Key Features Implemented

### 1. Custom Hooks
- `useFormState`: Manages form state, URL parameters, and scheduler filtering

### 2. Performance Optimizations
- React.memo for component memoization
- Lazy loading with React.Suspense
- Custom loading states

### 3. Error Handling
- ErrorBoundary component for graceful error handling
- Comprehensive error catching

### 4. Type Safety
- Strong TypeScript interfaces
- Proper type definitions for all components

### 5. Testing
- Unit tests for utility functions
- Jest configuration for testing

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Code Quality

- ESLint configuration for code quality
- TypeScript for type safety
- Prettier for code formatting
- Comprehensive error handling

## Performance Features

- Lazy loading of components
- Memoized components to prevent unnecessary re-renders
- Optimized bundle size with tree shaking
- Loading states for better UX
