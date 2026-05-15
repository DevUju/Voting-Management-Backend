# Backend - Poll & Voting System API

NestJS backend for the Poll & Voting System application.

##  Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm

##  Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=poll_voting_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
APP_PORT=3000
FRONTEND_URL=http://localhost:4200
```

### 3. Start Development Server
```bash
npm run start:dev
```

Server runs on http://localhost:3000

##  Project Structure

```
src/
├── auth/                   # Authentication module (signup, login, JWT)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── auth.dto.ts
│   └── guards/             # Authentication & authorization guards
│       ├── jwt-auth.guard.ts
│       ├── admin.guard.ts
│       └── non-admin.guard.ts
├── polls/                  # Polls module
│   ├── poll.controller.ts
│   ├── poll.service.ts
│   ├── polls.module.ts
│   ├── poll.entity.ts
│   └── poll.dto.ts
├── poll-options/           # Poll options module
│   ├── poll-options.controller.ts
│   ├── poll-options.service.ts
│   ├── poll-options.module.ts
│   └── poll-option.entity.ts
├── votes/                  # Votes module
│   ├── vote.controller.ts
│   ├── vote.service.ts
│   ├── votes.module.ts
│   ├── vote.entity.ts
│   └── vote.dto.ts
├── users/                  # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── user.entity.ts
├── config/                 # Configuration
│   └── database.config.ts
├── migrations/             # TypeORM database migrations
├── seeds/                  # Database seeds
│   └── admin.seed.ts
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
├── data-source.ts          # TypeORM data source configuration
└── env.d.ts                # Environment type definitions
```

##  API Endpoints

### Authentication (`/api/auth`)
```
POST   /signup              - Register new user
POST   /login               - Login user
GET    /profile             - Get current user profile (requires auth)
```

### Polls (`/api/polls`)
```
POST   /                    - Create poll (admin only)
GET    /                    - Get all polls
GET    /active              - Get active polls
GET    /:id                 - Get poll by ID
PATCH  /:id                 - Update poll (admin only)
DELETE /:id                 - Delete poll (admin only)
PATCH  /:id/close           - Close poll (admin only)
```

### Votes (`/api/votes`)
```
POST   /                    - Submit a vote
GET    /poll/:pollId        - Get votes for a poll
GET    /poll/:pollId/results           - Get poll results
GET    /poll/:pollId/results/by-state?state=STATE - Results by state
GET    /user/:userId/poll/:pollId     - Check user's vote on poll
```

##  Database Setup

The backend automatically creates tables on startup using TypeORM synchronization. Ensure PostgreSQL is running:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE poll_voting_db;"
```

##  Admin User Setup

An admin user seed is provided to initialize the database with an administrator account.

### Configure Admin Credentials

Edit the admin credentials in your `.env` file:

```env
ADMIN_EMAIL=superadmin@yourdomain.com
ADMIN_PASSWORD=SecureAdminPassword123!
ADMIN_NAME=Super Administrator
ADMIN_STATE=New York
```

### Run the Seed Script

```bash
npm run seed
```

This will create an admin user if one doesn't already exist. The admin will have:
- Full permission to create, update, and delete polls
- Access to admin-only endpoints
- Ability to manage other users

**Note**: Change the default admin password in production!

##  Available Scripts

```bash
npm run start        # Start production server
npm run start:dev    # Start development server with watch
npm run build        # Build for production
```

##  Authentication

- **Method**: JWT (Bearer Token)
- **Location**: Authorization header
- **Format**: `Bearer <token>`
- **Expiration**: Configurable via `JWT_EXPIRES_IN`

Example request with auth:
```bash
curl -H "Authorization: Bearer your_token_here" http://localhost:3000/api/auth/profile
```

##  Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Admin role-based access control
- Input validation with class-validator
- CORS protection
- SQL injection prevention via TypeORM


##  Database Entities

### User
```typescript
{
  id: UUID,
  name: string,
  email: string (unique),
  password: string (hashed),
  state: string,
  role: 'admin' | 'user',
  createdAt: datetime,
  updatedAt: datetime
}
```

### Poll
```typescript
{
  id: UUID,
  title: string,
  description: string,
  status: 'active' | 'closed',
  createdBy: UUID,
  createdAt: datetime,
  updatedAt: datetime,
  options: PollOption[],
  votes: Vote[]
}
```

### PollOption
```typescript
{
  id: UUID,
  pollId: UUID,
  optionText: string,
  createdAt: datetime,
  votes: Vote[]
}
```

### Vote
```typescript
{
  id: UUID,
  userId: UUID,
  pollId: UUID,
  optionId: UUID,
  state: string,
  createdAt: datetime
}
```

##  Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

##  Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_HOST | PostgreSQL host | localhost |
| DATABASE_PORT | PostgreSQL port | 5432 |
| DATABASE_USER | Database user | postgres |
| DATABASE_PASSWORD | Database password | postgres |
| DATABASE_NAME | Database name | poll_voting_db |
| JWT_SECRET | Secret for signing tokens | change_in_production |
| JWT_EXPIRES_IN | Token expiration duration | 15m |
| JWT_REFRESH_SECRET | Secret for refresh token signing | optional |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiration duration | 7d |
| APP_PORT | Server port | 3000 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:4200 |
| ADMIN_EMAIL | Admin user email | superadmin@yourdomain.com |
| ADMIN_PASSWORD | Admin user password | SecureAdminPassword123! |
| ADMIN_NAME | Admin user display name | Super Administrator |
| ADMIN_STATE | Admin user state | New York |

##  Data Flow

1. User registers/logs in → JWT token issued
2. User includes token in requests → JWT guard validates
3. Admin creates poll → Stored in database
4. User votes → Vote recorded with user state
5. Results requested → Aggregated vote counts returned
6. Results filtered by state → State-specific counts returned

##  Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Submit pull request

##  Support

For issues or questions, open an issue on the repository.

---

**Built with NestJS & TypeORM** 
