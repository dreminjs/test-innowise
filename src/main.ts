import "./style.css";
import { getBooks } from "./api";
import type { Book } from "./interfaces";

function renderBooks(books: Book[]) {
  const booksList = document.querySelector(".books__list");
  if (!booksList) return;
  const favorites: Book[] = JSON.parse(
    localStorage.getItem("favourite_books") || "[]",
  );

  booksList.innerHTML = books
    .map((book) => {
      const authors = book.author_name
        ? book.author_name.join(", ")
        : "Неизвестный автор";
      const year = book.first_publish_year || "Неизвестный год";

      return `
      <li class="books__list-item">
        ${
          book.key
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">`
            : "<div class='books__list-item-no-cover'>Нет обложки</div>"
        }
        <div class="books__list-item-info">
          <span class="books__list-item-title">${book.title}</span>
          <span class="books__list-item-authors">${authors}</span>
          <span class="books__list-item-year">${year}</span>
        </div>
        <button class="books__list-item-favorite" data-id="${book.key}">
        ${favorites.some((favorite) => favorite.key === book.key) ? '<img src="./src/assets/heart-active.svg" alt="Избранное" style="pointer-events: none;">' : '<img src="./src/assets/heart.svg" alt="Избранное" style="pointer-events: none;">'}
        </button>
      </li>
    `;
    })
    .join("");
}

function setupFavorites(books: Book[]) {
  const booksList = document.querySelector(".books__list");
  console.log(booksList);
  if (!booksList) return;

  booksList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const favoriteBtn = target.closest(".books__list-item-favorite");
    console.log(favoriteBtn);
    if (favoriteBtn) {
      const bookId = favoriteBtn.getAttribute("data-id");
      const bookData = books.find((b) => b.key === bookId);

      if (bookData) {
        toggleFavorite(bookData);
      }
    }
  });
}

function toggleFavorite(book: any) {
  const favorites: Book[] = JSON.parse(
    localStorage.getItem("favourite_books") || "[]",
  );

  const index = favorites.findIndex((fav) => fav.key === book.key);

  if (index === -1) {
    favorites.push(book);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favourite_books", JSON.stringify(favorites));
  renderFavorites();
  renderCountOfFavorites();
}

function renderCountOfFavorites() {
  const favoritesStr = localStorage.getItem("favourite_books");
  const favoritesCount = favoritesStr ? JSON.parse(favoritesStr).length : 0;

  const favoritesElement = document.querySelector(".books__favorites-count");
  if (favoritesElement) {
    favoritesElement.textContent = `${favoritesCount}`;
  }
}

function renderFavorites() {
  const favoritesStr = localStorage.getItem("favourite_books");
  const favorites: Book[] = favoritesStr ? JSON.parse(favoritesStr) : [];

  const favoritesList = document.querySelector(".books__favourites-list");
  console.log(favoritesList);
  if (favoritesList) {
    favoritesList.innerHTML = "";

    const favoritesHTML = favorites
      .map(
        (el) => `<li class="books__favourites-list-item">
                  <div class="books__favourites-list-item-inner">
                    <img class="books__favourites-list-item-preview" src="https://covers.openlibrary.org/b/id/${el.cover_i}-M.jpg" alt="${el.title}" />
                    <div>
                    <span class="books__favourites-list-item-title">${el.title}</span>
                    <span class="books__favourites-list-item-authors">${el.author_name.map((author) => author).join(", ")}</span>
                    <span class="books__favourites-list-item-year">${el.first_publish_year}</span>
                    </div>
                  </div>
                    <img src="./src/assets/heart.svg" alt="" />
                 </li>`,
      )
      .join("");

    favoritesList.innerHTML = favoritesHTML;
  }
}

async function handleSearch() {
  const input = document.querySelector<HTMLInputElement>(
    ".search__input-container input",
  );
  const query = input?.value.trim();

  if (query) {
    const booksData = await getBooks(query);
    renderBooks(booksData.docs);
  }
}

async function main() {
  const data = await getBooks();
  const books = data.docs;
  const searchBtn = document.querySelector(".search__container button");
  searchBtn?.addEventListener("click", handleSearch);

  const input = document.querySelector(".search__input-container input");
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  renderFavorites();
  renderBooks(books);
  renderCountOfFavorites();
  setupFavorites(books);
}

main();
