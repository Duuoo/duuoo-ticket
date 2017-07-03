# Duuoo Ticket

[![CircleCI](https://circleci.com/gh/Duuoo/duuoo-ticket.svg?style=svg&circle-token=2cc443dc69233cf7e97c4e239bcdea711f092ee5)](https://circleci.com/gh/Duuoo/duuoo-ticket)

A stateless ticket system, which can be used for things like invites.

## Usage

```js
import ticket from 'ticket'

const myTicket = ticket({
  invite: {
    email: 'eve@insecurity.co'
  }
})

myTicket.isVerified()
```

## API

### `ticket(context) => Ticket`

Returns a new `Ticket` instance.

- `context` - The context of this ticket, which is attached to the ticket payload.

## Generating key-pairs for signing

In order to securely sign JWT tokens, you'll need to generate a key-pair which you can sign with.


```sh
openssl genrsa -des3 -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```
