require("dotenv").config();
const area_id = process.env.AREA_ID;

const { GetAllowance, GetAreaInfo, CheckAllowance } = require("../utils/esp_utils.js");
const { GetAreaInfoMDB, UpdateAreaInfoMDB, UpdateMDB } = require("../utils/mongodb_utils.js");
const { AppendPageData } = require("../utils/notion_utils.js");

CheckAllowance().then((res) => {
  if (res.valid) {
    console.log(`ESP API quota good! Quota Left: ${res.count} of ${res.limit}`);
  } else {
    console.log(`ESP API quota EXCEEDED... Quota Left: ${res.count} of ${res.limit}`);
  }
});

// UpdateMDB();

// AppendPageData();
