# PeakNest — restructured to match the roleauth (car service) project

## What changed

**Folder structure** — split the old single `app.js` into the same layout as roleauth:

```
config/         db.js, seedAdmin.js
controller/     userController.js   (auth + dashboard stats + hotel CRUD)
middleware/     bodyParserMiddleware.js, checkrole.js
models/         User.js, Hotel.js
routes/         hotelRoutes.js
public/data.js  the old hardcoded hotel/room/deal/testimonial data, now a module
views/          + login.ejs, signup.ejs, admin-login.ejs, admin-dashboard.ejs
server.js       (renamed from app.js — same entrypoint role as roleauth's server.js)
```

**Auth, same as roleauth:**
- Signup/login with `bcryptjs` password hashing and `jsonwebtoken`
- Session-backed token (`express-session` + `connect-mongo`) via `req.session.token`
- `checkAdminRole` middleware protects admin routes
- `config/seedAdmin.js` auto-creates an admin user from `.env` on startup

**Admin dashboard** (`/admin/dashboard`) — sidebar with Overview / Manage Users / Add User / Manage Hotels / Add Hotel / Settings, same shape as roleauth's dashboard but restyled with PeakNest's colors and fonts, and "Services" swapped for "Hotels".

**Two data layers, same pattern as roleauth:**
- The public site (`/`, `/hotel/:id`) still renders from the rich static data in `public/data.js` (locations, hotels, rooms, deals, testimonials) — untouched content.
- A separate `Hotel` Mongoose model + CRUD API (`/api/auth/hotels`) lets an admin add/edit/delete hotel entries in MongoDB, shown in the admin dashboard — mirroring how roleauth kept its static `services` data for the public pages *and* a separate DB-backed `Service` model for admin management.

**Routes kept human-friendly** (not prefixed with `/api/auth/` like roleauth) since PeakNest's public URLs (`/`, `/hotel/:id`) were already clean — only the JSON API endpoints live under `/api/auth/*`.

| Route | Purpose |
|---|---|
| `GET /` | Homepage |
| `GET /hotel/:id` | Hotel detail |
| `GET /login`, `GET /signup`, `GET /admin/login` | Auth pages |
| `GET /admin/dashboard` | Admin panel (protected) |
| `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/logout` | Auth API |
| `GET/POST/PUT/DELETE /api/auth/hotels[/:id]` | Hotel CRUD (admin only) |
| `GET /api/auth/dashboard-stats`, `GET /api/auth/all-users` | Admin stats API |

## Setup

```bash
npm install
```

Update `.env` if needed (Mongo URI, JWT secret, seed admin credentials), then:

```bash
npm start        # or: npm run dev
```

The seed admin (from `.env`) is created automatically on first boot — log in at `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
