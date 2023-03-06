const sql = require('mssql');
const { config } = require('../sqlconfig')

module.exports = {
    getUser: async(req, res) => {
        await sql.connect(config);
        let user = await sql.query `SELECT * FROM bonga.users WHERE ID = ${id}`
        user = user.recordset
        if (user.length) {
            return user[0]
        } else {
            return undefined
        }
    }
}