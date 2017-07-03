import ticket from '../lib/index.js'

test('returns a valid object with methods', () => {
  const inviteTicket = ticket('meow')

  expect(inviteTicket).toEqual(expect.objectContaining({
    sign: expect.any(Function),
    verify: expect.any(Function),
    decode: expect.any(Function),
  }))
})

test('returns a valid JWT token', () => {
  const inviteTicket = ticket('meow')
  const token = inviteTicket.sign({ a: 1, b: 2 })

  expect(token).toEqual(expect.stringMatching(
    /^[a-zA-Z0-9-_]+?\.[a-zA-Z0-9-_]+?\.[a-zA-Z0-9-_]+?$/
  ))
})

test('verifies JWT token', () => {
  const inviteTicket = ticket('meow', { expiresIn: '2h' })
  const token = inviteTicket.sign({ a: 1, b: 2 })
  const decoded = inviteTicket.verify(token)

  expect(decoded).toEqual(expect.objectContaining({
    a: 1,
    b: 2,
    iat: expect.anything(),
    exp: expect.anything(),
  }))
})

test('decodes JWT token', () => {
  const inviteTicket = ticket('meow', { expiresIn: '2h' })
  const token = inviteTicket.sign({ a: 1, b: 2 })
  const decoded = inviteTicket.decode(token)

  expect(decoded).toEqual(expect.objectContaining({
    a: 1,
    b: 2,
    iat: expect.anything(),
    exp: expect.anything(),
  }))
})

test('overwrites sign options', () => {
  const inviteTicket = ticket('meow', { jwtid: 'alice' })
  const token = inviteTicket.sign({ a: 1, b: 2 }, { jwtid: 'bob' })
  const decoded = inviteTicket.verify(token)

  expect(decoded).toEqual(expect.objectContaining({
    a: 1,
    b: 2,
    jti: 'bob',
    iat: expect.anything(),
  }))
})

test('fails to verify JWT token', () => {
  const inviteTicket = ticket('meow', { expiresIn: '2h', issuer: 'bear' })
  const token = inviteTicket.sign({ a: 1, b: 2 })
  const decode = () => inviteTicket.verify(token, { issuer: 'dog' })

  expect(decode()).toThrow()
})

// const token = inviteTicket({
//   email: 'alice@example.com',
//   givenName: 'Alice',
//   familyName: 'Doe',
//   userId: 'omega',
//   organizationId: 'alpha',
//   teamId: 'beta',
// })
