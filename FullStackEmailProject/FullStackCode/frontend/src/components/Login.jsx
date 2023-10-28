import React from 'react';
import {useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

/**
 * @return {object} Login Screen
 */
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  // on submission of email and password
  const handleSubmit = (event) => {
    event.preventDefault();
    // call the login POST function
    fetch('http://localhost:3010/v0/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // return whatever the json was ({email, access token})
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      // store in local storage with key 'user' the stringified json
      .then((json) => {
        // stores {email, access token}
        localStorage.setItem('user', JSON.stringify(json));
        // puts us to the homepage of the application
        history('/');
      })
      // if theres a problem logging in, errors
      .catch((err) => {
        alert('Error logging in ' + err + ', please try again');
      });
  };

  // if tests dont work return this to container
  return (
    <Box sx={{width: '100%'}}>
      <Stack spacing={2}>
        <TextField
          onChange={handleInputChange}
          name="email"
          label="Email Address"
          aria-label="email address"
          autoFocus
        />
        <TextField
          onChange={handleInputChange}
          name="password"
          type="password"
          label="Password"
          aria-label="password"
        />
        <Button
          type="submit"
          variant="contained"
          aria-label="login button"
          onClick={handleSubmit}
        >
         Log In
        </Button>
      </Stack>
    </Box>
  );
}

export default Login;
