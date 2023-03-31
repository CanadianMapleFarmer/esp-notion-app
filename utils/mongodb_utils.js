require("dotenv").config();
const axios = require("axios");
const { GetAreaInfo } = require("./esp_utils.js");

const mongodb_key = process.env.MONGODB_API_KEY;
const area_id = process.env.AREA_ID;
const doc_id = process.env.MONGODB_DOC_ID;

const GetAreaInfoMDB = async () => {
  let res_data;
  var data = JSON.stringify({
    collection: "AreaInformation",
    database: "ESP-DB",
    dataSource: "DataCluster",
    filter: {},
  });

  var config = {
    method: "post",
    url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-lpvls/endpoint/data/v1/action/findOne",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": `${mongodb_key}`,
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      // console.log(response.data);
      res_data = response.data.document.area_info;
    })
    .catch(function (error) {
      console.log(error);
    });
  return res_data;
};

const UpdateAreaInfoMDB = async (areaInfo_data) => {
  let updated_data;
  var data = JSON.stringify({
    collection: "AreaInformation",
    database: "ESP-DB",
    dataSource: "DataCluster",
    filter: { _id: { $oid: `${doc_id}` } },
    update: {
      $set: {
        area_info: {
          events: areaInfo_data.events,
          info: areaInfo_data.info,
          schedule: areaInfo_data.schedule,
        },
      },
    },
  });

  var config = {
    method: "post",
    url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-lpvls/endpoint/data/v1/action/updateOne",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": `${mongodb_key}`,
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      updated_data = response.data;
      // return response.data.document.area_info;
    })
    .catch(function (error) {
      console.log(error);
    });

  console.log(`DATA UPDATED!\nResponse Data:\n{matched count: ${updated_data.matchedCount}, modified count: ${updated_data.modifiedCount}}`);
};

const UpdateMDB = async () => {
  let current_data;
  let latest_data;
  await GetAreaInfoMDB().then((res) => {
    current_data = JSON.stringify(res);
  });
  await GetAreaInfo(area_id).then((res) => {
    latest_data = JSON.stringify(res);
  });
  // console.log(`CURRENT DATA:\n${JSON.stringify(current_data)}\nLATEST DATA:\n${JSON.stringify(latest_data)}`);
  // console.log(`CURRENT DATA:\n${current_data}\nLATEST DATA:\n${latest_data}`);
  if (current_data !== latest_data) {
    await UpdateAreaInfoMDB(JSON.parse(latest_data));
  } else {
    console.log(`No updates made, latest data cached.`);
  }
};

module.exports = { GetAreaInfoMDB, ...module.exports };
module.exports = { UpdateAreaInfoMDB, ...module.exports };
module.exports = { UpdateMDB, ...module.exports };
