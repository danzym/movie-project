"use strict";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI="
  )}`;
};

const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

const fetchMovies = async () => {
  const url = constructUrl("movie/now_playing");
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
    const genres = document.querySelector("#genre-container");

    let popoverContent = "<ul>";
    data.genres.map((genre) => {
      popoverContent += `<li><button class="genre-btn" value="${genre.id}">${genre.name}</button></li>`;
    });
    popoverContent += "</ul>";

    //create popover
    let popover = document.createElement("div");
    popover.id = "genres-popover";
    popover.innerHTML = popoverContent;
    popover.style.display = "none";
    popover.style.position = "absolute";
    popover.style.backgroundColor = "rgba(0, 0, 0, 0.6);";
    popover.style.border = "1px solid #000";
    popover.style.padding = "15px";
    genres.appendChild(popover);
    document.querySelectorAll(".genre-btn").forEach((button) => {
      button.addEventListener("mouseout", function () {
        popover.style.backgroundColor = "";
        popover.style.border = "";
        popover.style.display = "none";
        popover.style.padding = "15px";
      });
      button.addEventListener("mouseover", function () {
        popover.style.backgroundColor = "black";
        popover.style.border = "1px solid #000";
        popover.style.display = "none";
        popover.style.padding = "15px";
      });
    });

    //return the data in case you need it later
    return data;
  } catch (error) {
    console.log(error);
  }
};

//actor-page part - fetch and render actors in navbar
const fetchActorBy = async (path) => {
  const url = constructUrl(`person/${path}`);
  const res = await fetch(url);
  const actorResults = await res.json();
  return actorResults;
};

const fetchActorsPage = async () => {
  const actorsLink = document.getElementById("actorsList");
  actorsLink.addEventListener("click", (e) => {
    e.preventDefault();
    fetchActorBy("popular").then((actorResults) => {
      renderActors(actorResults.results);
    });
  });
};
fetchActorsPage();
//end actor-page part

const genreContainer = document.querySelector("#genre-container");

genreContainer.addEventListener("mouseover", async function (event) {
  const existingPopover = document.querySelector("#genres-popover");
  if (!existingPopover) {
    await fetchGenres();
  }
  const popover = document.querySelector("#genres-popover");
  popover.style.display = "block";
});

genreContainer.addEventListener("mouseout", function (event) {
  const popover = document.querySelector("#genres-popover");
  // Add a timeout to delay the hiding of the popover
  setTimeout(() => {
    // If the popover or its child elements are not being hovered over, then hide the popover
    if (!popover.matches(":hover")) {
      popover.style.display = "none";
    }
  }, 300); // Adjust the timeout duration according to your needs
});

// Event listener for genre buttons in the popover
// Event listener for genre buttons in the popover
document
  .querySelector("#genre-container")
  .addEventListener("click", async function (event) {
    // check if we clicked on a genre button
    if (event.target.className === "genre-btn") {
      const genreId = event.target.value;
      const genreMovies = await fetchGenre(genreId);
      CONTAINER.innerHTML = "";
      renderMovies(genreMovies.results);
      return genreMovies;
    } else {
      return;
    }
  });
const fetchGenre = async (genreId) => {
  try {
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}&with_genres=${genreId}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

document
  .querySelector("#filter-container")
  .addEventListener("mouseover", async (event) => {
    const existingPopover = document.querySelector("#filters-popover");
    if (!existingPopover) {
      let popoverContent = `
      <ul>
          <li><button class="filter-btn" value="now_playing">Now Playing</button></li>
          <li><button class="filter-btn" value="popular">Popular</button></li>
          <li><button class="filter-btn" value="top_rated">Top Rated</button></li>
          <li><button class="filter-btn" value="upcoming">Upcoming</button></li>
      </ul>`;

      // Create popover
      let popover = document.createElement("div");
      popover.id = "filters-popover";
      popover.innerHTML = popoverContent;
      popover.style.display = "none";
      popover.style.position = "absolute";
      popover.style.backgroundColor = "rgba(0, 0, 0, 0.6);";
      popover.style.border = "1px solid #000";
      popover.style.padding = "15px";
      document.querySelector("#filters").appendChild(popover);
    }
    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.addEventListener("click", function () {
        popover.style.display = "none";
      });
    });

    const popover = document.querySelector("#filters-popover");
    popover.style.display = "block";
  });

document
  .querySelector("#filter-container")
  .addEventListener("mouseout", function (event) {
    const popover = document.querySelector("#filters-popover");
    setTimeout(() => {
      // If the popover or its child elements are not being hovered over, then hide the popover
      if (!popover.matches(":hover")) {
        popover.style.display = "none";
      }
    }, 300);
  });

// document;
// 	.querySelector('#filters')
// 	.addEventListener('mouseout', function (event) {
// 		const popover = document.querySelector('#filters-popover');
// 		popover.style.display = 'none';
// 	});

// // Rest of your code...

document
  .querySelector("#filters")
  .addEventListener("click", async function (event) {
    if (event.target.className === "filter-btn") {
      const filterType = event.target.value;
      const filteredMovies = await fetchMoviesByFilterType(filterType);
      // Remove existing movies and display new ones
      CONTAINER.innerHTML = "";
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
const SEARCH_BASE_URL = "https://api.themoviedb.org/3/search/multi";

const constructSearchUrl = (query) => {
  return `${SEARCH_BASE_URL}?api_key=${atob(
    "NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI="
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
  .querySelector("#search-movies-input")
  .addEventListener("input", async (event) => {
    // When a key is released in the input, execute search
    const searchResults = await searchMovies(event.target.value);

    const filteredMovies = searchResults?.results?.filter((movie) => {
      return movie.media_type == "movie";
    });
    console.log(filteredMovies);

    // Remove existing movies and display new ones
    CONTAINER.innerHTML = "";
    renderMovies(filteredMovies);
  });

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  const sliderContainer = document.querySelector(".slider-container");
  const slider = document.createElement("div");
  slider.className = "slider";

  movies.forEach((movie) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    const img = document.createElement("img");
    img.src = BACKDROP_BASE_URL + movie.backdrop_path;
    img.alt = movie.title;

    slide.appendChild(img);
    slider.appendChild(slide);

    img.addEventListener("click", () => {
      movieDetails(movie);
    });
  });

  sliderContainer.appendChild(slider);
};

