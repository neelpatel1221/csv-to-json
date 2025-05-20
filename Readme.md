# CSV to JSON Converter API

This project provides an Express.js API to convert a CSV file of user data into JSON, store it in a PostgreSQL database, and print age distribution statistics.

## Features
- Reads user data from a CSV file
- Converts CSV data to nested JSON objects
- Inserts user records into a PostgreSQL database
- Prints age group distribution statistics to the console
- Exposes an API endpoint to trigger the process and return the JSON data

## Setup Instructions

1. **Clone the repository** and install dependencies:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   npm install
   ```

2. **Configure Environment Variables:**
   - Create a `.env` file in the root directory.
   - All the environment variables and its values are present in env.txt file
   - Add the following variables:
     ```env
     PORT
     DATABASE_URL
     CSV_PATH
     ```

3. **Start PostgreSQL** and ensure your database is running.

4. **Run the Application:**
   ```sh
   npm run dev
   ```
   The server will start on port 3000 if not provided in env.

5. **Use the API:**
   - Send a GET request to `http://localhost:3000/csv_to_json`
   - The endpoint will:
     - Parse the CSV file
     - Insert users into the database
     - Print age group statistics to the console
     - Return the parsed JSON data as the response

## File Structure
- `src/app.ts` - Main Express app
- `src/routes/csvToJsonConverterRouter.ts` - API route for CSV to JSON conversion
- `src/helpers/commonHelper.ts` - CSV parsing logic
- `src/config/db.ts` - Database connection and queries
- `src/data/usersData.csv` - Sample CSV data(given in challenge)
- `src/data/enhancedUsersData.csv` - Sample CSV data(with more nested objects)
- `src/types/User.ts` - User type definitions

## Notes
- I have asumed it is a small project focused on performance and simplicity. For this reason, I’ve opted not to use an ORM. Instead, the pg package is used to handle database operations directly. 
-  That said, for larger applications with multiple modules, I would consider using an ORM to define models and establish associations for better structure and maintainability.
- The users table is created automatically if it does not exist.
- Batch inserts are used for efficiency.
- Age distribution is printed in the console after each import.

---

**Author:**
- Neel Patel
