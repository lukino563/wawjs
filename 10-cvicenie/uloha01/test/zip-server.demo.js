const server = require('../src/zip-server');
const client = require('../src/zip-client');
const port = 5634;

const srv = server('testdir').listen(port, ()=> {
    console.log('Server listening');
});

client(port, 'testfile.bin').on('finish', () => {
    srv.close();
});