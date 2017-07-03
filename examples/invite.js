// const fs = require('fs')
// const path = require('path')
const crypto = require('crypto')
const ticket = require('../lib')

const invite = {
  email: 'alice@example.com',
  givenName: 'Alice',
  familyName: 'Doe',
  userId: 'omega',
  organizationId: 'alpha',
  teamId: 'beta',
}

// Using key-pair
// const privateKey = fs.readFileSync(path.resolve(__dirname, 'private.pem'))
const secret = 'blue-apples'

// jti

// updates context
const jti = crypto.randomBytes(16).toString('hex')
const inviteTicket = ticket(secret, { expiresIn: '7d' })
console.log(inviteTicket)
const token = inviteTicket.sign(invite)

console.log(token)

const decoded = inviteTicket.verify(token, { jwtid: jti })
console.log(decoded)
