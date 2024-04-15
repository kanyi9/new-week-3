// Your code here
// Fetch the list of films from the API
document.addEventListener('DOMContentLoaded', async function() {
    // Function to fetch the list of films
    async function fetchFilms() {
      try {
        const response = await fetch('http://localhost:3000/films');
        const films = await response.json();
        return films;
      } catch (error) {
        console.error('Error fetching films:', error);
        throw error;
      }
    }
  
    // Function to buy a ticket for a film
    async function buyTicket(filmId) {
      try {
        const response = await fetch(`http://localhost:3000/films/${filmId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tickets_sold: ticketsSold + 1 }) 
        });
        const filmData = await response.json();
        const ticketNum = document.getElementById('ticket-num');
        ticketNum.textContent = filmData.capacity - filmData.tickets_sold;
        if (filmData.tickets_sold === filmData.capacity) {
          const buyTicketButton = document.getElementById('buy-ticket');
          buyTicketButton.disabled = true;
          const filmItem = document.querySelector(`li[data-film-id="${filmId}"]`);
          filmItem.classList.add('sold-out');
        }
      } catch (error) {
        console.error('Error buying ticket:', error);
      }
    }
  
    // Function to delete a film
    async function deleteFilm(filmId) {
      try {
        await fetch(`http://localhost:3000/films/${filmId}`, {
          method: 'DELETE'
        });
        const filmItem = document.querySelector(`li[data-film-id="${filmId}"]`);
        filmItem.remove();
      } catch (error) {
        console.error('Error deleting film:', error);
      }
    }
  
    // Function to display the list of films
    function displayFilms(films) {
      const filmsList = document.getElementById('films');
      filmsList.innerHTML = ''; // Clear the current list of films
      films.forEach(film => {
        const filmItem = document.createElement('li');
        filmItem.dataset.filmId = film.id;
        filmItem.classList.add('film', 'item');
        filmItem.innerHTML = `
          <span>${film.title}</span>
          <button class="delete-button" data-film-id="${film.id}">Delete</button>
        `;
        filmsList.appendChild(filmItem);
      });
    }
  
    // Get the Buy Ticket button and the Delete buttons
    const buyTicketButton = document.getElementById('buy-ticket');
    const deleteButtons = document.querySelectorAll('.delete-button');
  
    // Attach an event listener to the Buy Ticket button
    buyTicketButton.addEventListener('click', () => {
      const filmId = document.getElementById('film-id').value;
      buyTicket(filmId);
    });
  
    // Attach an event listener to each Delete button
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filmId = button.dataset.filmId;
        deleteFilm(filmId);
      });
    });
  
    // Fetch films and display them on the page
    try {
      const films = await fetchFilms();
      displayFilms(films);
    } catch (error) {
      console.error('Error initializing:', error);
    }
  });
  