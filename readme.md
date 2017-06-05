# Navigation Mesh Construction

## Background

Pathfinding algorithms are always visualized on square grids, but maps in the real-world
can rarely ever be represented by neat, orthogonal corners. There are a few different
ways to construct a navigation-mesh. This project demonstrates the pre-computational method that became popular in point-and-click adventure games in
the late 90s.

## Step 1: Using Cellular Automa to generate procedural levels
Cellular Automa has a myriad of different applications and amazing visualizations, but this is by far my favorite. This feature was originally implemented because UX-tests demonstrated that users were not drawing fully-connected or intricate maps due to a rather opaque control scheme, and therefore procedural generation was a quick way to fix the problem.

Automa-Generated caves is not a new concept to dungeon crawler and rogue-like games. The implementation is rather quite straight-forward in comparison with other procedural level generation algorithms. You can read more about the implementation [here](http://www.roguebasin.com/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels).

A slider also configures the % probability that each node is a wall upon instantiation. 0% means that only edges and corners are wall, which 100% means that the entire grid is a wall.

## Step 1.5: Grid to Concave polygon rasterization
Converting an array of true/false statements to a complex polygon is no easy task. A recursive algorithm was developed to isolate the connected grid pieces on the boundary of a polygon, and then isolating each polygon as an array of neighboring points. Then, for added measure, I used the [Concaveman](https://github.com/mapbox/concaveman) library to ensure concave polygons were represented accurately.

## Step 2: Mesh Modification
[Clipper-JS](https://sourceforge.net/p/jsclipper/wiki/Home%206/) is a port of port of Angus Johnson's Clipper library in JavaScript, which allows for the use of mathmatical on polygons. In this implementation, polygons can be added, subtracted, or offsetted to refine the output given by the procedural generation of the first step.

Originally this step was to be a stand-alone feature, but user tests show that most people do not take the time to develop cool-looking mazes in this Pathfinding demo.

## Step 3: Drop the player on the map

When a click occurs on the canvas screen in this step, the polygon with the biggest area becomes the central polygon that is used for mesh-generation. All other polygons are ignored.

The area of a concave polygon can be described as:
``` JavaScript
export const area = function(path) {
  let sum = 0;
  for(let i=0;i<path.length;i++) {
    const curr = path[i];
    const next = i === path.length - 1 ? path[0] : path[i+1];
    sum += curr.X * next.Y - curr.Y * next.X;
  }
  return Math.abs(sum/2);
};
```


The code to determine whether a point is inside a polygon is a bit tricky, and is difficult to find online.
``` JavaScript
export const contains = function(path, position, toleranceOnOutside = true) {
    let point = position;

    let inside = false;

    // Must have 3 or more edges
    if (path.length < 3) return false;

    let oldPoint = path[path.length - 1];
    let oldSqDist = distanceSq(point, oldPoint);

    for (let i = 0; i < path.length; i++) {
        let newPoint = path[i];
        let newSqDist = distanceSq(newPoint, point);

        let deltaSqs = oldSqDist + newSqDist
          + 2.0 * Math.sqrt(oldSqDist * newSqDist)
          - distanceSq(oldPoint,newPoint);

        if (deltaSqs < EPSILON)
          return toleranceOnOutside;

        let left;
        let right;
        if (newPoint.X > oldPoint.X) {
          left = oldPoint;
          right = newPoint;
        }
        else {
          left = newPoint;
          right = oldPoint;
        }

        if (
          left.X < point.X
          && point.X <= right.X
          && (point.Y - left.Y) * (right.X - left.X)
           < (right.Y - left.Y) * (point.X - left.X)
        ) {
          inside = !inside;
        }
        oldPoint = newPoint;
        oldSqDist = newSqDist;
    }

    return inside;
};
```

## Step 4: Mesh generation
Not all verticies should be a node. Verticies that can be described as 'innies' are more valuable for pathfinding algorithms than nodes that area 'outties'. How do we mathmatically compute innie vs outtie verticies?

I'm glad you asked:

``` JavaScript
export const isVertexConcave = function(path, vertexIdx)
{
    let current = path[vertexIdx];
    let next = path[(vertexIdx + 1) % path.length];
    let previous = path[vertexIdx === 0 ? path.length - 1 : vertexIdx - 1];

    let left = new Vector(current.X - previous.X, current.Y - previous.Y);
    let right = new Vector(next.X - current.X, next.Y - current.Y);

    let cross = (left.x * right.y) - (left.y * right.x);

    return cross < 0;
};
```

## Step 5: Raycasting
In order to demonstrate that the graph is fully-connected, a Raycasting algorithm is put into place. The mouse represents a dynamic node that is constantly moving - forming new connections while breaking off old ones. Note that no matter where the mouse is within the parent polygon, there is always at least one neighboring node. Subsequently, there always a path to reach the mouse from any other position on the screen.
