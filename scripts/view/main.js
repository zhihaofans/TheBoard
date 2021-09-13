const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  showAllClip = async () => {
    const clipItems = appClip.getAll(),
      menuResult = await $ui.menu(clipItems.map(item => item.data));
    $ui.menu({
      items: ["分享", "删除"],
      handler: (title, idx) => {
        const selectItem = clipItems[menuResult.index];
        switch (idx) {
          case 0:
            $share.sheet([selectItem.data]);
            break;
          case 1:
            $console.info(appClip.removeItem(selectItem.uuid));
            break;
        }
      }
    });
    $console.info(clipItems[menuResult.index]);
  },
  initMainView = () => {
    $ui.menu({
      items: ["新增", "查询"],
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
        }
      }
    });
  },
  init = () => {
    const sysClipText = $clipboard.text;
    if (!appClip.isDataExist(sysClipText)) {
      $ui.alert({
        title: "发现新的剪切板内容，是否导入",
        message: "",
        actions: [
          {
            title: "导入",
            disabled: false, // Optional
            handler: () => {
              appClip.add({
                data: sysClipText
              });
              initMainView();
            }
          },
          {
            title: "不了",
            disabled: false, // Optional
            handler: () => {
              initMainView();
            }
          }
        ]
      });
    } else {
      initMainView();
    }
  };
module.exports = {
  init
};
