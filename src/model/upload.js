const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

// Configuration AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-3'
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'topdessin-img-bucket',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.originalname}`;
            cb(null, fileName); // nom unique
        }
    })
});

module.exports = upload;
