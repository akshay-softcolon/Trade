import io from 'socket.io-client'
import { sendEmitDataToRoom } from './app-socet.js'
// import socketioWildcard from 'socketio-wildcard'
// import { joinAllRooms } from './modules/socket/controller.js'
// import { log } from 'winston'

let socket28 = ''
export const socketConnection = () => {
  // const socket = io('https://diamond.555exch.com:8443')
  const socket = io('http://localhost:3002/')
  socket28 = socket
  // const patch = socketioWildcard(io.Manager)
  // patch(socket)
  socket.on('userConnected', (data) => {
    // console.log(data)
  })

  // socket.emit('joinRoom', ['AUBANK23OCTFUT'])
  // setTimeout(() => {
  //   socket.emit('leaveRoom', 'AUBANK23OCTFUT')
  // }, 20000)
  socket.on('data', async (packet) => {
    await sendEmitDataToRoom(packet?.['Trading Symbol'], 'data', packet)
    // await sendEmitDataToRoom('abc', 'data', packet)
    // console.log(packet)
  })
}
export const jooinRoom = (roomId) => {
  socket28.emit('joinRoom', roomId)
}
export const removeRoom = (roomId) => {
  socket28.emit('leaveRoom', roomId)
}
