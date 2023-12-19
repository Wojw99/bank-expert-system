const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const database = require('../database');
const strings = require('../strings');
const expect = chai.expect;

chai.use(chaiHttp);

describe('POST /login', () => {
    it('should return a JWT token on successful login', (done) => {
        chai.request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    })

    it('should return 401 on invalid credentials', (done) => {
        chai.request(app)
          .post('/auth/login')
          .send({ username: 'invalidUser', password: 'invalidPassword' })
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.text).to.equal(strings.invalidCredentials);
            if(err) {
              done(err);
            } else {
              done();
            }
        });
    });

    it('should return a role', (done) => {
      chai.request(app)
      .post('/auth/login')
      .send({ username: 'user', password: 'user123' })
      .end((err, res) => {
        expect(res.body).to.have.property('role');
        done();
      });
    })

    it('should return a role', (done) => {
      chai.request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .end((err, res) => {
        expect(res.body).to.have.property('role');
        done();
      });
    })
})

describe('POST /register', () => {
    const time = new Date()
    const testUser = 'testUser5' + time.toUTCString()
    const testPass = 'testPassword5' + time.toUTCString()

    it('should register a new user and return 201 status', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({ username: testUser, password: testPass })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
  
    it('should return 400 if user already exists', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({ username: testUser, password: testPass })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
  

  describe('token handling', () => {
    it('should get auth token invalid error', (done) => {
      chai.request(app)
      .get('/settings/all')
      .set('Authorization', `Bearer 4454`)
      .end((err, res) => {
        expect(res).to.have.status(403)
        expect(res.text).to.equal(strings.authTokenIvalid);
        done()
      })
    });

    it('should get auth token missing error', (done) => {
      chai.request(app)
      .get('/settings/all')
      .end((err, res) => {
        expect(res).to.have.status(401)
        expect(res.text).to.equal(strings.authTokenMissing);
        done()
      })
    });



    
  });
  