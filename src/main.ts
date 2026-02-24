import "./style.css";
import { getBooks } from "./api";
import type { Book } from "./interfaces";

function renderStatus(message: string) {
  const booksList = document.querySelector(".books__list");
  if (booksList) {
    booksList.innerHTML = `<li class="books__status-message">${message}</li>`;
  }
}

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
      const isFavorite = favorites.some((fav) => fav.key === book.key);

      return `
      <li class="books__list-item">
        ${
          book.cover_i
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">`
            : "<div class='books__list-item-no-cover'>Нет обложки</div>"
        }
        <div class="books__list-item-info">
          <span class="books__list-item-title">${book.title}</span>
          <span class="books__list-item-authors">${authors}</span>
          <span class="books__list-item-year">${year}</span>
        </div>
        <button class="books__list-item-favorite" data-id="${book.key}">
          <img src="${isFavorite ? "./src/assets/heart-active.svg" : "./src/assets/heart.svg"}"
               alt="Избранное" style="pointer-events: none;">
        </button>
      </li>
    `;
    })
    .join("");
}

let currentBooks: Book[] = [];

function setupFavoritesListener() {
  const booksList = document.querySelector(".books__list");
  if (!booksList) return;

  booksList.replaceWith(booksList.cloneNode(true));
  const newBooksList = document.querySelector(".books__list")!;

  newBooksList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const favoriteBtn = target.closest(".books__list-item-favorite");

    if (favoriteBtn) {
      const bookId = favoriteBtn.getAttribute("data-id");
      const bookData = currentBooks.find((b) => b.key === bookId);

      if (bookData) {
        toggleFavorite(bookData);
        renderBooks(currentBooks);
      }
    }
  });
}

function toggleFavorite(book: Book) {
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

  if (favoritesList) {
    if (favorites.length === 0) {
      favoritesList.innerHTML = "<li>Список пуст</li>";
      return;
    }

    favoritesList.innerHTML = favorites
      .map((el) => {
        const authors = el.author_name
          ? el.author_name.join(", ")
          : "Автор не указан";
        return `
          <li class="books__favourites-list-item">
            <div class="books__favourites-list-item-inner">
              ${
                el.cover_i
                  ? `<img class="books__favourites-list-item-preview" src="https://covers.openlibrary.org/b/id/${el.cover_i}-M.jpg" alt="${el.title}" />`
                  : `<div class="no-cover-mini"></div>`
              }
              <div>
                <span class="books__favourites-list-item-title">${el.title}</span>
                <span class="books__favourites-list-item-authors">${authors}</span>
              </div>
            </div>
          </li>`;
      })
      .join("");
  }
}

async function handleSearch() {
  const input = document.querySelector<HTMLInputElement>(
    ".search__input-container input",
  );
  const query = input?.value.trim();

  if (!query) return;

  try {
    renderStatus("Загрузка...");
    const booksData = await getBooks(query);

    if (!booksData.docs || booksData.docs.length === 0) {
      renderStatus("Нет таких книг");
      return;
    }

    currentBooks = booksData.docs;
    renderBooks(currentBooks);
  } catch (error) {
    renderStatus("Ошибка при загрузке данных");
    console.error(error);
  }
}

(async function main() {
  const searchBtn = document.querySelector(".search__container button");
  const input = document.querySelector<HTMLInputElement>(
    ".search__input-container input",
  );

  searchBtn?.addEventListener("click", handleSearch);
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  setupFavoritesListener();

  try {
    renderStatus("Загрузка...");
    const data = await getBooks();
    currentBooks = data.docs;

    renderBooks(currentBooks);
    renderFavorites();
    renderCountOfFavorites();
  } catch (e) {
    renderStatus("Ошибка соединения с сервером");
  }
})();
