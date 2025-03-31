# Task Tracker Client

React + Vite application for Task Tracker

## File Structure

- assets - To hold custom assets such as images and fonts
- components - Database configurations and augmentations
  - auth - Components related to authentication pages
  - common - Shared components between pages
    - core - Atomic components unaffected by business logic
  - home - Components related to the home page
- constants - Global constant definitions
- hooks - Custom hooks
  - services - Service central react query hooks
- pages - Page and routing configurations
- providers - App level global providers
- services - External connectivity layer
- store - Zustand stores
- styles - Custom styles
- types - Type definitions
- utils - Shared utilities

</br>

## Basic Commands

- `pnpm dev` - Starts the server in dev mode
- `pnpm build` - Builds the server
- `pnpm start` - Runs the built server
- `pnpm test` - Runs unit tests (Please note that if directly run from here instead of through Turbo the dependant packages must be built first)