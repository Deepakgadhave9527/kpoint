

# Movie Data App

This project is a React-based web application that displays movies filtered by genre and year using data from The Movie Database (TMDb) API.

## Features

- Display movies categorized by release year.
- Filter movies by genre (Action, Comedy, Horror, Drama, Science Fiction).
- Infinite scrolling for loading more movies.
- Responsive design for mobile and desktop views.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v12 or higher)
- npm (Node Package Manager) or yarn

## Getting Started

Follow these steps to run the project locally on your machine:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd movie-data-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add your TMDb API key:

   ```plaintext
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
   ```

   Replace `your_tmdb_api_key_here` with your actual TMDb API key. You can obtain an API key by signing up on the [TMDb website](https://www.themoviedb.org/documentation/api).

4. **Run the development server:**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **View the application:**

   Open your web browser and navigate to `http://localhost:3000` to view the Movie Data App.

## Additional Details

- The application fetches movie data using the TMDb API. Ensure your API key is correctly set up in the `.env` file for proper data fetching.
- The project utilizes React hooks (useState, useEffect) for managing state and API requests.
- Responsive design is achieved using CSS media queries to ensure a consistent user experience across different devices.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to submit an issue or a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Feel free to customize this README file further based on specific project details or additional instructions you want to include. Adjust the sections as necessary to fit the specifics of your Movie Data App project.