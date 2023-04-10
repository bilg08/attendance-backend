module.exports.getCurrentMongoliaTimeDetail = () => {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const offset = 8;
    const mongolia = utc + (3600000 * offset);
    const mongoliaTimeNow = new Date(mongolia); //Mon Apr 10 2023 11:20:21 GMT+0800 (Ulaanbaatar Standard Time)
    const mongoliaTimeNowHour = mongoliaTimeNow.getHours(); //6
    const mongoliaTimeNowMinute = mongoliaTimeNow.getMinutes(); //5
    const today = mongoliaTimeNow.toISOString().slice(0, 10); //2023-04-10
    return {
        mongoliaTimeNow,
        mongoliaTimeNowHour,
        mongoliaTimeNowMinute,
        today
    }
}