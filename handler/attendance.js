const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { setAttendance } = require('../utils/setAttendance');
const { getCurrentMongoliaTimeDetail } = require('../utils/getCurrentMongoliaTimeDetail');
const { checkIsUserRegisteredToday } = require('../utils/checkUserRegisteredToday');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();
const {response: responseHttp} = require('../utils/response');
module.exports.registerAttendance = async (event) => {
    // console.log(event.body);
    const { id } = JSON.parse(event.body);
    console.log(id,'id');
    const { today } = getCurrentMongoliaTimeDetail();
    const isRegisteredToday = await checkIsUserRegisteredToday(id, today);
    console.log(isRegisteredToday,'isRegisteredToday')
    if (!isRegisteredToday) {
        await setAttendance(id);
        return responseHttp(200, 'amjilttai')
    } else {
        return responseHttp(400, 'ta burtguulsen baina')
    }

}