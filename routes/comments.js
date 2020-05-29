var express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router({mergeParams: true});
   
//Calling middleware
var middlewareObj = require('../middleware');
   
//calling Models
var Hotel = require('../models/hotels');
var Comment = require('../models/comments');

router.get('/new', middlewareObj.isLoggedIn, function(req, res){
   Hotel.findById(req.params.id, function(err, foundHotel){
      if(err){throw(err)}
      else {
         res.render('comments/add', {hotel: foundHotel});
      }
   });
});

router.post('/', middlewareObj.isLoggedIn, function(req, res){
  Hotel.findById(req.params.id, function(err, foundHotel){
    if(err){throw(err)}
    else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){throw(err)}
        else {
        
          foundHotel.comments.push(comment);
          foundHotel.save();
          res.redirect('/hotels/' + req.params.id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, function(req, res){
   Hotel.findById(req.params.id, function(err, foundHotel){
      if(err){throw(err)}
      else {
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){throw(err)}
            else {
               res.render('comments/edit', {comment: foundComment, hotel: foundHotel});
            }
         });
      }
   });
   
});

router.put('/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){
   
   var text = req.body.text;
   
   var updatedComment = {text: text};
   Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, function(err, updatedComment){
      if(err){throw(err)}
      else {
         res.redirect('/hotels/' + req.params.id);
      }
   });
   
});

router.delete('/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){throw(err)}
      else {
         res.redirect('/hotels/' + req.params.id);
      }
   });
});

//router.post('/', function(req, res){
//   Hotel.findById(req.params.id, function(err, foundHotel){
//      if(err){throw(err)}
//      else {
//         Comment.create(req.body.text, function(err, newComment){
//            if(err){throw(err)}
//            else {
//               foundHotel.comments.push(newComment);
//               foundHotel.save();
//               res.redirect('/hotels/' + req.params.id);
//            }
//         });
//      }
//   });
//});

module.exports = router;