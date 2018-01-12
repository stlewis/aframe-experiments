AFRAME.registerComponent('cursor-trigger', {
  init: function(){
    var message_box = document.querySelector('#message');
    var self        = this;
    var el          = self.el;
    var trigger_id  = '1';
    var click_id    = '0';
    var raycaster   = el.components.raycaster;
    var lastIntersect = null;

    el.addEventListener('mouseup', function(evt){
      message_box.setAttribute('value', 'Baaaar') ;
    });

    el.addEventListener('mousedown', function(evt){
      message_box.setAttribute('value', "Foooo");

      if(raycaster.intersectedEls.length > 0){
        intersected   = raycaster.intersectedEls[0];
        lastIntersect = intersected
        intersected.setAttribute('color', 'blue');
        message_box.setAttribute('value', "Strike");
      }else{
          message_box.setAttribute('value', "Feck");
          lastIntersect.setAttribute('color', 'red');
      }


      if(evt.detail.id == click_id){

      }
    });
  
  }


});
