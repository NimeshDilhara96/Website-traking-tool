# Website Analytics Tracker - Frontend

A React + Vite application for managing and tracking analytics across multiple websites.

## Features

- 📊 Dashboard to view all tracked websites
- ➕ Add new websites to track
- 📈 View detailed analytics for each website
- 🔍 Filter analytics by date range
- 📋 Copy tracking code snippets
- 🗑️ Delete websites

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Usage

### 1. Set up Database

First, run the SQL script from `backend/setup.sql` in your Supabase SQL Editor to create the necessary tables:
- `websites` - Stores website information
- `pageviews` - Stores page view data
- `events` - Stores custom event data

### 2. Start Backend Server

Make sure your backend server is running:
```bash
cd ../backend
npm run dev
```

### 3. Add a Website

1. Click the "Add Website" button
2. Enter the website name and domain
3. Click "Add Website"

### 4. Get Tracking Code

1. Click "View Analytics" on any website card
2. Copy the tracking code snippet
3. Add it to your website before the closing `</body>` tag

Example:
```html
<script>
  window.TRACKING_WEBSITE_ID = 'your-website-id';
</script>
<script src="http://localhost:3000/track.js"></script>
```

### 5. View Analytics

Once the tracking code is installed on your website:
- Page views will be automatically tracked
- View total page views, events, and unique sessions
- Filter data by date range
- See recent page views and events in detailed tables

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Components

- **WebsiteList** - Displays all tracked websites in a grid
- **AddWebsite** - Form to add new websites
- **Analytics** - Detailed analytics view for a selected website

## API Integration

The frontend communicates with the backend API:

- `GET /api/websites` - Fetch all websites
- `POST /api/websites` - Create new website
- `DELETE /api/websites/:id` - Delete website
- `GET /api/analytics/:website_id` - Fetch analytics data

## Technologies

- React 18
- Vite 6
- Axios for API calls
- CSS3 for styling
