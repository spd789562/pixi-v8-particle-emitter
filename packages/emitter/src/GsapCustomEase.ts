// @ts-nocheck
/**
 * All code copied from https://github.com/greensock/GSAP/blob/master/src/CustomEase.js
 * and https://github.com/greensock/GSAP/blob/master/src/utils/paths.js
 *
 * all rights reserved to GreenSock
 */

import type { SimpleEase } from './ParticleUtils';

/* path.js parts */
const _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[-+]?\d+)?)[0-9]/gi;
const _numbersExp = /(?:(-)?\d*\.?\d*(?:e[-+]?\d+)?)[0-9]/gi;
const _scientific = /[+-]?\d*\.?\d+e[+-]?\d+/gi;

const _DEG2RAD = Math.PI / 180,
  _RAD2DEG = 180 / Math.PI,
  _sin = Math.sin,
  _cos = Math.cos,
  _abs = Math.abs,
  _sqrt = Math.sqrt,
  _atan2 = Math.atan2;

// translates SVG arc data into a segment (cubic beziers). Angle is in degrees.
function arcToSegment(
  lastX,
  lastY,
  rx,
  ry,
  angle,
  largeArcFlag,
  sweepFlag,
  x,
  y,
) {
  if (lastX === x && lastY === y) {
    return;
  }
  rx = _abs(rx);
  ry = _abs(ry);
  let angleRad = (angle % 360) * _DEG2RAD,
    cosAngle = _cos(angleRad),
    sinAngle = _sin(angleRad),
    PI = Math.PI,
    TWOPI = PI * 2,
    dx2 = (lastX - x) / 2,
    dy2 = (lastY - y) / 2,
    x1 = cosAngle * dx2 + sinAngle * dy2,
    y1 = -sinAngle * dx2 + cosAngle * dy2,
    x1_sq = x1 * x1,
    y1_sq = y1 * y1,
    radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);
  if (radiiCheck > 1) {
    rx = _sqrt(radiiCheck) * rx;
    ry = _sqrt(radiiCheck) * ry;
  }
  let rx_sq = rx * rx,
    ry_sq = ry * ry,
    sq =
      (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) /
      (rx_sq * y1_sq + ry_sq * x1_sq);
  if (sq < 0) {
    sq = 0;
  }
  let coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq),
    cx1 = coef * ((rx * y1) / ry),
    cy1 = coef * -((ry * x1) / rx),
    sx2 = (lastX + x) / 2,
    sy2 = (lastY + y) / 2,
    cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
    cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
    ux = (x1 - cx1) / rx,
    uy = (y1 - cy1) / ry,
    vx = (-x1 - cx1) / rx,
    vy = (-y1 - cy1) / ry,
    temp = ux * ux + uy * uy,
    angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)),
    angleExtent =
      (ux * vy - uy * vx < 0 ? -1 : 1) *
      Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));
  Number.isNaN(angleExtent) && (angleExtent = PI); //rare edge case. Math.cos(-1) is NaN.
  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= TWOPI;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += TWOPI;
  }
  angleStart %= TWOPI;
  angleExtent %= TWOPI;
  let segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)),
    rawPath = [],
    angleIncrement = angleExtent / segments,
    controlLength =
      ((4 / 3) * _sin(angleIncrement / 2)) / (1 + _cos(angleIncrement / 2)),
    ma = cosAngle * rx,
    mb = sinAngle * rx,
    mc = sinAngle * -ry,
    md = cosAngle * ry,
    i: number;
  for (i = 0; i < segments; i++) {
    angle = angleStart + i * angleIncrement;
    x1 = _cos(angle);
    y1 = _sin(angle);
    ux = _cos((angle += angleIncrement));
    uy = _sin(angle);
    rawPath.push(
      x1 - controlLength * y1,
      y1 + controlLength * x1,
      ux + controlLength * uy,
      uy - controlLength * ux,
      ux,
      uy,
    );
  }
  //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).
  for (i = 0; i < rawPath.length; i += 2) {
    x1 = rawPath[i];
    y1 = rawPath[i + 1];
    rawPath[i] = x1 * ma + y1 * mc + cx;
    rawPath[i + 1] = x1 * mb + y1 * md + cy;
  }
  rawPath[i - 2] = x; //always set the end to exactly where it's supposed to be
  rawPath[i - 1] = y;
  return rawPath;
}

