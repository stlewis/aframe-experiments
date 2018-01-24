AFRAME.registerComponent('waypoint-setter', {
  schema: {
    floorPlane: {default: '#the-floor'}
  },

  init: function () {
    this.currentIntersect = null;
    
    this.bindMethods();


  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  remove: function () {
    this.pause();
  },

  bindMethods: function () {
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.onRaycastIntersection = this.onRaycastIntersection.bind(this);
  },

  addEventListeners: function () {
    this.el.addEventListener('triggerdown', this.onTriggerDown);
    this.el.addEventListener('raycaster-intersection', this.onRaycastIntersection);
    this.el.addEventListener('raycaster-intersection-cleared', this.onRaycastIntersectionCleared);
  },

  removeEventListeners: function () {
    this.el.removeEventListener('triggerdown', this.onTriggerDown);
    this.el.removeEventListener('raycaster-intersection', this.onRaycastIntersection);
    this.el.removeEventListener('raycaster-intersection-cleared', this.onRaycastIntersectionCleared);
  },

  onTriggerDown: function(e){
    raycaster = this.el.components.raycaster;
    if(raycaster.intersectedEls.length > 0 && this.currentIntersect){
      point    = this.currentIntersect;

      waypoint = document.createElement('a-cylinder');
      waypoint.setAttribute('radius', '0.5');
      waypoint.setAttribute('opacity', '0.4');
      waypoint.setAttribute('height', '1000'); // FIXME Attribute
      waypoint.setAttribute('color', 'red');   // Attribute
      waypoint.setAttribute('position', {x: point.x, z: point.z, y: 0})
      this.el.sceneEl.appendChild(waypoint); }

  },

  onRaycastIntersection: function(e){
    this.currentIntersect = e.detail.intersections[0].point;
  },

  onRaycastIntersectionCleared: function(e){
    this.currentIntersect = null; 
  }

});
