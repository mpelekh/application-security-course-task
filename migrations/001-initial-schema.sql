-- Up 
CREATE TABLE users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, user TEXT, password_hash TEXT, salt TEXT);
 
-- Down 
DROP TABLE users