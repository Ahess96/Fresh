const { expect } = require('chai');
const { describe, it, beforeEach, afterEach } = require('mocha');
const sinon = require('sinon');
const itemsCtrl = require('../controllers/api/items');
const pool = require('../config/database');

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
        clientMock = { query: sinon.stub(), release: sinon.spy() };
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