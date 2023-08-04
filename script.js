const publicKey = '7099391f3b2a229b2361d932e2cc1331';
const privateKey = '826ab870a9d658e09f5e8f627f89ad360e6adfdb';
const baseURL = 'https://gateway.marvel.com/v1/public/characters';
const favoritesKey = 'favoriteSuperheroes';
let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];


// Function to display favorite superheroes
function displayFavoriteSuperheroes() {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = '';
  
    favorites.forEach((superhero) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      const deleteButton = document.createElement('button');
      name.textContent = superhero.name;
      deleteButton.textContent = 'Delete from Favorites';
      deleteButton.classList.add('favorite');
  
      deleteButton.addEventListener('click', () => {
        removeFavorite(superhero);
        displayFavoriteSuperheroes();
      });
  
      li.appendChild(name);
      li.appendChild(deleteButton);
      favoritesList.appendChild(li);
    });
  }

// Function to generate the hash value
function generateHash() {
  const ts = Date.now();
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}

// Function to fetch and display superheroes on the home page
function fetchSuperheroes() {
  const searchInput = document.getElementById('searchInput');
  const superheroesList = document.getElementById('superheroesList');

  fetch(`${baseURL}?nameStartsWith=${searchInput.value}&${generateHash()}`)
    .then((response) => response.json())
    .then((data) => {
      superheroesList.innerHTML = '';

      data.data.results.forEach((superhero) => {
        const li = document.createElement('li');
        const name = document.createElement('span');
        const favoriteButton = document.createElement('button');
        name.textContent = superhero.name;
        favoriteButton.textContent = 'Add to Favorites';
        favoriteButton.classList.add('favorite');

        favoriteButton.addEventListener('click', () => {
          addFavorite(superhero);
        });

        li.appendChild(name);
        li.appendChild(favoriteButton);
        superheroesList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('Error fetching superheroes:', error);
    });
}

// Function to add superhero to favorites
function addFavorite(superhero) {
  const isAlreadyFavorite = favorites.some((fav) => fav.id === superhero.id);
  if (!isAlreadyFavorite) {
    favorites.push(superhero);
    saveFavoritesToStorage();
    alert(`${superhero.name} added to favorites!`);
  } else {
    alert(`${superhero.name} is already in favorites!`);
  }
}

// ... (previous code)

// Function to toggle visibility of the favorites list
function toggleFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.classList.toggle('hidden');
  }
  
  // Attach event listeners
  document.getElementById('searchInput').addEventListener('input', debounce(fetchSuperheroes));
  
  // Add event listener for "Favorite List" button
  document.getElementById('favoritesButton').addEventListener('click', () => {
    toggleFavoritesList();
    displayFavoriteSuperheroes();
  });
  
  // ... (rest of the code)
  

// Function to remove superhero from favorites
function removeFavorite(superhero) {
  favorites = favorites.filter((fav) => fav.id !== superhero.id);
  saveFavoritesToStorage();
  alert(`${superhero.name} removed from favorites!`);
}

// Function to save favorites to local storage
function saveFavoritesToStorage() {
  localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}

// Function to display favorite superheroes
function displayFavoriteSuperheroes() {
  const favoritesList = document.getElementById('favorites');
  favoritesList.innerHTML = '';

  favorites.forEach((superhero) => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const deleteButton = document.createElement('button');
    name.textContent = superhero.name;
    deleteButton.textContent = 'Delete from Favorites';
    deleteButton.classList.add('favorite');

    deleteButton.addEventListener('click', () => {
      removeFavorite(superhero);
      displayFavoriteSuperheroes();
    });

    li.appendChild(name);
    li.appendChild(deleteButton);
    favoritesList.appendChild(li);
  });
}

// Function to toggle visibility of the favorites list
function toggleFavoritesList() {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.classList.toggle('hidden');
}

// Attach event listeners
document.getElementById('searchInput').addEventListener('input', debounce(fetchSuperheroes));
document.getElementById('favoritesButton').addEventListener('click', () => {
  toggleFavoritesList();
  displayFavoriteSuperheroes();
});

// Debounce function to delay calling fetchSuperheroes to avoid rapid API requests
function debounce(func, delay = 300) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Call fetchSuperheroes initially to load some superheroes on the home page
fetchSuperheroes();
