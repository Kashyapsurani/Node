const http = require('http');

const server = http.createServer((req, res) => {
    res.write('Hello, World!');
    res.end();
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});