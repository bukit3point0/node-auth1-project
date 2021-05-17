const User = require('../users/users-model')

function restricted(req, res, next) {
  const {username, password} = req.body
  User.findBy({username})
  .then(([user]) => {
      if (user && bcrpyt.compareSync(password, user.password)) {
          console.log(req.session)
          req.session.user = user
          res.json({
              message: `${user.username} found!`
          })
      } else {
      next({
          status: 401, 
          message: `You shall not pass!`
      })
      }
  })
}

function checkUsernameFree(req, res, next) {
  const {username} = req.body.username
  User.findBy(username)
  .then(user => {
    if(!user) {
      next()
    } else {
      res.status(422).json({
        message: 'Username taken'
      })
    }
  })
}

function checkUsernameExists(req, res, next) {
  const {username} = req.body.username
  User.findBy(username)
  .then(user => {
    if(user) {
      next()
    } else {
      res.status(401).json({
        message: `Invalid credentials`
      })
    }
  })
}

function checkPasswordLength(req, res, next) {
  const {password} = req.body.password
  if (!password || password < 3) {
    res.status(422).json({
      message: `Password must be longer than 3 chars`
    })
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}
