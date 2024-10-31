const UserRoute = require('./User.route')
module.exports = (app) =>{
    app.use('/api/v1/',UserRoute)
}