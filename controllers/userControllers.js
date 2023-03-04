const sql = require('mssql');
const bcrypt = require('bcrypt');
const { config } = require('../sqlconfig');
const validateCreateUserSchema = require('../model/usersSchema')
const { getUser } = require('../services/getUserService')
const { createToken, verifyToken } = require('../services/jwtServices')
module.exports = {
    getAllTheUsers: async(req, res) => {
        try {
            await sql.connect(config);
            let users = await sql.query `SELECT * FROM bonga.users WHERE isDeleted=0`;
            res.json(users.recordset);
        } catch (error) {
            console.log(error)
        }

    },
    createUser: async(req, res) => {
        const details = req.body;
        try {
            // validate <datalist>
            let value = await validateCreateUserSchema(details)
                // bcrypt asynchronous
            let hashed_pwd = await bcrypt.hash(value.password, 8)

            await sql.connect(config);
            let results = await sql.query `INSERT INTO bonga.users VALUES (${value.fullname},${value.username},${value.email},${value.phone_number},${value.profile}${hashed_pwd},1,0)`
            console.log(results);
            users.push(results);
            res.json(users)

        } catch (error) {
            res.status(400).json(error)
        }
    },
    loginUser: async(req, res) => {
        //implementation of loginusing bcrypt
        let credentials = req.body;
        let user = await this.getUser(credentials.id)
        if (user) {
            let match = await bcrypt.compare(credentials.password, user.password)
            let token = await createToken({ full_names: user.full_names, id: user.id })
            if (match) {

                res.json({ success: true, message: 'login successful', token })
            } else {
                res.json({ success: false, message: 'check your credentials' })
            }
        } else {
            res.status(404).json({ message: "user doesn't exist" })
        }
    },
    getAUser: async(req, res) => {
        const { id } = req.params
        try {
            let user = await this.getAllTheUsers(id)
            if (user) {
                res.json(user)
            } else {
                res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.log(error)
        }
    },
    updateUser: async(req, res) => {
        const details = req.body
        try {
            await sql.connect(config);
            let results = await sql.query `UPDATE bonga.users SET full_name=${details.name}, username=${details.username}, profile=${details.profile},password=${details.password},email=${email},phone_number=${details.phone_number} WHERE id = ${details.id}`
            if (results.rowsAffected.length) res.json({ success: true, message: 'user updated successfully' })
        } catch (error) {
            console.log(error)
        }

    },
    SoftDeleteUser: async(req, res) => {
        const { id } = req.params
        try {
            await sql.connect(config);
            let results = await sql.query `UPDATE bonga.users SET isDeleted=1 WHERE id = ${id}`
            if (results.rowsAffected.length) res.json({ success: true, message: 'user deleted successfully' })
        } catch (error) {
            console.log(error)
        }

    }

}