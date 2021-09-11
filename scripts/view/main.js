const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  showAllClip = () => {
    const clipItems = appClip.getAll();
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
    initMainView();
  };
module.exports = {
  init
};
