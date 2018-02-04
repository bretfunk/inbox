const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

//async needs to be added to the params and declare variable beforehand
//if you want to access to a var inside a before each inside of an it block
//need to define the var ahead of time with let keyword
//The await operator is used to wait for a Promise.
//It can only be used inside an async function.
let accounts;
let inbox;

beforeEach(async () => {
  //web3.eth.getAccounts()
  //.then(fetchedAccounts => {
    //console.log(fetchedAccounts);
  //});
  //above is the old way, below is with async await
  accounts = await web3.eth.getAccounts();

  //capitalized because it is a constructor
  inbox = await new web3.eth.Contract(JSON.parse(interface))
  //since the contract is initalized with a word you have to pass it in
  .deploy({ data: bytecode, arguments: ['Hi there!'] })
  //from the first account, one mil gas limit
  .send({ from: accounts[0], gas: '1000000' })
  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });

  it('can change the message', async () => {
    //modifying data so need to use send, not call
    //need to say WHO is sending/paying
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  })
});

//class Car {
  //park() {
    //return 'stopped';
  //}

  //drive() {
    //return 'vroom';
  //}
//}

//let car;

//beforeEach(() => {
  //car = new Car();
//});

//describe('Car', () => {

  //it('can park', () => {
    //assert.equal(car.park(), 'stopped');
  //});

  //it('can drive', () => {
    //assert.equal(car.drive(), 'vroom');
  //});
//});
