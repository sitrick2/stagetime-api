const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const {JsonWebTokenError} = require("jsonwebtoken");

describe('user.generateAuthToken', () => {
    let payload;

    beforeEach(() => {
        payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            // role: {
            //     name: 'super admin'
            // }
        };
    });

    const exec = () => {
        const user = new User(payload);
        const token = user.generateAuthToken();
        return jwt.verify(token, config.get('jwtPrivateKey'));
    };

    it('should return a valid JWT', async () => {
        const decoded = await exec();
        expect(decoded).toMatchObject(payload);
        // expect(decoded.role.name).toMatch('super admin');
    });

    it('should return a JWT with no admin status', async () => {
        payload.role = {};
        const decoded = await exec();
        // expect(decoded.role.name).toBeFalsy();
    });

    it('should return an invalid JWT with incorrect private key', async () => {
        const user = new User(payload);
        const token = user.generateAuthToken();
        expect(() => {
            jwt.verify(token, '1234567890222');
        }).toThrow(JsonWebTokenError);
    });

});