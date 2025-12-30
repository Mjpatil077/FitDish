# FitDish

**Cook Smart. Eat Fit. Learn from Real Chefs.**

FitDish is a fitness-focused culinary learning platform that connects users with verified chefs for healthy, authentic cooking through free content and paid live sessions.

## 🎨 Design Philosophy

- **Minimalist & Clean**: Apple-level cleanliness with calm wellness aesthetic
- **Premium Feel**: No clutter, no noisy colors, no "cheap recipe app" vibes
- **Trustworthy**: Verified chefs, authentic recipes, health-focused content

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install root dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

4. **Set up environment variables:**

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitdish
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. **Start the development servers:**

From the root directory:
```bash
npm run dev
```

Or start separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📁 Project Structure

```
FitDish/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/
└── README.md
```

## 🎯 Features

### For Users
- Browse free healthy recipes
- Explore verified chefs
- Book live cooking sessions (1-on-1 or group)
- Save favorite recipes
- Track bookings
- Set diet preferences and fitness goals

### For Chefs
- Create and manage cooking sessions
- Set pricing and availability
- Track earnings and bookings
- Manage profile and specialties
- Get reviews and ratings

## 🎨 Design System

### Colors
- **Primary**: Olive Green (#556855)
- **Secondary**: Warm Beige (#b8a88a)
- **Accent**: Muted Orange (#f97316)

### Typography
- **Headings**: Poppins / Inter
- **Body**: Inter

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user/chef
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/saved-recipes` - Get saved recipes

### Chefs
- `GET /api/chefs` - Get all chefs
- `GET /api/chefs/:id` - Get chef profile
- `PUT /api/chefs/profile` - Update chef profile

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Create session (chef only)
- `PUT /api/sessions/:id` - Update session (chef only)
- `DELETE /api/sessions/:id` - Delete session (chef only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Recipes
- `GET /api/recipes` - Get all free recipes
- `GET /api/recipes/:id` - Get recipe details
- `POST /api/recipes` - Create recipe (chef only)

## 🔐 Authentication

The app uses JWT-based authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📄 License

ISC

## 👥 Roles

1. **User**: Can browse recipes, book sessions, save recipes
2. **Chef**: Can create sessions, manage profile, view earnings

---

Built with ❤️ for health-conscious food lovers

