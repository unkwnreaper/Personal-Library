/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

// mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const Schema = mongoose.Schema;
// Schema setup
const librarySchema = new Schema({
  comments: [{type: String}],
  title: {type: String, required: true},
  commentcount: {type: Number, required: true}
});
// Model setup
const libraryModel = mongoose.model('libraryModel', librarySchema);

module.exports = librarySchema;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      var library = await libraryModel.find({}).select('title comments commentcount');
      res.json(library);
    })
    
    .post(async function (req, res){
      if (!req.body.title) res.json("missing required field title");
      else {
        let title = req.body.title;
        //response will contain new book object including atleast _id and title
        var book = new libraryModel({title: title, commentcount: 0});
        await book.save();
        res.json(book);
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        //await libraryModel.deleteMany({});
        res.json("complete delete successful");
      } catch (error) {
        res.json("could not delete");
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        var book = await libraryModel.findById(bookid);
        if(!book) res.json("no book exists");
        else res.json(book);
      } catch (error) {
        res.json("no book exists");
      }
    })
    
    .post(async function(req, res){
      if (!req.body.comment) res.json("missing required field comment");
      else {
        let bookid = req.params.id;
        try {
          var data = await libraryModel.findById(bookid);
        } catch (error) {
          res.json("no book exists");
        }
        if(data) {
          let _commentCount = data.commentcount + 1;

          //json res format same as .get
          try {
            var book = await libraryModel.findByIdAndUpdate(bookid, { $push: { comments: [req.body.comment] }, commentcount: _commentCount} , {new: true});
            res.json({_id: book._id, title: book.title, comments: book.comments, commentcount: book.commentcount});
          } catch (error) {
            res.json("no book exists");
          }
        }
        else res.json("no book exists");
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        var result = await libraryModel.findByIdAndDelete(bookid);
        if (!result) res.json("no book exists");
        else res.json("delete successful");
      } catch (error) {
        res.json("no book exists");
      }
    });
  
};
