const http = require("http");
const port = 8000;
const fs = require("fs");

const server = http.createServer((req, res) => {
  let filename = "";
  switch (req.url) {
    case "/":
      filename = "./index.html";
      break;
    case "/about.html":
      filename = "./about.html";
      break;
    case "/contact.html":
      filename = "./contact.html";
      break;
    default:
      res.write("404 Not Found");
      res.end();
      break;
  }
  fs.readFile(filename, (err, data) => {
    if (!err) {
      res.write(data);
      res.end();
    }
  });
});

server.listen(port, (err) => {
  if (err) {
    console.log(`Error: ${err}`);
    return false;
  }
  console.log("Server running at port" + port);
});
