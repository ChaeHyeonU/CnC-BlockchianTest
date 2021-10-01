const fs = require('fs');//filesystem
const merkle = require('merkle');
const CryptoJs = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
const random = require('random')
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

let Blocks = [createGenesisBlock()]
console.log(Blocks)

function getBlocks(){
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
    const time = getCurrentTime()

    const MerkleTree = merkle('sha256').sync(data)
    const merkleRoot = MerkleTree.root() || '0'.repeat(64)

    const header = new BlockHeader(version,index,previousHash,time,merkleRoot)
    return new Block(header,data)
}


function getVersion(){
    const {version} =  JSON.parse(fs.readFileSync("./package.json"))
    return version
}

function getCurrentTime(){
    return Math.ceil(new Date().getTime()/1000)
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


function addBlock(newBlock){
    if(isValidNewBlock(newBlock, getLastBlock())){
        Blocks.push(newBlock);
        return true;
    }
    return false;
}

function mineBlock(blockData){
    const newBlock = nextBlock(blockData)
    if(addBlock(newBlock)){
        const nw = require('./network')
        nw.broadcast(nw.responseLastMsg())
        return newBlock
    } else {
        return null
    }
}

function replaceBlock(newBlocks){
    if (isValidBlocks(newBlocks) && newBlocks.length > Blocks.length && random.boolean()) {
        console.log(`Blocks 배열을 newBlocks 로 교체.`)
        const nw = require('./network')
        Blocks = newBlocks
        nw.broadcast(nw.responseLastMsg())
    } else {
        console.log(`메시지로부터 받은 블록배열이 맞지 않습니다.`)
    }
}

function isValidNewBlock(currentBlock, previousBlock){
    
    if(!isValidType(currentBlock)){
        console.log(`invalid block structure ${JSON.stringify(currentBlock)}`)
        return false
    }

    if(previousBlock.header.index + 1 !== currentBlock.header.index){
        console.log(`invalid index`)
        return false
    }

    if(createHash(previousBlock) !== currentBlock.header.previousHash){
        console.log(`invaild previousBlock`)
        return false
    }

    if (currentBlock.body.length === 0) {
        console.log(`invaild body`)
        return false
    }

    if (merkle("sha256").sync(currentBlock.body).root() !== currentBlock.header.merkleRoot) {
        console.log(`invalid merkleRoot`)
        return false
    }
    return true
}

function isValidType(block){
    return (
        typeof(block.header.version) === "string" &&
        typeof(block.header.index) === "number" &&
        typeof(block.header.previousHash) === "string" &&
        typeof(block.header.time) === "number" &&
        typeof(block.header.merkleRoot) === "string" &&
        typeof(block.body) === "object"
        )
}

function isValidBlocks(Blocks){
    if (JSON.stringify(Blocks[0]) !== JSON.stringify(createGenesisBlock())){
        console.log('genesis error')
        return false
    }

    let tempBlocks = [Blocks[0]]
    for (let i = 1; i < Blocks.length; i++){
        if(isValidNewBlock(Blocks[i], tempBlocks[i-1])){
            tempBlocks.push(Blocks[i])
        } else {
            return false
        }
    }

    return true
}

