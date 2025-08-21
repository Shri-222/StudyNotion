
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../model/User');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt')

let mongoServer;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    //Seed a test User 

    await User.create({
        firstName: 'test',
        lastName: ' user',
        email: 'user@example.com',
        password: "hashedPassword",
        accountType: 'Student',
        contactNumber: '1234567889',
        otp: '123456'
    })
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

describe(' Password Reset Flow',  () => {

    it('should request password reset and return success', async () => {

         await request(app)
            .post('/api/v1/profile/forgot-password-token')
            .send({
                email: 'user@example.com'
            })
            .expect(200);

        const userWithToken = await User.findOne({ email : 'user@example.com' })
        expect(userWithToken.changePasswordToken).toBeDefined();


        const rep = await request(app)
            .post('/api/v1/profile/reset-password')
            .send({
                token: userWithToken.changePasswordToken,
                password: 'newpassword',
                confirmPassword: 'newpassword'
            })

        expect(rep.statusCode).toBe(200);
        expect(rep.body).toHaveProperty('success', true);


        // Verify the password has been updated

        let updatedUser;
        for (let i = 0; i < 5; i++) {
            updatedUser = await User.findOne({ email: 'user@example.com' }).select('+password');

            if (updatedUser && updatedUser.password ) {
                break;
            }

            await new Promise((r) => setTimeout(r, 100)); // wait 100ms
        }
        console.log("Updated User Password:",updatedUser.password);

        const isMatch = await bcrypt.compare('newpassword', updatedUser.password);
        console.log("Updated User Password Match:", isMatch);
        expect(isMatch).toBe(false);
    })
})