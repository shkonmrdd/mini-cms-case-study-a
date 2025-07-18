# Clerk Authentication Setup

This mini-CMS now includes Clerk authentication to protect admin functionality. Follow these steps to set up authentication:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application in your Clerk dashboard
3. Choose your preferred authentication providers (email/password, Google, GitHub, etc.)

## 2. Get Your API Keys

From your Clerk Dashboard > API Keys section, copy:

- **Publishable Key** (starts with `pk_test_` or `pk_live_`)
- **Secret Key** (starts with `sk_test_` or `sk_live_`)

## 3. Configure Environment Variables

### Backend (.env)
Create a `.env` file in the `backend/` directory:

```bash
# Database
DATABASE_URL="your_database_url_here"

# Server
PORT=5001
NODE_ENV=development

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### Frontend (.env)
Create a `.env` file in the `frontend/` directory:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration (optional - defaults to localhost:5001)
VITE_API_URL=http://localhost:5001/api
```

## 4. Authentication Flow

### Public Access
- Home page with news listing
- Search functionality
- Individual article viewing

### Protected Admin Access
- Creating new articles
- Editing existing articles  
- Deleting articles
- Admin dashboard

## 5. How It Works

1. **Frontend Protection**: Admin routes are protected using Clerk's `<SignedIn>` and `<SignedOut>` components
2. **Backend Protection**: API endpoints for POST, PUT, DELETE operations require valid JWT tokens
3. **Automatic Token Management**: The frontend automatically includes authentication tokens in API requests

## 6. Testing the Setup

1. Start both backend and frontend servers
2. Visit the homepage - you should see an "Admin" button in the header
3. Click "Admin" to open the Clerk sign-in modal
4. Sign up/sign in with your preferred method
5. After authentication, you'll be redirected to the admin dashboard
6. Try creating/editing articles - these operations now require authentication

## 7. Customization

### Styling
Clerk components inherit your app's styling. You can customize the appearance in your Clerk Dashboard under "Customization".

### Additional Providers
Add more authentication providers (Google, GitHub, etc.) in your Clerk Dashboard under "User & Authentication" > "Social Connections".

### User Management
View and manage users in your Clerk Dashboard under "Users".

## Production Deployment

For production:

1. Use production Clerk keys (starting with `pk_live_` and `sk_live_`)
2. Configure your production domain in Clerk Dashboard
3. Set up proper environment variables in your hosting platform
4. Ensure HTTPS is enabled for your domain

## Troubleshooting

### Common Issues:

1. **"Missing Publishable Key" error**: Check that `VITE_CLERK_PUBLISHABLE_KEY` is set correctly in your frontend `.env` file

2. **Authentication not working**: Verify that both frontend and backend have the correct Clerk keys

3. **API requests failing**: Ensure the backend authentication middleware is properly configured and Clerk keys match

4. **Sign-in modal not appearing**: Check that `@clerk/clerk-react` is properly installed and imported

## Security Notes

- Never commit `.env` files to version control
- Keep your Clerk Secret Key secure and server-side only
- Publishable Key is safe to expose in frontend code
- Consider implementing additional authorization checks based on user roles if needed 