# VidTubeC - Video Platform Backend API

A robust backend API for a YouTube-like video platform built with Node.js, Express.js, and MongoDB. This application provides comprehensive video management, user authentication, and social features like tweets, playlists, subscriptions, and comments.

## 🚀 Features

### Core Features
- **User Management**: Registration, login, profile management with avatar and cover image support
- **Video Management**: Upload, view, update, delete videos with thumbnail support
- **Authentication**: JWT-based authentication with refresh tokens
- **File Upload**: Cloudinary integration for video and image storage
- **Social Features**: 
  - Tweet system for user posts
  - Video likes and comments
  - User subscriptions
  - Playlists creation and management
  - Watch history tracking

### Technical Features
- **RESTful API**: Clean API endpoints following REST principles
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcrypt password hashing, JWT tokens, CORS protection
- **File Handling**: Multer middleware for file uploads
- **Pagination**: MongoDB aggregation pipeline with pagination
- **Error Handling**: Centralized error handling with custom API responses

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv
- **Development**: Nodemon for hot reloading

## 📁 Project Structure

```
vidTubeC/
├── srcC/
│   ├── app.js                 # Express app configuration
│   ├── index.js              # Server entry point
│   ├── constants.js          # Application constants
│   ├── controller/           # Route controllers
│   │   ├── healthcheck.controllers.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── db/                   # Database configuration
│   │   └── index.js
│   ├── middlewares/          # Custom middlewares
│   │   ├── auth.middleware.js
│   │   └── multer.middlewares.js
│   ├── models/               # Mongoose models
│   │   ├── comment.models.js
│   │   ├── likes.models.js
│   │   ├── playlists.models.js
│   │   ├── subscription.models.js
│   │   ├── tweets.models.js
│   │   ├── user.models.js
│   │   └── video.models.js
│   ├── routes/               # API routes
│   │   ├── healthcheck.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   └── utils/                # Utility functions
│       ├── apiError.js
│       ├── apiResponse.js
│       ├── asynchandler.js
│       └── cloudinary.js
├── public/                   # Static files
└── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for file storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vidTubeC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/vidtube
   CORS_ORIGIN=*
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the application**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
- `GET /healthcheck` - Check server status

### User Routes
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/logout` - User logout (authenticated)
- `POST /users/refresh-token` - Refresh access token
- `GET /users/current-user` - Get current user details (authenticated)
- `PATCH /users/update-account` - Update account details (authenticated)
- `PATCH /users/avatar` - Update user avatar (authenticated)
- `PATCH /users/cover-image` - Update cover image (authenticated)
- `PATCH /users/change-password` - Change password (authenticated)

### Video Routes
- `GET /videos` - Get all videos (with optional authentication)
- `GET /videos/:videoId` - Get video by ID (with optional authentication)
- `POST /videos` - Upload new video (authenticated)
- `GET /videos/user/:userId` - Get user's videos (authenticated)
- `PATCH /videos/:videoId` - Update video details (authenticated)
- `DELETE /videos/:videoId` - Delete video (authenticated)
- `PATCH /videos/toggle/publish/:videoId` - Toggle video publish status (authenticated)

## 🗃️ Database Models

### User Model
- Username, email, full name
- Avatar and cover image URLs
- Password (hashed)
- Watch history
- JWT refresh tokens

### Video Model
- Video file URL and thumbnail
- Title, description, duration
- Views count and publish status
- Owner reference

### Additional Models
- **Comments**: User comments on videos
- **Likes**: User likes on videos
- **Tweets**: User posts/tweets
- **Playlists**: User-created video playlists
- **Subscriptions**: User subscription relationships

## 🔒 Authentication

The API uses JWT-based authentication with two types of tokens:
- **Access Token**: Short-lived token for API access (1 day)
- **Refresh Token**: Long-lived token for generating new access tokens (10 days)

Protected routes require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## 📄 API Response Format

### Success Response
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

### Error Response
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

## 🔧 Development

### Code Formatting
The project uses Prettier for code formatting:
```bash
npx prettier --write .
```

### Environment Variables
All sensitive configuration should be stored in environment variables. Never commit the `.env` file to version control.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Check the GitHub issues page for current known issues
- Please report any bugs you encounter

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a backend API only. You'll need to build a frontend application to interact with these endpoints.
