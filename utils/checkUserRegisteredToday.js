const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const db = new DynamoDB();
module.exports.checkIsUserRegisteredToday = async(id, today) => {
    const { Items } = await db.query(
        {
            TableName: 'attendance',
            ExpressionAttributeValues: {
                ':userId': { S: id },
                ':today': { S: today },
            },
            KeyConditionExpression: 'userid = :userId and createdDay = :today',
        });
    if (Items.length > 0) {
        return true;
    } else {
        return false
    }
}