const assert = require("assert");
const server = require('../src/zip-server');
const client = require('../src/zip-client');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const port = 5634;
const file = `${__dirname}/testfile.bin`;
const dir = `${__dirname}/testdir`;

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

describe("Zipper Tests", function() {

    it("Server is unreachable", async function() {
    
        client(port, file);
        await sleep(1000);
        assert(!fs.existsSync(`${__dirname}/${path.parse(file).base}.gz`));

    });
    it("File is correctly sent", function() {

        const srv = server(dir).listen(port);
        
        client(port, file).on('finish', () => {
            srv.close();
        });

        srv.on('finish', ()=> {

            const f1 = fs.readFileSync(file);
            const f2 = fs.readFileSync(`${dir}/testfile.bin`);
    
            const h1 = crypto.createHash('sha1').update(f1).digest().toString();
            const h2 = crypto.createHash('sha1').update(f2).digest().toString();
    
            console.log(h1, h2);
            assert(h1 == h2);

        });

    });
});