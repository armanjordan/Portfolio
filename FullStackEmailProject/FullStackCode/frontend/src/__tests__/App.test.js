import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Router} from 'react-router-dom';

import App from '../App';
import NotFound from '../Components/NotFound';

const molly = {
  name: 'Molly Member',
  accessToken: 'some-old-jwt',
};

/**
 */
test('App Renders', async () => {
  render(<App />);
});

test('App Renders with login', async () => {
  localStorage.setItem('user', JSON.stringify(molly));
  render(<App />);
});

test('Not Found', async () => {
  localStorage.removeItem('user');
  render(<Router location={'*'}><NotFound/></Router>);
});
