AFRAME.registerComponent('maze-builder', {
  schema: {
    src: {type: 'asset'},
    wallTexture: {default: '#wall-texture'}
  },

  init: function() {
    var data = this.data;

    if(data.src){
      console.log(data.src);
      fetch(data.src)
        .then((response) => response.json())
        .then((json) => {
          this.setMazeData(json);
          this.horizontalMazeBlocks = [];
          this.verticalMazeBlocks   = [];

          this.setHorizontalMazeBlocks();
          this.setVerticalMazeBlocks();

          this.tagHorizontalWalls();
          this.tagVerticalWalls();

          this.drawWalls('horizontal');
          this.drawWalls('vertical');

          this.positionCamera();
          this.positionWin();
        });

    }else{
      this.mazeData = {
        mapWidth: 10,
        mapHeight: 10,
        wallHeight: 10,
        wallDepth: 1,
        blocks: [
          1,1,1,1,1,1,1,1,1,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,3,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,0,0,0,0,0,0,0,0,1,
          1,1,1,1,0,2,0,1,1,1
        ]
      };

      this.horizontalMazeBlocks = [];
      this.verticalMazeBlocks   = [];

      this.setHorizontalMazeBlocks();
      this.setVerticalMazeBlocks();

      this.tagHorizontalWalls();
      this.tagVerticalWalls();

      this.drawWalls('horizontal');
      this.drawWalls('vertical');

      this.positionCamera();
      this.positionWin();

    }


  },

  setMazeData: function(json){
    this.mazeData = {
      mapWidth: json.width,
      mapHeight: json.height,
      wallHeight: json.wallHeight,
      wallDepth: json.wallDepth,
      blocks: json.blocks,
    };
  },

  positionCamera: function(){
    var camera = document.querySelector('#scene-camera'); // FIXME parameterize
    var cameraSquare = this.horizontalMazeBlocks.filter(function(blk){ return blk.cameraSquare; })[0];

    xPos = cameraSquare.column;
    yPos = 1.6;
    zPos = cameraSquare.row;

    camera.setAttribute('position', {x: xPos, y: yPos, z: zPos});
  },

  positionWin: function(){
    winSphere = document.createElement('a-sphere');
    winSphere.setAttribute('color', 'gold');
    winSphere.setAttribute('roughness', '0');
    winSphere.setAttribute('metalness', '0.5');
    winSphere.setAttribute('radius', '1');

    var winSquare = this.horizontalMazeBlocks.filter(function(blk){ return blk.winSquare; })[0];
    if(winSquare){
      xPos = winSquare.column;
      yPos = 1.6;
      zPos = winSquare.row;
    }else{
      return;
    }

    winSphere.setAttribute('position', {x: xPos, y: yPos, z: zPos});

    winAnim = document.createElement('a-animation');
    winAnim.setAttribute('attribute', 'position');
    winAnim.setAttribute('direction', 'alternate');
    winAnim.setAttribute('dur', 1000);
    winAnim.setAttribute('repeat', 'true');
    winAnim.setAttribute('autoplay', 'true');
    winAnim.setAttribute('easing', 'linear');
    winAnim.setAttribute('from', winSquare.column + ' 1.6 ' + winSquare.row);
    winAnim.setAttribute('to', winSquare.column + ' 2.6 ' + winSquare.row);
    winSphere.appendChild(winAnim);

    this.el.appendChild(winSphere);
  },

  drawWalls: function(direction){
    var self        = this;
    var mazeBlocks  = direction == 'horizontal' ? self.horizontalMazeBlocks : self.verticalMazeBlocks;
    var mazeBlocks  = mazeBlocks.filter(function(blk){ return blk.wallAxis === direction; });
    var wallIndexes = mazeBlocks.map(function(blk){ return blk.wallTag; }).filter(function(tag, idx, arr){
      return arr.indexOf(tag) === idx;
    });


    wallIndexes.forEach(function(wallIndex){
      wallBlocks = mazeBlocks.filter(function(blk){ return blk.wallTag == wallIndex; });
      first      = wallBlocks[0];
      last       = wallBlocks[wallBlocks.length - 1];

      wallDepth    = self.mazeData.wallDepth;
      wallHeight   = self.mazeData.wallHeight;
      wallWidth    = wallBlocks.length;
      wallPosition = self.calculateWallPosition(first, wallWidth);

      self.placeWall(wallDepth, wallHeight, wallWidth, wallPosition, direction);
    });

  },

  calculateWallPosition: function(firstBlock, totalWidth){
    var self = this;
    centerX  = firstBlock.column;
    centerZ  = firstBlock.row;

    if(firstBlock.wallAxis === 'horizontal'){
      topX    = centerX + (totalWidth/2);
      topY    = this.mazeData.wallHeight/2;
      topZ    = centerZ;
    }else{
      topX    = centerX + (self.mazeData.wallDepth / 2);
      topY    = this.mazeData.wallHeight/2;

      if(totalWidth == 1){
        topZ = centerZ;
      }else{
        topZ    = centerZ + (totalWidth/2) - (self.mazeData.wallDepth / 2);
      }

    }

    return {x: topX, y: topY, z: topZ}
  },

  placeWall: function(wallDepth, wallHeight, wallWidth, wallPosition, axis){
    wall      = document.createElement('a-box');
    wallColor = 'blue';
    walls.appendChild(wall);

    wall.setAttribute('width', wallWidth);
    wall.setAttribute('height', wallHeight);

    if(this.data.wallTexture){
      wall.setAttribute('src', this.data.wallTexture);
      wall.setAttribute("material", "src: " + this.data.wallTexture + "; roughness: 1; metalness: 0.5;")
    }else{
      wall.setAttribute('color', wallColor);
    }

    wall.setAttribute('depth', wallDepth);
    if(axis === 'vertical') wall.setAttribute('rotation', {x: 0, y: 90, z: 0});
    wall.setAttribute('position', wallPosition);
    wall.setAttribute('static-body', true);
  },

  setHorizontalMazeBlocks: function(){
    var self = this;
    console.log(this);
    self.mazeData.blocks.forEach(function(block, idx){
      // For every block in the array, figure out the x, z value of it's centerpoint and
      // store whether or not there is a block at that coordinate.
      data = {};
      data['horizontalIndex'] = idx;
      data['blockSquare']     = block === 1;
      data['cameraSquare']    = block === 2;
      data['winSquare']       = block === 3;
      data['column']          = self.xFromIndex(idx);
      data['row']             = self.zFromIndex(idx);

      self.horizontalMazeBlocks.push(data);
    });

  },

  setVerticalMazeBlocks: function(){
    var self = this;

    for(i = 0; i < this.mazeData.mapWidth; i++){
      blocks =  this.horizontalMazeBlocks.filter(function(block){ return block.column === i;   });
      blocks.forEach(function(blk){
        blk['verticalIndex'] = self.verticalMazeBlocks.length;
        self.verticalMazeBlocks.push(blk);
      });
    }
  },

  tagHorizontalWalls: function(){
    var wallTag = 1;
    var self = this;

    this.horizontalMazeBlocks.forEach(function(block, idx){
      previousBlock = self.horizontalMazeBlocks[idx - 1];
      if(previousBlock && block.blockSquare){
        if(!previousBlock.blockSquare || previousBlock.row < block.row){
          wallTag += 1;
        }
      }

      if(block.blockSquare){
        block.wallTag  = wallTag;
        block.wallAxis = 'horizontal';
      }
    });
  },

  tagVerticalWalls: function(){
    var verticalMazeBlocks = this.verticalMazeBlocks;
    var wallTags = this.verticalMazeBlocks.filter(function(blk){ return blk.blockSquare; }).map(function(blk){ return blk.wallTag });
    if(!wallTags.length > 0) return;
    var wallTag  = wallTags.reduce(function(a, b){ return Math.max(a, b); }) + 1;
    var uniquelyTagged = [];

    // Go through all the wall Tags.

    // Get all free floating vertical blocks
    uniquelyTagged = verticalMazeBlocks.filter(function(block){
      return verticalMazeBlocks.filter(function(blk){ return (blk.wallTag === block.wallTag); }).length === 1;
    });


    uniquelyTagged.forEach(function(block, idx){
      block.wallAxis = 'vertical';
      previousBlock  = uniquelyTagged[idx - 1];

      if(previousBlock){
        if((previousBlock.verticalIndex !== block.verticalIndex - 1) || previousBlock.column !== block.column){
          wallTag += 1;
        }

      }

      block.wallTag  = wallTag;
    });
  },

  xFromIndex: function(idx){
    mapWidth = this.mazeData.mapWidth;
    return(idx % mapWidth);

  },

  zFromIndex: function(idx){
    mapWidth  = this.mazeData.mapWidth;
    return(Math.floor(idx/mapWidth));
  }

});


