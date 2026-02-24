import "./style.css";
import { getBooks } from "./api";
import { toggleFavoriteInStorage } from "./storage";
import { renderStatus, renderBooks, renderFavoritesList } from "./ui";
import type { Book } from "./interfaces";

let currentBooks: Book[] = [];

async function handleSearch() {
  const input = document.querySelector<HTMLInputElement>(
    ".search__input-container input",
  );
  const query = input?.value.trim();
  if (!query) return;

  try {
    renderStatus("Загрузка...");
    const data = await getBooks(query);
    if (!data.docs.length) {
      renderStatus("Нет таких книг");
    } else {
      currentBooks = data.docs;
      renderBooks(currentBooks);
    }
  } catch (error) {
    renderStatus("Ошибка при загрузке");
  }
}

function initListeners() {
  const searchBtn = document.querySelector(".search__container button");
  const input = document.querySelector(".search__input-container input");
  const booksList = document.querySelector(".books__list");
  const favouriteList = document.querySelector(".books__favourites-list");
  searchBtn?.addEventListener("click", handleSearch);
  input?.addEventListener(
    "keypress",
    (e: any) => e.key === "Enter" && handleSearch(),
  );

  booksList?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest(".books__list-item-favorite");
    if (btn) {
      const id = btn.getAttribute("data-id");
      const book = currentBooks.find((b) => b.key === id);
      if (book) {
        toggleFavoriteInStorage(book);
        renderBooks(currentBooks);
        renderFavoritesList();
      }
    }
  });

  favouriteList?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest(".books__favourites-list-item-remove");
    if (btn) {
      const id = btn.getAttribute("data-id");
      const book = currentBooks.find((b) => b.key === id);
      if (book) {
        toggleFavoriteInStorage(book);
        renderBooks(currentBooks);
        renderFavoritesList();
      }
    }
  });
}

(async function main() {
  initListeners();
  renderFavoritesList();

  try {
    renderStatus("Загрузка...");
    const data = await getBooks();
    currentBooks = data.docs;
    renderBooks(currentBooks);
  } catch (e) {
    renderStatus("Ошибка соединения");
  }
})();
