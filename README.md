# Creator Compass

A modern content management platform for creators to organize, track, and manage their content creation process across different platforms.

## Features

- 📝 Content Board with Kanban-style organization
- 👤 User Profile Management
- 📊 Analytics Dashboard
- 🎯 Content Planning and Tracking
- 🔄 Real-time Updates
- 🌙 Dark Mode Interface

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Integration**: OpenAI, Anthropic, Replicate
- **Audio Processing**: Deepgram

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- API keys for integrated services (OpenAI, Anthropic, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/creator-compass.git
   cd creator-compass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your environment variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   REPLICATE_API_KEY=your_replicate_key
   DEEPGRAM_API_KEY=your_deepgram_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Google sign-in
3. Create a Firestore database
4. Add the following composite index:
   - Collection: `contentIdeas`
   - Fields: 
     - `userId` (Ascending)
     - `createdAt` (Descending)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # React components
├── lib/
│   ├── firebase/      # Firebase configuration and utilities
│   ├── hooks/         # Custom React hooks
│   ├── contexts/      # React contexts
│   └── types/         # TypeScript type definitions
└── styles/            # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Firebase for the backend services