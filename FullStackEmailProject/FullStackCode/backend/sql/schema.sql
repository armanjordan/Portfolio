--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
-- person table --
DROP TABLE IF EXISTS mail, mailbox, person;
CREATE TABLE person(email VARCHAR(32) PRIMARY KEY, username VARCHAR(32), password VARCHAR(128));
-- mailbox table --
-- DROP TABLE IF EXISTS mailbox;
CREATE TABLE mailbox(identifier VARCHAR(64) PRIMARY KEY, owner VARCHAR(32) REFERENCES person(email), label VARCHAR(32));
-- mail table --
-- DROP TABLE IF EXISTS mail;
CREATE TABLE mail(destination VARCHAR(64) REFERENCES mailbox(identifier), opened VARCHAR(32), starred VARCHAR(32), avatar VARCHAR(512), displayavatar VARCHAR(32), mailbox VARCHAR(32), fromname VARCHAR(32), fromemail VARCHAR(32), toemail VARCHAR(32), subject VARCHAR(32), content VARCHAR(32), sent VARCHAR(32), received VARCHAR(32));
