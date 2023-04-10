module.exports.response = (statusCode, message) => {
    const success = statusCode === 200 ? true : false;
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(
            {
                success: success,
                data: message
            },
        ),
    };
}