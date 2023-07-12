const { expect } = require('chai');
const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');
const itemsCtrl = require('../controllers/api/items');
const pool = require('../config/database');
const { query } = require('express');

describe('getQueriedItems', function() {
    let req, res, next, clientMock
    beforeEach(function() {
        // mock req/res objects
        req = {};
        res = {
            status: sinon.stub().returnsThis(), // stub res.status and return the object itself
            json: sinon.stub(), // stub res.json
        };
        // spy on next function
        next = sinon.spy();
        clientMock = { 
            query: sinon.stub(), 
            release: sinon.spy() 
        };
    });
    
    // required to restore spies and stubs
    afterEach(function() {
        sinon.restore();
    });

    it('should retrieve items matching the query and return JSON response', async function() {
        const expectedItems = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
        ];

        // return the client mock
        sinon.stub(pool, 'connect').resolves(clientMock);

        // this query should return expected items
        clientMock.query.resolves({ rows: expectedItems });

        await itemsCtrl.getQueriedItems(req, res, next);

        // response status should be 200
        expect(res.status.calledWithExactly(200)).to.be.true;

        // JSON should contain expected items
        expect(res.json.calledWithExactly(expectedItems)).to.be.true;

        // release method should be called
        expect(clientMock.release.calledOnce).to.be.true;
    });

    it('should send a 500 response with errors', async function() {
        const expectedErr = new Error('Test Error');

        // pool.connect() method should return clientMock
        sinon.stub(pool, 'connect').resolves(clientMock);

        // clientMock.query should throw error
        clientMock.query.rejects(expectedErr);

        await itemsCtrl.getQueriedItems(req, res, next);

        //Assert that next function is to be called with error
        expect(next.calledWithExactly(expectedErr)).to.be.true;

        // release
        expect(clientMock.release.calledOnce).to.be.true;
    });
});

describe('getItemDetails', function() {
    let req, res, next, clientMock;
    beforeEach(function() {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.spy();
        clientMock = {
            query: sinon.stub(),
            release: sinon.spy()
        };
    });

    afterEach(function() {
        sinon.restore();
    });
    
    it('should retrieve features and possible color configurations of a particular item', async function() {
        const expectedDetails = {
            "id":12006,
            "name":"Practical Granite Pants",
            "price":"150.00",
            "description":"New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
            "sku":"4e83098a-c470-4e3e-8d1f-e752dbae26df",
            "colors":["fuchsia","indigo","ivory","lavender","magenta","olive","pink","plum","red","turquoise","yellow"],
            "features":["Awesome","Fantastic","Modern","Oriental","Practical","Recycled","Rustic","Tasty","Unbranded"]
        }

        sinon.stub(pool, 'connect').resolves(clientMock);

        clientMock.query.resolves({ rows: [expectedDetails] });

        await itemsCtrl.getItemDetails(req, res, next);

        expect(res.status.calledWithExactly(200)).to.be.true;
        expect(res.json.calledWithExactly(expectedDetails)).to.be.true;
        expect(clientMock.release.calledOnce).to.be.true;
    });

    it('should send a 500 response with errors', async function() {
        const expectedErr = new Error('Test Error');

        // pool.connect() method should return clientMock
        sinon.stub(pool, 'connect').resolves(clientMock);

        // clientMock.query should throw error
        clientMock.query.rejects(expectedErr);

        await itemsCtrl.getQueriedItems(req, res, next);

        //Assert that next function is to be called with error
        expect(next.calledWithExactly(expectedErr)).to.be.true;

        // release
        expect(clientMock.release.calledOnce).to.be.true;
    });
});

describe('getItemReviews', function() {
    let req, res, next, clientMock;

    beforeEach(function() {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.spy();
        clientMock = {
            query: sinon.stub(),
            release: sinon.spy()
        };
    });

    afterEach(function() {
        sinon.restore();
    });
    
    it('should retrieve all reviews and review information about a particular item', async function() {
        const expectedReviews = [
            {"content":"Neque deserunt nobis ducimus ratione est atque maxime cum veritatis. Amet consequatur doloribus nulla minima minus animi praesentium voluptatibus. Mollitia facilis voluptates expedita quasi. Totam velit natus unde dolor officiis atque vitae voluptates praesentium. Fugit distinctio voluptatem atque porro quam veniam illo ducimus adipisci.","item_id":12008,"user_id":2223,"id":25888,"rating":5},
            {"content":"Dolores iure quis pariatur sed quos. Animi laborum quidem rerum. Nostrum et debitis esse dolor natus nostrum.","item_id":12008,"user_id":742,"id":25889,"rating":1}];

            sinon.stub(pool, 'connect').resolves(clientMock);

            clientMock.query.resolves({ rows: [expectedReviews] });
    
            await itemsCtrl.getItemDetails(req, res, next);
    
            expect(res.status.calledWithExactly(200)).to.be.true;
            expect(res.json.calledWithExactly(expectedReviews)).to.be.true;
            expect(clientMock.release.calledOnce).to.be.true;
    });

    it('should send a 500 response with errors', async function() {
        const expectedErr = new Error('Test Error');

        // pool.connect() method should return clientMock
        sinon.stub(pool, 'connect').resolves(clientMock);

        // clientMock.query should throw error
        clientMock.query.rejects(expectedErr);

        await itemsCtrl.getQueriedItems(req, res, next);

        //Assert that next function is to be called with error
        expect(next.calledWithExactly(expectedErr)).to.be.true;

        // release
        expect(clientMock.release.calledOnce).to.be.true;
    });
});

describe('getUser', function() {
    let req, res, next, clientMock;
    
    beforeEach(function() {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.spy();
        clientMock = {
            query: sinon.stub(),
            release: sinon.spy()
        };
    });

    afterEach(function() {
        sinon.restore();
    });

    it('should retrieve all information about a particular user', async function() {
        const expectedUser = {
            "name":"Marty Schaden",
            "address":"1192 Wiza Spur",
            "id":614
        };
        sinon.stub(pool, 'connect').resolves(clientMock);

        clientMock.query.resolves({ rows: [expectedUser] });

        await itemsCtrl.getItemDetails(req, res, next);

        expect(res.status.calledWithExactly(200)).to.be.true;
        expect(res.json.calledWithExactly(expectedUser)).to.be.true;
        expect(clientMock.release.calledOnce).to.be.true;
    });

    it('should send a 500 response with errors', async function() {
        const expectedErr = new Error('Test Error');

        sinon.stub(pool, 'connect').resolves(clientMock);

        clientMock.query.rejects(expectedErr);

        await itemsCtrl.getQueriedItems(req, res, next);

        expect(next.calledWithExactly(expectedErr)).to.be.true;

        expect(clientMock.release.calledOnce).to.be.true;
    });
})