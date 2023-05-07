const { Client } = require("pg");
const fs = require("fs");
const readline = require("readline");
const XXH = require("xxhashjs");
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

  // Prepare query
  const insertQuery = `
    INSERT INTO word_tokens (word, token)
    VALUES ($1, $2);
  `;

  // Initialize XXH64 with a seed value (use any integer value)
  const hashSeed = 0xabcd;

  for await (const line of rl) {
    const [word, ...vectorValues] = line.trim().split(" ");

    try {
      // Hash the vector values
      const hash = XXH.h64();
      for (const vectorValue of vectorValues) {
        hash.update(vectorValue);
      }
      // Convert the hash value to a hexadecimal string
      const hexHash = hash.digest(hashSeed).toString(16);
      // Convert the hexadecimal string to a BigInt and then to a signed 64-bit integer
      const token = BigInt(`0x${hexHash}`) % (2n ** 63n - 1n);

      // Insert word and token into the database
      await client.query(insertQuery, [word, token.toString()]);
    } catch (err) {
      console.error(`Error inserting word "${word}":`, err);
    }
  }

  await client.end();
}

main().catch(console.error);