//Spits back a RawPath with absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.
export function stringToRawPath(d) {
  let a =
      `${d}`
        .replace(_scientific, (m) => {
          const n = +m;
          return n < 0.0001 && n > -0.0001 ? 0 : n;
        })
        .match(_svgPathExp) || [], //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
    path = [],
    relativeX = 0,
    relativeY = 0,
    twoThirds = 2 / 3,
    elements = a.length,
    points = 0,
    errorMessage = `ERROR: malformed path: ${d}`,
    i: number,
    j: number,
    x: number,
    y: number,
    command: string,
    isRelative: boolean,
    segment: number[],
    startX: number,
    startY: number,
    difX: number,
    difY: number,
    beziers: number[],
    prevCommand: string,
    flag1: any[],
    flag2: any[],
    line = (sx: number, sy: number, ex: number, ey: number) => {
      difX = (ex - sx) / 3;
      difY = (ey - sy) / 3;
      segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
    };
  if (!d || !Number.isNaN(a[0]) || Number.isNaN(a[1])) {
    console.log(errorMessage);
    return path;
  }
  for (i = 0; i < elements; i++) {
    prevCommand = command;
    if (Number.isNaN(a[i])) {
      command = a[i].toUpperCase();
      isRelative = command !== a[i]; //lower case means relative
    } else {
      //commands like "C" can be strung together without any new command characters between.
      i--;
    }
    x = +a[i + 1];
    y = +a[i + 2];
    if (isRelative) {
      x += relativeX;
      y += relativeY;
    }
    if (!i) {
      startX = x;
      startY = y;
    }

    // "M" (move)
    if (command === 'M') {
      if (segment) {
        if (segment.length < 8) {
          //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }
      relativeX = startX = x;
      relativeY = startY = y;
      segment = [x, y];
      path.push(segment);
      i += 2;
      command = 'L'; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").

      // "C" (cubic bezier)
    } else if (command === 'C') {
      if (!segment) {
        segment = [0, 0];
      }
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.
      segment.push(
        x,
        y,
        relativeX + a[i + 3] * 1,
        relativeY + a[i + 4] * 1,
        (relativeX += a[i + 5] * 1),
        (relativeY += a[i + 6] * 1),
      );
      i += 6;

      // "S" (continuation of cubic bezier)
    } else if (command === 'S') {
      difX = relativeX;
      difY = relativeY;
      if (prevCommand === 'C' || prevCommand === 'S') {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      segment.push(
        difX,
        difY,
        x,
        y,
        (relativeX += a[i + 3] * 1),
        (relativeY += a[i + 4] * 1),
      );
      i += 4;

      // "Q" (quadratic bezier)
    } else if (command === 'Q') {
      difX = relativeX + (x - relativeX) * twoThirds;
      difY = relativeY + (y - relativeY) * twoThirds;
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      relativeX += a[i + 3] * 1;
      relativeY += a[i + 4] * 1;
      segment.push(
        difX,
        difY,
        relativeX + (x - relativeX) * twoThirds,
        relativeY + (y - relativeY) * twoThirds,
        relativeX,
        relativeY,
      );
      i += 4;

      // "T" (continuation of quadratic bezier)
    } else if (command === 'T') {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(
        relativeX + difX,
        relativeY + difY,
        x + (relativeX + difX * 1.5 - x) * twoThirds,
        y + (relativeY + difY * 1.5 - y) * twoThirds,
        (relativeX = x),
        (relativeY = y),
      );
      i += 2;

      // "H" (horizontal line)
    } else if (command === 'H') {
      line(relativeX, relativeY, (relativeX = x), relativeY);
      i += 1;

      // "V" (vertical line)
    } else if (command === 'V') {
      //adjust values because the first (and only one) isn't x in this case, it's y.
      line(
        relativeX,
        relativeY,
        relativeX,
        (relativeY = x + (isRelative ? relativeY - relativeX : 0)),
      );
      i += 1;

      // "L" (line) or "Z" (close)
    } else if (command === 'L' || command === 'Z') {
      if (command === 'Z') {
        x = startX;
        y = startY;
        segment.closed = true;
      }
      if (
        command === 'L' ||
        _abs(relativeX - x) > 0.5 ||
        _abs(relativeY - y) > 0.5
      ) {
        line(relativeX, relativeY, x, y);
        if (command === 'L') {
          i += 2;
        }
      }
      relativeX = x;
      relativeY = y;

      // "A" (arc)
    } else if (command === 'A') {
      flag1 = a[i + 4];
      flag2 = a[i + 5];
      difX = a[i + 6];
      difY = a[i + 7];
      j = 7;
      if (flag1.length > 1) {
        // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
        if (flag1.length < 3) {
          difY = difX;
          difX = flag2;
          j--;
        } else {
          difY = flag2;
          difX = flag1.substr(2);
          j -= 2;
        }
        flag2 = flag1.charAt(1);
        flag1 = flag1.charAt(0);
      }
      beziers = arcToSegment(
        relativeX,
        relativeY,
        +a[i + 1],
        +a[i + 2],
        +a[i + 3],
        +flag1,
        +flag2,
        (isRelative ? relativeX : 0) + difX * 1,
        (isRelative ? relativeY : 0) + difY * 1,
      );
      i += j;
      if (beziers) {
        for (j = 0; j < beziers.length; j++) {
          segment.push(beziers[j]);
        }
      }
      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
    } else {
      console.log(errorMessage);
    }
  }
  i = segment.length;
  if (i < 6) {
    //in case there's odd SVG like a M0,0 command at the very end.
    path.pop();
    i = 0;
  } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
    segment.closed = true;
  }
  path.totalPoints = points + i;
  return path;
}

/* customEase.js parts */

const _bigNum = 1e20,
  _bonusValidated = 1, //<name>CustomEase</name>
  _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi, //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
  _needsParsingExp = /[cLlsSaAhHvVtTqQ]/g,
  _findMinimum = (values: number[]) => {
    let l = values.length,
      min = _bigNum,
      i: number;
    for (i = 1; i < l; i += 6) {
      +values[i] < min && (min = +values[i]);
    }
    return min;
  },
  //takes all the points and translates/scales them so that the x starts at 0 and ends at 1.
  _normalize = (values, height, originY) => {
    if (!originY && originY !== 0) {
      originY = Math.max(+values[values.length - 1], +values[1]);
    }
    let tx = +values[0] * -1,
      ty = -originY,
      l = values.length,
      sx = 1 / (+values[l - 2] + tx),
      sy =
        -height ||
        (Math.abs(+values[l - 1] - +values[1]) <
        0.01 * (+values[l - 2] - +values[0])
          ? _findMinimum(values) + ty
          : +values[l - 1] + ty),
      i: number;
    if (sy) {
      //typically y ends at 1 (so that the end values are reached)
      sy = 1 / sy;
    } else {
      //in case the ease returns to its beginning value, scale everything proportionally
      sy = -sx;
    }
    for (i = 0; i < l; i += 2) {
      values[i] = (+values[i] + tx) * sx;
      values[i + 1] = (+values[i + 1] + ty) * sy;
    }
  },
  //note that this function returns point objects like {x, y} rather than working with segments which are arrays with alternating x, y values as in the similar function in paths.js
  _bezierToPoints = (
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    x4,
    y4,
    threshold,
    points,
    index,
  ) => {
    let x12 = (x1 + x2) / 2,
      y12 = (y1 + y2) / 2,
      x23 = (x2 + x3) / 2,
      y23 = (y2 + y3) / 2,
      x34 = (x3 + x4) / 2,
      y34 = (y3 + y4) / 2,
      x123 = (x12 + x23) / 2,
      y123 = (y12 + y23) / 2,
      x234 = (x23 + x34) / 2,
      y234 = (y23 + y34) / 2,
      x1234 = (x123 + x234) / 2,
      y1234 = (y123 + y234) / 2,
      dx = x4 - x1,
      dy = y4 - y1,
      d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx),
      d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx),
      length: number;
    if (!points) {
      points = [
        { x: x1, y: y1 },
        { x: x4, y: y4 },
      ];
      index = 1;
    }
    points.splice(index || points.length - 1, 0, { x: x1234, y: y1234 });
    if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
      length = points.length;
      _bezierToPoints(
        x1,
        y1,
        x12,
        y12,
        x123,
        y123,
        x1234,
        y1234,
        threshold,
        points,
        index,
      );
      _bezierToPoints(
        x1234,
        y1234,
        x234,
        y234,
        x34,
        y34,
        x4,
        y4,
        threshold,
        points,
        index + 1 + (points.length - length),
      );
    }
    return points;
  };

