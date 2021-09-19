const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  initView = () => {
    $ui.render({
      props: {
        titleView: {
          type: "tab",
          props: {
            bgcolor: $rgb(240, 240, 240),
            items: ["A", "B", "C"]
          },
          events: {
            changed: sender => {
              console.log(sender.index);
            }
          }
        }
      },
      views: [
        {
          type: "tab",
          props: {
            bgcolor: $rgb(240, 240, 240),
            items: ["A", "B", "C"]
          },
          events: {
            changed: sender => {
              console.log(sender.index);
            }
          }
        }
      ]
    });
  },
  init = () => {
    initView();
  };
module.exports = {
  init
};
