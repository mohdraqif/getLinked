const express = require('express');
const app= express()
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
require('./config/passport')(passport)
const PORT = process.env.PORT || 3000


// DB config
const db = require('./config/keys').mongoURI

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Mongo DB Connected...'))
.catch((e) => console.log(e))

// EJS
app.use(expressLayouts)
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')))

// BodyParser
app.use(express.urlencoded({extended: false}))

// Flash Messages for redirecting
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash
app.use(flash())

// Global Color vars
app.use((req, res,next) =>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')

  next()
})

// ROUTES
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users')) 

app.listen(PORT, console.log(`Server started on port ${PORT}`))