const $$KeyBoard = require("../../NeXT/keyboard"),
  $$view = require("../../NeXT/view"),
  kb = new $$KeyBoard({ barHidden: true }),
  { AppClipboard } = require("../api/clipboard"),
  initClipView = () => {
    $ui.push({
      props: {
        id: "keyboard_clip",
        title: "剪切板",
        navBarHidden: true
      },
      views: [
        {
          type: "list",
          props: {
            data: [
              {
                title: $clipboard.text ? "点击粘贴" : "剪切板为空",
                rows: [$clipboard.text]
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect: (_sender, indexPath, _data) => {
              kb.insert(_data);
            }
          }
        }
      ]
    });
  },
  initMain = appKernel => {
    $ui.render({
      views: [
        {
          type: "tab",
          props: {
            items: ["剪切板", "动作"],
            dynamicWidth: true // dynamic item width, default is false
          },
          layout: function (make) {
            make.left.top.right.equalTo(0);
            make.height.equalTo(40);
          },
          events: {
            changed: sender => {
              switch (sender.index) {
                case 0:
                  break;
              }
            }
          }
        },
        {
          type: "list",
          props: {
            data: [
              {
                title: "",
                rows: ["剪切板", "b"]
              }
            ]
          },
          layout: (make, view) => {
            make.top.inset(40);
            make.width.equalTo(view.wight);
          },
          events: {
            didSelect: (_sender, indexPath, _data) => {
              const row = indexPath.row;
              switch (row) {
                case 0:
                  initClipView(appKernel);
                  break;
              }
            }
          }
        }
      ]
    });
  },
  initView = appKernel => {
    kb.setHeight(appKernel.global.KEYBOARD_HEIGHT || 360);
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
                rows: ["剪切板", "动作"]
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect: (_sender, indexPath, _data) => {
              const row = indexPath.row;
              switch (row) {
                case 0:
                  initClipView(appKernel);
                  break;
              }
            }
          }
        }
      ]
    });
  },
  init = appKernel => {
    const appClip = new AppClipboard("");
    $console.info(appClip.CREATE_ITEM_TABLE_RESULT);
    if (kb.isKeyboard()) {
      initView(appKernel);
    } else {
      if (appKernel.DEBUG_MODE) {
        initView(appKernel);
        //$ui.render("kb.ux");
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
    }
  };
module.exports = {
  init
};
