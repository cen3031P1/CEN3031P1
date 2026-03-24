import {jest} from '@jest/globals';
import { resourceLimits } from 'node:worker_threads';
//This is a unit test for the login
//First we mock the database and make fake jwts
jest.unstable_mockModule('../server/models/user.js', () => ({
    default: {
        login: jest.fn(),
        signup: jest.fn(),
        findOne: jest.fn(), //these are used in the controller so they have to get mocked too
        find: jest.fn()
    }
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn()
    }
}));
//Using unstable_mockModule means i have to import the modules and then get the default export
const UserModule = await import('../server/models/user.js');
const jwtModule = await import('jsonwebtoken');
const User = UserModule.default;
const jwt = jwtModule.default;
//Need to import all functions from controller.js and other js files
const {login, signUp, getFriends, getLeaderboard, addFriend} =  await import('../server/controller.js');
//These imports come from the controllers imports
//Apparently jest assumes a different format? so i need require?
// const User = require('../server/models/user.js');
// const jwt = require('jsonwebtoken');
//test unit test
test('Jest works!', () => {
    expect(true).toBe(true);
});
//Mock requests to make the fake express request and response objects
//In the controller they have req and res but they also need to include a fake params for testing
const mockRequest = (body = {}, params = {}, query = {}) => {
    return { body, params, query };
};

const mockResponse = () => {
    const res = {}; //simulate res
    res.status = jest.fn().mockReturnValue(res); //mock function to keep track of args
    res.json = jest.fn().mockReturnValue(res); //mock function for res.json
    return res;
}

//describe is used for grouping, we want all these tests together
describe('Controller Unit Tests', () => {
    //before every test clear the old mock stuff
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //login test
    test('Login - Success', async () => {
        //Create mock request and response
        const req = mockRequest({ userName: 'FAKE-user', password: 'FAKE-password' });
        const res = mockResponse();
        //mock user.login from user.js --> login in controller uses _id
        User.login.mockResolvedValue({ _id: 'FAKE-userid' });
        //mock jwt.sign from jsonwebtoken
        jwt.sign.mockReturnValue('FAKE-jwttoken');
        //call the controller function (async so we await)
        await login(req, res);

        //now we make sure it's correct
        expect(res.status).toHaveBeenCalledWith(200); //should return 200 status

        //assert that we're using the right data (HOW it got this answer)
        expect(res.json).toHaveBeenCalledWith({ 
            username: 'FAKE-user', token: 'FAKE-jwttoken' }); //exclude password because of security i think
        });
    });
    test('Sign Up - Success', async () => {
        const req = mockRequest({ userName: 'FAKE-user2', password: 'FAKE-password2' });
        const res = mockResponse();
        User.signup.mockResolvedValue({ _id: 'FAKE-userid2' });
        jwt.sign.mockReturnValue('FAKE-jwttoken2');
        await signUp(req, res);

        expect(User.signup).toHaveBeenCalledWith('FAKE-user2', 'FAKE-password2');
        expect(res.status).toHaveBeenCalledWith(201); //This is 201 in the controller
        expect(res.json).toHaveBeenCalledWith({
            username: 'FAKE-user2', token: 'FAKE-jwttoken2' });
    });
    test('Get Friends - Success', async () => {
        const req = mockRequest({}, { userName: 'FAKE-user3' });
        const res = mockResponse();
        User.findOne.mockResolvedValue({ friends: ['susie', 'sally'] });
        await getFriends(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ userName: 'FAKE-user3' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ friends: ['susie', 'sally'] });
    });
    test('Add Friend - Success', async () => {
        const req = mockRequest({ userName: 'FAKE-user1' , friendUsername: 'susie' });
        const res = mockResponse();
        const fakeUser = { userName: 'FAKE-user4', friends: [], save: jest.fn() }; //User with no friends
        const fakeFriend = { userName: 'susie' }; //Friend to add

        //If its called with user1 then return the user with no friends, if its called with susie then return the friend
        User.findOne.mockImplementation(({ userName }) => {
            if (userName === 'FAKE-user1') {
                return Promise.resolve(fakeUser);
            } else if (userName === 'susie') {
                return Promise.resolve(fakeFriend);
            }
        });
        await addFriend(req, res);
        expect(User.findOne).toHaveBeenCalledWith({ userName: 'FAKE-user1' }); //who is adding the friend
        expect(User.findOne).toHaveBeenCalledWith({ userName: 'susie' }); //who is being added as a friend
        expect(fakeUser.friends).toContain('susie'); //check that susie was added to the friends list
        expect(fakeUser.save).toHaveBeenCalled(); //check if saved
        expect(res.status).toHaveBeenCalledWith(200); //check status
        expect(res.json).toHaveBeenCalledWith({ msg: 'Friend added successfully', code: 'FRIEND_ADDED' }); //check response... comes straight from controller
    });
    test('Get Leaderboard - Success', async () => {
        const req = mockRequest({}, {}, { sortBy: 'points' });
        const res = mockResponse();
        //Make fake leaderboard
        const fakeLeaderboard = [
            { userName: 'sandy', points: 500 },
            { userName: 'sam', points: 50 },
            { userName: 'shakira', points: 5 },
        ];
        //User.find.mockResolvedValue(fakeLeaderboard); This fails and gives a 500 error because of the difference in .sort() and 
        //Mock find, mock return value, mock sort THEN mock limit
        User.find.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue(fakeLeaderboard)
            })
        });
        await getLeaderboard(req, res);

        expect(User.find).toHaveBeenCalledWith({}, 'userName points'); //should only select username and points
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ leaderboard: fakeLeaderboard });
    });
