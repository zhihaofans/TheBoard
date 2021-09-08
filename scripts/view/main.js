const { AppClipboard } = require("../api/clipboard"),
  appClip = new AppClipboard(),
  init = () => {
    $input.text({
      type: $kbType.text,
      placeholder: "",
      text: "",
      handler: text => {
        if (text) {
          appClip.add({
            data: text
          });
        }
      }
    });
  };
module.exports = {
  init
};
