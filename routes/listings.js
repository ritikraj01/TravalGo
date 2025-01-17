const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const asyncError = require('../utils/wraperr.js');
const { isloggedin , toCheckOwner } = require('../middlewares/authMiddleware');

router.delete('/:id',isloggedin,toCheckOwner, asyncError(async(req,res)=>{
    const {id} = req.params;
    const review =  await Listing.findById(id);
    await Review.deleteMany({ _id: { $in: review.reviews } });
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted the list!');
    res.redirect('/listing');
}));

router.get('/add',isloggedin, (req, res) => {
    res.render('listings/addNew');
});

router.get('/edit/:id',isloggedin,toCheckOwner, asyncError(async (req, res) => {
    const {id} = req.params;
    const data = await Listing.findById(id);
    res.render('listings/editItem',{data});
}));

router.get('/', asyncError(async (req, res) => {
    const data = await Listing.find({});
    res.render('listings/home',{data});
}));

router.get('/:id',asyncError( async (req, res) => {
    const {id} = req.params;
    const data = await Listing.findById(id).populate(
        {
            path:"reviews",
            populate:{path:"auther"}
        }).populate("owner").exec();
    //console.log(data);
    res.render('listings/item',{data});
}));


router.patch('/edit/:id', asyncError(async (req, res) => {
    const {id} = req.params;
    const {img} = req.body;
    await Listing.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );
    await Listing.findByIdAndUpdate(
        id,
        { image: {filename: "listingimage",url:img}}
    );
    req.flash('success', 'You have successfully edited the list!');
    res.redirect('/listing');
}));

router.post('/submit-list' ,asyncError( async (req,res)=>{
    const {title , description , img ,price,location,country} = req.body;
    const newData = {
        title:title , 
        description:description ,
         price:price,
         location:location,
         country:country,
         owner:req.user,
    }
    if (img) {
        newData.image ={filename: "listingimage",url:img};
    }
    const newList = new Listing(newData);
    await newList.save();
    req.flash('success', 'You have successfully created new list!');
    res.redirect('/listing');
}));


module.exports = router;