const renderMovie = async (movie) => {
  const movieCrew = await fetch(
    ` https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${atob(
      "NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI="
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
      "NGViNmRiNGQ1MjBmOGNkNWYzZWY4Y2JjZjU5ZTZhMDI="
    )}`
  );
  const movieTrailer = await fetchMovie.json();
  const trailer = movieTrailer.results[0].key;

  const renderDetails = document.getElementById("details");
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

  const actorsList = document.getElementById("actors");
  actorsName.slice(0, 5).forEach((actorName, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = actorName;
    actorsList.appendChild(listItem);

    const imageContainer = document.createElement("img");
    const srcValue = BACKDROP_BASE_URL + actorsImage[index]; // Access each source value from the actorsImage array based on the current index
    imageContainer.setAttribute("src", srcValue);
    listItem.appendChild(imageContainer);
  });

  const renderActors = (actors) => {
    CONTAINER.innerHTML = "";
    const actorsContainer = document.createElement("div");
    actorsContainer.setAttribute("class", "actorsPage");
    actors.map((actor) => {
      const actorDiv = document.createElement("div");
      actorDiv.innerHTML = `
        <img class="actorsImages" src="${
          PROFILE_BASE_URL + actor.profile_path
        }" alt="${
        actor.name
      } poster"><div class="actorsCards"><p class="info" id="actorsNames">${
        actor.name
      }</p></div>`;

      actorDiv.addEventListener("click", () => {
        actorDetails(actor);
      });

      actorsContainer.appendChild(actorDiv);
      CONTAINER.appendChild(actorsContainer);
    });
  };
};

