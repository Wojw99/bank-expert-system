const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./database.db')

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS parameters");

    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, password TEXT, username TEXT, role TEXT, salt TEXT)");

    const initialUsers = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'user123', role: 'user' },
    ];
  
    const insertUser = db.prepare("INSERT INTO users (username, password, role, salt) VALUES (?, ?, ?, ?)");
  
    initialUsers.forEach((user) => {
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      insertUser.run(user.username, hashedPassword, user.role, salt);
    });
  
    insertUser.finalize();

    console.log('Table "users" created successfully.');

    db.run(`
      CREATE TABLE IF NOT EXISTS parameters (
      id INTEGER PRIMARY KEY,
      random_state INTEGER,
      n_estimators INTEGER,
      max_depth INTEGER,
      min_samples_split INTEGER,
      min_samples_leaf INTEGER,
      accuracy REAL
    )`);

var hyperparameters = {
  random_state : 42,
  n_estimators : 55,
  max_depth : 8,
  min_samples_split : 4,
  min_samples_leaf : 4,
  accuracy: 0.868
}

db.run(
  'INSERT OR REPLACE INTO parameters (id, random_state, n_estimators, max_depth, min_samples_split, min_samples_leaf, accuracy) VALUES (1, ?, ?, ?, ?, ?, ?)',
  [
      hyperparameters.random_state,
      hyperparameters.n_estimators,
      hyperparameters.max_depth,
      hyperparameters.min_samples_split,
      hyperparameters.min_samples_leaf,
      hyperparameters.accuracy
  ],
);
    console.log('Table "parameters" created successfully.');
});

db.close();