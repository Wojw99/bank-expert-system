const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const strings = require('../strings');
const database = require('../database');
const expect = chai.expect;


describe('Database', () => {
    const username = 'testUsername8'
    const password = 'testPassword8'

    describe('addUser', () => {
        it('db should has new member', () => {
            database.addUser(username, password, strings.userRole)
            database.getAllUsersCallback((users) => {
                expect(users).to.have.members([
                    {
                        'username' : username,
                        'password' : password,
                    }
                ]);
            })
          });
    });

    describe('removeUser', () => {
        it('db should not has old member', () => {
            database.removeUser(username)
            database.getAllUsersCallback((users) => {
                expect(users).not.to.have.members([
                    {
                        'username' : username,
                        'password' : password,
                    }
                ]);
            })
        });
    });

    describe('updateParameters', () => {
        it('db should has updated parameters', () => {
            var hyperparameters = {
                random_state : 6,
                n_estimators : 6,
                max_depth : 6,
                min_samples_split : 6,
                min_samples_leaf : 6,
                accuracy: 0.666
            }
            database.updateParameters(hyperparameters)
            database.getParameters((error, paramsActual) => {
                expect(paramsActual).to.equal(hyperparameters)
            })
        });
    });

    describe('updateParameters', () => {
        it('db should has wrong parameters', () => {
            var hyperparameters = {
                random_state : 6,
                n_estimators : 6,
                max_depth : 6,
                min_samples_split : 6,
                min_samples_leaf : 6,
                accuracy: 0.666
            }
            database.updateParameters(hyperparameters)
            database.getParameters((error, paramsActual) => {
                var hyperparametersWrong = {
                    random_state : 6,
                    n_estimators : 6,
                    max_depth : 6,
                    min_samples_split : 6,
                    min_samples_leaf : 6,
                    accuracy: 0.777
                }
                expect(paramsActual).not.to.equal(hyperparametersWrong)
            })
        });
    });
});

