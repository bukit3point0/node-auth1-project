const router = require('express').Router()
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
  // confirmPassword
} = require('./auth-middleware')
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res, next) => {
  const {username, password} = req.body
  const hash = bcrypt.hashSync(password, 10)

  Users.add({username, password: hash})
  .then(user => {
    res.status(201).json(user)
  })
  .catch(next)
})

// [POST] /api/auth/login
router.post('/login', checkUsernameExists, (req, res, next) => {
  const {username} = req.body

  Users.findIdAndUser({username})
  .then(([user]) => {
    req.session.user = user
    res.json({
      message: `welcome ${user.username}`
    })
  })
  .catch(err => {
    next(err)
  })
  
})

// [GET] /api/auth/logout
router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    res.clearCookie('chocolatechip')
    req.session.destroy(err =>{
        if (err) {
            res
            
            .json({
                message: `you can never escape`
            })
        } else {
            res.json({
                message: `logged out`
            })
        }
    })
  } else {
    res.json({
        message: `no session`
    })
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: `Authorization cranky`,
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router
