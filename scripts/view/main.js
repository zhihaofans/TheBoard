const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  init = () => {
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
  };
module.exports = {
  init
};
