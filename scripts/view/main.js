const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  showSettings = async() => {
    const menuResult = await $ui.menu(["输入法全屏"]);
    //menuResult.index , menuResult.title
    switch(menuResult.index){
      case 0:
      
      break
    }
  },
  showAllClip = async () => {
    const clipItems = appClip.getAll(),
      menuResult = await $ui.menu(clipItems.map(item => item.data));
    $ui.menu({
      items: ["分享", "删除", "编辑"],
      handler: (title, idx) => {
        const selectItem = clipItems[menuResult.index];
        switch (idx) {
          case 0:
            $share.sheet([selectItem.data]);
            break;
          case 1:
            $ui.toast(`remove: ${appClip.removeItem(selectItem.uuid)}`);
            break;
          case 2:
            $input.text({
              type: $kbType.text,
              placeholder: "",
              text: selectItem.data,
              handler: text => {
                switch (text) {
                  case selectItem.data:
                    $ui.alert({
                      title: "结果",
                      message: "并没有变化",
                      actions: [
                        {
                          title: "OK",
                          disabled: false, // Optional
                          handler: () => {}
                        }
                      ]
                    });
                    break;
                  case "":
                    $ui.alert({
                      title: "结果",
                      message: "我发现你输入了空白，你是要删除吗？",
                      actions: [
                        {
                          title: "删除",
                          disabled: false, // Optional
                          handler: () => {
                            appClip.removeItem(selectItem.uuid);
                          }
                        },
                        {
                          title: "手误",
                          disabled: false, // Optional
                          handler: () => {}
                        }
                      ]
                    });
                    break;
                  default:
                    $ui.alert({
                      title: "修改成这个？",
                      message: text,
                      actions: [
                        {
                          title: "Yes",
                          disabled: false, // Optional
                          handler: () => {
                            appClip.editItem(selectItem.uuid, text);
                          }
                        },
                        {
                          title: "No",
                          disabled: false, // Optional
                          handler: () => {}
                        }
                      ]
                    });
                    break;
                }
              }
            });
            break;
        }
      }
    });
    $console.info(clipItems[menuResult.index]);
  },
  initMainView = appKernel => {
    $ui.menu({
      items: ["新增", "查询", "设置"],
      handler: (title, idx) => {
        switch (idx) {
          case 0:
            $input.text({
              type: $kbType.text,
              placeholder: "",
              text: "",
              handler: text => {
                if (text) {
                  const addResult = appClip.add({
                    data: text
                  });
                  $ui.toast(addResult);
                }
              }
            });
            break;
          case 1:
            showAllClip();
            break;
          case 2:
            showSettings();
            break;
        }
      }
    });
  },
  init = appKernel => {
    const sysClipText = $clipboard.text,
      lastClipboardData = appClip.getLastClipboardData();
    appClip.setLastClipboardData(sysClipText);
    if (
      sysClipText &&
      !appClip.isDataExist(sysClipText) &&
      sysClipText != lastClipboardData
    ) {
      $ui.alert({
        title: "发现新的剪切板内容，是否导入",
        message: sysClipText,
        actions: [
          {
            title: "导入",
            disabled: false, // Optional
            handler: () => {
              appClip.add({
                data: sysClipText
              });
              initMainView(appKernel);
            }
          },
          {
            title: "不了",
            disabled: false, // Optional
            handler: () => {
              initMainView(appKernel);
            }
          }
        ]
      });
    } else {
      initMainView(appKernel);
    }
    appClip.setLastClipboardData(sysClipText);
  };
module.exports = {
  init
};
