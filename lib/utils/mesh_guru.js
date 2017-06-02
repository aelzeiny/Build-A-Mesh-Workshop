import Vector from './vector';

///Calculates the area of a given Path
export const area = function(path) {
  let sum = 0;
  for(let i=0;i<path.length;i++) {
    const curr = path[i];
    const next = i === path.length - 1 ? path[0] : path[i+1];
    sum += curr.X * next.Y - curr.Y * next.X;
  }
  return Math.abs(sum/2);
};

/// Checks to see if two line sements cross. The first segment, segA, starts at
/// IntPoint sA and ends at vector eA. The second segmeent, segB, starts at sB
/// ends at eB
export const lineSegmentsCross = function(sA, eA, sB, eB) {
  let denominator = ((eA.X - sA.X) * (eB.Y - sB.Y)) - ((eA.Y - sA.Y) * (eB.X - sB.X));

  if (denominator === 0)
      return false;

  let numerator1 = ((sA.Y - sB.Y) * (eB.X - sB.X)) - ((sA.X - sB.X) * (eB.Y - sB.Y));

  let numerator2 = ((sA.Y - sB.Y) * (eA.X - sA.X)) - ((sA.X - sB.X) * (eA.Y - sA.Y));

  if (numerator1 === 0 || numerator2 === 0)
      return false;

  let r = numerator1 / denominator;
  let s = numerator2 / denominator;

  return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
};

// Checks to see if vertex is considered an 'innie' or an 'outtie'
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

const EPSILON = 0.5;

function distanceSq(a, b) {
  return (a.X - b.X) * (a.X - b.X) + (a.Y - b.Y) * (a.Y - b.Y);
}

/// Checks to see if the position is contained within the specified path
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
