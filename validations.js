const mariadb = require('mariadb')
const dotenv = require('dotenv')

module.exports = {
    userExists: async function (idUser) {
        dotenv.config()
        
        const conn = await mariadb.createConnection('mariadb://root:pegasus@localhost/sonigas')
    
        let exists = false
    
        try {
            const rows = await conn.query('select count(*) as count from sgc_users where sgc_users.id = ?', [idUser])
            exists = rows[0]['count'] === 1
        } catch (error) {
            console.log(error)
        } finally {
            conn.end()
        }
    
        return exists
    }
}