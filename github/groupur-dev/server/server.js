const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userController = require('./user/userController');
const groupController = require('./group/groupController');
const cookieController = require('./util/cookieController');
const sessionController = require('./util/sessionController');


const mongoURI = 'mongodb://admin:ilovetesting@ds245518.mlab.com:45518/groupur';
mongoose.connect(mongoURI, () => {console.log('connected to database')});

/**
* Automatically parse urlencoded body content from incoming requests and place it
* in req.body
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + './../')); //serves the index.html
app.listen(3000, () => { console.log('listening on port 3000') }); //listens on port 3000 -> http://localhost:3000/

// when they hit the landing page, verify whether they have an active session, 
// if so direct to myAccount. If not, keep them on the landing page to allow for manual log in or sign up
app.post('/verify', sessionController.verifySession);

// if they hit the sign in button
app.post('/signup', userController.signup, /* sessionController.getToken, */ cookieController.setSSIDCookie, sessionController.startSession);

// if they hit the login button
app.post('/login', userController.verify, /*sessionController.getToken,*/ cookieController.setSSIDCookie, sessionController.startSession);

app.post('/add-group', userController.addGroup);

app.post('/remove-group', userController.removeGroup);

app.post('/add-group-member', groupController.addMember);

app.post('/remove-group-member', groupController.removeMember);

app.post('/add-group-order', groupController.addOrder);

app.post('/remove-group-order', groupController.removeOrder);

// ???
app.get('/myAccount')

module.exports = app;