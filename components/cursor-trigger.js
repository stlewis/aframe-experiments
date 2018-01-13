AFRAME.registerComponent('cursor-trigger', {
  init: function(){
    var self        = this;
    var el          = self.el;
    var trigger_id  = '1';
    var click_id    = '0';
    var raycaster   = el.components.raycaster;
    var lastIntersect = null;

    el.addEventListener('mouseup', function(evt){
    });

    el.addEventListener('mousedown', function(evt){

      if(raycaster.intersectedEls.length > 0){
        intersected   = raycaster.intersectedEls[0];
        lastIntersect = intersected
        intersected.setAttribute('color', 'blue');
      }else{
          lastIntersect.setAttribute('color', 'red');
      }


      if(evt.detail.id == click_id){

      }
    });
  
  }


});
