const sql = require('mssql');
const bcrypt = require('bcrypt');
const { config } = require('../sqlconfig');
const jwt = require('jsonwebtoken');
const validateCreateUserSchema = require('../Validation/RegistrationValidation')
const { getUser } = require('../services/getUserService')

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
            let hashed_pwd = await bcrypt.hash(value.passwords, 8)

            await sql.connect(config);
            let results = await sql.query `INSERT INTO bonga.users VALUES (${value.full_name},${value.username},${value.email},${value.phone_number},${value.profile}${hashed_pwd},0,1)`
            console.log(results);
            users.push(results);
            res.json(users)

        } catch (error) {
            res.status(400).json(error)
        }
    },
    loginUser: async(req, res) => {
        const { email, passwords } = req.body;

        try {
            await sql.connect(config);
            const result = await sql.query `SELECT * FROM bonga.users WHERE email = ${email}`;
            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                const match = await bcrpyt.compare(passwords, user.passwords);
                if (match) {
                    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.SECRET);
                    await sql.query `UPDATE bonga.users SET Status = 1 WHERE  id = ${user.user_id}`;
                    res.json({ success: true, token });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid email or password' });
                }
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error logging in' });
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

    },
    Logout: async(req, res) => {
        const { id } = req.params
        try {
            await sql.connect(config);
            let results = await sql.query `UPDATE bonga.users SET Status = 0 WHERE id = ${id}`;
            res.status(500).json({ success: true, message: 'successfully logged out' });
        } catch (error) {
            console.log(error)
            res.status(401).json({ success: false, message: 'Error logging out' })
        }

    }

}