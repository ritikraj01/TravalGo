const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const ListingRoutes = require('./routes/listings.js');
const ReviewRoutes = require('./routes/reviews.js');
const User =  require('./models/user.js');
const userRoutes = require('./routes/users.js');
const engine = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;



app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
     } 
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    res.locals.userInfo = req.user;
    next();
});





mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));




app.get('/', (req, res) => {
    res.render('listings/index', { what: 'best'});
});

app.use('/listing', ListingRoutes);
app.use('/listing/:id/review', ReviewRoutes);
app.use('/user', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('templets/error', { message: err.message });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));