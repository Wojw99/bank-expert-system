const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /api/endpoint', () => {
  it('should return status 404', (done) => {
    chai.request(app)
      .get('/api/endpoint')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
