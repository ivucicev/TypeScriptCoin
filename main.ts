const crypt = require('cryptojs');

class Block {

    private _index: number;
    private _timestamp: number;
    private _data: any;
    private _previousHash: string;
    private _hash: string;
    private _nonce: number;

    constructor(index, timestamp, data, previousHash = '') {
        this._index = index;
        this._timestamp = timestamp;
        this._data = data;
        this._previousHash = previousHash;
        this._hash = this.calculateHash();
        this._nonce = -1;
    }
    
    private calculateHash() {
        return crypt.Crypto.SHA256(this._index + this._previousHash + this._timestamp + JSON.stringify(this._data) + this._nonce).toString();
    }

    public mineBlock(difficulty) {
        while(this._hash.substring(0, difficulty) !== new Array(difficulty + 1).join("0")) {
            this._nonce++;
            this._hash = this.calculateHash();
            console.log("NONCE: ", this._nonce, "HASH: ", this._hash);
        }
    }

}

class Blockchain {
    
    private _chain;
    private _difficulty;

    constructor() {
        this._chain = [this.createGenesisBlock()];
        this._difficulty = 3;
    }

    private createGenesisBlock() {
        return new Block(0, '01/01/2017', "Genesis Block", "0");
    }

    private getLatestBlock() {
        return this._chain[this._chain.length - 1];
    }

    private isValid() {
        for(let i = 1; i < this._chain.length; i++) {
            const current = this._chain[i];
            const previousHash = this._chain[i - 1];
            if (current.hash !== current.calculateHash()) {
                return false;
            }
            if (current.previousHash !== previousHash.hash) {
                return false;
            }
        }
        return true;
    }

    public addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this._difficulty);
        this._chain.push(newBlock);
    }

    
    public showBlockChain() {
        console.log(JSON.stringify(this._chain, null, 4));
    }

}

let coin = new Blockchain();

console.time();
coin.addBlock(new Block(1, "10/07/2016", { amount: 41, from: "One", to: "Two"}));
console.timeEnd();

coin.showBlockChain();