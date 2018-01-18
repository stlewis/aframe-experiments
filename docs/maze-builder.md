# Maze Builder

So, the first thing I should warn you about is that this component is basically
a ripoff of the maze-generating code found in [this blog
post]('https://24ways.org/2016/first-steps-in-vr/'). 

Read the blog post if you really want to understand what's going on. In essence
though, this component converts an array of 0's, 1's, and 2's in to a 3D maze
that can be navigated in VR. How you come by that array is a subject better
covered in the post than anything I might write here.

# Attributes

The component accepts a handful of attributes that determine some of the basic
characteristics of the wall:

`wallSelector`: Selector for the entity that will contain your walls. All
generated walls will be appended to this entity. It defaults to '#walls'.

`wallTexture`: Selector for the texture asset to apply to "normal" maze walls.

`wallColor`: If no texture is supplied for normal walls, the color to apply
instead. Defaults to blue.

`winWallTexture`: Selector for the texture asset to apply to "win room" maze
walls. See below for an explanation.

`winWallColor`: If no texture is supplied for "win room" walls, the color to
apply instead. Defaults to 'red'.

`wallSize`: The thickness of the maze walls. Defaults to 5

`wallHeight`: How tall the maze walls are. Defaults to 12

# The Win Room


