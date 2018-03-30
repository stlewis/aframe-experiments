AFRAME.registerComponent('thrusters', {
  schema: {
    fuelLevel: {default: 500 }
  },

  init: function() {
    this.keyboardControls = this.el.components['keyboard-controls'];
    this.movementControls = this.el.components['movement-controls'];
    this.body = this.el.components['kinematic-body'].body;
  },

  tick: function() {
    fuelHUD  = document.querySelector("#fuel-hud");

    if(this.keyboardControls.isPressed('Space') && this.data.fuelLevel > 0){
       this.data.fuelLevel = this.data.fuelLevel - 1;
      fuelHUD.setAttribute('text', "value: " + this.data.fuelLevel);


      this.movementControls.velocity.y = 5
    }

  }

});
