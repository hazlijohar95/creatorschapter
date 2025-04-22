# DEALFLOW - AI-Powered Creator Success Platform

## Technical Infrastructure

### Frontend Stack
- **Framework:** React 18 with TypeScript for type-safe development
- **Build Tool:** Vite for fast development and optimized production builds
- **Styling:** 
  - Tailwind CSS for utility-first styling
  - shadcn/ui for high-quality, accessible UI components
  - CSS Modules for component-scoped styles
- **State Management:** 
  - React Query for server state management
  - React Context for global app state
- **Routing:** React Router v6 for client-side navigation

### Backend Infrastructure
- **Database:** Supabase PostgreSQL for data persistence
- **Authentication:** Supabase Auth with:
  - Email/Password authentication
  - Row Level Security (RLS) policies
- **API Layer:** 
  - Supabase Edge Functions for serverless computing
  - RESTful API endpoints
  - WebSocket support for real-time features

### Development Tools
- **Type Safety:** TypeScript for enhanced development experience
- **Package Management:** npm
- **Code Quality:**
  - ESLint for code linting
  - TypeScript for static type checking
- **Development Server:** Vite with hot module replacement

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Route components
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations
├── lib/             # Utility functions and constants
└── App.tsx          # Root component
```

## Development Setup

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Start development server
npm run dev
```

## Deployment

The application is deployed using Lovable's hosting infrastructure. Each commit to the main branch triggers an automatic deployment.

### Environment Variables
Make sure these environment variables are properly configured in your deployment environment:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Custom Domain Setup

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click on "Connect Domain"
3. Follow the DNS configuration instructions

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
4. Wait for review and approval

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ab9f700b-4cfa-4c51-8562-ab014700bea0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ab9f700b-4cfa-4c51-8562-ab014700bea0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
