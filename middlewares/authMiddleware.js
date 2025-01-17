const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const isloggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); 
    }
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/user/login');
};

const toRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next(); 
};


const toCheckOwner = async (req, res, next) => {
    let {id} = req.params;
    let list = await Listing.findById(id);
    if (list.owner.equals(res.locals.userInfo._id)) {
        return next();
    }
    req.flash('error', 'You are not the owner of listing.');
    res.redirect(`/listing/${id}`);
};

const isAuther = async (req, res, next) => {
    let {id , review_id} = req.params;
    let list = await Review.findById(review_id);
    if (list.auther.equals(res.locals.userInfo._id)) {
        return next();
    }
    req.flash('error', 'It is created by you');
    res.redirect(`/listing/${id}`);
};


module.exports = { isloggedin , toRedirect ,toCheckOwner,isAuther };