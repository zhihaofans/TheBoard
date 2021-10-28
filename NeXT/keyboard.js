class Keyboard {
  constructor({ barHidden = false }) {
    $keyboard.barHidden = barHidden;
  }
  isKeyboard() {
    return $app.env === $env.keyboard;
  }
  getHeight() {
    return $keyboard.height;
  }
  setHeight(newHeight) {
    $keyboard.height = newHeight;
  }
  insert(text) {
    $keyboard.insert(text);
  }
  getAllText() {
    return this.isKeyboard ? $keyboard.getAllText() : undefined;
  }
  paste() {
    if ($clipboard.text) {
      this.insert($clipboard.text);
    }
  }
  tokenize(handler) {
    if (this.isKeyboard()) {
      $text.tokenize({
        text: this.getAllText(),
        handler: handler
      });
    } else {
      handler(undefined);
    }
  }
}
module.exports = Keyboard;
