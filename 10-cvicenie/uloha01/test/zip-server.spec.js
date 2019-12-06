const assert = require("assert");
const server = require('../src/zip-server');
const client = require('../src/zip-client');
const crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');

describe("Zipper Tests", function() {

    it("Server disconnect when receiving file", function() {

    });
    it("Client disconnect when receiving zipped file", function() {

    });
    it("File is correctly sent", function() {
        let port = 5634;
        let file = `${__dirname}/testfile.bin`;

        const srv = server(`${__dirname}/testdir`).listen(port);
        
        client(port, file).on('finish', () => {
            srv.close();
        });

        const f1 = fs.readFileSync(file);
        const f2 = fs.readFileSync(`${__dirname}/testdir/testfile.bin`);

        const h1 = crypto.createHash('sha1').update(f1).digest().toString();
        const h2 = crypto.createHash('sha1').update(f2).digest().toString();

        assert(h1 === h2);


    });
});