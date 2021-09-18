const $$KeyBoard = require("../../NeXT/keyboard"),
  $$view = require("../../NeXT/view"),
  kb = new $$KeyBoard({ barHidden: true }),
  { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  initClipView = () => {
    const clipText = $clipboard.text,
      appClipList = appClip.getAll();
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
                title: appClipList.length > 0 ? "点击粘贴" : "剪切板为空",
                rows:
                  appClipList.length > 0
                    ? appClipList.map(item => item.data)
                    : undefined
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect: (_sender, indexPath, _data) => {
              if (kb.isKeyboard()) {
                kb.insert(appClipList[indexPath.row].data);
              }
            }
          }
        }
      ]
    });
  },
  initActionView = () => {
    $ui.push({
      props: {
        id: "keyboard_action",
        title: "动作",
        navBarHidden: true
      },
      views: [
        {
          type: "list",
          props: {
            data: [
              {
                title: "文字",
                rows: ["分享", "删掉一个字符"]
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect: (_sender, indexPath, _data) => {
              const section = indexPath.section,
                row = indexPath.row;
              switch (section) {
                case 0:
                  switch (row) {
                    case 0:
                      $keyboard.getAllText(text => {
                        if (text) {
                          $share.sheet([text]);
                        } else {
                          $ui.toast("空白内容，无法分享");
                        }
                      });
                      break;
                    case 1:
                      $keyboard.delete();
                  }
                  break;
              }
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
                case 1:
                  initActionView(appKernel);
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
