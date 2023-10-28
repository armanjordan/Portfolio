// __tests__/Login.test.js

import {render, fireEvent} from '@testing-library/react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Router} from 'react-router-dom';

import App from '../App';
import Login from '../components/Login';

const URL = 'http://localhost:3010/v0/login';

const server = setupServer(
  rest.post(URL, async (req, res, ctx) => {
    const user = await req.json();
    return user.email === 'molly@books.com' ?
      res(ctx.json({name: 'Molly Member', accessToken: 'some-old-jwt'})) :
      res(ctx.status(401, 'Username or password incorrect'));
  }),
  rest.get('http://localhost:3010/v0/mail', (req, res, ctx) => {
    return res(ctx.status(404, 'Unknown mailbox'));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Success', async () => {
  render(<Router location={'/login'}><Login /></Router>);
  window.alert = () => { };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByText('Log In'));
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null);
  });
});


test('Fail', async () => {
  render(<Router location={'/login'}><Login /></Router>);
  let alerted = false;
  window.alert = () => {
    alerted = true;
  };
  fireEvent.click(screen.getByText('Log In'));
  await waitFor(() => {
    expect(alerted).toBe(true);
  });
  expect(localStorage.getItem('user')).toBe(null);
});

test('App Renders with login', async () => {
  render(<App />);
  window.alert = () => { };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByText('Log In'));
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null);
  });
  fireEvent.click(screen.getByRole('button', {name: 'logout'}));
});

test('Logout', async () => {
  render(<App />);
  window.alert = () => { };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByText('Log In'));
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null);
  });
  fireEvent.click(screen.getByRole('button', {name: 'logout'}));
  await waitFor(() => {
    expect(localStorage.getItem('user')).toBe(null);
  });
});

// We were told to keep backend of dummy in,
// do we need to have auth.check on and the schema for dummy correct as well?
// ^^Or can we remove the endpoint in the server
