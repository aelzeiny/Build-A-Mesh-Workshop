import Vector from './vector';

/*
public static bool LineSegmentsCross(Vector2 a, Vector2 b, Vector2 c, Vector2 d)
{
}
*/

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
    let previous = path[vertexIdx === 0 ? path.Count - 1 : vertexIdx - 1];

    let left = new Vector(current.X - previous.X, current.Y - previous.Y);
    let right = new Vector(next.X - current.X, next.Y - current.Y);

    let cross = (left.x * right.y) - (left.y * right.x);

    return cross < 0;
};
