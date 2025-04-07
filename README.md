# Quisly - Quiz Platform

Quisly is a modern, interactive Quisly built with Next.js, MongoDB, and Clerk authentication. It provides a seamless experience for creating, managing, and taking quizzes.

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Quiz Management**: Create, edit, and delete quizzes
- **Real-time Quiz Taking**: Interactive quiz-taking experience
- **Responsive Design**: Works seamlessly across all devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Secure API**: Protected endpoints with JWT authentication
- **MongoDB Integration**: Efficient data storage and retrieval

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (running locally)
- npm or yarn package manager

## Installation

1. Clone the repository: https://github.com/PjVineeth/Quisly-Quiz-Platform.git
```bash
git clone [your-repository-url]
cd Quisly-Quiz-Platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/quisly
JWT_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

## Setting up MongoDB

1. Install MongoDB locally if you haven't already
2. Start MongoDB service:
```bash
# On macOS
brew services start mongodb-community
# On Windows
net start MongoDB
# On Linux
sudo service mongod start
```

3. Verify MongoDB is running:
```bash
mongosh
```

## Running the Application

1. Start the development server:
```bash
npm run dev:all
# or
yarn dev:all
```

This will start both the Next.js frontend and the Express backend server.

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

- `npm run dev`: Start Next.js development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run server`: Start the Express backend server
- `npm run dev:all`: Start both frontend and backend servers
- `npm run lint`: Run ESLint

## Project Structure

```
Quisly-Quiz-Platform/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
├── models/          # MongoDB models
├── public/          # Static assets
├── server/          # Express backend server
├── styles/          # Global styles
└── hooks/           # Custom React hooks
```

## Authentication

The application uses Clerk for authentication. You'll need to:
1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Get your API keys and add them to the `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
