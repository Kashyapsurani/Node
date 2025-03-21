const http = require("http");
const port = 8000;

const server = http.createServer((req, res) => {

  if (req.url === "/") {
    res.end("Welcome to the Home Page!");
  } else if (req.url === "/about") {
    res.end("This is the About Page.");
  } else if (req.url === "/contact") {
    res.end("This is the contect Page.");
  } else {
    res.end("404 Not Found");
  }
});

server.listen(port, (err) => {
  if (err) {
    console.log(`Error: ${err}`);
    return false;
  }
  console.log(`Custom Server running at http://localhost:${port}`);
});