/**
 * Generates a custom ease function, based on the GreenSock custom ease, as demonstrated
 * by the related tool at http://www.greensock.com/customease/.
 * main logics are copied from https://github.com/greensock/GSAP/blob/master/src/CustomEase.js
 *
 * @param path A path string, as created by
 * http://www.greensock.com/customease/.
 * basically just svg path or a cubic bezier curve.
 * @return A function that calculates the percentage of change at
 *                    a given point in time (0-1 inclusive).
 */
export function generateEaseFromPath(data: string, config = {}): SimpleEase {
  data = data || '0,0,1,1';
  let values = data.match(_numExp),
    closest = 1,
    points = [],
    lookup = [],
    precision = config.precision || 1,
    fast = precision <= 1,
    l: number,
    a1: any,
    a2: any,
    i: number,
    inc: number,
    j: number,
    point: any,
    prevPoint: any,
    p: number;
  if (
    _needsParsingExp.test(data) ||
    (~data.indexOf('M') && data.indexOf('C') < 0)
  ) {
    values = stringToRawPath(data)[0];
  }
  l = values.length;
  if (l === 4) {
    values.unshift(0, 0);
    values.push(1, 1);
    l = 8;
  } else if ((l - 2) % 6) {
    throw 'Invalid CustomEase';
  }
  if (+values[0] !== 0 || +values[l - 2] !== 1) {
    _normalize(values, config.height, config.originY);
  }
  for (i = 2; i < l; i += 6) {
    a1 = { x: +values[i - 2], y: +values[i - 1] };
    a2 = { x: +values[i + 4], y: +values[i + 5] };
    points.push(a1, a2);
    _bezierToPoints(
      a1.x,
      a1.y,
      +values[i],
      +values[i + 1],
      +values[i + 2],
      +values[i + 3],
      a2.x,
      a2.y,
      1 / (precision * 200000),
      points,
      points.length - 1,
    );
  }
  l = points.length;
  for (i = 0; i < l; i++) {
    point = points[i];
    prevPoint = points[i - 1] || point;
    if (
      (point.x > prevPoint.x ||
        (prevPoint.y !== point.y && prevPoint.x === point.x) ||
        point === prevPoint) &&
      point.x <= 1
    ) {
      //if a point goes BACKWARD in time or is a duplicate, just drop it. Also it shouldn't go past 1 on the x axis, as could happen in a string like "M0,0 C0,0 0.12,0.68 0.18,0.788 0.195,0.845 0.308,1 0.32,1 0.403,1.005 0.398,1 0.5,1 0.602,1 0.816,1.005 0.9,1 0.91,1 0.948,0.69 0.962,0.615 1.003,0.376 1,0 1,0".
      prevPoint.cx = point.x - prevPoint.x; //change in x between this point and the next point (performance optimization)
      prevPoint.cy = point.y - prevPoint.y;
      prevPoint.n = point;
      prevPoint.nx = point.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)
      if (
        fast &&
        i > 1 &&
        Math.abs(
          prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx,
        ) > 2
      ) {
        //if there's a sudden change in direction, prioritize accuracy over speed. Like a bounce ease - you don't want to risk the sampling chunks landing on each side of the bounce anchor and having it clipped off.
        fast = 0;
      }
      if (prevPoint.cx < closest) {
        if (!prevPoint.cx) {
          prevPoint.cx = 0.001; //avoids math problems in getRatio() (dividing by zero)
          if (i === l - 1) {
            //in case the final segment goes vertical RIGHT at the end, make sure we end at the end.
            prevPoint.x -= 0.001;
            closest = Math.min(closest, 0.001);
            fast = 0;
          }
        } else {
          closest = prevPoint.cx;
        }
      }
    } else {
      points.splice(i--, 1);
      l--;
    }
  }
  l = (1 / closest + 1) | 0;
  inc = 1 / l;
  j = 0;
  point = points[0];
  if (fast) {
    for (i = 0; i < l; i++) {
      //for fastest lookups, we just sample along the path at equal x (time) distance. Uses more memory and is slightly less accurate for anchors that don't land on the sampling points, but for the vast majority of eases it's excellent (and fast).
      p = i * inc;
      if (point.nx < p) {
        point = points[++j];
      }
      a1 = point.y + ((p - point.x) / point.cx) * point.cy;
      lookup[i] = { x: p, cx: inc, y: a1, cy: 0, nx: 9 };
      if (i) {
        lookup[i - 1].cy = a1 - lookup[i - 1].y;
      }
    }
    j = points[points.length - 1];
    lookup[l - 1].cy = j.y - a1;
    lookup[l - 1].cx = j.x - lookup[lookup.length - 1].x; //make sure it lands EXACTLY where it should. Otherwise, it might be something like 0.9999999999 instead of 1.
  } else {
    //this option is more accurate, ensuring that EVERY anchor is hit perfectly. Clipping across a bounce, for example, would never happen.
    for (i = 0; i < l; i++) {
      //build a lookup table based on the smallest distance so that we can instantly find the appropriate point (well, it'll either be that point or the very next one). We'll look up based on the linear progress. So it's it's 0.5 and the lookup table has 100 elements, it'd be like lookup[Math.floor(0.5 * 100)]
      if (point.nx < i * inc) {
        point = points[++j];
      }
      lookup[i] = point;
    }

    if (j < points.length - 1) {
      lookup[i - 1] = points[points.length - 2];
    }
  }

  return function customEase(p: number) {
    let point = lookup[(p * l) | 0] || lookup[l - 1];
    if (point.nx < p) {
      point = point.n;
    }
    return point.y + ((p - point.x) / point.cx) * point.cy;
  };
}
