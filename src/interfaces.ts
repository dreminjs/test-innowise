export interface Book {
  title: string;
  author_name: string[];
  first_publish_year: number;
  key: string;
  cover_i: number;
}

export interface IAPIResponse {
  docs: Book[];
  numFound: number;
  numFoundExact: number;
  num_found: number;
  offset: number | null;
  q: string;
  start: number;
}
