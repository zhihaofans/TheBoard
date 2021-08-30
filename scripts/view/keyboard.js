const KeyBoard = require("../../NeXT/keyboard"),
  kb = new KeyBoard({}),
  initView = () => {
    $ui.render({
      props: {
        id: "keyboard_main",
        title: ""
      },
      views: [
        {
          type: "list",
          props: {
            data: [
              {
                title: "",
                rows: []
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect: function (_sender, indexPath, _data) {
              const section = indexPath.section;
              const row = indexPath.row;
            }
          }
        }
      ]
    });
  },
  init = () => {
    if (kb.isKeyBoard()) {
      initView();
    } else {
      $ui.alert({
        title: "Error",
        message: "Need keyboard",
        actions: [
          {
            title: "EXIT",
            disabled: false,
            handler: function () {
              $app.close();
            }
          }
        ]
      });
    }
  };
module.exports = {
  init
};
