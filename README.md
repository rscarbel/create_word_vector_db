This is a script used for populating postgres table with 400,000 words and their vector values (including special characters).

To make this work, first download the [GloVe](https://nlp.stanford.edu/projects/glove/) word vectors. I used the wikipedia 300-D vector file, but you can use whichever you want. Then, run the following command to create a table in your postgres database:

create a table with a column for the word and a column for the vector points. The table should look like this:
```sql
CREATE TABLE word_vectors (
word VARCHAR PRIMARY KEY,
vector FLOAT[] NOT NULL
);
```

Move the `glove.6B.50d.txt` file into the base directory, and rename it to `word_vector.txt`.

Install the npm dependencies with `npm install`.

Create a .env file with the following contents:

```
PGHOST=your_host
PGUSER=your_user
PGPORT=your_port
PGDATABASE=words
PGPASSWORD=your_password
```

Replace the values with your postgres host, user, port, and database.

e.g. this is mine:
  
```
PGUSER=postgres
PGHOST=localhost
PGDATABASE=words
PGPORT=5432
PGPASSWORD=postgres
```

You can add the password if you have one, but be sure to modify the `index.js` file to include it.

Then, run the script with `node index.js` or `npm start`. It might take a while to run, but it will populate the table with all the words and their vectors.

After it is done, if you want you can additionally create a table for the estimated hash value of each word. To do this, run the following command:

```sql
CREATE TABLE word_tokens (
  word VARCHAR NOT NULL,
  token BIGINT NOT NULL,
  PRIMARY KEY (word)
);
```
  
  Then, run the following command to populate the table:
  
  ```shell
  node createTokenTable.js
  ```