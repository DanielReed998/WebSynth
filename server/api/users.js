var router = require('express').Router();
var {User} = require('../db/models');

router.post('/', function (req, res, next) {
    console.log(req.session);
    User.create(req.body)
    .then(function (user) {
      req.session.userId = user.id;
      res.status(201).json(user);
    })
    .catch(next);
  });

router.post('/login', function (req, res, next) {
    console.log(req.body)
    User.findOne({
        where: {
          email: req.body.email,
          password: req.body.password
        }
    })
    .then(function (user) {
        if (!user) {
        res.sendStatus(401);
        } else {
        res.status(200).send(user);
        }
    })
    .catch(next);
  })

router.get('/session-id', function (req, res, next) {
    const sessionId = req.session.userId;
    if (sessionId) {
      User.findOne({
        where: {
          id: sessionId
        }
      })
      .then(userInfo => {
        res.json(userInfo);
      })
    }
    else res.send(401);
  });

router.post('/logout', function (req, res, next) {
    res.send(200);
  })
  
router.get('/:id', function (req, res, next) {
    req.requestedUser.reload(User.options.scopes.populated())
    .then(function (requestedUser) {
      res.json(requestedUser);
    })
    .catch(next);
  });

router.delete('/:id', function (req, res, next) {
    req.requestedUser.destroy()
    .then(function () {
      res.status(204).end();
    })
    .catch(next);
  });

module.exports = router;