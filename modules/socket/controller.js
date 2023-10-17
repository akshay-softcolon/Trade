import { jooinRoom, removeRoom } from '../../app-listen-socket.js'
import { symbols } from '../../app-socet.js'

// join into all rooms which is present in my db
export const joinAllRooms = (abc, socket) => {
  const rooms = ['AUBANK23OCTFUT', 'CRUDEOIL23OCTFUT']

  // socket in userId assign part is pending
  for (const i of rooms) {
    socket.join(i)
  }
}

export const joinUserRoom = async (uId, socket) => {
  // getting array from user model restricted symbols
  const rooms = ['AUBANK23OCTFUT', 'CRUDEOIL23OCTFUT']
  // socket in userId assign part is pending
  for (const i of rooms) {
    if (symbols.get(i)) {
      symbols.set(i, [...symbols.get(i), uId])
    } else {
      await jooinRoom(i)
      symbols.set(i, [uId])
    }
    socket.join(i)
  }
  console.log(symbols)
}

export const leaveRoom = async (room, uId, socket) => {
  console.log(room, '--------------------------------')
  console.log(room === 'all')
  // find user by socket.id
  if (room === 'all') {
    console.log('enter')
    console.log(symbols)
    const rooms = ['AUBANK23OCTFUT', 'CRUDEOIL23OCTFUT']
    // const rooms = userRoom.filter((n) => !room.includes(n))
    for (const i of rooms) {
      const leaveRoomId = symbols.get(i)
      console.log({ leaveRoomId })
      if (leaveRoomId) {
        console.log(symbols?.get(i)?.indexOf(uId))
        await leaveRoomId.splice(symbols?.get(i)?.indexOf(uId), 1)
        symbols.set(i, leaveRoomId)
        console.log({ leaveRoomId })
        if (leaveRoomId.length === 0) {
          console.log(i, 'dfds')
          symbols.delete(i)
          removeRoom(i)
        }
      }
      socket.leave(i)
      console.log('i', i)
    }
    console.log(symbols)
  } else {
    const userRoom = ['AUBANK23OCTFUT', 'CRUDEOIL23OCTFUT']
    const rooms = userRoom.filter((n) => !room.includes(n))
    for (const i of rooms) {
      console.log({ i })
      console.log({ uId })
      const leaveRoomId = symbols.get(i)
      if (leaveRoomId) {
        await leaveRoomId.splice(symbols?.get(i)?.indexOf(uId), 1)
        symbols.set(i, leaveRoomId)
        if (leaveRoomId.length === 0) {
          console.log('dfgh')
          symbols.delete(i)
          removeRoom(i)
        }
      }
      socket.leave(i)
      console.log('i', i)
    }
    console.log(symbols)
  }
}
