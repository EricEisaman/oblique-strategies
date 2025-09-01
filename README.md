# Oblique Strategies

A modern web application for Brian Eno's Oblique Strategies, built with Vue 3, TypeScript, Vite, and Express.js.

## Features

- **Modern Tech Stack**: Vue 3 + TypeScript + Vite + Express.js
- **Beautiful UI**: Material Design with Vuetify 3
- **PWA Support**: Progressive Web App with offline capabilities
- **Favorites System**: Save and manage your favorite strategies
- **Responsive Design**: Works perfectly on desktop and mobile
- **Type Safety**: Full TypeScript support with strict configuration
- **Code Quality**: ESLint with strict rules for maintainable code

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vuetify 3** - Material Design component framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression
- **Morgan** - HTTP request logger

### Development Tools
- **ESLint** - Code linting with strict TypeScript rules
- **Concurrently** - Run multiple commands simultaneously
- **TSX** - TypeScript execution for development

### Deployment
- **Docker** - Containerization
- **Render.com** - Cloud hosting platform
- **PWA** - Progressive Web App capabilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com-ericeisaman:EricEisaman/oblique-strategies.git
cd oblique-strategies
```

2. Install dependencies:
```bash
npm run install-all
```

3. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend dev server on http://localhost:3000
- Backend API server on http://localhost:5000

### Development Commands

```bash
# Start development servers
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Lint checking (no auto-fix)
npm run lint:check

# Start production server
npm start
```

## Project Structure

```
oblique-strategies/
├── client/                 # Vue 3 frontend
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── views/         # Page components
│   │   ├── stores/        # Pinia stores
│   │   ├── plugins/       # Vue plugins
│   │   ├── router/        # Vue Router
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Express.js backend
│   ├── index.ts          # Server entry point
│   └── tsconfig.json     # Server TypeScript config
├── dist/                  # Build output
├── package.json          # Root dependencies
├── .eslintrc.js          # ESLint configuration
├── render.yaml           # Render.com deployment
├── Dockerfile            # Docker configuration
└── README.md             # This file
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/strategies` - Get all oblique strategies
- `GET /api/strategies/random` - Get a random strategy

## Deployment

### Render.com

The project is configured for automatic deployment on Render.com:

1. Connect your GitHub repository to Render
2. Use the `render.yaml` configuration
3. Deploy as a Docker service

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t oblique-strategies .

# Run the container
docker run -p 10000:10000 oblique-strategies
```

## What are Oblique Strategies?

Oblique Strategies is a set of published cards created by Brian Eno and Peter Schmidt first published in 1975. Each card contains a phrase or cryptic remark which can be used to break a deadlock or dilemma situation.

The strategies are designed to help artists, musicians, and creative professionals overcome creative blocks and find new perspectives on their work.

## Credits

- **Oblique Strategies** © 1975, 1978, and 1979 Brian Eno/Peter Schmidt
- **Original App**: Matt Ruten (matt@ruten.ca)
- **Modern Implementation**: Eric Eisaman

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## Development Notes

- Uses strict TypeScript configuration for maximum type safety
- ESLint rules enforce code quality and consistency
- PWA configuration enables offline functionality
- Responsive design works on all device sizes
- Local storage for favorites persistence
# Mon Sep  1 13:52:22 EDT 2025
