import React, { useState, useEffect } from 'react';
import { Search, Star, Play, X, Calendar, Flame } from 'lucide-react';
import { fetchPopular, fetchTrending, searchMovies, fetchProviders, getImageUrl } from './api';

function App() {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('popular'); // 'popular' | 'trending' | 'search'
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [providers, setProviders] = useState(null);
    const [providersLoading, setProvidersLoading] = useState(false);

    useEffect(() => {
        loadMovies(activeTab);
    }, [activeTab]);

    const loadMovies = async (tab) => {
        setLoading(true);
        let data = [];
        if (tab === 'popular') {
            data = await fetchPopular();
        } else if (tab === 'trending') {
            data = await fetchTrending();
        }
        setMovies(data);
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setActiveTab('search');
        const data = await searchMovies(query);
        if (data.length === 0) {
            alert("Movie not found! Please try another name.");
            setMovies([]);
        } else {
            setMovies(data);
        }
        setLoading(false);
    };

    const openMovieDetails = async (movie) => {
        setSelectedMovie(movie);
        setProvidersLoading(true);
        const provs = await fetchProviders(movie.id);
        setProviders(provs);
        setProvidersLoading(false);
    };

    const closeMovieDetails = () => {
        setSelectedMovie(null);
        setProviders(null);
    };

    return (
        <div className="app-container">
            <header>
                <h1>Antigravity Movies</h1>
                <p className="subtitle">Discover, Search, and Find Where to Watch.</p>

                <form className="search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for a movie..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <Search size={20} />
                    </button>
                </form>
            </header>

            <main>
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
                        onClick={() => setActiveTab('popular')}
                    >
                        Popular
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trending')}
                    >
                        Trending Today
                    </button>
                    {activeTab === 'search' && (
                        <button className="tab-btn active">
                            Search Results
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loader"></div>
                ) : (
                    <>
                        {movies.length === 0 ? (
                            <div className="empty-state">
                                <h2>No movies found</h2>
                                <p>Try exploring the popular or trending tabs!</p>
                            </div>
                        ) : (
                            <div className="movies-grid">
                                {movies.map(movie => (
                                    <div key={movie.id} className="movie-card" onClick={() => openMovieDetails(movie)}>
                                        <div className="poster-container">
                                            <img
                                                src={getImageUrl(movie.poster_path)}
                                                alt={movie.title}
                                                className="movie-poster"
                                                loading="lazy"
                                            />
                                            <div className="overlay">
                                                <div className="view-details-btn">View Details</div>
                                            </div>
                                        </div>
                                        <div className="movie-info">
                                            <h3 className="movie-title">{movie.title || movie.name}</h3>
                                            <div className="movie-meta">
                                                <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                                                <span className="rating">
                                                    <Star size={14} fill="currentColor" />
                                                    {movie.vote_average?.toFixed(1) || 'NR'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Movie Details Modal */}
            {selectedMovie && (
                <div className="modal-backdrop" onClick={closeMovieDetails}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeMovieDetails}>
                            <X size={24} />
                        </button>
                        <div className="modal-body">
                            <div className="modal-poster-container">
                                <img
                                    src={getImageUrl(selectedMovie.poster_path)}
                                    alt={selectedMovie.title}
                                    className="modal-poster"
                                />
                            </div>
                            <div className="modal-info">
                                <h2 className="modal-title">{selectedMovie.title || selectedMovie.name}</h2>
                                {selectedMovie.original_title !== selectedMovie.title && (
                                    <p className="modal-tagline">{selectedMovie.original_title}</p>
                                )}

                                <div className="modal-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Release Date</span>
                                        <span className="stat-value">
                                            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            {selectedMovie.release_date || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Rating</span>
                                        <span className="stat-value rating-value">
                                            <Star size={16} fill="currentColor" />
                                            {selectedMovie.vote_average?.toFixed(1)} / 10
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Popularity</span>
                                        <span className="stat-value">
                                            <Flame size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--accent-color)' }} />
                                            {selectedMovie.popularity}
                                        </span>
                                    </div>
                                </div>

                                <div className="modal-overview">
                                    <h3>Overview</h3>
                                    <p>{selectedMovie.overview || "No overview available."}</p>
                                </div>

                                <div className="providers-section">
                                    <h3>Where to Watch</h3>
                                    {providersLoading ? (
                                        <p>Finding platforms...</p>
                                    ) : providers ? (
                                        <div>
                                            {providers.flatrate || providers.rent || providers.buy ? (
                                                <div className="providers-list">
                                                    {(() => {
                                                        // Merge and deduplicate providers
                                                        const allProvs = [
                                                            ...(providers.flatrate || []),
                                                            ...(providers.rent || []),
                                                            ...(providers.buy || [])
                                                        ];
                                                        const uniqueProvs = Array.from(new Map(allProvs.map(p => [p.provider_id, p])).values());

                                                        return uniqueProvs.map(p => (
                                                            <a
                                                                key={p.provider_id}
                                                                href={providers.link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="provider-item"
                                                            >
                                                                <img
                                                                    src={getImageUrl(p.logo_path, 'w92')}
                                                                    alt={p.provider_name}
                                                                    className="provider-logo"
                                                                />
                                                                <span className="provider-name">{p.provider_name}</span>
                                                            </a>
                                                        ));
                                                    })()}
                                                </div>
                                            ) : (
                                                <p>Not available on common streaming platforms in your region.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p>Information not available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;   