// code to get the database funcs in an object
const db = require('./maildb');

// not a get all, just get by mailbox. required to have param
exports.getMailbox = async (req, res) => {
  const emails = await db.selectEmailsFromMailbox(req.user, req.query.mailbox);

  const returnEmails = sortEmails(emails);

  // grabs array of mail from that mailbox
  return res.status(200).json(returnEmails);
};


// function to sort all of the emails by date ----------------------------------
const sortEmails = (arrayEmails) => {
  const sortedEmails = arrayEmails.sort((a, b) => {
    return new Date(a.received).getTime() -
        new Date(b.received).getTime();
  }).reverse();

  // Create a variable to store todays date for comparing
  const today = new Date();

  // Create a variable to store month strings, and month values
  const monthString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // SUBSTRING GUIDE:
  // substring
  // For each email
  // substring(0, 4) is year ex: 2022
  // substring(5, 7) is month ex: 01
  // substring(8, 10) is day ex: 09
  // substring(11, 16) is time ex: 07:06:00 (do 16 instead of 19 no secs)
  // Sort through and prep each received for printing
  sortedEmails.forEach((prop) => {
    // first, check if the day is the same
    if ( parseInt(prop.received.substring(8, 10)) === today.getDate() &&
    parseInt(prop.received.substring(5, 7)) === (today.getMonth() + 1) &&
    parseInt(prop.received.substring(0, 4)) === today.getFullYear()) {
      // If it is, print time

      prop.received = (parseInt(prop.received.substring(11, 14))).toString() +
        prop.received.substring(13, 16);
    } else {
      // if it was yesterday, print yesterday
      // got idea of using a seperate yesterday from online
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if ((yesterday.getDate() === (parseInt(prop.received.substring(8, 10))) &&
      (yesterday.getMonth() + 1) === parseInt(prop.received.substring(5, 7)) &&
      yesterday.getFullYear() === parseInt(prop.received.substring(0, 4)))) {
        prop.received = 'yesterday';
      } else {
        // then, check if the year is the same
        if ( parseInt(prop.received.substring(0, 4)) ===
          today.getFullYear() ) {
          // If it is, print month and year
          prop.received = monthString[parseInt(
            prop.received.substring(5, 7)) - 1] +
            ' ' + prop.received.substring(8, 10);
        } else {
          // If the year is not the same, print year
          prop.received = prop.received.substring(0, 4);
        }
      }
    }
  });
  return sortedEmails;
};
