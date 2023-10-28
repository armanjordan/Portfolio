const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('GET Invalid URL', async () => {
  let bearertoken;
  await request.post('/v0/login').set({'Content-Type': 'application/json'})
    .send(JSON.stringify({email: 'molly@books.com', password: 'mollymember'}))
    .expect(200)
    .then((res) => {
      bearertoken = res.body;
    });
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .set({'headers.authorization': bearertoken})
    .expect(404);
});

test('Invalid Credentials', async () => {
  await request.post('/v0/login').set({'Content-Type': 'application/json'})
    .send(JSON.stringify({email: 'fake@books.com', password: 'user'}))
    .expect(401);
});

test('Tampered Bearertoken', async () => {
  const user = {username: 'Molly Member',
    email: 'molly@books.com', password: 'mollymember'};
  let bearertoken;
  await request.post('/v0/login').set({'Content-Type': 'application/json'})
    .send(user)
    .expect(200)
    .then((res) => {
      bearertoken = res.body;
    });
  await request.get('/v0/mail?mailbox=pinbox')
    .set({'Authorization': ('Bearer' + bearertoken.accessToken)})
    .expect(403);
});

test('No Bearertoken', async () => {
  const user = {username: 'Molly Member',
    email: 'molly@books.com', password: 'mollymember'};
  await request.post('/v0/login').set({'Content-Type': 'application/json'})
    .send(user)
    .expect(200);
  await request.get('/v0/mail?mailbox=pinbox')
    .expect(401);
});

// get valid mailbox
test('GET Inbox', async () => {
  const user = {username: 'Molly Member',
    email: 'molly@books.com', password: 'mollymember'};
  let bearertoken;
  await request.post('/v0/login').set({'Content-Type': 'application/json'})
    .send(JSON.stringify(user))
    .expect(200)
    .then((res) => {
      bearertoken = res.body;
    });
  await request.get('/v0/mail?mailbox=Inbox')
    .set({'Authorization': (' Bearer ' + bearertoken.accessToken)})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(36);
      // iterate through inbox
      for (let i = 0; i < 35; i++) {
        expect(res.body[i]).toHaveProperty('opened');
        expect(res.body[i]).toHaveProperty('starred');
        expect(res.body[i]).toHaveProperty('avatar');
        expect(res.body[i]).toHaveProperty('displayAvatar');
        expect(res.body[i]).toHaveProperty('fromName');
        expect(res.body[i]).toHaveProperty('fromEmail');
        expect(res.body[i]).toHaveProperty('subject');
        expect(res.body[i]).toHaveProperty('content');
        expect(res.body[i]).toHaveProperty('received');
      }
    });
});
