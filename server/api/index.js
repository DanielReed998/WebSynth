const apiRouter = require('express').Router()


apiRouter.get('/', (req, res, next) => {
    res.send('your server is running!');
})

module.exports = apiRouter;