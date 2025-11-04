# She Safe Journeys

A comprehensive women's safety application built with modern web technologies, providing real-time safety features, emergency assistance, and community support.

## Project Information

**URL**: https://lovable.dev/projects/c0a611db-9f2d-42b1-a0cf-13f2337b4f5c

## Features

- Real-time location tracking and safety monitoring
- Emergency contact management and quick SOS functionality
- Interactive safety maps with crowd-sourced incident reporting
- Community safety ratings and reviews
- Secure authentication and user profiles
- Dark mode support

## Technologies Used

This project is built with:

- **Vite** - Next-generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **React** - UI component library
- **shadcn-ui** - Re-usable component system
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (authentication, database, real-time)
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase account** - [Sign up here](https://supabase.com)

## Getting Started

### 1. Clone the Repository

```sh
git clone <YOUR_GIT_URL>
cd she-safe-journeys
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Environment Configuration

#### Create Environment File

Copy the example environment file and configure it with your credentials:

```sh
cp .env.example .env
```

#### Set Up Supabase

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Fill in your project details and create the project

2. **Get Your API Credentials**
   - Navigate to Project Settings → API
   - Copy the following values:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **Project ID** (from the URL)
     - **anon/public key** (your publishable API key)

3. **Configure Your `.env` File**

Open the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id_here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_anon_key_here
```

**Important Security Notes:**
- ⚠️ Never commit the `.env` file to version control
- ⚠️ Never share your API keys publicly
- ✅ Only use the anon/public key in frontend code
- ✅ Keep your service role key secret (never use in frontend)

### 4. Database Setup

The project includes database migrations in the `supabase` directory. To set up your database:

1. Install the Supabase CLI (optional):
   ```sh
   npm install -g supabase
   ```

2. Link your project:
   ```sh
   supabase link --project-ref your_project_id
   ```

3. Push migrations:
   ```sh
   supabase db push
   ```

Alternatively, you can manually create the tables using the SQL editor in your Supabase dashboard.

### 5. Start the Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:8080` (or the port shown in your terminal).

## Development Workflow

### Using Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/c0a611db-9f2d-42b1-a0cf-13f2337b4f5c) and start prompting. Changes made via Lovable will be committed automatically to this repo.

### Using Your Preferred IDE

1. Make your changes locally
2. Test thoroughly
3. Commit with clear messages:
   ```sh
   git add .
   git commit -m "Description of changes"
   git push
   ```

Pushed changes will also be reflected in Lovable.

### Using GitHub Codespaces

1. Navigate to the main page of your repository
2. Click on the "Code" button (green button)
3. Select the "Codespaces" tab
4. Click "New codespace"
5. Edit files directly and commit changes when done

### Using GitHub Web Editor

1. Navigate to the desired file(s)
2. Click the "Edit" button (pencil icon)
3. Make your changes and commit

## Project Structure

```
she-safe-journeys/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── integrations/     # External service integrations
│   │   └── supabase/     # Supabase client and types
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React context providers
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
├── public/               # Static assets
├── supabase/            # Database migrations
├── .env.example         # Example environment variables
└── README.md            # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Deploy via Lovable

The easiest way to deploy:

1. Open [Lovable](https://lovable.dev/projects/c0a611db-9f2d-42b1-a0cf-13f2337b4f5c)
2. Click on **Share → Publish**
3. Your app will be deployed automatically

### Deploy to Other Platforms

This project can be deployed to:

- **Vercel** - `vercel --prod`
- **Netlify** - Connect your repo and deploy
- **Cloudflare Pages** - Connect and deploy

**Important:** Make sure to add your environment variables in the deployment platform's settings.

## Custom Domain

To connect a custom domain:

1. Navigate to Project → Settings → Domains
2. Click "Connect Domain"
3. Follow the DNS configuration steps

[Read more about custom domains](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Security Best Practices

- ✅ All sensitive credentials are stored in `.env` (not committed to git)
- ✅ Environment variables use `VITE_` prefix for Vite exposure
- ✅ Supabase Row Level Security (RLS) policies are enabled
- ✅ Authentication is required for sensitive operations
- ✅ Input validation on all user-submitted data

## Troubleshooting

### Common Issues

**"Supabase client not initialized"**
- Make sure your `.env` file is configured correctly
- Restart the development server after changing `.env`
- Verify your Supabase project is active

**"Module not found"**
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Build errors**
- Check TypeScript errors: `npm run type-check`
- Ensure all environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions:
- Create an issue in this repository
- Contact the development team
- Check the [Lovable documentation](https://docs.lovable.dev)

---

Built with ❤️ for women's safety
