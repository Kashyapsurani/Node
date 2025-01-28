const http = require("http");
const port = 3000;
const fs = require("fs");

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/":
      fs.readFile("./index.html", (err, data) => {
        if (!err) {
          res.write(data);
        }
        res.end();
      });
      break;
    case "/about.html":
      fs.readFile("./about.html", (err, data) => {
        if (!err) {
          res.write(data);
        }
        res.end();
      });
      break;
    case "/contact.html":
      fs.readFile("./contact.html", (err, data) => {
        if (!err) {
          res.write(data);
        }
        res.end();
      });
      break;
    default:
      res.write("404 Not Found");
      res.end();
      break;
  }
});

server.listen(port, (err) => {
      if(err) {
        console.log(`Error: ${err}`);
        return false;
      }
  console.log('Server running at port'+port);
});
