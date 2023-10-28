/*
 * Copyright (C) 2018-2022 David C. Harrison. All right reserved.
 *
 * You may not use, distribute, publish, or modify this code without
 * the express written permission of the copyright holder.
 */

import React from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import './Window.css';

import WindowContext from './WindowContext.jsx';
import Logout from './Logout.jsx';
// import {useNavigate} from 'react-router-dom';

// Grab all of the emails from the queried mailbox
const fetchEmails = (setPrintedEmails, setError) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  // was: const bearerToken = user ? user.accessToken : '';
  const bearerToken = user.accessToken;
  fetch('http://localhost:3010/v0/mail?mailbox=Inbox', {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      setError('');
      setPrintedEmails(json);
    })
    .catch((error) => {
      setPrintedEmails([]);
      setError(`${error.status} - ${error.statusText}`);
    });
};


/**
  * Function to generate email html
  *
  *  @param {array} printedEmails An array of sorted formatted emails
  *  @return {object} All of the email html
  */
const writeEmails = (printedEmails) => {
  let keyNum = 0;
  return (
    // if email.avatarDisplay == true, display, otherwise substring(0, 1)
    printedEmails.map((email) => (
      <Box key={keyNum++}>
        <Box
          sx={{display: 'flex', borderTop: 1, borderBottom: 1}} width='610px'
        >
          <Grid sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: 1,
          }}>
            {email.displayAvatar === 'true' ?
              <Avatar src={email.avatar}
                sx={{padding: 2, marginRight: 3, marginTop: 1}}>
              </Avatar> :
              <Avatar sx={{padding: 2, marginRight: 3, marginTop: 1}}>
                {(email.fromName).substring(0, 1).toUpperCase()}
              </Avatar>
            }
            <Box>
              <Grid width='500px' sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                {email.opened === 'false' ?
                  <Typography align='left' sx={{fontWeight: 'bold'}}>
                    {email.fromName}
                  </Typography> :
                  <Typography align='left'>
                    {email.fromName}
                  </Typography>
                }

                <Typography align='right' sx={{marginRight: 2}}>
                  {email.received}
                </Typography>
              </Grid>
              {email.opened === 'false' ?
                <Typography sx={{marginTop: 1.2, fontWeight: 'bold'}}>
                  {email.subject}
                </Typography> :
                <Typography sx={{marginTop: 1.2}}>
                  {email.subject}
                </Typography>
              }

              <Grid width='500px' sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <Typography
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    marginTop: 1.2,
                  }}
                  align='left'>
                  {email.content}
                </Typography>
                {email.starred === 'false' ?
                  <IconButton> <StarBorderIcon /> </IconButton> :
                  <IconButton> <StarIcon /> </IconButton>
                }
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Box>
    ))
  );
};

/**
 * Simple component with no state.
 *
 * See the basic-react example for an example of adding and reacting to
 * changes in state and lecture 10 for details on Material-UI
 *
 * @return {object} JSX
 */
function Window() {
  // State variables
  // A state to store which mailbox to print
  const [printedEmails, setPrintedEmails] = React.useState([]);
  const [error, setError] = React.useState('Logged Out');

  // const history = useNavigate();

  React.useEffect(() => {
    fetchEmails(setPrintedEmails, setError);
  }, [printedEmails]);

  /*
  React.useEffect(() => {
    if (!printedEmails.length) {
      history('/login');
    }
  }, [printedEmails]);
  */

  const globalVars = {
    printedEmails: printedEmails,
    setPrintedEmails,
    error: error,
    setError,
  };

  // after this effect, printedEmails should be populated with sorted
  // and formatted dates, time to print!

  return (
    <WindowContext.Provider value={globalVars}>
      <div tabIndex={0}>
        <h2>Div</h2>

        <div>
          <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed" sx={{zIndex: (theme) =>
              theme.zIndex.drawer + 1}}>
              <Toolbar>
                <Grid width='600px' sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <Typography
                    variant="h6" noWrap component="div"
                    align="left" sx={{margin: 1}}
                  >
                    Inbox
                  </Typography>
                  <>
                  </>
                  <Logout/>
                </Grid>
              </Toolbar>
            </AppBar>
          </Box>
        </div>

        <div>
          {writeEmails(printedEmails)}
        </div>
      </div>
    </WindowContext.Provider>
  );
}

export default Window;
