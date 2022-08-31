# Tours app

Node.js app to manage Tours.

## Prerequisites

- Node `>=v16.14.0`
- MongoDB (Compass)

### Installing

Clone the repository:

`git clone https://github.com/albertorsesc/tours.git`

Install Dependencies:

`npm install`

Create and configure "config.env" file:

`cp config.env.example config.env`

Set MongoDB in your `config.env` file.

Start app:

`npm run start`

## Contributing

Contributions welcome.

## License

MIT

## Acknowledgments

  - [Jonas Schmedtmann](https://twitter.com/jonasschmedtman)

## To do:

#### Security

* [] Implement Test suite.
* [] Rate limiting (express-rate-limit)
* [] Max login attempts.
* [] HTTP headers (helmet).
* [] Limit body payload.
* [] Filter malicious regular expressions.
* [] CSRF protection (csurf)
* [] JWT black list.
* [] Confirm email.