# Application Security course

## Home task 1

Implement Authenticator app ( script / class / function ) skeleton with basic login and sign-up (registration) functionality  
**will be extended in the future*

**Requirements:**

Functionality:
- Signup (account creation: user and password should be enough)
- Login (username and password checking routine)
- Credentials storage (filesystem: text, binary file, local db)
- [optional] password hashing / salting / stretching, multiple accounts (authorization levels), encryption. All optional topics will be covered in the future sessions

Programming language:
- any. Understandability of code is our friend! ;)
- [optional] it should be possible to run/compile app without extra overhead. HOWTO guides are welcome

## Home task 2
- Set up PKI for client and server communcation.
- Use pbkdf2/scrypt/bcrypt to hash and keep password.

OpenSSL library was used to set up PKI.  
How To is [here](https://github.com/mpelekh/application-security-course-task/blob/master/PKI-HOW-TO.md).
