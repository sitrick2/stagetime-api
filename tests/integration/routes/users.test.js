const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');

let token;
let server;
let uploadData;
let me;

describe('/api/users', () => {
    beforeEach(async() => {
        server = require('../../../index');
        me = await User.create({
            first_name: 'David',
            last_name: 'Sitrick',
            email: "sitrick2@gmail.com",
            password : "TEST1234",
            address: {
                city: "Brooklyn",
                region: "New York",
                postal: "11238",
                country: "United States"
            } });

        token = await me.generateAuthToken();
        uploadData = {
            first_name: 'David',
            last_name: 'Sitrick',
            email: 'sitrick3@gmail.com',
            password: 'TEST1234',
            address: {
                city: "Brooklyn",
                region: "New York",
                postal: "11238",
                country: "United States"
            }
        }
    });

    afterEach( async () => {
        await User.deleteMany({});
        await server.close();
    });

    // describe('GET /', () => {
    //     it('should return 403 if logged in user is not an admin or host');
    //     it('should return 401 if user is not logged in');
    //     it('should return 200 if the user has permission and is logged in');
    //     it('should return all users if privileges allow');
    //     it('should only return users the logged in users role can manage');
    //     it('should not return password information');
    //     it('should not return login tokens');
    // });
    //
    // describe('GET /me', () => {
    //     it('should return 404 if user is not logged in');
    //     it('should return 200 if user is logged in');
    //     it('should return data for logged in user');
    //     it('should not return data for users other than logged in user');
    //     it('should not return password information');
    //     it('should not return login tokens');
    // });

    describe('GET /:id', () => {

    });

    describe('POST /', () => {
        const exec = () => {
            return request(server)
                .post('/api/users')
                .set('x-auth-token', token)
                .send(uploadData);
        };

        it('should return 400 if user already exists', async () => {
            uploadData.email = 'sitrick2@gmail.com';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if user data is invalid', async () => {
            uploadData.email = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return an array of user data on valid request', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.headers).toHaveProperty('x-auth-token');
            //@TODO: update this
            // expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            //     'name', 'email', '_id'
            // ]));
        });
    });

    describe('PUT /:id', () => {
        let user;
        beforeEach(async () => {
            user = await User.create(uploadData);
        });

        const exec = () => {
            return request(server)
                .put('/api/users/' + user._id)
                .set('x-auth-token', token)
                .send(uploadData);
        };

        it('should return 404 if use not found', async () => {
            user = { _id : mongoose.Types.ObjectId() };
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return updated user details on valid request', async () => {
            uploadData.email = 'sitrick4@gmail.com';
            const res = await exec();
            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                'first_name', 'last_name', 'email', 'address'
            ]));
            expect(res.body.email).toMatch('sitrick4@gmail.com');
        });
    });

    describe('DELETE /:id', () => {
        describe('DELETE /:id', () => {
            let user;

            beforeEach(async () => {
                user = await User.create(uploadData);
            });

            const exec = () => {
                return request(server)
                    .delete('/api/users/' + user._id)
                    .set('x-auth-token', token);
            };

            // //@TODO add roles
            // it('should return 403 if logged in user is not an admin.', async () => {
            //     token = user.generateAuthToken();
            //     const res = await exec();
            //     expect(res.status).toBe(403);
            // });

            it('should return 404 if user does not exist.', async () => {
                user = { _id : mongoose.Types.ObjectId() };
                const res = await exec();
                expect(res.status).toBe(404);
            });

            it('should delete the user on valid request', async () => {
                const res = await exec();
                const dbUser = await User.findById(user._id);
                expect(res.status).toBe(200);
                expect(dbUser).toBeFalsy();
            });

            it('should return the deleted user on valid request', async () => {
                const res = await exec();
                // TODO update this
                // expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                //     'name', 'email', '_id'
                // ]));
            });
        });
    });
});