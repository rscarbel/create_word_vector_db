This is a script used for populating postgres table with 400,000 words and their vector values (including special characters).

To make this work, first download the [GloVe](https://nlp.stanford.edu/projects/glove/) word vectors. I used the 6B vectors, but you can use whichever you want. Then, run the following command to create a table in your postgres database:

```sql
CREATE TABLE word_vectors (
  word VARCHAR NOT NULL,
  vector1 FLOAT NOT NULL,
  vector2 FLOAT NOT NULL,
  vector3 FLOAT NOT NULL,
  vector4 FLOAT NOT NULL,
  vector5 FLOAT NOT NULL,
  vector6 FLOAT NOT NULL,
  vector7 FLOAT NOT NULL,
  vector8 FLOAT NOT NULL,
  vector9 FLOAT NOT NULL,
  vector10 FLOAT NOT NULL,
  vector11 FLOAT NOT NULL,
  vector12 FLOAT NOT NULL,
  vector13 FLOAT NOT NULL,
  vector14 FLOAT NOT NULL,
  vector15 FLOAT NOT NULL,
  vector16 FLOAT NOT NULL,
  vector17 FLOAT NOT NULL,
  vector18 FLOAT NOT NULL,
  vector19 FLOAT NOT NULL,
  vector20 FLOAT NOT NULL,
  vector21 FLOAT NOT NULL,
  vector22 FLOAT NOT NULL,
  vector23 FLOAT NOT NULL,
  vector24 FLOAT NOT NULL,
  vector25 FLOAT NOT NULL,
  vector26 FLOAT NOT NULL,
  vector27 FLOAT NOT NULL,
  vector28 FLOAT NOT NULL,
  vector29 FLOAT NOT NULL,
  vector30 FLOAT NOT NULL,
  vector31 FLOAT NOT NULL,
  vector32 FLOAT NOT NULL,
  vector33 FLOAT NOT NULL,
  vector34 FLOAT NOT NULL,
  vector35 FLOAT NOT NULL,
  vector36 FLOAT NOT NULL,
  vector37 FLOAT NOT NULL,
  vector38 FLOAT NOT NULL,
  vector39 FLOAT NOT NULL,
  vector40 FLOAT NOT NULL,
  vector41 FLOAT NOT NULL,
  vector42 FLOAT NOT NULL,
  vector43 FLOAT NOT NULL,
  vector44 FLOAT NOT NULL,
  vector45 FLOAT NOT NULL,
  vector46 FLOAT NOT NULL,
  vector47 FLOAT NOT NULL,
  vector48 FLOAT NOT NULL,
  vector49 FLOAT NOT NULL,
  vector50 FLOAT NOT NULL
);

CREATE INDEX word_index ON word_vectors (word);

```

Move the `glove.6B.50d.txt` file into the base directory, and rename it to `word_vector.txt`.

Install the npm dependencies with `npm install`.

Create a .env file with the following contents:

```
PGHOST=your_host
PGUSER=your_user
PGPORT=your_port
PGDATABASE=words
```

Replace the values with your postgres host, user, port, and database.

e.g. this is mine:
  
```
PGUSER=postgres
PGHOST=localhost
PGDATABASE=words
PGPORT=5432
```

You can add the password if you have one, but be sure to modify the `index.js` file to include it.

Then, run the script with `node index.js` or `npm start`. It might take a while to run, but it will populate the table with all the words and their vectors.

After it is done, if you want you can additionally create a table for the average vector values of each word. This is useful for when you want to find the average vector value of a sentence. To do this, run the following command:

```sql
CREATE TABLE word_tokens (
  word VARCHAR NOT NULL,
  token FLOAT NOT NULL
);

CREATE INDEX idx_word_tokens_word ON word_tokens (word);

INSERT INTO word_tokens (word, token)
SELECT word, (
  (vector1 + vector2 + vector3 + vector4 + vector5 + vector6 + vector7 + vector8 + vector9 + vector10 +
  vector11 + vector12 + vector13 + vector14 + vector15 + vector16 + vector17 + vector18 + vector19 + vector20 +
  vector21 + vector22 + vector23 + vector24 + vector25 + vector26 + vector27 + vector28 + vector29 + vector30 +
  vector31 + vector32 + vector33 + vector34 + vector35 + vector36 + vector37 + vector38 + vector39 + vector40 +
  vector41 + vector42 + vector43 + vector44 + vector45 + vector46 + vector47 + vector48 + vector49 + vector50) / 50
) AS token
FROM word_vectors;
```