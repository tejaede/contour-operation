describe('Worker Service', () => {
  beforeEach((done) => {
     done();        
  });
  describe('MessageService', () => {
      it('it should load main-worker.mjson', (done) => {


        

        importScripts('./../../main.js');



        done();
      });
  });
});