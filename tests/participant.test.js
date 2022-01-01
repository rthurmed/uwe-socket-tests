const { Socket } = require("socket.io-client")
const { getSocket } = require("../server")

/**
 * @type Socket
 */
let socket

beforeAll((done) => {
  getSocket()
    .then((s) => {
      socket = s
      socket.on('connect', () => {
        done()
      })
    })
})

afterAll((done) => {
  if (socket) {
    socket.close()
  }
  done()
})

const DIAGRAM_ID = 42

test('join a diagram', (done) => {
  // arrange
  // act
  socket.emit('join', DIAGRAM_ID)
  socket.once('join', (payload) => {
    // assert
    expect(payload.diagramId).toBe(DIAGRAM_ID)
    done()
  })
})

const joinDiagramAnd = (diagramId, callback) => {
  socket.emit('join', diagramId)
  socket.once('join', callback)
}

test('leave diagram', (done) => {
  // arrange
  joinDiagramAnd(DIAGRAM_ID, (participant) => {
    // act
    socket.emit('leave')
    socket.once('leave', (participantId) => {
      // assert
      expect(participantId).toBe(participant.id)
      done()
    })
  })
})

test('grab entity', (done) => {
  // TODO
  done()
})

test('drop entity', (done) => {
  // TODO
  done()
})
