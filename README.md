Task: https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view
How to run this app: npm run start

src/ (Source Code)
main.ts: The entry point of the application. It initializes event listeners and manages the high-level application flow.

api.ts: Contains logic for network requests, specifically fetching book data from the Open Library API.

ui.ts: Handles all DOM manipulations, including rendering the book list, status messages (loading, errors), and the favorites sidebar.

storage.ts: Manages data persistence, providing functions to read from and write "Favorite" books to localStorage.

interfaces.ts: Defines TypeScript interfaces and types (e.g., Book, ApiResponse) to ensure type safety across the project.

style.css: Contains all the visual styling for the application.
