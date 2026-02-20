import "./style.css";
import type { IAPIResponse } from "./interfaces";

async function getBooks(): Promise<IAPIResponse> {
  const response = await fetch(
    "https://openlibrary.org/search.json?q=crime+and+punishment&fields=key,title,author_name,cover_i,first_publish_year&limit=10",
  );
  const data = await response.json();
  return data;
}

function renderBooks(books) {
  const booksList = document.querySelector(".books__list");
  if (!booksList) return;

  booksList.innerHTML = "";

  const htmlContent = books
    .map((book) => {
      const authors = book.author_name
        ? book.author_name.join(", ")
        : "Неизвестный автор";

      const year = book.first_publish_year || "Неизвестный год";

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
      </li>
    `;
    })
    .join("");

  booksList.innerHTML = htmlContent;
}

async function main() {
  const books = await getBooks();
  console.log(books.docs);
  renderBooks(books.docs);
}

main();
