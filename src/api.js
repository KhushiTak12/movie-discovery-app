const API_KEY = '1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopular = async () => {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
};

export const fetchTrending = async () => {
    try {
        const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};

export const searchMovies = async (query) => {
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

export const fetchProviders = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
        const data = await res.json();
        return data.results?.US || data.results?.IN || Object.values(data.results)[0] || null;
    } catch (error) {
        console.error("Error fetching providers:", error);
        return null;
    }
};

export const getImageUrl = (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
};
