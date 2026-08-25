Production-Ready Media REST API
A highly scalable, production-ready Media REST API built with Bun, Elysia, TypeScript, Cloudflare R2 (storage), and Turso/libSQL (database).
Features
🚀 Built on Bun and Elysia for extreme performance.
📁 Cloudflare R2 for object storage (images and videos).
💾 Turso (libSQL) with Drizzle ORM for metadata storage.
🔒 Admin-only Bearer Token authentication for uploads/deletions.
🎲 Efficient randomized media endpoint using SQLite RANDOM().
🛡️ File type and size validation, protection against path traversal.
🧹 Automatic rollback logic if DB inserts fail after R2 uploads.
📦 Fully typed and secure by default.
1. Requirements
Bun (v1.0+)
Cloudflare R2 bucket
Turso Database (or a compatible SQLite instance)
2. Installation
   bun install
3.Copy .env.example to .env and fill in your credentials.
   cp .env.example .env
4.Database Setup (Turso)
Create a database using the Turso CLI:
    turso db create my-media-db
   Get your database URL and Auth Token and add them to your .env
   turso db show my-media-db --url
turso db tokens create my-media-db
5. Database Migrations
Generate and push the schema to your Turso database:
bun run db:generate
bun run db:push
Cloudflare R2 Setup
Create an R2 bucket in your Cloudflare dashboard.
Create an API Token with Object Read & Write permissions.
Add the Account ID, Access Key, Secret Key, Bucket Name, and Public URL (custom domain or R2 dev domain) to your .env.


API Endpoints
Health Check
GET /health - Returns { "success": true, "status": "ok" }
Public Endpoints
GET /api/images - List paginated images.
GET /api/images/:id - Get single image metadata.
GET /api/images/random?limit=5 - Get random images.
GET /api/videos - List paginated videos.
GET /api/videos/:id - Get single video metadata.
GET /api/videos/random?limit=5 - Get random videos.
Protected Endpoints (Admin Only)
POST /api/images - Upload an image.
DELETE /api/images/:id - Delete an image.
POST /api/videos - Upload a video.
DELETE /api/videos/:id - Delete a video.

Usage Examples
curl https://your-api.com/api/images/random?limit=5

Upload an Image (Admin)
curl -X POST https://your-api.com/api/images \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  -F "file=@/path/to/image.jpg" \
  -F "title=My Beautiful Image"
  
 Delete a Video (Admin)
 curl -X DELETE https://your-api.com/api/videos/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY"





   
