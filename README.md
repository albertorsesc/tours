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

Import Development data

`node ./dev-data/data/import-dev-data.js --import`

To Delete Development Data

`node ./dev-data/data/import-dev-data.js --delete`

Start app:

`npm run start`

## PWD

Users' password: `test1234`

## Notes

When importing data through the CLI, make sure to comment out the `save` middlewares in `models/user.js` which are used to encrypt the user's password,
if not commented out, the already encrypted password in the `dev-data/data/users.json` file will be encrypted again. After importing it is now safe to uncomment.

## Contributing

Contributions welcome.

## License

MIT

## To do:

#### Security

* [x] Rate limiting
* [x] Limit body payload.
* [x] Security HTTP headers.
* [x] NoSQL injection prevention.
* [x] XSS prevention.
* [x] Parameter pollution prevention.
* [] Implement Test suite.
* [] Max login attempts.
* [] Filter malicious regular expressions.
* [] CSRF protection (csurf)
* [] JWT black list.
* [] Confirm email.