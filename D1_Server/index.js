const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
    res.write('Hello, World!');
    res.end();
});

server.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
        return false;
    }
    console.log('Server running at port' +port);
});