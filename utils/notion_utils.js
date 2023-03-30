require("dotenv").config();
const notion_key = process.env.NOTION_API_KEY;

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: notion_key });
