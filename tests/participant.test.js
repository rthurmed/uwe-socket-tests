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

test('grab entity', (done) => {
  const ENTITY_TYPE = 11
  joinDiagramAnd(DIAGRAM_ID, (participant) => {
    socket.emit('create', {
      type: ENTITY_TYPE,
      diagramId: DIAGRAM_ID
    })
    socket.once('create', (entity) => { // creates entity to grab it
      socket.emit('grab', entity.id)
      socket.once('grab', (payload) => {
        expect(payload.participantId).toBe(participant.id)
        expect(payload.entityId).toBe(entity.id)
        done()
      })
    })
  })
})

test('drop entity', (done) => {
  const ENTITY_TYPE = 11
  joinDiagramAnd(DIAGRAM_ID, (participant) => {
    socket.emit('create', {
      type: ENTITY_TYPE,
      diagramId: DIAGRAM_ID
    })
    socket.once('create', (entity) => { // creates entity to grab it
      socket.emit('grab', entity.id)
      socket.once('grab', (grabbedEntity) => {
        socket.emit('drop')
        socket.once('drop', (payload) => {
          expect(payload.participantId).toBe(participant.id)
          done()
        })
      })
    })
  })
})
