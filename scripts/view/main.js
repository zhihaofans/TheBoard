const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  showAllClip = async () => {
    const clipItems = appClip.getAll(),
      menuResult = await $ui.menu(clipItems.map(item => item.data));
    //menuResult.index , menuResult.title
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
      appClip.add({
        data: sysClipText
      });
    }
    initMainView();
  };
module.exports = {
  init
};
