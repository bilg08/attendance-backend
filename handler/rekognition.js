const Aws = require('aws-sdk');
const rekognition = new Aws.Rekognition();
const s3 = new Aws.S3();
const axios = require('axios');
const { response: responseHttp } = require('../utils/response');
const bucketName = `zorigooleap3devattendanceaws`;
module.exports.getPresignedUrlToSourceImages = async (event) => {
    const { id, ContentType } = JSON.parse(event.body);
    console.log(id, ContentType)
    const ext = ContentType.split('/')[1];
    const params = {
        Bucket: bucketName,
        Key: `sourceimages/${id}.${ext}`,
        ContentType: ContentType,
    };
    const preSignedUrl = s3.getSignedUrl('putObject', params);
    return responseHttp(200, preSignedUrl)

}
module.exports.getPresignedUrlToTargetImages = async (event) => {
    const { id, ContentType } = JSON.parse(event.body);
    const ext = ContentType.split('/')[1];
    const params = {
        Bucket: bucketName,
        Key: `targetimages/${id}.${ext}`,
        ContentType: ContentType,
    };
    const preSignedUrl = s3.getSignedUrl('putObject', params);
    return responseHttp(200, preSignedUrl)
}

module.exports.compareFaces = async (event) => {
    const targetimagepath = event.Records[0].s3.object.key; //source/1.png
    const userid  = event.Records[0].s3.object.key.split('/')[1].split('.')[0];
    const source_image_objects = await s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: 'sourceimages',
    }).promise(); // show all objects of  ${bucketName}/sourceimages
    const sourceimagepath = source_image_objects.Contents.filter(content =>{
       return content.Key.includes(userid);
    })[0].Key;
    const response = await rekognition.compareFaces({
        SourceImage: {
            S3Object: {
                Bucket: bucketName, //zorigooleap3devattendanceaws
                Name: sourceimagepath, //sourceimages/1.png
            },
        },
        TargetImage: {
            S3Object: {
                Bucket: bucketName, //zorigooleap3devattendanceaws
                Name: targetimagepath, //targetimage/1.png
            }
        }
    }).promise();
    const { Similarity: similarity } = response?.FaceMatches[0];
    const isSimilarFace = similarity > 80;
    if (isSimilarFace) {
        try {
            await axios.post('https://nuccbbgisl.execute-api.us-east-1.amazonaws.com/dev/registerAttendance', {
                id: userid
            });
            console.log('amjilttai burtgelee');
            return responseHttp(200, 'amjilttai burtgelee');
        } catch (error) {
            console.log('ta burtguulsen baina');
            //hervee hereglec ali hediin burtguulegdsen baival
            return responseHttp(400, error.message);
        }
    }else{
        //zyrag ogt adilhan bish baih uyd
        return responseHttp(400, 'Ta bish baina');
    }
}