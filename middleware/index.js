var Hotel = require('../models/hotels');
var Comment = require('../models/comments');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
   if(req.isAuthenticated()){
      return next();
   } else {
      req.flash('error', 'You need to logged in to do that.');
      res.redirect('/login')
   }
}

middlewareObj.checkHotelOwnership = function(req, res, next){
   if(req.isAuthenticated()){
      Hotel.findById(req.params.id, function(err, foundHotel){
         if(err){
            console.log(err);
            res.redirect('back');
         } else {
            if(foundHotel.author.id.equals(req.user._id)){
               next();
            } else {
               req.flash('error', 'You dont have permission to do that.');
               res.redirect('back');
            }
         }
      });
   } else {
      req.flash('error', 'You need to logged in to do that.');
      res.redirect('back');
   }
}

middlewareObj.checkCommentOwnership = function(req, res , next){
   if(req.isAuthenticated()){
      Comment.findById(req.params.id, function(err, foundComment){
         if(err){
            console.log(err);
            res.redirect('back');
         } else {
            if(foundComment.author.id.equals(req.user._id)){
               next();
            } else {
               req.flash('error', 'You dont have permission to do that.');
               res.redirect('back');
            }
         }
      })
   } else {
      req.flash('error', 'You need to logged in to do that.');
      res.redirect('back');
   }
}

module.exports = middlewareObj;