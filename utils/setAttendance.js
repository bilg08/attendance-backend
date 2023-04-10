const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { getCurrentMongoliaTimeDetail } = require('./getCurrentMongoliaTimeDetail');
const db = new DynamoDB();
module.exports.setAttendance = async (email) => {
    const {
        mongoliaTimeNow,
        mongoliaTimeNowHour,
        mongoliaTimeNowMinute,
        today
    } = getCurrentMongoliaTimeDetail();
    if (mongoliaTimeNowHour <= 9 && mongoliaTimeNowMinute <= 20) {
        await db.putItem({
            TableName: 'attendance',
            Item: marshall({
                email,
                createdAt: mongoliaTimeNow.toISOString(),
                description: 'hotsorsongui',
                createdDay: today
            }),
        })
    } else {
        await db.putItem({
            TableName: 'attendance',
            Item: marshall({
                email,
                createdAt: mongoliaTimeNow.toISOString(),
                description: 'hotsorloo',
                createdDay: today
            }),
        })
    }
}