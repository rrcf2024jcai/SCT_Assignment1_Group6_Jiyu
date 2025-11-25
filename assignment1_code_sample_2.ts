import * as readline from 'readline';
import * as mysql from 'mysql';
import { exec } from 'child_process';
import * as https from 'https';

const dbConfig = {
    host: 'mydatabase.com',
    user: 'admin',
    password: process.env.DB_PASSWORD || 'secret123',
    database: 'mydb'
};

function getUserInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter your name: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

function sendEmail(to: string, subject: string, body: string) {
    console.log(`Simulating sending email to ${to} with subject "${subject}"`);
}

function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get('https://insecure-api.com/get-data', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function saveToDb(data: string) {
    const connection = mysql.createConnection(dbConfig);
    const query = `INSERT INTO mytable (column1, column2) VALUES (?, 'Another Value')`;

    connection.connect();
    connection.query(query, [data], (error, results) => { ... });
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Data saved');
        }
        connection.end();
    });
}

(async () => {
    const userInput = await getUserInput();
    const data = await getData();
    
    if (data && data.trim().length > 0) {
        saveToDb(data);
    } else {
        console.error("Validation failed: Data from API is empty.");
    }
    
    sendEmail('admin@example.com', 'User Input', userInput);
})();