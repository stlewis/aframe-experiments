AFRAME.registerComponent('maze-builder', {
  schema: {
    mazeData: {default: {}},
    wallSelector: {default: '#walls'},
    wallTexture: {default: ''},
    wallColor:   {default: 'blue'},
    winWallColor: {default: 'red'},
    winWallTexture: {default: ''},
    wallSize: {default: 5},
    wallHeight: {default: 12},
  },

  // FIXME Designate player start via block

  init: function () {
    var el     = this.el;
    var self   = this;
    var walls  = document.querySelector(this.data.wallSelector);
    var mazeData   = JSON.parse(this.data.mazeData);

    var map = { 
      "height": mazeData.size,
      "data": mazeData.walls,
      //"data":[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 2, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
      "width": mazeData.size
    }


    for (var x = 0; x < map.height; x++)  {
        for (var y = 0; y < map.width; y++) {

            var i = y*map.width + x;
            var position = (x-map.width/2)*self.data.wallSize + ' ' + 1.5 + ' ' + (y-map.height/2)*self.data.wallSize;
            if (map.data[i] === 1 || map.data[i] === 2) {
                // Create wall
                wall = document.createElement('a-box');
                walls.appendChild(wall);
                wall.setAttribute('width', self.data.wallSize);
                wall.setAttribute('height', self.data.wallHeight);
              
                if(map.data[i] === 1){
                  if(this.data.wallTexture){
                    wall.setAttribute('material', {src: this.data.wallTexture, repeat: {u: self.data.wallSize, v: self.data.wallSize} });
                  }else{
                    wall.setAttribute('color', this.data.wallColor);
                  }
                }else{
                  if(this.data.winWallTexture){
                    wall.setAttribute('material', {src: this.data.winWallTexture, repeat: {u: self.data.wallSize, v: self.data.wallSize} });
                  }else{
                    wall.setAttribute('color', this.data.winWallColor);
                  }
                }
                wall.setAttribute('depth', self.data.wallSize);
                wall.setAttribute('position', position);
                wall.setAttribute('static-body', true);
            }

        }
    }

  }

});
