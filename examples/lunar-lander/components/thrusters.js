AFRAME.registerComponent('thrusters', {
  schema: {
    fuelLevel: {default: 500 },
    thrusterVelocity: {default: 5 }
  },

  init: function() {
    this.keyboardControls = this.el.components['keyboard-controls'];
    this.movementControls = this.el.components['movement-controls'];
    this.scoreHUD = document.querySelector('#score-hud');
    this.fuelHUD = document.querySelector('#fuel-hud');

    this.scoreHUD.setAttribute('text', { value: 'Score: 0', align: 'right'});
    this.fuelHUD.setAttribute('text', { value: "Fuel: " + this.data.fuelLevel });
  },

  tick: function() {

    if(this.keyboardControls.isPressed('Space') && this.data.fuelLevel > 0){
       this.data.fuelLevel = this.data.fuelLevel - 1;
       this.fuelHUD.setAttribute('text', { value: "Fuel: " + this.data.fuelLevel });
       this.movementControls.velocity.y = this.data.thrusterVelocity;
    }

  }

});
