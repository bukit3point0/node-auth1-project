const User = require('../users/users-model')
const bcrypt = require('bcryptjs')

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: `you shall not pass`
    })
  }
}

function checkUsernameFree(req, res, next) {
  const username = req.body.username
  User.findBy({username})
  .then(([user]) => {
    if(user) {
      res.status(422).json({
        message: 'Username taken',
      })
    } else {
      next()
    }
  })
}

function checkUsernameExists(req, res, next) {
  const {username, password} = req.body
  
  User.findBy({username})
  .then(([user]) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      next()
    } else {
      res.status(401).json({
        message: `Invalid credentials`
      })
    }
  })
}

function checkPasswordLength(req, res, next) {
  const password = req.body.password
  if (!password || password < 3) {
    res.status(422).json({
      message: `Password must be longer than 3 chars`
    })
  } else {
    next()
  }
}

// function confirmPassword(req, res, next) {
//   const {username, password} = req.body.password
//   User.findBy({username})
//   .then(([user]) => {
//     if(user && bcrypt.compareSync(password, user.password)) {
//       next()
//     } else {
//       res.status(401).json({
//         message: `Incorrect username or password.`
//       })
//     }
//   })
// }

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  // confirmPassword
}
