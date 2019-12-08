const tls = require("tls");
const fs = require("fs");
const path = require("path");
const { getUserInfo } = require("./user-info");

const options = {
  ca: fs.readFileSync(
    path.join(__dirname, "../../certification-authority/ca-crt.pem")
  ),
  key: fs.readFileSync(path.join(__dirname, "./client1-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./client1-crt.pem")),
  host: "localhost",
  port: 8000
};
const CLIENT_NAME = "client1";

const socket = tls.connect(options, async () => {
  console.log(
    "Connection to server - ",
    socket.authorized ? "authorized" : "unauthorized"
  );

  const userInfo = await getUserInfo();
  const data = {
    clientName: CLIENT_NAME,
    ...userInfo
  };
  socket.write(JSON.stringify(data));
});

socket.setEncoding("utf8");

socket.on("data", data => {
  console.log(data);
});

socket.on("error", error => {
  console.error(error);
});

socket.on("end", data => {
  console.log("Socket end event");
});
