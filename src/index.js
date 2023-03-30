require("dotenv").config();
const area_id = process.env.AREA_ID;

const { GetAllowance, GetAreaInfo, CheckAllowance } = require("../modules/esp_utils.js");
const { GetAreaInfoMDB, UpdateAreaInfoMDB, UpdateMDB } = require("../modules/mongodb_utils.js");

CheckAllowance().then((res) => {
  if (res.valid) {
    console.log(`ESP API quota good! Quota Left: ${res.count} of ${res.limit}`);
  } else {
    console.log(`ESP API quota EXCEEDED... Quota Left: ${res.count} of ${res.limit}`);
  }
});

UpdateMDB();
