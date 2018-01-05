const express = require('express');
const apiRouter = express();

apiRouter.use('/sequences', require('./sequences'));
apiRouter.use('/users', require('./users'));

module.exports = apiRouter;

