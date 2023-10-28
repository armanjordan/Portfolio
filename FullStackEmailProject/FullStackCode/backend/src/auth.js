const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// include the secret
const secrets = require('./secrets');

// include database stuff so you can grab users
const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});


// Initial login function -----------------------------------------
exports.login = async (req, res) => {
  const {email, password} = req.body;

  // grab the users
  const select = 'SELECT * FROM person';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);
  const users = rows;

  // search for user
  const user = users.find((user) => {
    return user.email === email &&
    bcrypt.compareSync(password, user.password);
  });
  // spit out password that matches

  // if user found, return signed JWT, otherwise 401
  if (user) {
    const accessToken = jwt.sign(
      {email: user.email},
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    res.status(200).json({name: user.email, accessToken: accessToken});
  } else {
    res.status(401).send('Invalid credentials');
  }
};


// Check login function -----------------------------------------
exports.check = (req, res, next) => {
  // grabs jwt from login
  const authHeader = req.headers.authorization;

  // if (authHeader) {
  const token = authHeader.split(' ')[1];
  // makes sure jwt matches a user
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    // attaches req.user to request, so other server calls
    // like v0/mail have access to req.user(email)
    req.user = user;
    next();
  });
  // } else {
  // res.sendStatus(401);
  // }
};
