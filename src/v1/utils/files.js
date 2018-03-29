const AWS = require('aws-sdk');
const config = require('c0nfig');

AWS.config.update({
  accessKeyId: config.s3.key,
  secretAccessKey: config.s3.secret
});

function upload (body, mimetype, key) {
  const s3bucket = new AWS.S3({
    params: {
      Bucket: config.s3.bucket,
      ACL: 'public-read',
      ContentType: mimetype
    }
  });

  return new Promise((resolve, reject) => {
    s3bucket.upload({
      Key: key,
      Body: body
    }, (err, data) => {
      if (err) {
        return reject(err);
      }

      const fileUrl = `${data.key}`;

      resolve(fileUrl);
    });
  });
}

module.exports = {
  upload
};
