var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;

AFRAME.registerComponent('controller-movement', {
  schema: {
    acceleration: {default: 65},
    adAxis: {default: 'x', oneOf: ['x', 'y', 'z']},
    adEnabled: {default: false},
    adInverted: {default: false},
    easing: {default: 20},
    enabled: {default: true},
    fly: {default: false},
    wsAxis: {default: 'z', oneOf: ['x', 'y', 'z']},
    wsEnabled: {default: true},
    wsInverted: {default: false}
  },

  axisUp: false,
  axisDown: false,
  axisRight: false,
  axisLeft: false,
  pushingTrackpad: false,
  camera: null,

  init: function () {
    var el = this.el;
    var self = this;

    this.position = {};
    this.velocity = new THREE.Vector3();
    this.camera   = document.querySelector('a-camera'); // FIXME Property instead?

    el.addEventListener('axismove', function(evt){
      // axis[0] = X (left to right on pad). Negative indicates left.
      // axis[1] = Y (top to bottom on pad). Inverted -- Negative to the top
      var axis_data = evt.detail.axis;

      self.axisUp    = axis_data[1] < 0;
      self.axisDown  = axis_data[1] > 0;
      self.axisLeft  = axis_data[0] < 0;
      self.axisRight = axis_data[0] > 0;
    });

    el.addEventListener('trackpaddown', function(evt){
      self.pushingTrackpad = true;
    });

    el.addEventListener('trackpadup', function(evt){
      self.pushingTrackpad = false;
    });
  },

  tick: function (time, delta) {
    var currentPosition;
    var data = this.data;
    var el   = this.el;
    var movementVector;
    var position = this.position;
    var velocity = this.velocity;
    var pushingTrackpad = this.pushingTrackpad

    if (!pushingTrackpad) { return; }
    // Update velocity.
    delta = delta / 1000;
    this.updateVelocity(delta);

    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

    // Get movement vector and translate position.
    currentPosition = this.camera.getAttribute('position');
    movementVector = this.getMovementVector(delta);
    position.x = currentPosition.x + movementVector.x;
    position.y = currentPosition.y + movementVector.y;
    position.z = currentPosition.z + movementVector.z;
    this.camera.setAttribute('position', position);
  },

  updateVelocity: function (delta) {
    var acceleration;
    var adAxis;
    var adSign;
    var data = this.data;
    var velocity = this.velocity;
    var wsAxis;
    var wsSign;
    var pushingTrackpad = this.pushingTrackpad;

    adAxis = data.adAxis;
    wsAxis = data.wsAxis;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      return;
    }

    // Decay velocity.
    if (velocity[adAxis] !== 0) {
      velocity[adAxis] -= velocity[adAxis] * data.easing * delta;
    }
    if (velocity[wsAxis] !== 0) {
      velocity[wsAxis] -= velocity[wsAxis] * data.easing * delta;
    }

    // Clamp velocity easing.
    if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
    if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

    if (!data.enabled) { return; }

    // Update velocity using keys pressed.
    acceleration = data.acceleration;
    if (data.adEnabled) {
      adSign = data.adInverted ? -1 : 1;
      if (this.axisLeft && pushingTrackpad) { velocity[adAxis] -= adSign * acceleration * delta; }
      if (this.axisRight && pushingTrackpad) { velocity[adAxis] += adSign * acceleration * delta; }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;
      if (this.axisUp && pushingTrackpad) { velocity[wsAxis] -= wsSign * acceleration * delta; }
      if (this.axisDown && pushingTrackpad) { velocity[wsAxis] += wsSign * acceleration * delta; }
    }
  },

  getMovementVector: (function () {
    var directionVector = new THREE.Vector3(0, 0, 0);
    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    return function (delta) {
      var rotation = this.camera.getAttribute('rotation');
      var velocity = this.velocity;
      var xRotation;

      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) { return directionVector; }

      xRotation = this.data.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
      directionVector.applyEuler(rotationEuler);
      return directionVector;
    };
  })(),

});
