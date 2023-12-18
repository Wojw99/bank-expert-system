const sqlite3 = require('sqlite3').verbose()
const strings = require('./strings')
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
            let user = {
                username: username,
                password: password,
                role: strings.userRole
              }
              database.users.push(user)
        }
    )
}

database.removeUser = function(username) {
    db.run(
        'DELETE FROM users WHERE username = ?',
        [username],
        (error) => {
            if(error) {
                return console.error(error.message);
            }
            console.log(`User ${username} has been removed`);
            database.users = database.users.filter(user => user.username !== username);

        }
    );
};

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

database.users = database.getAllUsers()

database.getAllUsersCallback = function(callback) {
    db.all('SELECT * FROM users', [], (error, rows) => {
            if (error) {
                callback(error, null)
                return;
            }

            let users = []

            rows.forEach(row => {
                users.push(row)
            })
            callback(null, users)

            return users
        }
    );
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

database.updateParameters = function(hyperparameters) {
    db.run(
        'REPLACE INTO parameters (id, random_state, n_estimators, max_depth, min_samples_split, min_samples_leaf, accuracy) VALUES (1, ?, ?, ?, ?, ?, ?)',
        [
            hyperparameters["random_state"],
            hyperparameters["n_estimators"],
            hyperparameters["max_depth"],
            hyperparameters["min_samples_split"],
            hyperparameters["min_samples_leaf"],
            hyperparameters["accuracy"]
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