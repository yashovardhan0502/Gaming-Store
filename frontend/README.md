# React Frontend for Gaming Store Backend

Complete React frontend integration for your Node.js/Express gaming store backend with authentication, protected routes, and admin functionality.

## 📋 Backend Analysis Summary

### API Endpoints Discovered

#### Authentication Routes (`/api/auth`)
- `POST /api/auth/login` - User login (Public)
- `POST /api/auth/register` - User registration (Public)

#### Game Routes (`/api/games`)
- `GET /api/games` - Get all games (Public)
- `GET /api/games/:id` - Get game by ID (Public)
- `POST /api/games` - Add new game (Protected - Admin Only)
- `PUT /api/games/:id` - Update game (Protected - Admin Only)
- `DELETE /api/games/:id` - Delete game (Protected - Admin Only)

#### Order Routes (`/api/orders`)
- `POST /api/orders` - Place order (Protected - User)
- `GET /api/orders/my` - Get user's orders (Protected - User)
- `GET /api/orders` - Get all orders (Protected - Admin Only)
- `PUT /api/orders/:id` - Update order status (Protected - Admin Only)

### Authentication Flow
1. **JWT Token-based authentication** using Bearer tokens
2. Token sent in `Authorization: Bearer <token>` header
3. Middleware: `protect` (authentication), `adminOnly` (admin verification)
4. User roles: `User` (default) and `Admin`

### Data Models

#### User Model
```javascript
{
  _id: string,
  name: string,
  email: string,
  password: string (hashed),
  role: "User" | "Admin",
  createdAt: Date,
  updatedAt: Date
}
```

#### Game Model
```javascript
{
  _id: string,
  title: string,
  price: number,
  platform: string,
  genre: string,
  stock: number,
  image: string
}
```

#### Order Model
```javascript
{
  _id: string,
  user: ObjectId (User reference),
  items: [
    {
      game: ObjectId (Game reference),
      quantity: number
    }
  ],
  totalAmount: number,
  status: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Install Dependencies

```bash
npm install axios react-router-dom
```

### Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── apiClient.js          # Axios configuration & interceptors
│   │   ├── authService.js        # Authentication API calls
│   │   ├── gameService.js        # Game-related API calls
│   │   ├── orderService.js       # Order-related API calls
│   │   └── index.js              # API services export
│   ├── components/
│   │   ├── Login.jsx             # Login component
│   │   ├── Register.jsx          # Registration component
│   │   ├── GameList.jsx          # Public game listing
│   │   ├── MyOrders.jsx          # User's orders (Protected)
│   │   ├── AdminDashboard.jsx    # Admin dashboard (Admin Only)
│   │   ├── ProtectedRoute.jsx    # Route protection HOC
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── Unauthorized.jsx      # 403 error page
│   │   ├── Auth.css              # Auth components styles
│   │   ├── GameList.css          # Game list styles
│   │   ├── MyOrders.css          # Orders styles
│   │   ├── AdminDashboard.css    # Admin styles
│   │   ├── Navbar.css            # Navbar styles
│   │   └── Unauthorized.css      # Error page styles
│   └── App.js                    # Main app with routing
```

## 🔧 API Service Files

### 1. apiClient.js
- Axios instance with base URL configuration
- Request interceptor: Automatically adds JWT token to headers
- Response interceptor: Handles 401 errors and token expiration

### 2. authService.js
Methods:
- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Clear auth data
- `getCurrentUser()` - Get current user from localStorage
- `getToken()` - Get current token
- `isAuthenticated()` - Check if user is logged in
- `isAdmin()` - Check if user is admin

### 3. gameService.js
Methods:
- `getAllGames()` - Fetch all games (Public)
- `getGameById(id)` - Fetch game by ID (Public)
- `addGame(gameData)` - Add new game (Admin Only)
- `updateGame(id, gameData)` - Update game (Admin Only)
- `deleteGame(id)` - Delete game (Admin Only)

### 4. orderService.js
Methods:
- `placeOrder(orderData)` - Place new order (Protected)
- `getMyOrders()` - Get user's orders (Protected)
- `getAllOrders()` - Get all orders (Admin Only)
- `updateOrderStatus(id, statusData)` - Update order status (Admin Only)

## 🎨 Components

### Public Components

#### Login.jsx
- User login form
- Email/password validation
- Auto-redirect based on user role
- Error handling

#### Register.jsx
- User registration form
- Password confirmation
- Email validation
- Auto-login after registration

#### GameList.jsx
- Display all available games
- Public access (no login required)
- Game cards with image, price, stock info
- Add to cart functionality (coming soon)

#### Navbar.jsx
- Responsive navigation
- Conditional rendering based on auth state
- User info display
- Logout functionality

### Protected Components

#### MyOrders.jsx (User Only)
- Display user's order history
- Order details with items
- Order status tracking
- Responsive order cards

#### AdminDashboard.jsx (Admin Only)
- **Games Management Tab:**
  - View all games in table format
  - Add new games with form
  - Edit existing games
  - Delete games
  
- **Orders Management Tab:**
  - View all orders from all users
  - Update order status
  - View customer details

### Utility Components

