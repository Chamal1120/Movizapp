import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';
import MovieCard from './components/MovieCard';

function App() {
    const IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280';
    const API_URL = 'https://api.themoviedb.org/3';
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState({});
    const [searchKey, setSearchKey] = useState('');

    const fetchMovies = async (searchKey) => {
        const type = searchKey ? 'search' : 'discover';
        const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: process.env.REACT_APP_MOVIE_API_KEY,
                query: searchKey,
            },
        });

        setSelectedMovie(results[1]);
        setMovies(results);
    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: process.env.REACT_APP_MOVIE_API_KEY,
                append_to_response: 'videos,credits',
            },
        });

        return {
            ...data,
            videos: data.videos.results,
            cast: data.credits.cast,
        };
    };

    const selectMovie = async (movie) => {
        const data = await fetchMovie(movie.id);
        console.log('movie data', data);
        setSelectedMovie(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const renderMovies = () => (
        movies.map(movie => (
            <MovieCard
                key={movie.id}
                movie={movie}
                selectMovie={selectMovie}
            />
        ))
    );

    const searchMovies = (e) => {
        e.preventDefault();
        fetchMovies(searchKey);
    };

    const renderTrailer = () => {
        const trailer = selectedMovie.videos?.find(vid => vid.name === 'Official Trailer');

        if (trailer) {
            const opts = {
                height: '390',
                width: '640',
                playerVars: {
                    autoplay: 0,
                },
            };

            return <YouTube videoId={trailer.key} opts={opts} />;
        }

        return null;
    };

    const renderCast = () => (
        <div className="hero-cast">
            {selectedMovie.cast?.slice(0, 5).map((actor) => (
                <div className="hero-cast-member" key={actor.id}>
                    <img
                        className="hero-cast-member-image"
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                    />
                    <span className="hero-cast-member-name">{actor.name}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="App">
            <header className="header">
                <div className="header-content max-center">
                    <span>Moviz Gallery</span>
                    <form onSubmit={searchMovies}>
                        <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
                        <button type="submit">Search!</button>
                    </form>
                </div>
            </header>

            <div className="hero" style={{ backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')` }}>
                <div className="hero-content max-center">
                    {selectedMovie.videos ? renderTrailer() : null}
                    <button className="hero-button">Watch Now</button>
                    <h1 className="hero-title">{selectedMovie.title}</h1>
                    {selectedMovie.overview ? <p className="hero-overview">{selectedMovie.overview}</p> : null}
                    {renderCast()}
                </div>
            </div>

            <div className="container max-center">
                {renderMovies()}
            </div>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-text">
                        <i className="footer-icon fab fa-react"></i>
                        <span>Made with React.js</span>
                    </div>
                    <div className="footer-text">
                        <a href="mailto:chamal.randika.mcr@gmail.com">
                            <i className="footer-icon fas fa-envelope"></i>
                            <span>Mail Me on Gmail</span>
                        </a>
                    </div>
                    <div className="footer-text">
                        <a href="https://www.linkedin.com/in/chamal-randika/" target="_blank" rel="noopener noreferrer">
                            <i className="footer-icon fas fa-linkedin-in"></i>
                            <span>Follow me on LinkedIn</span>
                        </a>
                    </div>
                    <div className="footer-text">
                        <a href="https://github.com/Chamal1120" target="_blank" rel="noopener noreferrer">
                            <i className="footer-icon fab fa-github"></i>
                            <span>My GitHub Profile</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
