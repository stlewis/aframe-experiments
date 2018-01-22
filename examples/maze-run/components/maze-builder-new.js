AFRAME.registerComponent('maze-builder', {

  init: function() {
    // Array is a left-to-right single dimensional representation of an NxN grid.
    this.mazeData = { 
      mapWidth: 5, 
      mapHeight: 5,
      wallHeight: 5, 
      wallDepth: 1,
      blocks: [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
    };

    this.horizontalMazeBlocks = [];
    this.verticalMazeBlocks   = [];
    
    this.setHorizontalMazeBlocks();
    this.setVerticalMazeBlocks();
    
    this.tagHorizontalWalls();
    this.tagVerticalWalls();

    this.drawWalls('horizontal');
    this.drawWalls('vertical');
    
    mapped = this.horizontalMazeBlocks.map(function(blk){ return blk.wallTag || 0; })
    //console.log(mapped);
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
    var xPos;
    var yPos;
    var zPos;
    
    if(firstBlock.wallAxis === 'horizontal'){
      xPos = (firstBlock.xCoordinate/2) + (totalWidth/2);
      yPos = 0;
      zPos = firstBlock.zCoordinate - (this.mazeData.wallDepth/2);
    }else{
      xPos = (firstBlock.xCoordinate) + (this.mazeData.wallDepth/2);
      yPos = 0;
      zPos = firstBlock.zCoordinate + (this.mazeData.wallDepth);
  }
    return({x: xPos, y: yPos, z: zPos});
  },

  placeWall: function(wallDepth, wallHeight, wallWidth, wallPosition, axis){
    wall      = document.createElement('a-box');
    wallColor = axis === 'horizontal' ? 'green' : 'blue';
    walls.appendChild(wall);

    wall.setAttribute('width', wallWidth);
    wall.setAttribute('height', wallHeight);
    wall.setAttribute('color', wallColor);
    wall.setAttribute('depth', wallDepth);
    if(axis === 'vertical') wall.setAttribute('rotation', {x: 0, y: 90, z: 0});
    wall.setAttribute('position', wallPosition);
    wall.setAttribute('static-body', true);
  },

  setHorizontalMazeBlocks: function(){
    var self = this;
    this.mazeData.blocks.forEach(function(block, idx){
      // For every block in the array, figure out the x, z value of it's centerpoint and
      // store whether or not there is a block at that coordinate.
      data = {};
      data['horizontalIndex'] = idx;
      data['blockSquare']     = block === 1;
      data['xCoordinate']     = (self.xFromIndex(idx));
      data['zCoordinate']     = (self.zFromIndex(idx));

      self.horizontalMazeBlocks.push(data);
    });
     
  },

  setVerticalMazeBlocks: function(){
    var self = this;
    
    for(i = 0; i < this.mazeData.mapWidth; i++){
      blocks =  this.horizontalMazeBlocks.filter(function(block){ return block.xCoordinate === i;   });
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
        if(!previousBlock.blockSquare || previousBlock.zCoordinate < block.zCoordinate){
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
    console.log(verticalMazeBlocks);
    console.log(this.horizontalMazeBlocks);
    uniquelyTagged = verticalMazeBlocks.filter(function(block){
      return verticalMazeBlocks.filter(function(blk){ return (blk.wallTag === block.wallTag); }).length === 1;
    });


    uniquelyTagged.forEach(function(block, idx){
      block.wallAxis = 'vertical';
      previousBlock  = uniquelyTagged[idx - 1];

      if(previousBlock){
        if((previousBlock.verticalIndex !== block.verticalIndex - 1) || previousBlock.xCoordinate !== block.xCoordinate){
           //If there was a gap between this and the previous block
           //Or, if there is a difference in xCoordinate between the two
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


