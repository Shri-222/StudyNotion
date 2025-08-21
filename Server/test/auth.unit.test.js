
// unit test for the login 

const { expect } = require('chai');
const User = require('../model/User');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const { login } = require('../controller/Auth/Login');
const jwt = require('jsonwebtoken');

describe('Login Controller unit testing ', () => {

    afterEach(() => sinon.restore());

    it('should return token on valid credential', async () => {

         // Fake req & res
        const req = {
            body: { email: 'test@example.com', password: 'hashed' }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            cookie: sinon.stub().returnsThis()   
        };

        // stub the DB and bcrypt
        sinon.stub(User, 'findOne').returns({
            select : () => Promise.resolve({
                _id: '123',
                firstname:'unit', 
                lastname:'testing', 
                email: 'test@example.com', 
                password: 'hashed'
            })
        });

        sinon.stub(bcrypt, 'compare').resolves(true);
        sinon.stub(jwt, 'sign').returns('fakeToken');

        await login(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ Token: 'fakeToken' })).to.be.true;
    })

    it('should throw an error if user is not found', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'hashed' }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        sinon.stub(User, 'findOne').resolves(null);

        try {
            await login(req, res);
        } catch (error) {
            expect(error.message).to.equal('User not Found');
        }
    })

    it('should throw error if password is incorrect', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'wrongpassword' }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        sinon.stub(User, 'findOne').resolves({_id: '123', firstname:'unit', lastname:'testing', email: 'test@example.com', password: 'hashed'})

        try {
            await login(req, res);
        } catch (error) {
            expect(error.message).to.equal('Invalid email or password.');
        }
    })
} )