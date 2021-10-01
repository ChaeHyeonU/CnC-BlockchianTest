const fs = require('fs');//filesystem
const merkle = require('merkle');
const CryptoJs = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
let index = 0;

function createGenesisBlock(){
    const version = getVersion()
    const timestamp = parseInt(Date.now()/1000)
    const previousHash =  '0'.repeat(64)
    const body = ['hello block']
    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)

    const header = new BlockHeader(version,index,previousHash,timestamp,root)
    return new Block(header,body)
}

function getVersion(){
    const package = fs.readFileSync("./package.json");
    return JSON.parse(package).version;
};

class BlockHeader {
    constructor(version,index,previousHash,timestamp,merkleRoot){//header를 만들 인잣값들
        this.version = version//1{version:1}
        this.index = index
        this.previousHash = previousHash
        this.timestamp = timestamp 
        this.merkleRoot = merkleRoot

    }

}

class Block{
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

const block=createGenesisBlock();
let Blocks = [createGenesisBlock()]
console.log(Blocks)

function getBlock(){
    return Blocks
}

function getLastBlock(){
    return Blocks[Blocks.length - 1]
}

function nextBlock(data){
    const prevBlock = getLastBlock()
    const version = getVersion()
    const index = prevBlock.header.index + 1
    const previousHash = createHash(prevBlock)
    const time = parseInt(Date.now()/1000);
    const MerkleTree = merkle('sha256').sync(data)
    const merkleRoot = MerkleTree.root() || '0'.repeat(64)
    const header = new BlockHeader(version,index,previousHash,time,merkleRoot)
    return new Block(header,data)
}


function createHash(data){
    const{
        version,
        index,
        previousHash,
        time,
        merkleRoot
    } = data.header
    const blockString = version+index+previousHash+time+merkleRoot
    const Hash = CryptoJs.SHA256(blockString).toString()
    return Hash
}


function addBlock(data){
    const newBlock = nextBlock(data);
    Blocks.push(newBlock);
}

