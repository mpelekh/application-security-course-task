const tls = require("tls");
const fs = require("fs");
const path = require("path");

const options = {
  ca: fs.readFileSync(
    path.join(__dirname, "../../certification-authority/ca-crt.pem")
  ),
  key: fs.readFileSync(path.join(__dirname, "./key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./certificate.pem")),
  host: "localhost",
  port: 8000
};

const socket = tls.connect(options, () => {
  console.log(
    "Connection to server - ",
    socket.authorized ? "authorized" : "unauthorized"
  );
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
