const { Socket } = require("socket.io-client")
const { getSocket } = require("../server")
const { randomString } = require("../util")

/**
 * @type Socket
 */
let socket

const DIAGRAM_ID = 42

beforeAll((done) => {
  getSocket()
    .then((s) => {
      socket = s
      socket.on('connect', () => {
        socket.emit('join', DIAGRAM_ID)
        socket.once('join', (payload) => {
          done()
        })
      })
    })
})

afterAll((done) => {
  if (socket) {
    socket.close()
  }
  done()
})

test('create an entity', (done) => {
  // arrange
  const ENTITY_TYPE = 11
  // act
  socket.emit('create', {
    type: ENTITY_TYPE,
    diagramId: DIAGRAM_ID
  })
  socket.once('create', (payload) => {
    // assert
    expect(payload.type).toBe(ENTITY_TYPE)
    expect(payload.diagramId).toBe(DIAGRAM_ID)
    done()
  })
})

const createAnEntityAnd = (entity, callback) => {
  socket.emit('create', entity)
  socket.once('create', callback)
}

test('patch an entity', (done) => {
  // arrange
  const ENTITY_TYPE = 11
  const NEW_TITLE = randomString()
  createAnEntityAnd({
    type: ENTITY_TYPE,
    diagramId: DIAGRAM_ID
  }, (entity) => {
    // act
    socket.emit('patch', {
      id: entity.id,
      title: NEW_TITLE
    })
    socket.once('patch', (payload) => {
      // assert
      expect(payload.type).toBe(ENTITY_TYPE)
      expect(payload.diagramId).toBe(DIAGRAM_ID)
      expect(payload.title).toBe(NEW_TITLE)
      done()
    })
  })
})

test('delete an entity', (done) => {
  // arrange
  const ENTITY_TYPE = 11
  createAnEntityAnd({
    type: ENTITY_TYPE,
    diagramId: DIAGRAM_ID
  }, (entity) => {
    socket.emit('grab', entity.id)
    socket.once('grab', () => {
      // act
      socket.emit('delete')
    })
    socket.once('delete', (payload) => {
      // assert
      expect(payload).toBe(entity.id)
      done()
    })
  })
})
