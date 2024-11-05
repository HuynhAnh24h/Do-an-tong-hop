const UserRoute = require('./User.route')
const ProductRoute = require('./Product.route')
module.exports = (app) =>{
    app.use('/api/v1/',UserRoute)
    app.use('/api/v1/',ProductRoute)
}