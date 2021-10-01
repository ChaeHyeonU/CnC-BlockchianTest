const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const bodyParser = require('body-parser')
const bc = require('./block.js')
const ws = require('./network.js')

app.use(bodyParser.json())

app.get("/blocks",(req,res)=>{
    res.send(bc.getBlocks())
})

app.get("/version",(req,res)=>{
   res.send(bc.getVersion()) 
})

app.post("/mineBlock",(req,res)=>{
    const data = req.body.data
    const result = bc.mineBlock(data)
    if(result === null){
        res.status(400).send('error: cannot add block')
    } else {
        res.send(result)
    }
})

app.get('/peers',(req,res)=>{
    res.send(ws.getSockets().map(socket => {
        return `$socket._socket.remoteAddress}:${socket._socket.remotePort}`;
    }))
})

app.post('/addPeers',(req,res)=>{
    const peers = req.body.peers
    ws.connectionToPeers(peers)
    res.send('success')
})

app.get('/stop', (req,res)=>{
    res.send("Server Stop")
    process.exit(0)
})

ws.wsInit()
app.listen(port, () => {
    console.log(`server start port ${port}`)
})