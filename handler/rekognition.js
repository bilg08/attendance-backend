const Aws = require('aws-sdk');
const rekognition = new Aws.Rekognition();
const s3 = new Aws.S3();
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
    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            url: preSignedUrl,
          },
        ),
    };
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
    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            url: preSignedUrl,
          },
        ),
    };
}

module.exports.compareFaces = async (event) => {
    const response = await rekognition.compareFaces({
        SourceImage: {
            S3Object: {
                Bucket: 'zorigooleap3devattendance',
                Name: 'sourceimages/jeff.jpeg',
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: 'zorigooleap3devattendance',
                Name: 'targetimages/jeff.jpeg',
            }
        }
    }).promise();
    const { Similarity: similarity } = response?.FaceMatches[0];
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            data: { success: true, similarity }
        })
    };
}