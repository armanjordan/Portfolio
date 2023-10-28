import WindowContext from './WindowContext.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useContext} from 'react';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function Logout() {
  const history = useNavigate();

  // on submission of email and password
  const handleLogout = (event) => {
    event.preventDefault();
    // call the login POST function
    // update state
    setIsSending(true);
    // send the actual request
    localStorage.removeItem('user');
    myContext.setPrintedEmails([]);
    myContext.setError('Logged Out');
    // once the request is sent, update state again
    setIsSending(false);

    // puts us to the homepage of the application
    history('/login');
  };

  const myContext = useContext(WindowContext);
  const [isSending, setIsSending] = useState(false);

  return (
    <IconButton
      aria-label='logout'
      size="large"
      edge="start"
      color="inherit"
      align="right"
      sx={{mr: 2}}
      disabled={isSending}
      onClick={handleLogout}>
      <SettingsIcon />
    </IconButton>
  );
}

export default Logout;
