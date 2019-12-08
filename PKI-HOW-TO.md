# Node.js TLS plain TLS sockets

This guide shows how to set up a bidirectional client/server authentication for plain TLS sockets. 

## Prepare certificates

Generate a Certificate Authority:
```shell
openssl req -new -x509 -days 9999 -keyout ca-key.pem -out ca-crt.pem
```
- Insert a CA Password
- Specify a CA Common Name, like 'root.localhost' or 'ca.localhost'. __This MUST be different from both server and client CN__.

### Server certificate

Generate Server Key:
```shell
openssl genrsa -out server-key.pem 4096
```
Generate Server certificate signing request:
```shell
openssl req -new -key server-key.pem -out server-csr.pem
```
- Specify server Common Name, like 'localhost' or 'server.localhost'. __The client will verify this, so make sure you have a vaild DNS name for this__.
- For this example, do not insert the challenge password.

Sign certificate using the CA:
```shell
openssl x509 -req -days 9999 -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem
```
- insert CA Password

Verify server certificate:
```shell
openssl verify -CAfile ca-crt.pem server-crt.pem
```
### Client certificate

Generate Client Key:
```shell
openssl genrsa -out client1-key.pem 4096
```
Generate Client certificate signing request:
```shell
openssl req -new -key client1-key.pem -out client1-csr.pem
```
- Specify client Common Name, like 'client.localhost'. Server should not verify this, since it should not do reverse-dns lookup.
- For this example, do not insert the challenge password.

Sign certificate using the CA:
```shell
openssl x509 -req -days 9999 -in client1-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client1-crt.pem
```
- insert CA Password

Verify client certificate:
```shell
openssl verify -CAfile ca-crt.pem client1-crt.pem
```

## Server code

```javascript
const tls = require('tls');
const fs = require('fs');

const options = { 
    key: fs.readFileSync('server-key.pem'), 
    cert: fs.readFileSync('server-crt.pem'), 
    ca: fs.readFileSync('ca-crt.pem'), 
    requestCert: true, 
    rejectUnauthorized: true
}; 

const server = tls.createServer(options, (socket) => {
    console.log('server connected', 
        socket.authorized ? 'authorized' : 'unauthorized');
    
    socket.on('error', (error) => {
        console.log(error);
    });
    
    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(process.stdout);
    socket.pipe(socket);
});

server.listen(8000, () => {
    console.log('server bound');
});
```

## Client code

```javascript
const tls = require('tls');
const fs = require('fs');

const options = {
    ca: fs.readFileSync('ca-crt.pem'),
    key: fs.readFileSync('client1-key.pem'),
    cert: fs.readFileSync('client1-crt.pem'),
    host: 'server.localhost',
    port: 8000,
    rejectUnauthorized:true,
    requestCert:true
};

const socket = tls.connect(options, () => {
    console.log('client connected', 
        socket.authorized ? 'authorized' : 'unauthorized');
    process.stdin.pipe(socket);
    process.stdin.resume();
});

socket.setEncoding('utf8');

socket.on('data', (data) => {
    console.log(data);
});

socket.on('error', (error) => {
    console.log(error);
});

socket.on('end', (data) => {
    console.log('Socket end event');
});