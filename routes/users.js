const express = require('express')
const router = new express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/login', (req, res) =>{
  res.render('login')
})
router.get('/register', (req, res) =>{
  res.render('register')
})

router.post('/register', (req, res) =>{
  const { name, email, password, password2 } = req.body
  let errors = []

  if(!name|| !email|| !password|| !password2  ) {
    errors.push({ msg: 'Please fill in all the fields' })
  }
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }
  if(password.length < 6){
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  if(errors.length > 0){
    res.render('register', { errors, name, email, password, password2 })  
  } else{
  // Validate Registerd User  
    User.findOne({ email: email })
    .then((user) => {
      if(user) {
        errors.push({ msg: 'email already registered' })
        res.render('register', { errors, name, email, password, password2 })  
      }
      else {
        const newUser = new User({
          name,
          email,
          password
        })
      bcrypt.genSalt(10, (error, salt) =>{
        bcrypt.hash(newUser.password, salt, (error, hash) =>{
          if(error) throw error

          // Password Hash
          newUser.password = hash

          newUser.save().then(() =>{
            req.flash('success_msg', 'Registration done! You can now Login')
            res.redirect('/users/login')
          }).catch((e) =>{
            console.log(e)
          })
        })
      })
      }
    }).catch((e) =>{
      console.log(e)
    })
  }
})

// Login Users
router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Logout User
router.get('/logout', (req, res) =>{
  req.logout()
  req.flash('success_msg', 'You are logged out!')
  res.redirect('/users/login')
})


module.exports = router