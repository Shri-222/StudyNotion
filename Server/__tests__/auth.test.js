
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../model/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    // spin up an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);


    //Seed a test user 
    
    await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'user@example.com',
        password: 'password123',
        accountType: 'Student',
    });
});

afterAll( async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
})

// Force close open handles (optional fallback)
afterAll(done => {
    setImmediate(done);
});


describe('POST /api/v1/users/login', () => {
    it('should return 200 and a token for valid credentials', async () => {

        const response = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'user@example.com',
                password: 'password123'
            })

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('Token');
    })

    it('should return 401 for invalid credentials', async () => {

        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'user@example.com',
                password: 'wrongpassword'
            })

        expect(res.statusCode).toBe(401);
    })

        it('should return 401 for invalid credentials', async () => {

        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'use@example.com',
                password: 'wrongpassword'
            })

        expect(res.statusCode).toBe(401);
    })
})