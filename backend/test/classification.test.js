const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const strings = require('../strings');
const config = require('../config');
const database = require('../database');
const classification = require('../routes/classification');
const expect = chai.expect;
const accessTokenSecret = config.accessTokenSecret

describe('Classification', () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ username: 'admin', role: strings.adminRole }, accessTokenSecret, { expiresIn: '1h' });

    describe('relearn', () => {
        it(`accuracies from two relearnings with different params should be not equal`, async () => {
            const params1 = {
                "random_state" : 6,
                "n_estimators" : 6,
                "max_depth" : 6,
                "min_samples_split" : 6,
                "min_samples_leaf" : 6
            }
            const params2 = {
                "random_state" : 7,
                "n_estimators" : 7,
                "max_depth" : 7,
                "min_samples_split" : 7,
                "min_samples_leaf" : 7
            }

            const resp1 = await chai.request(app)
            .post('/classification/relearn')
            .set('Authorization', `Bearer ${token}`)
            .send(params1)

            const resp2 = await chai.request(app)
            .post('/classification/relearn')
            .set('Authorization', `Bearer ${token}`)
            .send(params2)

            const accuracy1 = resp1.body.accuracy
            const accuracy2 = resp2.body.accuracy
            console.log("Testing accuracies: ", accuracy1, accuracy2)

            expect(accuracy1).not.to.equal(accuracy2);
        });
    });

    describe('accept relearning', () => {
        it(`relearning should be accepted`, async () => {
            const params = {
                "random_state" : 8,
                "n_estimators" : 8,
                "max_depth" : 8,
                "min_samples_split" : 8,
                "min_samples_leaf" : 8
            }

            console.log("start requests")

            const resp1 = await chai.request(app)
            .post('/classification/relearn')
            .set('Authorization', `Bearer ${token}`)
            .send(params)

            const resp2 = await chai.request(app)
            .post('/classification/acceptRelearning')
            .set('Authorization', `Bearer ${token}`)
            .send(params)

            const resp3 = chai.request(app)
            .post('/settings/all')
            .set('Authorization', `Bearer ${token}`)
            .send(params)

            console.log("BOOODY", resp3.body)
            expect(params.random_state).to.equal(resp3.body.lastParams.random_state);
        });
    });

    describe('classification', () => {
        it(`should return 1`, async () => {
            const params = {
                "age" : 54,
                "job" : "unknown",
                "balance" : 11,
                "day" : 18,
                "month" : 8,
                "duration" : 48,
                "education" : "primary"
            }

            const resp = await chai.request(app)
            .post('/classification/classify')
            .set('Authorization', `Bearer ${token}`)
            .send(params)
            
            const prediction = resp.body.prediction

            expect(prediction).to.equal(1);
        });
    });

});

