// include database stuff so you can grab users
const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectEmailsFromMailbox = async (user, mailbox) => {
  // creating the select statement
  const select = 'SELECT * FROM mail WHERE destination = $1';
  // req.user is current email (added by authcheck)
  const destinationVar = (user.email).toString() + '-' + mailbox.toString();
  const query = {
    text: select,
    values: [destinationVar],
  };
  // calling the query
  const {rows} = await pool.query(query);

  // push all the returned json info to array
  const returnArray = [];

  for (const row of rows) {
    // remove content and add id
    const pushMail = {
      'opened': row.opened,
      'starred': row.starred,
      'avatar': row.avatar,
      'displayAvatar': row.displayavatar,
      'fromName': row.fromname,
      'fromEmail': row.fromemail,
      'subject': row.subject,
      'content': row.content,
      'received': row.received,
    };
    (returnArray).push(pushMail);
  }
  return returnArray;
};
