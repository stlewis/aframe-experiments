AFRAME.registerComponent('thrusters', {
  schema: {
    fuelLevel: {default: 500 },
    thrusterVelocityMax: {default: 5 }
  },

  init: function() {
    this.keyboardControls = this.el.components['keyboard-controls'];
    this.movementControls = this.el.components['movement-controls'];
    this.body             = this.el.components['kinematic-body'].body;
    this.scoreHUD = document.querySelector('#score-hud');
    this.fuelHUD = document.querySelector('#fuel-hud');
    // NOTE speedHUD to display downward velocity.
    // We also need to decide what the "safe" landing range in in terms of speed.

    this.scoreHUD.setAttribute('text', { value: 'Score: 0', align: 'right'});
    this.fuelHUD.setAttribute('text', { value: "Fuel: " + this.data.fuelLevel });

    this.thrusterEngagedSecs = 0;
  },

  tick: function(globalUp, timeDelta) {
    console.log("Controls: " + this.movementControls.velocity.y, "Body: " + this.body.velocity.y);

    if(this.keyboardControls.isPressed('Space') && this.data.fuelLevel > 0){

      this.data.fuelLevel = this.data.fuelLevel - 1;
      this.fuelHUD.setAttribute('text', { value: "Fuel: " + this.data.fuelLevel });

      if(this.movementControls.velocity.y < this.data.thrusterVelocityMax){
        this.thrusterEngagedSecs = this.thrusterEngagedSecs + (timeDelta/1000)
        this.movementControls.velocity.y = (0.5 * this.thrusterEngagedSecs);
      }else{
        this.movementControls.velocity.y = this.data.thrusterVelocityMax;
      }

    }else{
      this.movementControls.velocity.y = 0;
    }
  }

});
