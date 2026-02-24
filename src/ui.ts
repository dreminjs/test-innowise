import type { Book } from "./interfaces";
import { getFavorites } from "./storage";

export function renderStatus(message: string) {
  const booksList = document.querySelector(".books__list");
  if (booksList) {
    booksList.innerHTML = `<li class="books__status-message">${message}</li>`;
  }
}

export function renderBooks(books: Book[]) {
  const booksList = document.querySelector(".books__list");
  if (!booksList) return;

  const favorites = getFavorites();

  booksList.innerHTML = books
    .map((book) => {
      const authors = book.author_name?.join(", ") || "Неизвестный автор";
      const year = book.first_publish_year || "Неизвестный год";
      const isFavorite = favorites.some((fav) => fav.key === book.key);

      return `
      <li class="books__list-item">
        ${
          book.cover_i
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">`
            : `<div class='books__list-item-no-cover'>Нет обложки</div>`
        }
        <div class="books__list-item-info">
          <span class="books__list-item-title">${book.title}</span>
          <span class="books__list-item-authors">${authors}</span>
          <span class="books__list-item-year">${year}</span>
        </div>
        <button class="books__list-item-favorite" data-id="${book.key}">
          <img src="${isFavorite ? "heart-active.svg" : "heart.svg"}"
               alt="Избранное" style="pointer-events: none;">
        </button>
      </li>`;
    })
    .join("");
}

export function renderFavoritesList() {
  const favorites = getFavorites();
  const favoritesList = document.querySelector(".books__favourites-list");
  const countElement = document.querySelector(".books__favorites-count");

  if (countElement) countElement.textContent = String(favorites.length);
  if (!favoritesList) return;

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<li>Список пуст</li>";
    return;
  }

  favoritesList.innerHTML = favorites
    .map(
      (el) => `
    <li class="books__favourites-list-item">
      <div class="books__favourites-list-item-inner">
        <img class="books__favourites-list-item-preview"
             src="${el.cover_i ? `https://covers.openlibrary.org/b/id/${el.cover_i}-S.jpg` : ""}" alt="" />
        <div>
          <span class="books__favourites-list-item-title">${el.title}</span>
        </div>
      </div>
      <button class="books__favourites-list-item-remove" data-id="${el.key}">
        <img src="/public/heart-active.svg" alt="Удалить" style="pointer-events: none;">
      </button>
    </li>`,
    )
    .join("");
}
