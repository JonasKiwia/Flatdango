const API_URL = "http://localhost:3000/films";

document.addEventListener("DOMContentLoaded", () => {
  loadMovies();
  loadFirstMovie();
});

function loadMovies() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((movies) => {
      const filmsList = document.getElementById("films");
      filmsList.innerHTML = ""; // Clear the placeholder
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.classList.add("film", "item");
        if (movie.capacity - movie.tickets_sold === 0) {
          li.classList.add("sold-out");
        }
        li.addEventListener("click", () => displayMovieDetails(movie));
        filmsList.appendChild(li);
      });
    });
}

function loadFirstMovie() {
  fetch(`${API_URL}/1`)
    .then((response) => response.json())
    .then((movie) => displayMovieDetails(movie));
}

function displayMovieDetails(movie) {
  document.getElementById("movie-poster").src = movie.poster;
  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("movie-runtime").textContent = `Runtime: ${movie.runtime} minutes`;
  document.getElementById("movie-showtime").textContent = `Showtime: ${movie.showtime}`;
  const availableTickets = movie.capacity - movie.tickets_sold;
  document.getElementById("movie-available-tickets").textContent = `Available Tickets: ${availableTickets}`;
  const buyButton = document.getElementById("buy-ticket");
  buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
  buyButton.disabled = availableTickets === 0;

  buyButton.onclick = () => {
    if (availableTickets > 0) {
      const newTicketsSold = movie.tickets_sold + 1;
      fetch(`${API_URL}/${movie.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: newTicketsSold }),
      }).then(() => {
        movie.tickets_sold = newTicketsSold;
        displayMovieDetails(movie);
        loadMovies();
      });
    }
  };
}