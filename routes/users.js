const express = require('express');
const router = express.Router({mergeParams:true});
const { toRedirect } = require('../middlewares/authMiddleware');
const User = require('../models/user.js');
const passport = require('passport');


router.get('/', (req, res) => res.render('users/signup.ejs'));

router.get('/login', (req, res) => res.render('users/login.ejs'));



router.post('/signup', async (req, res) => {
    try{
        const {email,username,password }=req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        //console.log(registeredUser);
        req.login(registeredUser, (err) => {
        if (err) {
            req.flash('error', `${err}`);
            return res.redirect('/user');
        }
        req.flash('success', 'User registered successfully!');
        res.redirect('/listing');  
    });}catch(err){
        req.flash('error', `${err}`);
        res.redirect('/user');
    }
});

router.post('/login',toRedirect,passport.authenticate('local', {             
    failureRedirect: '/user/login',                
    failureFlash: true,                         
}),async (req, res) => {
    req.flash('success','Successfully logged in!' );
    let str = res.locals.redirectUrl;
    if (str && str.includes('review')) {
        return res.redirect('/listing');
    }
    //console.log(str);
    res.redirect(str || '/listing');
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out successfully.');
        res.redirect('/user/login'); 
    });
});

module.exports = router;