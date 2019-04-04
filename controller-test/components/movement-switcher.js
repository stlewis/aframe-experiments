AFRAME.registerComponent('movement-switcher', {

  init: function() {
    var rig = document.querySelector('[trackpad-controls]');
    var self = this;

    this.el.addEventListener('click', function(e){
      var movementType = self.el.getAttribute('value');
      var rig          = document.querySelector('[trackpad-controls]');
      AFRAME.log("Current mode is:" + rig.components['trackpad-controls'].data.mode)


      if(movementType == 'Touch') {
        rig.removeAttribute('trackpad-controls');
        rig.setAttribute('trackpad-controls', 'mode', 'touch');
      }

      if(movementType == 'Slide') {
        rig.removeAttribute('trackpad-controls');
        rig.setAttribute('trackpad-controls', 'mode', 'swipe');
      }

      if(movementType == 'Press') {
        rig.removeAttribute('trackpad-controls');
        rig.setAttribute('trackpad-controls', 'mode', 'press');
      }

      console.log(rig.components['trackpad-controls'])
      AFRAME.log("Switched to: " + rig.components['trackpad-controls'].data.mode);

    });

  }

});
