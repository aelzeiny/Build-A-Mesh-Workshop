import Vector from './vector';

export const lineSegementsCross = function(a, b, c, d) {
  let denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));

  if (denominator === 0)
      return false;

  let numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));

  let numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

  if (numerator1 === 0 || numerator2 === 0)
      return false;

  let r = numerator1 / denominator;
  let s = numerator2 / denominator;

  return (r > 0 && r < 1) && (s > 0 && s < 1);
};

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

export const contains = function(path, position, toleranceOnOutside = true) {
    let point = position;

    let inside = false;

    // Must have 3 or more edges
    if (path.length < 3) return false;

    let oldPoint = path[path.length - 1];
    let oldSqDist = oldPoint.subtract(point).DistanceSquared();

    for (let i = 0; i < path.length; i++)
    {
        let newPoint = path[i];
        let newSqDist = newPoint.subtract(point).distanceSq();

        if (oldSqDist + newSqDist + 2.0 * Math.sqrt(oldSqDist * newSqDist) - oldPoint.subtract(newPoint).distanceSq() < EPSILON)
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

        if (left.X < point.X && point.X <= right.X && (point.Y - left.Y) * (right.X - left.X) < (right.Y - left.Y) * (point.X - left.X))
            inside = !inside;

        oldPoint = newPoint;
        oldSqDist = newSqDist;
    }

    return inside;
};
