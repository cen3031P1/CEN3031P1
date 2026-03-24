import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import User from '../server/models/user.js';
import { login, signUp } from '../server/controller.js';
//Hopefully this allows jwt token problem
process.env.JWT_SECRET = 'testsecret';

//This is basically straight from this: https://dev.to/ali_adeku/guide-to-writing-integration-tests-in-express-js-with-jest-and-supertest-1059
    let mongod;
//These just start and clean the mongo instance
    beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
    });
    afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongod.stop();
    });
    afterEach(async () => {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
      }
    });
    //Same as other unit tests but this uses real stuff
    const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    describe('Integration Tests', () => {
        test('Integration Test - Login', async () => {
            //Sign up new user with database - cant use dash here apparently
            const signUpReq = mockRequest({ userName: 'INTEGRATIONuser', password: 'Password123!!' });
            const signUpRes = mockResponse();
            await signUp(signUpReq, signUpRes);
            expect(signUpRes.status).toHaveBeenCalledWith(201); //Fail is 400
            //Now try to log in with that user
            const loginReq = mockRequest({ userName: 'INTEGRATIONuser', password: 'Password123!!' });
            const loginRes = mockResponse();
            await login(loginReq, loginRes);
            expect(loginRes.status).toHaveBeenCalledWith(200);
        });
});