# Website Tracking Tool - Frontend

A React-based dashboard for monitoring website analytics and managing tracking codes.

## Features

- 📊 **Website Management**: Add, view, and delete websites
- 📈 **Real-time Analytics**: Monitor page views, events, and user sessions
- 🔒 **Secure Tracking**: Generate unique tracking codes for each website
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎯 **Date Filtering**: Filter analytics by date range

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   
   Create a `.env` file in the frontend directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```
   
   **Important**: Do NOT use `localhost` URLs if you want to access the app from different devices or deploy it.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```
   
   The built files will be in the `dist/` directory.

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Usage

### Adding a Website

1. Click the "Add Website" button
2. Enter the website name (e.g., "My Blog")
3. Enter the domain (e.g., "myblog.com")
4. Click "Add Website"

### Viewing Analytics

1. Click "View Analytics" on any website card
2. See real-time statistics:
   - Total page views
   - Total events
   - Unique sessions
   - Top pages and referrers
3. Use date filters to narrow down the data

### Installing Tracking Code

1. Click "View Analytics" on a website
2. Click "Show Tracking Code"
3. Copy the code snippet
4. Paste it in the `<head>` section of your website
5. Deploy your website and start seeing analytics!

## Environment Variables

- `VITE_API_URL`: Your backend API URL (required)

## Tech Stack

- **React 19**: UI library
- **Vite**: Build tool and dev server
- **CSS3**: Styling

## API Endpoints Used

- `GET /api/websites` - List all websites
- `POST /api/websites` - Create a new website
- `DELETE /api/websites/:id` - Delete a website
- `GET /api/analytics/:website_id` - Get analytics data

## Development

The frontend uses environment variables prefixed with `VITE_` to be accessible in the browser. Make sure to:

1. Always restart the dev server after changing `.env`
2. Never commit `.env` to version control (it's in `.gitignore`)
3. Update `.env.example` when adding new environment variables

## Deployment

When deploying to services like Vercel, Netlify, or similar:

1. Set the `VITE_API_URL` environment variable in your deployment platform
2. Make sure your backend allows CORS from your frontend domain
3. Build with `npm run build`
4. Deploy the `dist/` directory

## License

See the LICENSE file in the root directory.
