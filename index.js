const io = require('socket.io')()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const ns = io.of('/sonigas')

function log(action, socketId, ip, room, message) {
    console.log(`****** ${action} *****`)
    console.log(`sender: ${socketId}, IP: ${ip}`)
    console.log(`subsidiary ${room}.`)
    console.log(`visits: ${message}.`)
    console.log(`${Date().toString()}.`)
    console.log('**********************')
}
let event = 0
ns.on('connection', socket => {
    console.log('==== create connection ====')
    console.log(`sender: ${socket.id}, IP: ${socket.conn.remoteAddress}`)
    console.log('===========================')

    const token = socket.request._query['room']

    // io.clients((error, clients) => console.log(clients))

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
        if (error || !('user_claims' in decoded)) {
            console.error('/+++ ERROR +++/')
            console.error(error.message)
            console.error('/+++++++++++++/')

            ns.to(socket.id).emit('error', 'tokenError')
        }
        else {
            const room = decoded.user_claims.id_subsidiary
    
            console.log('===== room =====')
            console.log(room)
            console.log('================')
    
            socket.join(room)
    
            socket.on('newVisit', msg => {
                event++
                // io.clients((error, clients) => console.log(clients))
                ns.to(room).emit('newVisit', msg)
                log('visit added', socket.id, socket.conn.remoteAddress, room, msg)
                console.log(event)
            })
    
            socket.on('updateVisit', msg => {
                ns.to(room).emit('updateVisit', msg)
                log('visit updated', socket.id, socket.conn.remoteAddress, room, msg)
            })
    
            socket.on('newCheck', msg => {
                ns.to(room).emit('newCheck', msg)
                log('check added', socket.id, socket.conn.remoteAddress, room, msg)
            })
    
            socket.on('updateCheck', msg => {
                ns.to(room).emit('updateCheck', msg)
                log('check updated', socket.id, socket.conn.remoteAddress, room, msg)
            })
    
            socket.on('disconnect', () => {
                console.log('==== client disconected ====')
                console.log(`Disconnected: ${socket.id}, IP: ${socket.conn.remoteAddress}`)
                console.log('============================')
            })
        }

    })
})

io.listen(process.env.PORT)
console.log(`Port: ${process.env.PORT}`)