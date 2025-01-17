const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const asyncError = require('../utils/wraperr.js');
const { isloggedin,isAuther  } = require('../middlewares/authMiddleware');

router.post('/' ,isloggedin,asyncError( async (req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);

    const {rating , comment} = req.body;
    const newData = {
        rating : rating,
        comment:comment,
        auther:req.user._id,
    }
    const newReview = new Review(newData);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'You have successfully created the review.');
    res.redirect(`/listing/${req.params.id}`);
}));

router.delete('/:review_id',isloggedin , isAuther , asyncError(async(req,res)=>{
    const {id , review_id} = req.params;
    await Listing.updateOne(
        { _id: id },  
        { $pull: { reviews: review_id} } 
    );
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'You have successfully deleted the review.');
    res.redirect(`/listing/${id}`);
}));

module.exports = router;