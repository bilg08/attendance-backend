const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { unmarshall, marshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/hashpassword');
const { response: responseHttp } = require('../utils/response');
const db = new DynamoDB();

module.exports.signup = async (event) => {
    const { email, username, password } = JSON.parse(event.body);
    const hashedpassword = await hashPassword(password);
    const id = uuidv4();
    const {Item: user} = await db.getItem({
        TableName: 'users',
        Key: marshall({
            email: email
        })
    });
    if(!user) {
        await db.putItem({
            TableName: 'users',
            Item: marshall({
                email,
                username,
                hashedpassword,
                id
            })
        });
        const {Item: newuser} = await db.getItem({
            TableName: 'users',
            Key: marshall({
                email: email
            })
        });
        const token = jwt.sign(newuser, 'hash');
        return responseHttp(200, {
            user: unmarshall(newuser),
            token
        })
    }else{
        return responseHttp(400, 'heregelegc burgegedsen baina')
    }
}
module.exports.signin = async (event) => {
    const { email, password } = JSON.parse(event.body);
    const { Item } = await db.getItem({
        TableName: 'users',
        Key: marshall({ email })
    });
    const user = unmarshall(Item);
    const isPasswordRight = await bcrypt.compare(password, user.hashedpassword);
    if (isPasswordRight) {
        const token = jwt.sign(user, 'hash');
        return responseHttp(200, {user,token})
    } else {
        return responseHttp(405, `Invalid email or password`)
    }
};
