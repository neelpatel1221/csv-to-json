import {Pool} from 'pg'
import dotenv from "dotenv";
import { User } from '../types/User';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log any notices or errors from connected clients
pool.on("connect", (client) => {
  client.on("notice", (msg) => console.log("NOTICE:", msg));
  client.on("error", (err) => console.error("Client error:", err));
});

// Handle pool-level errors (such as idle client errors)

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1); // or handle gracefully
});

// shutdown the pool when the process receives a termination signal (e.g., Ctrl+C)

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await pool.end();
  process.exit(0);
});


// Function to create the 'users' table if it doesn't exist

export async function createUsersTable() {

    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        address JSONB,
        additional_info JSONB
      );
    `;

  try {
    await pool.query(query);
    console.log("Users table is ready");
  } catch (err) {
    console.error("Failed to create users table:", err);
  }
}

// Function to insert an array of users into the 'users' table in batches of 1000
export async function insertUsers(users: User[]){
    const client = await pool.connect();
    const batchSize = 1000
    try {
      await client.query("BEGIN"); // Start transaction
      for (let i = 0; i < users.length; i += batchSize) {
        const chunk = users.slice(i, i + batchSize);

        const values: any = [];
        const placeholders: string[] = [];

        //  Prepare placeholders and values for the batch insert
        //  Each user will have 4 values (name, age, address, additional_info)
        //  The placeholders will be in the format ($1, $2, $3, $4), ($5, $6, $7, $8), etc.
        // The values will be in the format (name1, age1, address1, additional_info1), (name2, age2, address2, additional_info2), etc.

        chunk.forEach((user, idx) => {
          const baseIndex = idx * 4;
          placeholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
              baseIndex + 4
            })`
          );
          values.push(user.name, user.age, user.address, user.additional_info);
        });

        const query = `INSERT INTO users (name, age, address, additional_info) VALUES 
            ${placeholders.join(", ")}`;

        await client.query(query, values);
      }
      await client.query("COMMIT"); // Commit transaction if all inserts succeed
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK"); // Rollback transaction on error
    }
    finally{
      client.release(); // Release DB connection
    }
}

// Function to calculate and print age group distribution statistics

export async function printAgeDistribution() {
  const client = await pool.connect();

  try {
    // Query to count users in different age groups
    // The query uses conditional aggregation to count users in different age groups

    const query = `
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE age < 20) AS age_lt_20,
          COUNT(*) FILTER (WHERE age BETWEEN 20 AND 40) AS age_20_40,
          COUNT(*) FILTER (WHERE age > 40 AND age <= 60) AS age_40_60,
          COUNT(*) FILTER (WHERE age > 60) AS age_gt_60
        FROM users;
      `;

    const result = await client.query(query);
    const row = result.rows[0];

    const total = parseInt(row.total, 10);
    const ageGroups = {
      "< 20": parseInt(row.age_lt_20, 10),
      "20 to 40": parseInt(row.age_20_40, 10),
      "40 to 60": parseInt(row.age_40_60, 10),
      "> 60": parseInt(row.age_gt_60, 10),
    };

    // Calculate and format age group percentages
    const ageGroupPercentages = Object.entries(ageGroups).map(
      ([group, count]) => {
        const percentage = total === 0 ? 0 : ((count / total) * 100).toFixed(2);
        return {
          "Age Group": group,
          Count: count,
          Percentage: `${percentage}%`,
        };
      }
    );
    
    // Print results in table forma
    console.table(ageGroupPercentages);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}
  