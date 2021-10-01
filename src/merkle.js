const {MerkleTree} = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

const testSet = ['a','b','c','c'];
const testArray = testSet.map((v)=>SHA256(v));
const tree = new MerkleTree(testArray,SHA256);
const root = tree.getRoot();

const testRoot = 'a';
const leaf = SHA256(testRoot);
const proof = tree.getProof(leaf);
console.log(tree.verify(proof,leaf,root));
console.log(tree.verify(tree.getProof(leaf),SHA256('a'),tree.getRoot()));
console.log(tree.toString());