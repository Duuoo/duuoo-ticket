const fs = require('fs')
const url = require('url')
const path = require('path')
const qs = require('querystring')

const express = require('express')
const bodyParser = require('body-parser')

const ticket = require('../lib')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cert = fs.readFileSync(path.resolve(__dirname, 'private.pem'))
const inviteTicket = ticket(cert, { expiresIn: '1s' })

function appendQueryToUrl (uri, queryObj) {
  const parsedUrl = url.parse(uri)
  const urlQuery = qs.parse(parsedUrl.query)
  const query = qs.stringify(Object.assign(urlQuery, queryObj))

  parsedUrl.search = query

  return url.format(parsedUrl)
}

// redirect_uri validation (whitelist)
// only check the uri, without query parameters
// SHOULD PROBABLY ALSO CHECK DNS ABOUT DOMAIN TO AVOID SPOOFING!!!

// const parsedVerifyUrl = url.parse(verifyUrl)
// const parsedVerifyQuery = qs.parse(parsedVerifyUrl.query)

// const signUpUrl = appendQueryToUrl(parsedVerifyQuery.redirect_uri, {
//   prefill: JSON.stringify({ email: 'alice@example.com' }),
// })

app.post('/invite', (req, res) => {
  try {
    // Before this, check the body.email if the user (by email) is in the database.

    const token = inviteTicket.sign(req.body)
    const verifyUrl = appendQueryToUrl('http://localhost:3001/invite/verify', {
      token,
      redirect_uri: 'http://localhost:3001/sign-up',
    })

    res.send({
      context: req.body,
      token,
      url: verifyUrl,
      // url: `http://localhost:3001/invite/verify?ticket=${token}&redirect_uri=http://localhost:3001/profile`,
    })
  } catch (error) {
    res.status(403).send({
      message: 'Invalid invite object',
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  }
})

app.get('/invite/verify', (req, res) => {
  const { ticket, redirect_uri } = req.query

  if (!ticket) {
    res.status(403).send({
      error: 'Required ticket parameter',
    })
  }

  try {
    const decoded = inviteTicket.verify(ticket)

    const redirectUrl = appendQueryToUrl(redirect_uri, {
      prefill: JSON.stringify({
        email: decoded.email,
        givenName: decoded.givenName,
        familyName: decoded.familyName,
      }),
    })

    // before this, check if the user's (by email) start date is already set is already in the database
    res.send({
      payload: decoded,
      redirect: redirectUrl,
    })
  } catch (error) {
    res.status(403).send({
      message: 'Invalid invite ticket',
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  }
})

app.get('/sign-up', (req, res) => {
  res.send({
    raw: req.query,
    query: {
      prefill: JSON.parse(req.query.prefill),
    },
  })
})

app.listen(3001, () => { console.log('Listening localhost:3001') })
