/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');
const routes = require('../routes/api');
const librarySchema = routes.librarySchema;
const libraryModel = mongoose.model('libraryModel', librarySchema);

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  *//*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'Response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'test'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'test', 'Response should contain the title');
          assert.property(res.body, 'commentcount', 'Book should contain commentcount');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '"missing required field title"', 'Response should be an error');
          done();
        });
      });

    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      

    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/1234')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '"no book exists"', 'Response should be an error');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', function(done){
        var book = new libraryModel({title: 'test', commentcount: 0});
        book.save();
        setTimeout(() => {
        chai.request(server)
        .get(`/api/books/${book._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body._id, book._id.toString(), 'Response should have correct id');
          assert.property(res.body, 'commentcount', 'Book should contain commentcount');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          assert.equal(res.body.title, 'test', 'Book should have correct title');
          done();
        });
      }, 100);
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        var book = new libraryModel({title: 'test', commentcount: 0});
        book.save();
        setTimeout(() => {
        chai.request(server)
        .post(`/api/books/${book._id}`)
        .send({comment: 'comment to test'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body._id, book._id.toString(), 'Response should have correct id');
          assert.property(res.body, 'commentcount', 'Book should contain commentcount');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          assert.equal(res.body.title, 'test', 'Book should have correct title');
          assert.property(res.body, 'comments', 'Book should have comments');
          assert.equal(res.body.commentcount, 1, 'Book should have correct comment count');
          assert.include(res.body.comments, 'comment to test', 'Book should include correct comment');
          done();
        });
      }, 100);
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        var book = new libraryModel({title: 'test', commentcount: 0});
        book.save();
        setTimeout(() => {
        chai.request(server)
        .post(`/api/books/${book._id}`)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '"missing required field comment"', 'Response should be an error');
          done();
        });
      }, 100);
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/5f665eb46e296f6b9b6a504d')
        .send({comment: 'comment to test'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '"no book exists"', 'Response should be an error');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        var book = new libraryModel({title: 'test', commentcount: 0});
        book.save();
        setTimeout(() => {
        chai.request(server)
        .delete(`/api/books/${book._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '"delete successful"', 'Response should be successful');
          done();
        });
      }, 100);
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/1234')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '"no book exists"', 'Response should be successful');
          done();
        });
      });

    });

  });

});