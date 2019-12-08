const tls = require("tls");
const fs = require("fs");
const path = require("path");
const Authenticator = require("../authenticator");

const options = {
  key: fs.readFileSync(path.join(__dirname, "./server-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./server-crt.pem")),
  ca: fs.readFileSync(
    path.join(__dirname, "../certification-authority/ca-crt.pem")
  ),
  requestCert: true,
  rejectUnauthorized: false
};

const server = tls.createServer(options, socket => {
  console.log(
    "Client connected - ",
    socket.authorized ? "authorized" : "unauthorized"
  );

  if (!socket.authorized) {
    console.log("The client is not authorized. Closing connection.");
    socket.write("The client is not authorized. Closing connection.");
    socket.end();
  }

  socket.on("error", error => {
    console.error(error);
  });

  socket.setEncoding("utf8");

  socket.on("data", async data => {
    const { clientName, action, userInfo } = JSON.parse(data);
    console.log(`The data from ${clientName} has been obtained.`);

    switch (action) {
      case "login": {
        try {
          const { user, password } = userInfo;
          const isLoggedIn = await Authenticator.login({ user, password });
          let message = "";

          if (isLoggedIn) {
            message = `✔️  ${clientName} - Success login`;
          } else {
            message = `❌  ${clientName} - Wrong login or password`;
          }

          console.log(message);
          socket.write(message);
        } catch (error) {
          console.error(error.message);
        }
        break;
      }

      case "register": {
        const { firstName, lastName, user, password } = userInfo;

        try {
          const isRegistered = await Authenticator.register({
            firstName,
            lastName,
            user,
            password
          });
          let message = "";

          if (isRegistered) {
            message = `✔️  ${clientName} - Success registration`;
          } else {
            message = `❌  ${clientName} - The error is in input data. Try one more time`;
          }

          console.log(message);
          socket.write(message);
        } catch (error) {
          console.error(error.message);
        }
        break;
      }
    }
  });
});

server.listen(8000, () => {
  console.log("server bound");
});
