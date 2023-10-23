import { isValidUser } from './middleware/socket/UserAuth.js'
import { joinUserRoom, leaveRoom } from './modules/socket/controller.js'
import logger from './utilities/logger.js'

let io = ''
export const symbols = new Map()
export const userIds = new Map()
export const setIoObject = async (socketIo) => {
  logger.info('Socket connection start')
  io = socketIo
  if (io) await setSocket(io) // Listen ws
}
//
// cron.schedule('*/1 * * * * *', function () {
//   if (io !== '') {
//     try {
//       const onlineUserIds = Object.keys(onlineUser)
//       const clientIds = io.sockets.clients()
//       console.log('TEST')
//       logger.info(onlineUserIds.length)
//     } catch (e) {
//       logger.error(e)
//     }
//   }
// }).start()

/**
 * Socket Listener
 * @param io
 * @returns {Promise<void>}
 */
export const setSocket = async (io) => {
  try {
    io
      .use(isValidUser)
      // .use(isValidUser) // Validate User Bearer Token
      .on('connection', async (socket) => { // On socket connection
        // socket.join('CRUDEOIL23OCTFUT')
        // console.log(socket.userId, '===============================')
        // await jooinRoom()
        userIds.set(socket.id, socket.userId)
        const userId = userIds.get(socket.id)
        // socket.id = '123456789'
        // console.log(userId, '++++++++++++++++')
        await joinUserRoom(userId, socket)

        socket.on('leaveRoom', async function (room) {
          await leaveRoom(room, userId, socket)
        })

        socket.on('reJoinRoom', async function () {
          await joinUserRoom(userId, socket)
        })
        // userMaps.set(socket.userId, socket.id)
        // userMaps.set(socket.id, socket.userId)
        // userWSocketMaps.set(socket.id, socket.userId)

        // onlineUser[socket.userId] = socket.id
        // connectdIds[socket.id] = true
        // const userId = userMaps.get(socket.id)
        // await notifyFriendsUserIsOnline(socket, onlineUser, userId)

        // socket.emit('onlineUser', (Object.keys(onlineUser)), await joinUserRoom(socket.userId, socket))

        // socket.on('typing', (user, room) => {
        //   io.to(room).emit('typing', user)
        // })
        //
        // socket.on('stopTyping', user => {
        //   io.emit('stopTyping', user)
        // })

        socket.on('disconnect', async function () {
          // const userID = userIds.get(socket.id)
          await leaveRoom('all', userId, socket)
          console.log('A user disconnected')
          userIds.delete(socket.id)
        })
      })
  } catch (e) {
    console.log(e)
    logger.error(e)
  }
}

/**
 * Socket ROOM Events
 */
export const listenRoomEvents = async (io) => {
  try {
    io.on('create-room', (room) => { // Verify Room Exist

    })

    io.on('join-room', (room) => { // Join Room

    })

    io.on('delete-room', (room) => { // Offline All User

    })
  } catch (e) {
    logger.error(e)
  }
}

/**
 * Send data to client
 * @param route
 * @param roomId
 * @param name
 * @param data
 */
export const sendEmitDataToRoom = (roomId, name, data) => {
  if (io !== '') {
    // io.emit('onlineFriend', roomId)
    io.to(roomId).emit(name, data)
  }
}

export const sendData = (name, data) => {
  if (io !== '') {
    io.emit(name, data)
  }
}

/**
 * ===>>>> Room Management <<<<====
 * @param route
 * @returns {string[]|*[]}
 */
export const getActiveRoomIds = () => {
  if (io !== '') {
    return Array.from((io.adapter.rooms).keys())
  }
  return []
}
