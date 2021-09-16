class ViewKit {
  constructor() {
    this.viewId = undefined;
    this.navButtons = undefined;
    this.homeIndicatorHidden = false;
    this.modalPresentationStyle = 0;
    this.events = {
      appeared: () => {
        ///这是第一次加载完毕会出现的提示
      },
      shakeDetected: () => {
        ///这是摇一摇会出现的提示
      }
    };
  }
  setHomeIndicatorHidden(homeIndicatorHidden) {
    this.homeIndicatorHidden = homeIndicatorHidden;
  }
  setModalPresentationStyle(modalPresentationStyle) {
    this.modalPresentationStyle = modalPresentationStyle;
  }
  setNavButtons(navButtons) {
    this.navButtons = navButtons;
  }
  setViewId(viewId) {
    this.viewId = viewId;
  }
  setEvents(events) {
    this.events = events;
  }
  pushView(title, views) {
    $ui.push({
      props: {
        title: title,
        navButtons: this.navButtons
      },
      views: views,
      events: this.events
    });
  }
  renderView(title, views) {
    $ui.render({
      props: {
        id: this.viewId,
        title: title,
        homeIndicatorHidden: this.homeIndicatorHidden,
        modalPresentationStyle: this.modalPresentationStyle,
        navButtons: this.navButtons
      },
      views: views,
      events: this.events
    });
  }
}
class ListKit {
  constructor() {
    this._viewKet = new ViewKit();
    this._viewKet.setAutoRowHeight(true);
    this.estimatedRowHeight = 10;
    this.autoRowHeight = true;
  }
  setEstimatedRowHeight(estimatedRowHeight) {
    this.estimatedRowHeight = estimatedRowHeight;
  }
  setAutoRowHeight(autoRowHeight) {
    this.autoRowHeight = autoRowHeight === true;
  }
  renderIdx(title, listData, handler = (section, row, data) => {}) {
    this.renderView(title, [
      {
        type: "list",
        props: {
          autoRowHeight: this.autoRowHeight,
          estimatedRowHeight: this.estimatedRowHeight,
          data: listData
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            handler(indexPath.section, indexPath.row, data);
          }
        }
      }
    ]);
  }
  pushIdx(title, listData, handler = (section, row, data) => {}) {
    this.pushView(title, [
      {
        type: "list",
        props: {
          autoRowHeight: this.autoRowHeight,
          estimatedRowHeight: this.estimatedRowHeight,
          data: listData
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath, data) => {
            handler(indexPath.section, indexPath.row, data);
          }
        }
      }
    ]);
  }
}
module.exports = {
  ListKit
};
