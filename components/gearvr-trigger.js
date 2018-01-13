AFRAME.registerComponent('gearvr-trigger', {
  init: function(){
    var el          = this.el;
    var self        = this;
    var trigger_id  = 1;
    var click_id    = 0;
    var lastIntersect = null;

    el.addEventListener('buttondown', function(evt){
      
      button_id = evt.detail.id;


      if(trigger_id == button_id){
        
        if(el.components.raycaster.intersectedEls.length > 0){
          intersected   = el.components.raycaster.intersectedEls[0];
          lastIntersect = intersected
          intersected.setAttribute('color', 'blue');
        }else{
            lastIntersect.setAttribute('color', 'red');
        }

      }

    });


  }
});