#### ProtectedRoute.jsx
- HOC for route protection
- Redirects to login if not authenticated
- Supports admin-only routes
- Props: `children`, `adminOnly`

#### Unauthorized.jsx
- 403 error page
- Shown when non-admin tries to access admin routes

## 🛣️ Routing Setup

```javascript
// Public Routes
/                      → Redirect to /games
/login                 → Login page
/register              → Registration page
/games                 → Game listing (public)
/unauthorized          → 403 error page

// Protected Routes (Authenticated Users)
/my-orders             → User's orders

// Admin Only Routes
/admin/dashboard       → Admin dashboard
```

## 🔐 Authentication Flow

1. **User registers/logs in**
   - Backend returns user data + JWT token
   - Token saved to `localStorage`
   - User data saved to `localStorage`

2. **Making authenticated requests**
   - apiClient automatically adds token to headers
   - Format: `Authorization: Bearer <token>`

3. **Token expiration**
   - 401 response triggers auto-logout
   - User redirected to login page
   - localStorage cleared

4. **Role-based access**
   - ProtectedRoute checks authentication
   - Admin routes check user role
   - Non-admin users redirected to /unauthorized

## 💾 Local Storage Management

### Stored Data
```javascript
localStorage.token     // JWT token string
localStorage.user      // JSON string of user object
```

### User Object Structure
```javascript
{
  _id: "user_id",
  name: "User Name",
  email: "user@email.com",
  role: "User" | "Admin"
}
```

## 🎯 Usage Examples

### 1. Login Flow
```javascript
import { authService } from '../api';

const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    // Token automatically stored
    // Redirect based on role
    if (response.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/games');
    }
  } catch (error) {
    console.error(error.message);
  }
};
```

### 2. Fetching Games
```javascript
import { gameService } from '../api';

const fetchGames = async () => {
  try {
    const games = await gameService.getAllGames();
    setGames(games);
  } catch (error) {
    console.error(error.message);
  }
};
```

### 3. Admin Adding Game
```javascript
import { gameService } from '../api';

const addGame = async (gameData) => {
  try {
    const newGame = await gameService.addGame({
      title: "Game Title",
      price: 59.99,
      platform: "PC",
      genre: "Action",
      stock: 100,
      image: "https://example.com/image.jpg"
    });
    console.log('Game added:', newGame);
  } catch (error) {
    console.error(error.message);
  }
};
```

### 4. Placing Order
```javascript
import { orderService } from '../api';

const placeOrder = async (orderData) => {
  try {
    const order = await orderService.placeOrder({
      items: [
        { game: "game_id_1", quantity: 2 },
        { game: "game_id_2", quantity: 1 }
      ],
      totalAmount: 119.98
    });
    console.log('Order placed:', order);
  } catch (error) {
    console.error(error.message);
  }
};
```

## 🎨 Styling

All components include responsive CSS with:
- Modern gradient backgrounds
- Card-based layouts
- Smooth transitions and hover effects
- Mobile-responsive design
- Consistent color scheme (Purple gradient theme)

### Color Palette
- Primary: `#667eea` (Blue-Purple)
- Secondary: `#764ba2` (Purple)
- Success: `#22c55e` (Green)
- Error: `#ef4444` (Red)
- Warning: `#fbbf24` (Yellow)

## 🔄 Error Handling

### API Errors
- All service methods include try-catch blocks
- Error messages extracted from response
- Fallback error messages provided
- Errors logged to console

### HTTP Status Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (admin access required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### User Feedback
- Error banners in forms
- Loading states during API calls
- Success notifications (can be added)
- Retry buttons on failures

## 🚀 Next Steps / Enhancements

1. **Shopping Cart Functionality**
   - Add to cart feature
   - Cart management
   - Checkout process

2. **Advanced Features**
   - Search and filter games
   - Pagination for large datasets
   - Image upload for games
   - User profile management

3. **UI Improvements**
   - Toast notifications
   - Loading skeletons
   - Animations
   - Dark mode

4. **Security Enhancements**
   - Token refresh mechanism
   - Password strength meter
   - Email verification
   - Forgot password flow

5. **Testing**
   - Unit tests for services
   - Component tests
   - Integration tests
   - E2E tests

## 📝 Backend Requirements

Ensure your backend:
1. Has CORS enabled for frontend origin
2. Returns proper error messages
3. Uses JWT for authentication
4. Implements protect and adminOnly middleware correctly
5. Runs on `http://localhost:5000` (or update REACT_APP_API_URL)

## 🐛 Troubleshooting

### CORS Errors
```javascript
// Backend server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Token Not Being Sent
- Check if token exists in localStorage
- Verify Authorization header format
- Check apiClient interceptor

### Routes Not Working
- Ensure React Router is installed
- Check route paths match exactly
- Verify ProtectedRoute is wrapping protected components

### Admin Routes Not Accessible
- Verify user role is "Admin" (case-sensitive)
- Check adminOnly middleware in backend
- Confirm token is valid

## 📄 License

This code is provided as-is for integration with your gaming store backend.

## 🤝 Support

For issues or questions:
1. Check console for error messages
2. Verify backend is running and accessible
3. Check network tab in browser DevTools
4. Review localStorage for token and user data

---

Built with ❤️ for seamless backend-frontend integration
