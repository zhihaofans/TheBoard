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
      views: []
    });
    view.layout((make, view) => {
      make.left.top.right.equalTo(0);
      make.height.equalTo(100);
    });
  },
  init = () => {
    initView();
  };
module.exports = {
  init
};
