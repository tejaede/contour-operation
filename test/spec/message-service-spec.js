
var APP_TEST_URL = null;

if (typeof process !== 'undefined') {
  APP_TEST_URL = process.env.APP_TEST_URL;
}

// Default value
APP_TEST_URL = APP_TEST_URL || 'http://localhost:8080';

describe('Message HTTP API', () => {
  beforeEach((done) => {
     done();        
  });
  describe('/GET message', () => {
      it('it should GET all the messages', (done) => {
        chai.request(APP_TEST_URL)
            .get('/api/data')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('root');
                expect(res.body.root).to.be.a('object');
                expect(res.body.root).to.have.property('value');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.be.a('object');
                expect(res.body.message).to.have.property('prototype');
                expect(res.body.message).to.have.property('prototype');
                expect(res.body.message).to.have.property('values');
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('/POST message', () => {
      it('it should not POST a message without pages field', (done) => {
        var message = {
        };
        chai.request(APP_TEST_URL)
            .post('/api/data')
            .send(message)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('root');
                expect(res.body.root).to.be.a('object');
                expect(res.body.root).to.have.property('value');
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('/DELETE message', () => {
      it('it should not DELETE a message without pages field', (done) => {
        var message = {
        };
        chai.request(APP_TEST_URL)
            .delete('/api/data')
            .send(message)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
              done();
            });
      });
  });
});