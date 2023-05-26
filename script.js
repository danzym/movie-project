'use strict';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.container');

const autorun = async () => {
	const movies = await fetchMovies();
	CONTAINER.innerHTML = '';

	renderMovies(movies.results);
};
document.addEventListener('click', async (event) => {
	if (event.target.matches('#home')) {
		const navItems = document.querySelector('#navbar-items');

		window.scrollTo({ top: 0, behavior: 'smooth' });
		// navItems.scrollIntoView({ block: 'end', behavior: 'smooth' });

		if (window.innerWidth <= 768) {
			navItems.style.display = 'none';
		} // Replace with your function

		location.reload();
	}
});

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
	try {
		const url = constructUrl('movie/now_playing');
		document.getElementById('loader').style.display = 'block';
		const response = await fetch(url);
		const data = await response.json();
		setTimeout(() => {
			document.getElementById('loader').style.display = 'none';
		}, 1000);

		console.log(data);
		return data;
	} catch (error) {
		document.getElementById('loader').style.display = 'none';
		console.log(error);
	}
};

const fetchMovie = async (movieId) => {
	try {
		const url = constructUrl(`movie/${movieId}`);
		document.getElementById('loader').style.display = 'block';

		const res = await fetch(url);
		const data = await res.json();
		setTimeout(() => {
			document.getElementById('loader').style.display = 'none';
		}, 1000);
		return data;
	} catch (error) {
		document.getElementById('loader').style.display = 'none';

		console.log(error);
	}
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

				const navItems = document.querySelector('#navbar-items');
				if (window.innerWidth <= 768) {
					navItems.style.display = 'none';
				}
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
			const navItems = document.querySelector('#navbar-items');

			if (window.innerWidth <= 768) {
				navItems.style.display = 'none';
			}
			CONTAINER.innerHTML = '';
			const details = document.querySelector('#details');
			details.innerHTML = `			<div class="slider-container "></div>
			<div class="slider-controls ">
				<button class="  text-white  rounded  hover:drop-shadow-md hover:bg-red-800 bg-red-600" onclick="prevSlide()">Prev</button>
				<button class="  text-white rounded  hover:drop-shadow-md hover:bg-red-800 bg-red-600" onclick="nextSlide()">Next</button>
			</div>`;

			renderMovies(genreMovies.results);
			document
				.querySelector('#details')
				.scrollIntoView({ block: 'end', behavior: 'smooth' });

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
		document.getElementById('loader').style.display = 'block';
		const res = await fetch(url);
		const data = await res.json();
		setTimeout(() => {
			document.getElementById('loader').style.display = 'none';
		}, 1000);
		return data;
	} catch (error) {
		console.log(error);
		document.getElementById('loader').style.display = 'none';
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
				document
					.querySelector('#details')
					.scrollIntoView({ block: 'end', behavior: 'smooth' });
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
			const details = document.querySelector('#details');
			const navItems = document.querySelector('#navbar-items');
			if (window.innerWidth <= 768) {
				navItems.style.display = 'none';
			}
			details.innerHTML = `			<div class="slider-container "></div>
			<div class="slider-controls ">
				<button class="  text-white  rounded  hover:drop-shadow-md hover:bg-red-800 bg-red-600" onclick="prevSlide()">Prev</button>
				<button class="  text-white rounded  hover:drop-shadow-md hover:bg-red-800 bg-red-600" onclick="nextSlide()">Next</button>
			</div>`;
			renderMovies(filteredMovies.results);
			details.scrollIntoView({ block: 'end', behavior: 'smooth' });
		} else return;
	});

