# @hmxlabs/sched-select

## TLDR
Choosing a HPC/AI scheduler is often a once per career type decision and getting it wrong can be expensive. Want a hand? This is the tool for to do that.

If you just want to use the tool, head over to https://scheduler-select.hmxlabs.io

Looking to add your own scheduler or correct a mistake? You probably just want to edit this file: [src/db/schedulers.json](./src/db/schedulers.json) and raise a PR.

## Overview

This package serves two purposes:

1. **Standalone Application**: A complete React application for scheduler selection
2. **NPM Package**: A reusable component library that can be imported into other React projects

## Installation

### As an NPM Package

```bash
npm install @hmxlabs/sched-select
```

Or for local development:

```json
{
  "dependencies": {
    "@hmxlabs/sched-select": "file:../sched-select"
  }
}
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.0",
  "@mui/icons-material": "^5.18.0",
  "@mui/material": "^5.18.0",
  "@mui/system": "^5.18.0",
  "framer-motion": "^12.4.5",
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "react-router-dom": "^7.0.0"
}
```

## Usage

### As a Component in Another Project

```tsx
import { SchedSelectForm } from '@hmxlabs/sched-select';
import '@hmxlabs/sched-select/styles';

function App() {
  return (
    <div>
      <SchedSelectForm />
    </div>
  );
}
```

### Available Exports

```tsx
// Main component
import { SchedSelectForm } from '@hmxlabs/sched-select';

// Individual components
import {
  QuestionComponent,
  SchedulerListComponent,
  SchedulerInfo,
  UnknownFeature,
} from '@hmxlabs/sched-select';

// Utilities
import {
  scoreSchedulers,
  filterSchedulers,
  generateShareableLink,
  formatKey,
} from '@hmxlabs/sched-select';

// Types
import type { Scheduler, SchedulerFeatures, Answer } from '@hmxlabs/sched-select';

// Theme
import { theme } from '@hmxlabs/sched-select';

// Styles (must be imported separately)
import '@hmxlabs/sched-select/styles';
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the standalone app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the **library** for distribution. Creates:
- `dist/index.js` - CommonJS bundle
- `dist/index.esm.js` - ES Module bundle
- `dist/index.d.ts` - TypeScript declarations
- `dist/styles.css` - Component styles

### `npm run build:app`

Builds the **standalone application** for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

## Project Structure

```
sched-select/
├── src/
│   ├── index.tsx          # Standalone app entry point
│   ├── lib.ts             # Library entry point (exports)
│   ├── App.tsx            # Standalone app root component
│   ├── components/        # React components
│   │   ├── Form.tsx
│   │   ├── QuestionComponent.tsx
│   │   ├── SchedulerListComponent.tsx
│   │   ├── SchedulerInfo.tsx
│   │   └── UnknownFeature.tsx
│   ├── models/            # TypeScript interfaces
│   ├── utils/             # Helper functions
│   ├── styles/            # Theme configuration
│   ├── db/                # JSON data files
│   └── assets/            # Images and static assets
├── dist/                  # Built library output
├── build/                 # Built standalone app output
├── rollup.config.mjs      # Library build configuration
├── tsconfig.build.json    # TypeScript config for library build
└── package.json
```

## Development Environment

A VSCode developer environment is provided. Open VSCode, and then select "Open in Container" from the interactive button, or search for "Dev Containers" in the command palette.

## Building for Distribution

To build and publish the library:

```bash
# Build the library
npm run build

# The package is ready to be published or linked locally
```