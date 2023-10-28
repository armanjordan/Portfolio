import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import Window from '../components/Window';
import {Router} from 'react-router-dom';

const molly = {
  name: 'Molly Member',
  accessToken: 'some-old-jwt',
};

const subjects = ['Some Old Subject', 'Some Other Subject'];

const inbox = [{
  opened: 'false',
  starred: 'false',
  avatar: 'https://www.stockvault.net/data/2018/08/28/254042/preview16.jpg',
  displayAvatar: 'true',
  fromName: 'Arman Jordan',
  fromEmail: 'armanjordan@gmail.com',
  subject: subjects[0],
  content: 'Boopy boop boop',
  received: '2020-06-19T15:12:39Z',
}, {
  opened: 'true',
  starred: 'true',
  avatar: 'https://www.stockvault.net/data/2018/08/28/254042/preview16.jpg',
  displayAvatar: 'false',
  fromName: 'Arman Jordan',
  fromEmail: 'armanjordan@gmail.com',
  subject: subjects[1],
  content: 'Goo goo Gaa gaa',
  received: '2021-08-17T14:12:52Z',
}];

let box = undefined;

const URL = 'http://localhost:3010/v0/mail';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return box ? res(ctx.json(box)) :
      res(ctx.status(404, 'Unknown mailbox'));
  }),
);

beforeAll(() => {
  localStorage.setItem('user', JSON.stringify(molly));
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Unknown mailbox', async () => {
  box = undefined;
  render(<Router location={'/'}><Window/></Router>);
});

test('Inbox has two mails', async () => {
  box = inbox;
  render(<Router location={'/'}><Window/></Router>);
  await screen.findByText(subjects[0]);
  await screen.findByText(subjects[1]);
});

/*
test('Logout', async () => {
  render(<Router location={'/'}><Window/></Router>);
  window.alert = () => { };
  fireEvent.click(screen.getByRole('button', {name: 'logout'}));
  await waitFor(() => {
    expect(localStorage.getItem('user')).toBe(null);
  });
});
*/
