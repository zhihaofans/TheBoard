const $$KeyBoard = require("../../NeXT/keyboard"),
  kb = new $$KeyBoard({ barHidden: false }),
  { AppClipboard } = require("../api/clipboard"),
  { ActionRunner } = require("../api/action"),
  appClip = new AppClipboard();
class KeyboardView {
  constructor(appKernel) {
    this.appKernel = appKernel;
    this.kbAction = new ActionRunner(appKernel);
  }
  initView() {
    kb.setHeight(this.appKernel.global.KEYBOARD_HEIGHT || 360);
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
                title: "test",
                rows: ["剪切板", "动作", "动作(旧)"]
              }
            ]
          },
          layout: $layout.fill,
          events: {
            didSelect: (_sender, indexPath, _data) => {
              const row = indexPath.row;
              switch (row) {
                case 0:
                  initClipView(this.appKernel);
                  break;

                case 1:
                  $console.warn(
                    this.kbAction.runAction(this.kbAction.launcherActionId)
                  );
                  break;
                case 2:
                  initActionView(this.appKernel);
                  break;
              }
            }
          }
        }
      ]
    });
  }
}
const initClipView = () => {
    const appClipList = appClip.getAll();
    if (appClipList.length > 0) {
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
                      : []
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
    } else {
      $ui.toast("剪切板为空");
    }
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
  init = appKernel => {
    const appClip = new AppClipboard(""),
      kbView = new KeyboardView(appKernel);
    $console.info(appClip.CREATE_ITEM_TABLE_RESULT);
    if (kb.isKeyboard()) {
      kbView.initView();
    } else {
      if (appKernel.DEBUG_MODE) {
        kbView.initView();
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
