require("dotenv").config();
const axios = require("axios");

const esp_key = process.env.ESP_API_KEY;

const GetAllowance = async () => {
  await axios
    .get("https://developer.sepush.co.za/business/2.0/api_allowance", {
      headers: {
        token: `${esp_key}`,
      },
    })
    .then((response) => {
      // handle response data
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      // handle error
      if (error.response) {
        // server responded with a status code outside the 2xx range
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // no response received
        console.log(error.request);
      } else {
        // something else went wrong
        console.log("Error: ", error.message);
      }
    });
};

const GetAreaInfo = async (id, test) => {
  let res_data;
  let working_url;
  if (test !== null || undefined || "") {
    working_url = `https://developer.sepush.co.za/business/2.0/area?id=${id}&test=${test}`;
  } else {
    working_url - `https://developer.sepush.co.za/business/2.0/area?id=${id}`;
  }
  await axios
    .get(working_url, {
      headers: {
        token: `${esp_key}`,
      },
    })
    .then((response) => {
      // handle response data
      // console.log(response.data);
      res_data = response.data;
    })
    .catch((error) => {
      // handle error
      if (error.response) {
        // server responded with a status code outside the 2xx range
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // no response received
        console.log(error.request);
      } else {
        // something else went wrong
        console.log("Error: ", error.message);
      }
    });
  return res_data;
};

const CheckAllowance = async () => {
  let quota_valid;
  await axios
    .get("https://developer.sepush.co.za/business/2.0/api_allowance", {
      headers: {
        token: `${esp_key}`,
      },
    })
    .then((response) => {
      let api_count = response.data.allowance.count;
      let api_limit = response.data.allowance.limit;
      // handle response data
      // console.log(response.data);
      if (api_count < api_limit) {
        quota_valid = { valid: true, count: api_count, limit: api_limit };
      } else {
        quota_valid = { valid: true, count: api_count, limit: api_limit };
      }
    })
    .catch((error) => {
      // handle error
      if (error.response) {
        // server responded with a status code outside the 2xx range
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // no response received
        console.log(error.request);
      } else {
        // something else went wrong
        console.log("Error: ", error.message);
      }
    });
  return quota_valid;
};

module.exports = { GetAllowance, ...module.exports };
module.exports = { GetAreaInfo, ...module.exports };
module.exports = { CheckAllowance, ...module.exports };
