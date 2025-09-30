<div align="center">
	<h1>🕵️ Mystery Message</h1>
	<p>Anonymous messaging platform built with Next.js 15, MongoDB & NextAuth. Users register, verify via email, share a public link, and receive anonymous messages in a secure dashboard.</p>
</div>

## ✨ Features

- 🔐 Credential-based authentication (email / username + password) with email verification
- 📧 Verification emails sent via Resend + React Email component
- 👤 Unique public profile links: `/u/:username` to receive anonymous messages
- 💬 Anonymous message submission with content validation (10–300 chars)
- 📨 Dashboard to view, refresh, and delete received messages
- 🚦 Toggle to accept / pause new anonymous messages
- 🗑️ Secure server-side message deletion
- ✅ Zod-based schema validation on both client & server
- 🧵 Session JWT strategy with enriched user object (verification status, messaging preference)
- 🗃️ MongoDB with Mongoose models (embedded messages array)
- 🎠 Autoplaying testimonial/message carousel on landing page
- 🎨 Tailwind CSS + shadcn-inspired UI primitives + Radix UI + lucide-react icons
- 🧩 TypeScript strict mode & path aliases (`@/*`)

## 🏗️ Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth | NextAuth (Credentials Provider, JWT sessions) |
| DB / ODM | MongoDB + Mongoose |
| Validation | Zod (@hookform/resolvers + client/server) |
| Forms | React Hook Form |
| Styling / UI | Tailwind CSS 4, Radix UI, shadcn-like components, lucide-react, sonner toasts |
| Email | Resend + React Email (`emails/VerificationEmail.tsx`) |
| Carousel | Embla + Autoplay plugin |
| Misc | Axios, bcryptjs, dayjs (unused presently in repo), class-variance-authority, clsx |

## 📂 Project Structure (key paths)

```
src/
	app/
		(app)/                # Public marketing + authenticated app sections
			page.tsx            # Landing page (carousel, marketing copy)
			dashboard/page.tsx  # Authenticated user dashboard
		(auth)/               # Auth flows
			sign-in/page.tsx
			sign-up/page.tsx
			verify/[username]/page.tsx
		api/                  # Route handlers (Next.js App Router)
			sign-up/route.ts            # Registration & send verification code
			verify-code/route.ts        # Verify 6‑digit code
			check-username-unique/route.ts
			auth/[...nextauth]/options.ts
			send-message/route.ts       # Anonymous message submission
			get-messages/route.ts       # Auth: list messages (sorted desc)
			accept-messages/route.ts    # GET/POST toggle accept status
			delete-message/[messageId]/route.ts
	components/             # Reusable UI + MessageCard, Navbar, ui/* primitives
	context/                # AuthProvider (NextAuth Session wrapper)
	helpers/                # Email helpers (sendVerificationEmail)
	lib/                    # dbConnect, resend client, utils
	models/                 # Mongoose User (with embedded Message schema)
	schemas/                # Zod schemas (signIn, signUp, verify, message, acceptMessage)
	types/                  # Shared TS types (ApiResponse, next-auth augmentation)
emails/                   # React Email templates
public/                   # Static assets
```

## 🧪 Validation Schemas (Zod)

- `signUpSchema`: username (3–20 alphanumeric/_), email (valid), password (≥6)
- `signInSchema`: identifier (email or username), password
- `verifySchema`: code exact length 6
- `messageSchema`: content 10–300 chars
- `acceptMessageSchema`: boolean flag

## 🔐 Authentication Flow
1. User submits sign-up form → server creates (or updates) unverified user with hashed password + 6‑digit code (1h expiry).
2. Verification email dispatched via Resend using React Email component.
3. User enters code at `/verify/:username` → server validates code + expiry → marks `isVerified=true`.
4. User signs in with email OR username + password via NextAuth Credentials provider.
5. JWT callback enriches token & session with: `_id`, `username`, `isVerified`, `isAcceptingMessages`.

## 💬 Messaging Flow
1. Visitor hits public link `/u/:username` (page file not shown here but implied by structure) to submit anonymous message.
2. Server validates target user exists & `isAcceptingMessages`.
3. Message appended to embedded `messages` array (content + timestamp).
4. Dashboard fetches messages (aggregation pipeline sorts descending via `$unwind` + `$sort`).
5. User can delete a message via DELETE route using `$pull`.
6. User toggles acceptance state via POST `/api/accept-messages`.