const fetchMoviesByFilterType = async (filterType) => {
	try {
		const url = constructUrl(`movie/${filterType}`);
		document.getElementById('loader').style.display = 'block';
		const res = await fetch(url);
		const data = await res.json();
		setTimeout(() => {
			document.getElementById('loader').style.display = 'none';
		}, 1000);
		return data;
	} catch (error) {
		document.getElementById('loader').style.display = 'none';
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
		document.getElementById('loader').style.display = 'block';
		const res = await fetch(url);
		const data = await res.json();
		if (query.length < 1) {
			window.location.reload();
		}
		renderMovies(data.results);
		setTimeout(() => {
			document.getElementById('loader').style.display = 'none';
		}, 200);
		return data;
		// render the search results
	} catch (error) {
		document.getElementById('loader').style.display = 'none';
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

		// Remove existing movies and display new ones
		CONTAINER.innerHTML = '';
		const details = document.querySelector('#details');
		details.innerHTML = `			<div class="slider-container "></div>
		<div class="slider-controls ">
			<button class="  text-white  rounded  hover:drop-shadow-md hover:bg-red-800 bg-red-600" onclick="prevSlide()">Prev</button>
			<button class="  text-white rounded  hover:drop-shadow-md hover:bg-red-800 bg-red-600" onclick="nextSlide()">Next</button>
		</div>`;

		renderMovies(filteredMovies);
		details.scrollIntoView({ block: 'end', behavior: 'smooth' });
	});

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
	const sliderContainer = document.querySelector('.slider-container');
	sliderContainer.innerHTML = '';
	const slider = document.createElement('div');
	slider.className = 'slider';

	movies.forEach((movie) => {
		const slide = document.createElement('div');
		slide.className = 'slide';

		const img = document.createElement('img');
		img.src = BACKDROP_BASE_URL + movie.backdrop_path;
		img.classList.add('cursor-pointer');

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
		` https://api.themoviedb.org/3/movie/${movie?.id}/credits?api_key=${atob(
			'NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI='
		)}`
	);
	const crew = await movieCrew?.json();
	console.log(crew);
	const directorName = crew?.crew[0]?.name;
	const actorsName = crew?.cast?.map((actor) => actor.name);
	const actorsImage = crew?.cast?.map((actImage) => actImage?.profile_path);
	console.log(actorsImage);

	const fetchMovie = await fetch(
		`https://api.themoviedb.org/3/movie/${movie?.id}/videos?api_key=${atob(
			'NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI='
		)}`
	);
	const movieTrailer = await fetchMovie.json();
	const trailer = movieTrailer?.results[0]?.key;

	const renderDetails = document.getElementById('details');
	renderDetails.innerHTML = `
  <div class="flex flex-col gap-4 px-6 bg-black">
    <div>
        <img class='w-full' id="movie-backdrop" src="${
					BACKDROP_BASE_URL + movie.backdrop_path
				}">
    </div>

    <div class='grid grid-cols-12  gap-4 w-full  '>       
        <div class=" lg:col-span-6 md:col-span-4 col-span-12  gap-4">
            <h2 class='font-bold text-red-600 text-3xl mb-6' id="movie-title">${
							movie.title
						}</h2>
            <p id="movie-release-date"><b class='text-red-600'>Release Date:</b> ${
							movie.release_date
						}</p>
            <p id="movie-runtime"><b class='text-red-600'>Runtime:</b> ${
							movie.runtime
						} Minutes</p>
            <h3 class='font-bold text-red-600'>Overview:</h3>
            <p class='w-full ' id="movie-overview">${movie.overview}</p>
            <h2 class='font-bold text-red-600'>Vote average: </h2>
            <p>${movie.vote_average}</p>
            <h2 class='font-bold text-red-600'>Language: </h2>
            <p>${movie.original_language}</p>
            <h2 class='font-bold text-red-600'>Director: </h2>
            <p>${directorName}</p>
        </div>

        <div class='w-full lg:col-span-6 col-span-12 md:col-span-8 h-full gap-4'>
            <h3 class='mb-6 font-bold text-red-600 '>Trailer:</h3>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${trailer}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div>
</div>

<div class=' flex flex-col justify-center items-center w-full bg-black pt-12'>   
    <h3 class='text-center text-2xl text-white font-bold'>Actors</h3>
    <ul class='gap-2  flex flex-start items-center' id="actors" class="list-unstyled"></ul>
</div>


 
`;

	const actorsList = document.getElementById('actors');
	actorsName.slice(0, 5).forEach((actorName, index) => {
		const listItem = document.createElement('li');
		listItem.textContent = actorName;

		actorsList.appendChild(listItem);

		const imageContainer = document.createElement('img');
		imageContainer.classList.add('rounded-full');
		const srcValue = BACKDROP_BASE_URL + actorsImage[index]; // Access each source value from the actorsImage array based on the current index
		imageContainer.setAttribute('src', srcValue);
		listItem.classList.add(
			'flex',
			'flex-col',
			'justify-center',
			'items-center',
			'gap-2',
			'mx-4',
			'bg-black',
			'text-white',
			'p-4',
			'rounded-md',
			'hover:drop-shadow-md',
			'hover:bg-red-800',
			'bg-red-600',
			'cursor-pointer',
			'actor'
		);
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
		navItems.style.flexDirection = 'column-reverse';
	} else {
		navItems.style.display = 'none';
	}
});
window.addEventListener('resize', function () {
	var navItems = document.querySelector('#navbar-items');

	if (window.innerWidth > 768) {
		navItems.style.display = 'flex'; // set display to flex
		navItems.style.flexDirection = 'row'; // set flex direction to row
	} else {
		navItems.style.display = 'none'; // set display to none
	}
});
const getSlideWidth = () => {
	let slidesToScroll = 1;
	if (window.innerWidth >= 1024) {
		slidesToScroll = 3;
	} else if (window.innerWidth >= 768) {
		slidesToScroll = 2;
	}
	const slider = document.querySelector('.slider');
	const totalSlides = slider.querySelectorAll('.slide').length;
	return (slider.scrollWidth * slidesToScroll) / totalSlides;
};

const prevSlide = () => {
	const slideWidth = getSlideWidth();
	const slider = document.querySelector('.slider');
	slider.scrollBy({
		left: -slideWidth,
		behavior: 'smooth',
	});
};

const nextSlide = () => {
	const slideWidth = getSlideWidth();
	const slider = document.querySelector('.slider');
	slider.scrollBy({
		left: slideWidth,
		behavior: 'smooth',
	});
};

document.addEventListener('DOMContentLoaded', autorun);
