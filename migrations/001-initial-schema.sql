-- Up 
CREATE TABLE users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, user TEXT, password_hash TEXT, salary TEXT, salt TEXT, initialization_vector TEXT, auth_tag TEXT);
 
-- Down 
DROP TABLE users