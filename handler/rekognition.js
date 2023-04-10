const Aws = require('aws-sdk');
const rekognition = new Aws.Rekognition();
const s3 = new Aws.S3();
const axios = require('axios');
const { response: responseHttp } = require('../utils/response');
module.exports.getPresignedUrlToSourceImages = async (event) => {
    const { email, ContentType } = JSON.parse(event.body);
    const ext = ContentType.split('/')[1];
    const bucketName = `zorigooleap3devattendance`
    const params = {
        Bucket: bucketName,
        Key: `sourceimages/${email}.${ext}`,
        ContentType: ContentType,
    };
    const preSignedUrl = s3.getSignedUrl('putObject', params);
    return responseHttp(200, preSignedUrl);
}
module.exports.getPresignedUrlToTargetImages = async (event) => {
    const { email, ContentType } = JSON.parse(event.body);
    const ext = ContentType.split('/')[1];
    const bucketName = `zorigooleap3devattendance`
    const params = {
        Bucket: bucketName,
        Key: `targetimages/${email}.${ext}`,
        ContentType: ContentType,
    };
    const preSignedUrl = s3.getSignedUrl('putObject', params);
    return responseHttp(200, preSignedUrl);
}

module.exports.compareFaces = async (event) => {
    const { email } = JSON.parse(event.body);
    const response = await rekognition.compareFaces({
        SourceImage: {
            S3Object: {
                Bucket: 'zorigooleap3devattendance',
                Name: `sourceimages/${email}.jpeg`,
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: 'zorigooleap3devattendance',
                Name: `targetimages/${email}.jpeg`,
            }
        }
    }).promise();
    const { Similarity: similarity } = response?.FaceMatches[0];
    //hervee tsarai adilahn baival
    if (similarity > 80) {
        try {
            await axios.post('https://uoa756xi8c.execute-api.us-east-1.amazonaws.com/dev/registerAttendance', {
                email: email
            });
            return responseHttp(200, 'amjilttai burtgelee');
        } catch (error) {
            //hervee hereglec ali hediin burtguulegdsen baival
            return responseHttp(400, 'ta burtguulsen bain');
        }
    }else{
        //zyrag ogt adilhan bish baih uyd
        return responseHttp(400, 'Ta bish baina');
    }
}