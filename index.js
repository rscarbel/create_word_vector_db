const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
require("dotenv").config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: "",
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

    const query = `
      INSERT INTO word_vectors (word, ${vectorColumns()})
      VALUES ($1, ${vectorValues.map((_, i) => `$${i + 2}`).join(", ")})
    `;

    try {
      await client.query(query, [word, ...vectorValues]);
    } catch (err) {
      console.error(`Error inserting word "${word}":`, err);
    }
  }

  await client.end();
}

function vectorColumns() {
  return Array.from({ length: 50 }, (_, i) => `vector${i + 1}`).join(", ");
}

main().catch(console.error);
