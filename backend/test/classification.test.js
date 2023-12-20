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

    describe('accept relearning', () => {
        it(`relearning should be accepted`, async () => {
            const params = {
                "random_state" : 42,
                "n_estimators" : 60,
                "max_depth" : 66,
                "min_samples_split" : 5,
                "min_samples_leaf" : 1
            }

            const resp1 = await chai.request(app)
            .post('/classification/relearn')
            .set('Authorization', `Bearer ${token}`)
            .send(params)

            const resp2 = await chai.request(app)
            .post('/classification/acceptRelearning')
            .set('Authorization', `Bearer ${token}`)
            .send(params)

            expect(resp1).to.have.status(200);
            expect(resp2).to.have.status(200);
        });
    });

    describe('classification', () => {
        it(`should return 1`, (done) => {
            const params = {
                "age" : 31,
                "job" : "technician",
                "balance" : 26,
                "day" : 18,
                "month" : "sep",
                "duration" : 419,
                "education" : "tertiary"
            }

            chai.request(app)
            .get('/classification/classify')
            .set('Authorization', `Bearer ${token}`)
            .query(params)
            .end((err, resp) => {
                const prediction = resp.body.prediction
                
                expect(prediction).to.deep.equal([1]);
                done()
            })
        });
    });

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


    // describe('big test', () => {
    //     it(`relearning acceptation should change model classification`, async () => {
    //         const hyperParams1 = {
    //             "random_state" : 42,
    //             "n_estimators" : 60,
    //             "max_depth" : 66,
    //             "min_samples_split" : 5,
    //             "min_samples_leaf" : 1
    //         }

    //         const resp1 = await chai.request(app)
    //         .post('/classification/relearn')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(hyperParams1)

    //         const resp2 = await chai.request(app)
    //         .post('/classification/acceptRelearning')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(hyperParams1)

    //         const params1 = {
    //             "age" : 31,
    //             "job" : "technician",
    //             "balance" : 26,
    //             "day" : 18,
    //             "month" : "sep",
    //             "duration" : 419,
    //             "education" : "tertiary"
    //         }

    //         const r1 = await chai.request(app)
    //         .get('/classification/classify')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(params1)
    //         const p1 = r1.body.prediction

    //         const hyperParams2 = {
    //             "random_state" : 1,
    //             "n_estimators" : 1,
    //             "max_depth" : 1,
    //             "min_samples_split" : 1,
    //             "min_samples_leaf" : 1
    //         }

    //         await chai.request(app)
    //         .post('/classification/relearn')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(hyperParams2)

    //         await chai.request(app)
    //         .post('/classification/acceptRelearning')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(hyperParams2)

    //         const r2 = await chai.request(app)
    //         .get('/classification/classify')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(params1)
    //         const p2 = r2.body.prediction

    //         expect(p1).not.to.deep.equal(p2);
    //     });
    // })
});

