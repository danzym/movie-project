'use strict';
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.container');

const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    'NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI='
  )}`;
};

const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

const fetchMovies = async () => {
  const url = constructUrl('movie/now_playing');
  const response = await fetch(url);
  const data = await response.json();
   console.log(data)
  return data;
};

const fetchMovie = async (movieId) => {
	const url = constructUrl(`movie/${movieId}`);
	const res = await fetch(url);
  
	return res.json();
};
const renderMovies = (movies) => {
  const sliderContainer = document.querySelector('.slider-container');
  const slider = document.createElement('div');
  slider.className = 'slider';

  movies.forEach((movie) => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    const img = document.createElement('img');
    img.src = BACKDROP_BASE_URL + movie.backdrop_path;
    img.alt = movie.title;

    slide.appendChild(img);
    slider.appendChild(slide);

    img.addEventListener('click', () => {
      movieDetails(movie)
    })
  });

  sliderContainer.appendChild(slider);
};


const renderMovie = async (movie) => {

  const movieCrew = await fetch(
   ` https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${atob(
        'NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI='
    )}`
);
const crew = await movieCrew.json();
console.log(crew)
const directorName = crew.crew[0].name;
const actorsName = crew.cast.map((actor) => actor.name);
const actorsImage = crew.cast.map((actImage) => actImage?.profile_path)
console.log(actorsImage)

const fetchMovie = await fetch(
  `https://api.themoviedb.org/3/movie/${movie?.id}/videos?api_key=${atob(
      'NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI='
  )}`
);
const movieTrailer = await fetchMovie.json();
const trailer = movieTrailer.results[0].key;


  
const renderDetails = document.getElementById('details');
renderDetails.innerHTML = `
    <div class="row">
        <div class="col-md-4">
            <img id="movie-backdrop" src="${BACKDROP_BASE_URL + movie.backdrop_path}">
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <h2>Vote average: </h2>
            <p>${movie.vote_average} </p>
            <h2>Language: </h2>
            <p> ${movie.original_language} </p>
            <h2> Director: </h2>
            <p>${directorName}</p>
            <h3>Trailer:</h3>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div>
    <h3>Actors:</h3>
    <ul id="actors" class="list-unstyled"></ul>
`;

const actorsList = document.getElementById('actors');
actorsName.slice(0, 5).forEach((actorName, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = actorName;
    actorsList.appendChild(listItem);

    const imageContainer = document.createElement('img');
    const srcValue = BACKDROP_BASE_URL + actorsImage[index]; // Access each source value from the actorsImage array based on the current index
    imageContainer.setAttribute('src', srcValue);
    listItem.appendChild(imageContainer);
});


    
};

const prevSlide = () => {
  const slider = document.querySelector('.slider');
  const slideWidth = slider.scrollWidth / 6;
  slider.scrollBy({
    left: -slideWidth,
    behavior: 'smooth',
  });
};

const nextSlide = () => {
  const slider = document.querySelector('.slider');
  const slideWidth = slider.scrollWidth / 6;
  slider.scrollBy({
    left: slideWidth,
    behavior: 'smooth',
  });
};

renderMovie()

document.addEventListener('DOMContentLoaded', autorun);