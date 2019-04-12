AFRAME.registerComponent('axis-powers', {

  init: function() {
    AFRAME.log("Place your thumb on a position on the trackpad.");
    AFRAME.log("Then press the trigger to log your thumb position");
    this.el.addEventListener('trackpadchanged', this.triggerDown.bind(this));
  },

  triggerDown: function() {
    AFRAME.log("X Axis: " + window.navigator.getGamepads()[0].axes[0]);
    AFRAME.log("Y Axis: " + window.navigator.getGamepads()[0].axes[1]);
  },

});
