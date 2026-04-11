# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- `react` & `react-dom` - React framework
- `react-router-dom` - Routing
- `axios` - HTTP client

### Step 2: Configure Environment
Create a `.env` file in the root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Ensure Backend is Running
Make sure your Node.js backend is running on port 5000:
```bash
# In your backend directory
npm start
```

### Step 4: Start React App
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Test the Application

### 1. Register a New User
1. Go to `http://localhost:3000/register`
2. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. You'll be auto-logged in and redirected to `/games`

### 2. View Games (Public)
- Games page is accessible without login
- Browse available games
- See prices, platforms, genres, and stock

### 3. Login
1. If logged out, go to `/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Login"

### 4. View Your Orders
1. Login as a user
2. Navigate to "My Orders" in navbar
3. See your order history (empty initially)

### 5. Test Admin Features
To test admin features, you need to:
1. Manually set a user's role to "Admin" in MongoDB:
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "Admin" } }
)
```

2. Login with admin credentials
3. Navigate to "Admin Dashboard"
4. Try:
   - Adding a new game
   - Editing existing games
   - Deleting games
   - Viewing all orders
   - Updating order statuses

## 🎯 Common Tasks

### Task 1: Add a Game (Admin)
1. Login as admin
2. Go to Admin Dashboard → Games Management
3. Click "+ Add New Game"
4. Fill in the form:
   - Title: The Last of Us
   - Price: 59.99
   - Platform: PS5
   - Genre: Action
   - Stock: 50
   - Image URL: (any image URL)
5. Click "Add Game"

### Task 2: Place an Order (User)
Currently, order placement is available through the API but not yet in the UI (shopping cart feature). You can test it via API:

```javascript
// Using the orderService
import { orderService } from './api';

await orderService.placeOrder({
  items: [
    { game: "GAME_ID_HERE", quantity: 2 }
  ],
  totalAmount: 119.98
});
```

### Task 3: Update Order Status (Admin)
1. Login as admin
2. Go to Admin Dashboard → Orders Management
3. Find an order
4. Change status dropdown
5. Status automatically updates

## 🔍 Directory Structure Overview

```
frontend/
├── public/
├── src/
│   ├── api/                    # All API services
│   │   ├── apiClient.js        # Axios setup
│   │   ├── authService.js      # Auth APIs
│   │   ├── gameService.js      # Game APIs
│   │   ├── orderService.js     # Order APIs
│   │   └── index.js            # Exports
│   │
│   ├── components/             # React components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── GameList.jsx
│   │   ├── MyOrders.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Navbar.jsx
│   │   ├── Unauthorized.jsx
│   │   └── *.css              # Component styles
│   │
│   └── App.js                  # Main app with routes
│
├── .env                        # Environment variables
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Problem: "Network Error" when calling API
**Solution:**
1. Check backend is running: `http://localhost:5000`
2. Verify CORS is enabled in backend
3. Check `.env` file has correct API_URL

### Problem: "Not authorized, no token"
**Solution:**
1. Make sure you're logged in
2. Check localStorage has token: Open DevTools → Application → Local Storage
3. If missing, login again

### Problem: Can't access Admin Dashboard
**Solution:**
1. Verify user role is "Admin" in database
2. Logout and login again
3. Check network tab for 403 errors

### Problem: Components not rendering
**Solution:**
1. Check console for errors
2. Verify all imports are correct
3. Make sure React Router is set up correctly

### Problem: Styles not loading
**Solution:**
1. Check CSS files are in same directory as components
2. Verify imports: `import './ComponentName.css'`
3. Clear browser cache

## 💡 Tips

1. **Use React DevTools** - Install React Developer Tools extension for Chrome/Firefox
2. **Check Network Tab** - Monitor API calls in browser DevTools → Network
3. **localStorage Inspector** - View stored tokens in Application → Local Storage
4. **Console Logs** - Components log errors to console for debugging

## 🎨 Customization

### Change API URL
Edit `.env`:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Change Color Scheme
Edit CSS files and update color variables:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
```

### Add New Features
1. Create new component in `src/components/`
2. Create corresponding CSS file
3. Add API service method if needed
4. Add route in `App.js`
5. Update Navbar if needed

## 📚 Next Steps

1. **Add Shopping Cart**
   - Create Cart component
   - Add cart state management
   - Implement add to cart functionality
   - Create checkout flow

2. **Improve UI/UX**
   - Add toast notifications
   - Implement loading states
   - Add animations
   - Enhance error handling

3. **Add More Features**
   - Search functionality
   - Game filters
   - User profile page
   - Order tracking

4. **Testing**
   - Write unit tests
   - Add integration tests
   - E2E testing with Cypress

## 🆘 Getting Help

If you encounter issues:
1. Check the console for errors
2. Review the API_REFERENCE.md for endpoint details
3. Verify backend is running and accessible
4. Check localStorage for auth data
5. Test API endpoints directly with Postman/cURL

## ✅ Checklist

Before deploying:
- [ ] All dependencies installed
- [ ] .env file configured
- [ ] Backend is running
- [ ] Can register/login users
- [ ] Games display correctly
- [ ] Protected routes work
- [ ] Admin features functional
- [ ] Error handling works
- [ ] Responsive on mobile

Happy Coding! 🚀