//actor-page part
const fetchActorByID = async (actor) => {
  const actors = await fetchActorBy(actor.id);
  if (actor.id == actors.id) {
    CONTAINER.innerHTML = "";
    CONTAINER.className = "";
    CONTAINER.className = "container actorPage my-5 p-5";
    CONTAINER.innerHTML = `
      <div class="row">
      <div class="col-md-4 text-white">
      <h1><b>${actor.name}</b></h1>
      <img class="img-fluid" src="${BACKDROP_BASE_URL + actor.profile_path}" />
      <p><b>Gender:</b>${actor.gender === 2 ? "Male" : "Female"}</p>
      <p><b>Birthdate:</b>${actors.birthday}</p>
      <p><b>Deathdate:</b>${actors.deathday ? actors.deathday : "Unknown"}</p>
      <p><b>Popularity:</b>${
        actors.popularity ? actors.popularity : "Unknown"
      }</p>
      </div>
      <div class="col-md-8 mt-5 text-white">
      <h3><b>Biograpy:</b></h3><p>${
        actors.biography ? actors.biography : "Unknown"
      }</p><br>
      <h3><b>${
        actor.name
      }'s Other Works:</h3></b><ul id="actor-movie-list"></ul>
			</div>
      </div>
`;
    const actorOtherWorks = document.getElementById("actor-movie-list");
    actor.known_for.forEach((movies) => {
      const eachMovie = document.createElement("a");
      eachMovie.setAttribute("href", "#");
      eachMovie.innerHTML = `<li> ${movies.title} </li>`;
      actorOtherWorks.appendChild(eachMovie);
      eachMovie.addEventListener("click", () => {
        movieDetails(movies);
      });
    });
  }
};

const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  CONTAINER.className = "";
  CONTAINER.className = "row mx-auto justify-content-center";
  actors.forEach((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.className =
      "card col-10 col-sm-4 col-md-4 col-xl-3  px-2 pt-2 m-5 bg-white rounded";
    actorDiv.style.width = "20rem";
    actorDiv.innerHTML = `
      <a class="actor-div" href="#">
     <h3 class="text-center text-xl text-red-700 font-semibold">${
       actor.name
     }</h3>
     <img class="card-img-top img-fluid p-2 mb-2 rounded" src="${
       PROFILE_BASE_URL + actor.profile_path
     }" class="img-fluid p-2 mb-2 rounded" alt="Card image cap">
      </a>
    `;
    actorDiv.addEventListener("click", () => {
      fetchActorByID(actor);
    });
    CONTAINER.appendChild(actorDiv);
  });
};
// end of actor-page part
const about = () => {
  const aboutPage = document.getElementById("about");
  aboutPage.addEventListener("click", () => {
    CONTAINER.innerHTML = "";
    CONTAINER.className = "";
    CONTAINER.className = "container aboutPage my-5 p-5";
    CONTAINER.innerHTML = `
    <div class="text-center">
    <img src="netflix.gif" alt="gif netflix logo" class="mx-auto">
    <h1><b>Re:Coded Production</b></h1>
    <p>Some info about project and team members</p>
    </div>
    `;
  });
};
about();
// home button part
function goToHomePage() {
  window.location.href = "index.html";
}
// end of home button part
const prevSlide = () => {
  const slider = document.querySelector(".slider");
  const slideWidth = slider.scrollWidth / 6;
  slider.scrollBy({
    left: -slideWidth,
    behavior: "smooth",
  });
};

const nextSlide = () => {
  const slider = document.querySelector(".slider");
  const slideWidth = slider.scrollWidth / 6;
  slider.scrollBy({
    left: slideWidth,
    behavior: "smooth",
  });
};
renderMovie();
document.addEventListener("DOMContentLoaded", autorun);
