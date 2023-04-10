const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const db = new DynamoDB();
module.exports.checkIsUserRegisteredToday = async(email, today) => {
    const { Items } = await db.query(
        {
            TableName: 'attendance',
            ExpressionAttributeValues: {
                ':useremail': { S: email },
                ':today': { S: today },
            },
            KeyConditionExpression: 'email = :useremail and createdDay = :today',
        });
    if (Items.length > 0) {
        //hereglegc burtgegedsen gesen ug
        return true;
    } else {
        return false
    }
}