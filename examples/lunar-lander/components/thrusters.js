AFRAME.registerComponent('thrusters', {
  schema: {
    fuelLevel: {default: 500 },
    thrusterVelocityMax: {default: 5 },
    score: {default: 0 }
  },

  init: function() {

    this.score = 0;

    this.onCollision = this.onCollision.bind(this);

    this.el.addEventListener('collide', this.onCollision)

    this.keyboardControls = this.el.components['keyboard-controls'];
    this.movementControls = this.el.components['movement-controls'];
    this.body             = this.el.components['kinematic-body'].body;
    this.scoreHUD = document.querySelector('#score-hud');
    this.fuelHUD = document.querySelector('#fuel-hud');
    this.speedHUD = document.querySelector("#speed-hud")
    // We also need to decide what the "safe" landing range in in terms of speed.

    this.scoreHUD.setAttribute('text', { value: 'Score: 0', anchor: 'right'});
    this.fuelHUD.setAttribute('text', { value: "Fuel: " + this.data.fuelLevel });
    this.speedHUD.setAttribute('text', { value: "Vertical Speed: 0", anchor: 'right', baseline: 'bottom'});

    this.thrusterEngagedSecs = 0;
  },

  onCollision: function(e) {
    var contactNormal = e.detail.contact.ni
    var verticalContact = contactNormal.y
    if(verticalContact < 0 ) {
      this.data.score += 10
      console.log("Score!");
    }
  },

  tick: function(globalUp, timeDelta) {
    this.scoreHUD.setAttribute('text', {value: "Score: " + this.data.score })
    this.speedHUD.setAttribute('text', {value: "Vertical Speed: " + Math.round(this.body.velocity.y) })
    if(this.keyboardControls.isPressed('Space') && this.data.fuelLevel > 0){

      this.data.fuelLevel = this.data.fuelLevel - 1;
      this.fuelHUD.setAttribute('text', { value: "Fuel: " + this.data.fuelLevel });

      if(this.movementControls.velocity.y < this.data.thrusterVelocityMax){
        this.thrusterEngagedSecs = this.thrusterEngagedSecs + (timeDelta/1000)
        this.movementControls.velocity.y = (2 * this.thrusterEngagedSecs);
      }else{
        this.movementControls.y = this.data.thrusterVelocityMax;
      }

    }else{
      this.thrusterEngagedSecs = 0;
      //this.movementControls.velocity.y = 0;
    }
  }

});
