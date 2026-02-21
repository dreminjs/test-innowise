import type { IAPIResponse } from "./interfaces";

export async function getBooks(
  query: string = "crime and punishment",
): Promise<IAPIResponse> {
  const searchQuery = encodeURIComponent(query);

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${searchQuery}&fields=key,title,author_name,cover_i,first_publish_year&limit=10`,
  );
  const data = await response.json();
  return data;
}
