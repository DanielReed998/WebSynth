'use strict'; 

// const {db} = require('./server/db/models')
const app = require('./server')

app.listen(process.env.PORT || 8080, () => console.log(`listening on port ${PORT}`))

/*
** Below will be added once backend functionality is up and running.
*/

// db.sync() // if you update your db schemas, make sure you drop the tables first and then recreate them
// .then(() => {
//   console.log('db synced')
//   app.listen(PORT, () => console.log(`listening on port ${PORT}`))
// });

