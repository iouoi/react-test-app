const request = require('supertest');
// Start server
const app = require('./../server/server.js');

const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;
const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

describe('Route integration', () => {
  describe('/', () => {
    it('responds with 200 status and text/html content type', done => {
      request(HOST)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });

  describe('POST', () => {
    it('verify route responds to valid request with 200 status and application/json content type', done => {
      request(HOST)
        .post('/verify')
        .set('Content-Type', 'application/json')
        .send({})
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('check verify route\'s response for no session', done => {
      request(HOST)
        .post('/verify')
        .set('Content-Type', 'application/json')
        .send({})
        .end(function(err, res) {
          if(err) return done(err);
<<<<<<< HEAD
          console.log(res.body);
=======
>>>>>>> login
          done();
        });
    });

    it('post request to signup works', done => {
      request(HOST)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send({
          username: 'jared',
          password: 'weiss'
        })
        // .expect('Content-Type', /application\/json/)
<<<<<<< HEAD
        .expect(200, done)
=======
        .expect(200)
>>>>>>> login
        .end(function(err, res) {
          if(err) return done(err);
          console.log(res.body);
          done();
        })
    });
  });
});

//     it('ZERO responds to a valid request with the item that was created in the DB', done => {
//       request(HOST)
//        .post('/detials')
//        .set('Content-Type', 'application/json')
//        .send({
//         id: 'hi',
//         details: 'yo wassuuppppp'
//        })
//        .end(function(err, res) {
//          if(err) return done(err);
//          console.log(res.body);
//          done();
//        })
//     });

//   describe('POST', () => {
//     it('ONE responds to valid request with 200 status and application/json content type', done => {
//       request(HOST)
//        .post('/load-photos')
//        .set('Content-Type', 'application/json')
//        .send({})
//        .expect('Content-Type', /application\/json/)
//        .expect(200, done);
//     });

//     it('ONE responds to a valid request with the item that was created in the DB', done => {
//       request(HOST)
//        .post('/load-photos')
//        .set('Content-Type', 'application/json')
//        .send({})
//        .end(function(err, res) {
//          if(err) return done(err);
//          done();
//        })
//     });
//     it('TWO responds to valid request with 200 status and application/json content type', done => {
//       request(HOST)
//        .post('/like')
//        .set('Content-Type', 'application/json')
//        .send({ 
//           id: 'hello',
//           likes: 4
//         })
//        .expect('Content-Type', /application\/json/)
//        .expect(200, done);
//     });

//     it('TWO responds to a valid request with the item that was created in the DB', done => {
//       const post = { 
//         id: 'hello',
//         likes: 4
//       };
//       request(HOST)
//        .post('/photo')
//        .set('Content-Type', 'application/json')
//        .send(post)
//        .end(function(err, res) {
//          if(err) return done(err);
//          expect(res.body.id).to.equal(post.id)
//          expect(res.body.img).to.equal(post.img)
//          done();
//        })
//     });

//     it('THREE responds to valid request with 200 status and application/json content type', done => {
//       request(HOST)
//        .post('/photo')
//        .set('Content-Type', 'application/json')
//        .send({ 
//           id: 'hello',
//           img: 'http://www.google.com'
//         })
//        .expect('Content-Type', /application\/json/)
//        .expect(200, done);
//     });

//     it('THREE responds to a valid request with the item that was created in the DB', done => {
//       const post = { 
//         id: 'yoooooo',
//         img: 'wikipedia.com'
//       };
//       request(HOST)
//        .post('/photo')
//        .set('Content-Type', 'application/json')
//        .send(post)
//        .end(function(err, res) {
//          if(err) return done(err);
//          expect(res.body.id).to.equal(post.id)
//          expect(res.body.img).to.equal(post.img)
//          done();
//        })
//      });
//     });
//   });