# Antigravity Movies

A responsive React + Vite movie discovery app that lets users explore popular and trending films, search titles, and view streaming provider details.

## 🚀 Features

- Browse popular movies from TMDB
- View today’s trending films
- Search movies by title
- Click a movie card to open details and watch provider links
- Smooth responsive UI with modal details and rated cards
- Lazy-loading images for performance

## 🧩 Tech Stack

- React 19
- Vite
- Lucide React icons
- Plain CSS styling
- The Movie Database (TMDB) API

## 📁 Project Structure

- `src/App.jsx` — main UI and app state
- `src/api.js` — TMDB API access for popular, trending, search, and provider data
- `src/index.css` — responsive styles, cards, modal, and animations
- `src/main.jsx` — React app bootstrap
- `index.html` — Vite app shell

## 💻 Installation

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## 🔧 Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## ⚠️ TMDB API Key

This project currently includes a TMDB API key directly in `src/api.js`. For a production-ready setup, move the key to an environment variable or backend service.

Example:

1. Add a `.env` file at the project root:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

2. Update `src/api.js` to use `import.meta.env.VITE_TMDB_API_KEY`.

## ✅ Notes

- Empty search results show a friendly message.
- Movie cards display title, release year, and rating.
- The detail modal shows overview, release date, popularity, and provider availability.

## 📌 Next Improvements

- Add favorites/bookmarks
- Support multiple regions for providers
- Add pagination for large result sets
- Improve error handling and loading states

## 📄 License

MIT
