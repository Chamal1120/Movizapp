import React from 'react';

const MovieCard = ({movie, selectMovie}) => {
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w500/"
    return (
        <div className={"movie-card"}onClick={() => selectMovie(movie)}>
            {/* eslint-disable-next-line no-template-curly-in-string */}
            {movie.poster_path ? <img className={"movie-cover"} src={`${IMAGE_PATH}${movie.poster_path}`} alt=""/>
                :
            <div className={"movie-placeholder"}>No Image Found</div>
            }
            <h5 className={"movie-title"}>{movie.title}</h5>
        </div>
    );
};

export default MovieCard;
