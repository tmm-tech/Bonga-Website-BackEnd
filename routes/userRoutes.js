const userRoutes = require('express').Router()

const {
    createUser,
    getAUser,
    updateUser,
    getAllTheUsers,
    SoftDeleteUser,
    loginUser,

} = require('../controllers/userControllers');

//read data
userRoutes.get('/Users', getAllTheUsers)
    // create and insert data into the table
userRoutes.post('/Users', createUser)
    //read for a specific id
userRoutes.get('/User/:id', getAUser)
    //soft delete item of a specific id
userRoutes.delete('/User/:id', SoftDeleteUser)
    //update items
userRoutes.put('/Users', updateUser)
    // login a user
userRoutes.get('/User/:id', loginUser)

module.exports = userRoutes