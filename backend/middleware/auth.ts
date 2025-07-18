// ⚠️ DEPRECATED: This file contains INSECURE authentication
// 
// This implementation only DECODES JWT tokens without proper verification
// making it vulnerable to token forgery attacks.
//
// The application now uses SECURE authentication with proper JWT verification
// via Clerk's backend SDK directly in the routes and server.ts files.
//
// DO NOT USE THIS FILE - it's kept for reference only.
//
// Secure implementation is now in:
// - server.ts: clerkMiddleware() for global JWT verification
// - routes/news.ts: getAuth() for route-level authentication checks 