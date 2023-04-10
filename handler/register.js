const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { unmarshall, marshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/hashpassword');
const s3 = new AWS.S3();
const db = new DynamoDB();

module.exports.signup = async (event) => {
    const { email, username, password } = JSON.parse(event.body);
    const hashedpassword = await hashPassword(password);
    try {
        const response = await db.putItem({
            TableName: 'users',
            Item: marshall({
                email,
                username,
                hashedpassword,
            })
        });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(
                {
                    success: true,
                    response
                },
            ),
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(
                {
                    success: false,
                    error: error.message
                },
            ),
        };
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
        const hashedUser = jwt.sign(user, 'hash')
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({
                data: hashedUser
            })
        };
    } else {
        return {
            statusCode: 405,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({
                error: `Invalid email or password `
            })
        };
    }
};
