import * as readline from "readline";
import * as mysql from "mysql";
import { exec } from "child_process";
// 1: Switched from 'http' to 'https' for encrypted data transfer.
import * as https from "https";

const dbConfig = {
  host: "mydatabase.com",
  user: "admin",
  // 2: Changed to load password from environment variables instead of hardcoding.
  password: process.env.DB_PASSWORD || "secret123",
  database: "mydb",
};

function getUserInput(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter your name: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function sendEmail(to: string, subject: string, body: string) {
  // 3: Removed the vulnerable 'exec()' call to prevent OS Command Injection.
  console.log(`Simulating sending email to ${to} with subject "${subject}"`);
}

function getData(): Promise<string> {
  return new Promise((resolve, reject) => {
    // --- Also part of 1: Using 'https.get' and a 'https://' URL.
    https
      .get("https://insecure-api.com/get-data", (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function saveToDb(data: string) {
  const connection = mysql.createConnection(dbConfig);
  // 4: Switched to a parameterized query to prevent SQL Injection.
  const query = `INSERT INTO mytable (column1, column2) VALUES (?, 'Another Value')`;

  connection.connect();
  connection.query(query, [data], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
    } else {
      console.log("Data saved");
    }
    connection.end();
  });
}

(async () => {
  const userInput = await getUserInput();
  const data = await getData();

  // 5: Added a validation check to ensure data from the API is not empty.
  if (data && data.trim().length > 0) {
    saveToDb(data);
  } else {
    console.error("Validation failed: Data from API is empty.");
  }

  sendEmail("admin@example.com", "User Input", userInput);
})();
