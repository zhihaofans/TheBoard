const init = () => {
  $console.info("init");
  $ui.render("./main");
  $console.info("render");
};
module.exports = {
  init
};
