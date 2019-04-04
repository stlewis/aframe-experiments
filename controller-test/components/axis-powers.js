AFRAME.registerComponent('axis-powers', {

  init: function() {
    this.el.addEventListener('triggerdown', this.triggerDown.bind(this));
  },

  triggerDown: function() {
    AFRAME.log("M: " + window.navigator.getGamepads()[0].mapping);
    //AFRAME.log("0: " + window.navigator.getGamepads()[0].axes[0]);
    //AFRAME.log("1: " + window.navigator.getGamepads()[0].axes[1]);
  },

});
