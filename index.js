const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
require("dotenv").config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function main() {
  await client.connect();

  const fileStream = fs.createReadStream("./word_vectors.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [word, ...vectorValues] = line.trim().split(" ");

    // Skip words that are not strictly lowercase
    if (!/^[a-z]+$/.test(word)) continue;

    const query = `
      INSERT INTO word_vectors (word, vector)
      VALUES ($1, ARRAY[${vectorValues
        .map((_, i) => `$${i + 2}`)
        .join(", ")}]::float[])
    `;

    try {
      await client.query(query, [word, ...vectorValues.map(parseFloat)]);
    } catch (err) {
      console.error(`Error inserting word "${word}":`, err);
    }
  }

  await client.end();
}

main().catch(console.error);
