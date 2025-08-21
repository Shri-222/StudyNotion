
process.env.NODE_ENV = 'test'; // Set environment to test


const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User =require('../model/User');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri =mongoServer.getUri();
    await mongoose.connect(uri)

    // Seed a test User Otp

    // await User.create({
    //     otp: '123456',
    // })

})

afterAll(async () => {
    mongoose.disconnect();
    mongoServer.stop();
})

afterAll(done => {
    setImmediate(done);
})

afterEach(async () => {
    await User.deleteMany();
})

describe('POST /api/v1/users/signup', () => {
    it('should return 201 and a token for valid credentials', async () => {
        
        const res = await request(app)
            .post('/api/v1/users/signup')
            .send({
                firstName : 'User', 
                lastName : 'Test',
                email : 'user@example.com',
                password : 'password',
                confirmPassword : 'password',
                accountType : 'Student',
                contactNumber : '1234567890',
                otp : '123456', 
            })

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('success', true);
            // expect(res.body).toHaveProperty('Token');
    })

    it('should return 400 and a token for valid credentials', async () => {
        
        const res = await request(app)
            .post('/api/v1/users/signup')
            .send({
                firstName : 'User', 
                lastName : 'Test',
                email : 'user@example.com',
                password : 'password',
                confirmPassword : 'password123',
                accountType : 'Student',
                contactNumber : '1234567890',
                otp: '123456', 
            })

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('success', false);
    })

    it('should return 400 and a token for valid credentials', async () => {
        
        const res = await request(app)
            .post('/api/v1/users/signup')
            .send({
                firstName : '', 
                lastName : 'Test',
                email : 'user@example.com',
                password : 'password',
                confirmPassword : 'password',
                accountType : 'Student',
                contactNumber : '1234567890',
                otp: '123456', 
            })

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('success', false);
    })

    // it('should return 400 and a token for valid credentials', async () => {
        
    //     const res = await request(app)
    //         .post('/api/v1/users/signup')
    //         .send({
    //             firstName : 'User', 
    //             lastName : 'Test',
    //             email : 'user@example.com',
    //             password : 'password',
    //             confirmPassword : 'password',
    //             accountType : 'Student',
    //             contactNumber : '1234567890',
    //             otp: '123456', 
    //         })

    //         expect(res.statusCode).toBe(400);
    //         expect(res.body).toHaveProperty('success', false);
    // })
})