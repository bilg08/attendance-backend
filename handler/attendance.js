const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { setAttendance } = require('../utils/setAttendance');
const { getCurrentMongoliaTimeDetail } = require('../utils/getCurrentMongoliaTimeDetail');
const { checkIsUserRegisteredToday } = require('../utils/checkUserRegisteredToday');
const db = new DynamoDB();

module.exports.registerAttendance = async (event) => {
    const { email } = JSON.parse(event.body);
    const { today } = getCurrentMongoliaTimeDetail();
    const isRegisteredToday = await checkIsUserRegisteredToday(email, today);
    if (!isRegisteredToday) {
        await setAttendance(email)
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                data: { success: true }
            })
        };
    } else {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                data: {
                    success: false,
                    error: 'ta burtguulsen baina'
                }
            })
        };
    }

}