## 🗄️ Data Model (Mongoose)

User
- `username`: unique, required
- `email`: unique, required
- `password`: bcrypt hash
- `verifyCode` + `verifyCodeExpiry`
- `isVerified` (boolean)
- `isAcceptingMessages` (boolean, default true)
- `messages`: Embedded array of `{ content, createdAt }`

## 🌐 API Endpoints

| Endpoint | Method(s) | Auth | Description |
|----------|-----------|------|-------------|
| `/api/sign-up` | POST | No | Register user & send verification code |
| `/api/verify-code` | POST | No | Verify 6-digit code, activate account |
| `/api/check-username-unique?username=` | GET | No | Validate availability & format |
| `/api/auth/[...nextauth]` | POST (NextAuth) | No | Credentials sign-in |
| `/api/send-message` | POST | No | Submit anonymous message to user |
| `/api/get-messages` | GET | Yes | Fetch authenticated user's messages |
| `/api/accept-messages` | GET/POST | Yes | Read / toggle accept status |
| `/api/delete-message/:messageId` | DELETE | Yes | Delete specific message |

Response shape generally:
```
{
	success: boolean,
	message?: string,
	messages?: Array<{ _id: string, content: string, createdAt: string }>,
	isAcceptingMessages?: boolean
}
```

## 🚀 Local Development

### 📥 Clone the Repository

Using HTTPS:
```
git clone https://github.com/lovesinghal31/mysterymessage.git
cd mysterymessage
```

Using SSH:
```
git clone git@github.com:lovesinghal31/mysterymessage.git
cd mysterymessage
```

Using GitHub CLI:
```
gh repo clone lovesinghal31/mysterymessage
cd mysterymessage
```

Then install dependencies & start the dev server:

### ⚙️ Environment Variables

Create a `.env.local` file before starting the server:
```
MONGO_URI=your-mongodb-connection-string-without-db
DB_NAME=mysterymessage
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
```

Optional:
```
EMAIL_FROM=admin@your-domain.com
```

Install dependencies:
```
npm install
```

Run dev server:
```
npm run dev
```

Open http://localhost:3000

## 🧹 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start Next.js in development |
| `build` | Production build |
| `start` | Start production server |
| `lint` | Run ESLint (flat config) |

## 🔒 Security Considerations / Future Hardening
- Rate limiting for message submission & sign-up (e.g., Upstash Redis) – not yet implemented.
- Throttle verification code regeneration.
- Add CSRF protection (NextAuth built-in for some flows; credentials route relies on same-site).
- Move email from address to env var.
- Sanitize message content or add moderation pipeline.

## 🧱 Architectural Notes
- Simple per-request DB connect; Mongoose connection cached via singleton object.
- Embedded messages keeps user + messages in single doc (simpler reads, potential growth concerns if messages unbounded).
- Aggregation pipeline sorts by message timestamp efficiently for dashboard.
- All validation centralized in Zod schemas reused client & server where applicable.

## 🗺️ Roadmap Ideas
- Public profile page UI for `/u/:username` (structure exists, implement design & form UX)
- Pagination or infinite scroll for messages
- Soft delete / archival of messages
- Resend code (resend verification) endpoint
- Add OAuth providers (Google, GitHub) alongside credentials
- Add dark mode toggle (next-themes already installed?)
- Test coverage (Playwright / Vitest) & CI pipeline

## 🐞 Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| Cannot connect to DB | Wrong `MONGO_URI` or network | Verify connection string & IP allowlist |
| Verification email not sent | Invalid `RESEND_API_KEY` | Check dashboard / rotate key |
| Always "Please verify" on login | Code not verified | POST to `/api/verify-code` with correct code before login |
| Messages empty | No messages or aggregation result empty | Send a test message via `/api/send-message` |

## 📜 License
Currently no explicit license file. Add one (e.g., MIT) if you plan to open source contributions.

## 🙌 Acknowledgements
- Next.js / Vercel ecosystem
- Resend & React Email
- Radix UI & shadcn/ui patterns
- Zod, React Hook Form, Sonner, Lucide

---
Feel free to open issues or extend functionality. PRs welcome once a license is defined.

Happy building 🕵️
