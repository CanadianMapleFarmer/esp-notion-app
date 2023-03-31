require("dotenv").config();
const notion_key = process.env.NOTION_API_KEY;
const notion_page_id = process.env.NOTION_PAGE_ID;
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: notion_key });
const { GetAreaInfoMDB } = require("./mongodb_utils.js");

let page_data = {};

const AppendPageData = async () => {
  await GetAreaInfoMDB().then((res) => {
    page_data = res;
  });
  const events = page_data.events;
  const blockId = `${notion_page_id}`;

  let i = 1;
  addAppendData();
  function addAppendData() {
    setTimeout(function () {
      events.forEach(async (event) => {
        let stage_ = event.note;
        let start_ = event.start;
        let end_ = event.end;
        let stage_color_;
        let stage_num = stage_.split(" ")[1];
        if (stage_num >= 6) {
          stage_color_ = "red";
        } else if (stage_num >= 4) {
          stage_color_ = "orange";
        } else {
          stage_color_ = "yellow";
        }
        await AppendNotionBlock(stage_, start_, end_, stage_color_, i++);
      });
    }, 5000);
  }

  async function AppendNotionBlock(stage, start_datetime, end_datetime, stage_color, i) {
    await notion.blocks.children
      .append({
        block_id: blockId,
        children: [
          {
            type: "heading_1",
            heading_1: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: `${i}. ${stage}`,
                    link: null,
                  },
                },
              ],
              color: `${stage_color}`,
              is_toggleable: false,
            },
          },
          {
            type: "table",
            table: {
              table_width: 2,
              has_column_header: true,
              has_row_header: false,
              children: [
                {
                  type: "table_row",
                  table_row: {
                    cells: [
                      [
                        {
                          type: "text",
                          text: {
                            content: "Start Time:",
                            link: null,
                          },
                          annotations: {
                            bold: false,
                            italic: false,
                            strikethrough: false,
                            underline: false,
                            code: false,
                            color: "red",
                          },
                          href: null,
                        },
                      ],
                      [
                        {
                          type: "text",
                          text: {
                            content: "End Time:",
                            link: null,
                          },
                          annotations: {
                            bold: false,
                            italic: false,
                            strikethrough: false,
                            underline: false,
                            code: false,
                            color: "green",
                          },
                          href: null,
                        },
                      ],
                    ],
                  },
                },
                {
                  type: "table_row",
                  table_row: {
                    cells: [
                      [
                        {
                          type: "text",
                          text: {
                            content: `${start_datetime}`,
                            link: null,
                          },
                          annotations: {
                            bold: false,
                            italic: false,
                            strikethrough: false,
                            underline: false,
                            code: false,
                            color: "default",
                          },
                          href: null,
                        },
                      ],
                      [
                        {
                          type: "text",
                          text: {
                            content: `${end_datetime}`,
                            link: null,
                          },
                          annotations: {
                            bold: false,
                            italic: false,
                            strikethrough: false,
                            underline: false,
                            code: false,
                            color: "default",
                          },
                          href: null,
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
      .then((response) => {
        console.log(response);
      });
    // console.log(data);
  }
};

module.exports = { AppendPageData, ...module.exports };
