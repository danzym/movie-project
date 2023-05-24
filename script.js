'use strict';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
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
	console.log(data);
	return data;
};

const fetchMovie = async (movieId) => {
	const url = constructUrl(`movie/${movieId}`);
	const res = await fetch(url);

	return res.json();
};

const fetchGenres = async () => {
	try {
		const url = constructUrl(`genre/movie/list`);
		const res = await fetch(url);
		const data = await res.json();
		const genres = document.querySelector('#genre-container');

		let popoverContent = '<ul>';
		data.genres.map((genre) => {
			popoverContent += `<li><button class="genre-btn" value="${genre.id}">${genre.name}</button></li>`;
		});
		popoverContent += '</ul>';

		//create popover
		let popover = document.createElement('div');
		popover.id = 'genres-popover';
		popover.innerHTML = popoverContent;
		popover.style.display = 'none';
		popover.style.position = 'absolute';
		popover.style.backgroundColor = '#000000';
		popover.style.border = '1px solid #000';
		popover.style.padding = '10px';
		genres.appendChild(popover);
		document.querySelectorAll('.genre-btn').forEach((button) => {
			button.addEventListener('click', function () {
				popover.style.display = 'none';
				var navItems = document.querySelector('#navbar-items');
				navItems.style.display = 'none';
			});
		});

		//return the data in case you need it later
		return data;
	} catch (error) {
		console.log(error);
	}
};
const genreContainer = document.querySelector('#genre-container');

genreContainer.addEventListener('mouseover', async function (event) {
	const existingPopover = document.querySelector('#genres-popover');
	if (!existingPopover) {
		await fetchGenres();
	}
	const popover = document.querySelector('#genres-popover');
	popover.style.display = 'block';
});

genreContainer.addEventListener('mouseout', function (event) {
	const popover = document.querySelector('#genres-popover');
	// Add a timeout to delay the hiding of the popover
	setTimeout(() => {
		// If the popover or its child elements are not being hovered over, then hide the popover
		if (!popover.matches(':hover')) {
			popover.style.display = 'none';
		}
	}, 300); // Adjust the timeout duration according to your needs
});

// Event listener for genre buttons in the popover
// Event listener for genre buttons in the popover
document
	.querySelector('#genre-container')
	.addEventListener('click', async function (event) {
		// check if we clicked on a genre button
		if (event.target.className === 'genre-btn') {
			const genreId = event.target.value;
			const genreMovies = await fetchGenre(genreId);
			CONTAINER.innerHTML = '';

			renderMovies(genreMovies.results);
			return genreMovies;
		} else {
			return;
		}
	});
const fetchGenre = async (genreId) => {
	try {
		const url = `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
			'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
		)}&with_genres=${genreId}`;
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

document
	.querySelector('#filter-container')
	.addEventListener('mouseover', async (event) => {
		const existingPopover = document.querySelector('#filters-popover');
		if (!existingPopover) {
			let popoverContent = `
      <ul>
          <li><button class="filter-btn" value="now_playing">Now Playing</button></li>
          <li><button class="filter-btn" value="popular">Popular</button></li>
          <li><button class="filter-btn" value="top_rated">Top Rated</button></li>
          <li><button class="filter-btn" value="upcoming">Upcoming</button></li>
      </ul>`;

			// Create popover
			let popover = document.createElement('div');
			popover.id = 'filters-popover';
			popover.innerHTML = popoverContent;
			popover.style.display = 'none';
			popover.style.position = 'absolute';
			popover.style.backgroundColor = '#000000';
			popover.style.border = '1px solid #000';
			popover.style.padding = '10px';
			document.querySelector('#filters').appendChild(popover);
		}
		document.querySelectorAll('.filter-btn').forEach((button) => {
			button.addEventListener('click', function () {
				popover.style.display = 'none';
				var navItems = document.querySelector('#navbar-items');
				navItems.style.display = 'none';
			});
		});

		const popover = document.querySelector('#filters-popover');
		popover.style.display = 'block';
	});

document
	.querySelector('#filter-container')
	.addEventListener('mouseout', function (event) {
		const popover = document.querySelector('#filters-popover');
		setTimeout(() => {
			// If the popover or its child elements are not being hovered over, then hide the popover
			if (!popover.matches(':hover')) {
				popover.style.display = 'none';
			}
		}, 300);
	});

document
	.querySelector('#filters')
	.addEventListener('click', async function (event) {
		if (event.target.className === 'filter-btn') {
			const filterType = event.target.value;
			const filteredMovies = await fetchMoviesByFilterType(filterType);
			// Remove existing movies and display new ones
			CONTAINER.innerHTML = '';
			renderMovies(filteredMovies.results);
		}
	});

const fetchMoviesByFilterType = async (filterType) => {
	try {
		const url = constructUrl(`movie/${filterType}`);
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};
const SEARCH_BASE_URL = 'https://api.themoviedb.org/3/search/multi';

const constructSearchUrl = (query) => {
	return `${SEARCH_BASE_URL}?api_key=${atob(
		'NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI='
	)}&query=${query}&include_adult=false&language=en-US&page=1`;
};

const searchMovies = async (query) => {
	try {
		const url = constructSearchUrl(query);
		const res = await fetch(url);
		const data = await res.json();
		renderMovies(data.results);
		return data;
		// render the search results
	} catch (error) {
		console.log(error);
	}
};

document
	.querySelector('#search-movies-input')
	.addEventListener('input', async (event) => {
		// When a key is released in the input, execute search
		const searchResults = await searchMovies(event.target.value);

		const filteredMovies = searchResults?.results?.filter((movie) => {
			return movie.media_type == 'movie';
		});
		console.log(filteredMovies);

		// Remove existing movies and display new ones
		CONTAINER.innerHTML = '';
		renderMovies(filteredMovies);
	});

// You'll need to play with this function in order to add features and enhance the style.
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
			movieDetails(movie);
		});
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
	console.log(crew);
	const directorName = crew.crew[0].name;
	const actorsName = crew.cast.map((actor) => actor.name);
	const actorsImage = crew.cast.map((actImage) => actImage?.profile_path);
	console.log(actorsImage);

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
            <img id="movie-backdrop" src="${
							BACKDROP_BASE_URL + movie.backdrop_path
						}">
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
							movie.release_date
						}</p>
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

document.addEventListener('DOMContentLoaded', autorun);
// Add event listener for the hamburger menu
// This function adjusts the layout based on the window width
document.querySelector('#navbar-toggle').addEventListener('click', function () {
	var navItems = document.querySelector('#navbar-items');
	// Toggle the display of the navbar items when the toggle button is clicked
	if (navItems.style.display === 'none') {
		navItems.style.display = 'flex';
	} else {
		navItems.style.display = 'none';
	}
});
window.addEventListener('resize', function () {
	var navItems = document.querySelector('#navbar-items');
	if (window.innerWidth > 768) {
		navItems.style.display = 'flex'; // set display to flex
	} else {
		navItems.style.display = 'none'; // set display to none
	}
});
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

renderMovie();

document.addEventListener('DOMContentLoaded', autorun);
