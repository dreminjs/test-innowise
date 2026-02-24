import type { Book } from "./interfaces";

const STORAGE_KEY = "favourite_books";

export const getFavorites = (): Book[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const toggleFavoriteInStorage = (book: Book): void => {
  const favorites = getFavorites();
  const index = favorites.findIndex((fav) => fav.key === book.key);

  if (index === -1) {
    favorites.push(book);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};
