const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.db')

database = {};

database.testDatabase = function() {
    this.addUser('admin123', 'admin', 'admin') 
    this.addUser('user123', 'user', 'user') 
    console.log(this.getAllUsers())
}

database.addUser = function(password, username, role) {
    db.run(
        'INSERT INTO users (password, username, role) VALUES (?, ?, ?)', 
        password,
        username,
        role, 
        (error) => {
            if(error) {
                return console.error(error.message)
            }
            console.log(`A new user has been added`)
        }
        )
}

database.getAllUsers = function() {
    let users = []

    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach(row => {
            users.push(row)
        });
    });

    return users
}

database.logAllUsers = function() {
    console.log('- - - Users: - - -')
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach(row => {
            console.log(row);
        });
    });
    console.log('- - - - - - - - - - -')
}

database.updateParameters = function(random_state,
    n_estimators,
    max_depth,
    min_samples_split,
    min_samples_leaf) {
    console.log("STORE", [
        random_state,
        n_estimators,
        max_depth,
        min_samples_split,
        min_samples_leaf
    ])
    db.run(
        'REPLACE INTO parameters (id, random_state, n_estimators, max_depth, min_samples_split, min_samples_leaf) VALUES (1, ?, ?, ?, ?, ?)',
        [
            random_state,
            n_estimators,
            max_depth,
            min_samples_split,
            min_samples_leaf
        ],
        (error) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('Parameters stored successfully');
        }
    );
}

database.getParameters = function(callback) {
    db.get(
        'SELECT * FROM parameters WHERE id = 1',
        [],
        (error, row) => {
            if (error) {
                callback(error, null)
                return;
            }
    
            if (row) {
                console.log('Retrieved parameters:', row);
                callback(null, row)
            } else {
                console.log('No hyperparameters found.');
                callback(null, null)
            }
        }
    );
}

module.exports = database