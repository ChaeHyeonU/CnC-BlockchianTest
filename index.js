const fs = require("fs");
const potentialbuffer = fs.readFileSync('./GiChul_backup/gichulgenerator-potential-export.json')
const answerbuffer = fs.readFileSync('./GiChul_backup/gichulgenerator-answer-export.json')
const potentialJSON = JSON.parse(potentialbuffer)
const answerJSON = JSON.parse(answerbuffer)


//console.log(answerJSON["2015"].gyoyuk["3"].imath)

var fstring = ""

function random_item(items){
    return items[Math.floor(Math.random()*items.length)];
}
function weight_random(){
    
}
var ran0 = random_item(Object.keys(potentialJSON))
console.log(ran0)
var ran1 = random_item(Object.keys(potentialJSON[ran0]))
console.log(ran1)
var ran2 = random_item(Object.keys(potentialJSON[ran0][ran1]))
console.log(ran2)
var ran3 = random_item(Object.keys(potentialJSON[ran0][ran1][ran2]))
console.log(ran3)

const buf = potentialJSON[ran0][ran1][ran2][ran3]

console.log(buf)