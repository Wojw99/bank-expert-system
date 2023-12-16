const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.db')

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS parameters");

    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, password TEXT, username TEXT, role TEXT)");

    console.log('Table "users" created successfully.');

    db.run(`
  CREATE TABLE IF NOT EXISTS parameters (
    id INTEGER PRIMARY KEY,
    random_state INTEGER,
    n_estimators INTEGER,
    max_depth INTEGER,
    min_samples_split INTEGER,
    min_samples_leaf INTEGER
  )
`);

var hyperparameters = {
  random_state : 42,
  n_estimators : 60,
  max_depth : "",
  min_samples_split : "",
  min_samples_leaf : ""
}

db.run(
  'INSERT OR REPLACE INTO parameters (id, random_state, n_estimators, max_depth, min_samples_split, min_samples_leaf) VALUES (1, ?, ?, ?, ?, ?)',
  [
      hyperparameters.random_state,
      hyperparameters.n_estimators,
      hyperparameters.max_depth,
      hyperparameters.min_samples_split,
      hyperparameters.min_samples_leaf
  ],
);

    console.log('Table "parameters" created successfully.');
});

db.close();