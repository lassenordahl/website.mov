import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_USER_ACCESS_KEY,
  secretAccessKey: process.env.AWS_USER_ACCESS_SECRET,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// function to get all files from s3 bucket and return them
export const listFiles = async () => {
  const listParams = {
    Bucket: process.env.BUCKET_NAME!,
  };
  const resData = await s3
    .listObjectsV2(listParams, (err, data) => {
      if (err) {
        console.log("params", listParams);
        console.log("data", data);
        console.log("Error", err);
        console.log("Error Stack", err.stack);
        console.log("Error Code", err.code);
        console.log("Error Message", err.message);
      }
    })
    .promise();
  return resData;
};

// function to download file from s3 given a key
export const downloadFile = async (key: string) => {
  const downloadParams = {
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  };
  const resData = await s3
    .getObject(downloadParams, (err, data) => {
      if (err) {
        console.log("params", downloadParams);
        console.log("Error", err);
      }
    })
    .promise();
  return resData;
};
