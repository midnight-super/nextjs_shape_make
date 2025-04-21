const multiplier = 10;

export function createEdges(drawnObject) {
  console.log(drawnObject);
  // Check if dimensions exist
  if (drawnObject.dimensions && Array.isArray(drawnObject.dimensions)) {
    // Create edgeLabels array
    drawnObject.edgeLabels = drawnObject.dimensions.map((dim, index) => {
      const labelName = "N";
      return { name: labelName, value: 0 };
    });
  }
  console.log(drawnObject);
  return drawnObject;
}

function distanceFromLineSegment(point, p1, p2) {
  const { x, y } = point;

  const A = x - p1.x;
  const B = y - p1.y;
  const C = p2.x - p1.x;
  const D = p2.y - p1.y;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  const param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = p1.x;
    yy = p1.y;
  } else if (param > 1) {
    xx = p2.x;
    yy = p2.y;
  } else {
    xx = p1.x + param * C;
    yy = p1.y + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function rotateOutline(outline, direction) {
  if (outline.length % 2 !== 0) {
    throw new Error("Invalid outline array");
  }

  const n = outline.length / 2;

  // Calculate centroid
  let Cx = 0,
    Cy = 0;
  for (let i = 0; i < outline.length; i += 2) {
    Cx += outline[i];
    Cy += outline[i + 1];
  }
  Cx /= n;
  Cy /= n;

  const rotatedOutline = [];

  for (let i = 0; i < outline.length; i += 2) {
    const x = outline[i] - Cx; // Translate to origin
    const y = outline[i + 1] - Cy;

    // Rotate around origin
    let newX, newY;
    if (direction === "counterclockwise") {
      newX = y;
      newY = -x;
    } else if (direction === "clockwise") {
      newX = -y;
      newY = x;
    } else {
      throw new Error("Invalid direction");
    }

    // Translate back
    rotatedOutline.push(newX + Cx, newY + Cy);
  }

  return rotatedOutline;
}

export function expandOutline(outline, pixelOffset) {
  let expandedOutline = [];

  for (let i = 0; i < outline.length; i = i + 2) {
    let candidateLine = [
      [outline[i], outline[(i + 1) % outline.length]],
      [outline[(i + 2) % outline.length], outline[(i + 3) % outline.length]],
    ];
    let adjustedLine;

    if (isHorizontal(candidateLine)) {
      adjustedLine = candidateLine.map((point) => [
        point[0],
        point[1] - pixelOffset,
      ]);
      if (isInPolygon(outline, adjustedLine)) {
        adjustedLine = candidateLine.map((point) => [
          point[0],
          point[1] + pixelOffset,
        ]);
      }
    } else {
      adjustedLine = candidateLine.map((point) => [
        point[0] - pixelOffset,
        point[1],
      ]);
      if (isInPolygon(outline, adjustedLine)) {
        adjustedLine = candidateLine.map((point) => [
          point[0] + pixelOffset,
          point[1],
        ]);
      }
    }

    // Flatten the adjusted line and push to the expandedOutline
    expandedOutline.push(...adjustedLine.flat());
  }

  return expandedOutline;
}

export function bumpOut(drawnObject, indices) {
  const outline = drawnObject.outline;

  // Extract the START and END points using the given indices
  const startX = outline[indices[0] * 2];
  const startY = outline[indices[0] * 2 + 1];
  const endX = outline[indices[1] * 2];
  const endY = outline[indices[1] * 2 + 1];

  // Calculate one-third and two-third points on the original edge
  const oneThirdX = startX + (endX - startX) / 3;
  const oneThirdY = startY + (endY - startY) / 3;
  const twoThirdX = startX + (2 * (endX - startX)) / 3;
  const twoThirdY = startY + (2 * (endY - startY)) / 3;

  let pointsToInsert = [];

  // Define the bump's depth
  const bumpDepth = 50;
  console.log("Original Start X:", startX);
  console.log("Original Start Y:", startY);
  console.log("Original End X:", endX);
  console.log("Original End Y:", endY);
  console.log("One-Third Point X:", oneThirdX);
  console.log("One-Third Point Y:", oneThirdY);
  console.log("Two-Third Point X:", twoThirdX);
  console.log("Two-Third Point Y:", twoThirdY);
  console.log("Bump Depth:", bumpDepth);
  switch (drawnObject.dimensions[indices[0]][2]) {
    case "up":
      pointsToInsert = [
        oneThirdX,
        oneThirdY,
        oneThirdX,
        oneThirdY - bumpDepth,
        twoThirdX,
        twoThirdY - bumpDepth,
        twoThirdX,
        twoThirdY,
      ];
      break;

    case "down":
      pointsToInsert = [
        oneThirdX,
        oneThirdY,
        oneThirdX,
        oneThirdY + bumpDepth,
        twoThirdX,
        twoThirdY + bumpDepth,
        twoThirdX,
        twoThirdY,
      ];
      break;

    case "left":
      pointsToInsert = [
        oneThirdX,
        oneThirdY,
        oneThirdX - bumpDepth,
        oneThirdY,
        twoThirdX - bumpDepth,
        twoThirdY,
        twoThirdX,
        twoThirdY,
      ];
      break;

    case "right":
      pointsToInsert = [
        oneThirdX,
        oneThirdY,
        oneThirdX + bumpDepth,
        oneThirdY,
        twoThirdX + bumpDepth,
        twoThirdY,
        twoThirdX,
        twoThirdY,
      ];
      break;

    default:
      // Handle any other cases if necessary
      break;
  }

  // Construct the new outline by splicing in the bump points
  const newOutline = [
    ...outline.slice(0, indices[0] * 2 + 2),
    ...pointsToInsert,
    ...outline.slice(indices[1] * 2),
  ];

  console.log("New Outline: ", newOutline);
  // Update the drawnObject with the new outline
  drawnObject.outline = newOutline;

  return drawnObject;
}

export function outlineToSVGPath(drawnObject) {
  console.log("SVG GEN");
  const outline = drawnObject.outline;
  if (!outline || outline.length < 2) return "";

  let path = `M ${outline[0]} ${outline[1]}`; // Start with the first point

  for (let i = 2; i <= outline.length; i += 2) {
    console.log("Index: ", i);
    const isClosingEdge = i === outline.length;
    const nextX = isClosingEdge ? outline[0] : outline[i];
    const nextY = isClosingEdge ? outline[1] : outline[i + 1];
    const edgeLabelIndex = isClosingEdge ? (i - 2) / 2 : (i - 2) / 2;
    console.log("Edge Labels: ", drawnObject.edgeLabels);
    console.log("Edge index: ", edgeLabelIndex);
    if (drawnObject.edgeLabels && drawnObject.edgeLabels[edgeLabelIndex]) {
      const edgeLabel = drawnObject.edgeLabels[edgeLabelIndex];
      console.log("NAME: ", edgeLabel.name);
      switch (edgeLabel.name) {
        case "N":
          path += ` L ${nextX} ${nextY}`;
          break;

        case "Full Radius":
          // Calculate control point for the curve
          const midX = (outline[i - 2] + nextX) / 2;
          const midY = (outline[i - 1] + nextY) / 2;
          console.log("midX: ", midX);
          console.log("midY: ", midY);
          const dx = nextX - outline[i - 2];
          const dy = nextY - outline[i - 1];
          console.log("dx: ", dx);
          console.log("dy: ", dy);
          const len = Math.sqrt(dx * dx + dy * dy);
          const qx = midX + (edgeLabel.value * dy) / len;
          const qy = midY - (edgeLabel.value * dx) / len;
          console.log("qx: ", qx);
          console.log("qy: ", qy);

          path += ` Q ${qx} ${qy} ${nextX} ${nextY}`;
          break;

        default:
          path += ` L ${nextX} ${nextY}`;
          break;
      }
    } else {
      path += ` L ${nextX} ${nextY}`;
    }
  }

  console.log(path);

  return path;
}

// export function outlineToSVGPath(outline) {
//   if (!outline || outline.length < 2) return '';

//   let path = `M ${outline[0]} ${outline[1]}`; // Start with the first point

//   for (let i = 2; i < outline.length; i += 2) {
//       path += ` L ${outline[i]} ${outline[i + 1]}`; // Draw lines to subsequent points
//   }

//   path += ' Z'; // Close the path

//   return path;
// }

export function findClosest(mousePos, outline) {
  const POINT_THRESHOLD = 20;
  const EDGE_THRESHOLD = 20;

  // Find the closest point first.
  const closestPointData = findClosestPoint(mousePos, outline);
  if (closestPointData.distance < POINT_THRESHOLD) {
    return {
      type: "point",
      index: closestPointData.index,
      x: closestPointData.coordinates.x,
      y: closestPointData.coordinates.y,
      distance: closestPointData.distance,
    };
  }

  // If not close to a point, find the closest edge.
  let closestEdgeDistance = Infinity;
  let edgeDetails = null;

  for (let i = 0; i < outline.length; i += 2) {
    const p1 = { x: outline[i], y: outline[i + 1] };
    const p2 = {
      x: outline[(i + 2) % outline.length],
      y: outline[(i + 3) % outline.length],
    };
    const dist = distanceFromLineSegment(mousePos, p1, p2);
    if (dist < closestEdgeDistance) {
      closestEdgeDistance = dist;
      edgeDetails = {
        index: [i / 2, ((i + 2) / 2) % (outline.length / 2)],
        x: [p1.x, p2.x],
        y: [p1.y, p2.y],
      };
    }
  }

  if (closestEdgeDistance < EDGE_THRESHOLD) {
    return {
      type: "edge",
      ...edgeDetails,
      distance: closestEdgeDistance,
    };
  }

  return null; // Neither point nor edge was close enough.
}

export function findClosestPoint(mousePos, outline) {
  let minDistance = Infinity;
  let closestPointIndex = -1;
  let closestCoordinates = null;

  for (let i = 0; i < outline.length; i += 2) {
    const x = outline[i];
    const y = outline[i + 1];
    const distance = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      closestPointIndex = i / 2;
      closestCoordinates = { x, y };
    }
  }

  return {
    index: closestPointIndex,
    coordinates: closestCoordinates,
    distance: minDistance,
  };
}

export function getLineSegmentIndex(annotationIndex, totalSegments) {
  const totalAnnotations = 2 * totalSegments + 2; // 2 for stubby ends
  console.log("total segments");
  console.log(totalSegments);
  // Handle the stubby start
  if (annotationIndex === 0) {
    return -1; // Or whatever you'd like for this case
  }

  // Handle the first half of annotations
  if (annotationIndex <= totalSegments) {
    return annotationIndex - 1; // Subtracting 1 to account for stubby start
  }

  // Handle the stubby end
  if (annotationIndex === totalSegments + 1) {
    return -2; // Or whatever you'd like for this case
  }

  // Handle the second half of annotations
  return totalAnnotations - annotationIndex - 1;
}

export function getLineDirections(xzistSection) {
  let directions = xzistSection.map((line) => {
    let [startX, startY, endX, endY] = line;
    if (startX === endX) {
      return startY < endY ? "down" : "up";
    } else {
      return startX < endX ? "right" : "left";
    }
  });
  return directions;
}

export function getXzistOutline(xzistSection, width) {
  let directions = getLineDirections(xzistSection);
  let outlinePoints = [];

  let relativeDirection = "";

  let offset = 5;

  let firstPoint = xzistSection[0].slice(0, 2);
  let initialOutlinePoint;

  let forwardPass = true;

  if (directions[0] === "left" || directions[0] === "right") {
    initialOutlinePoint = [firstPoint[0], firstPoint[1] + width / 2];
  } else {
    initialOutlinePoint = [firstPoint[0] + width / 2, firstPoint[1]];
  }

  outlinePoints.push(initialOutlinePoint);

  if (directions[0] === "left" || directions[0] === "right") {
    initialOutlinePoint = [firstPoint[0], firstPoint[1] - width / 2];
  } else {
    initialOutlinePoint = [firstPoint[0] - width / 2, firstPoint[1]];
  }

  outlinePoints.push(initialOutlinePoint);

  if (forwardPass) {
    for (let i = 0; i < xzistSection.length; i++) {
      let currentLine = xzistSection[i];
      let currentDirection = directions[i];
      let nextDirection = directions[i + 1];

      if (i === xzistSection.length - 1 || !nextDirection) {
        // Last line
        if (currentDirection === "left" || currentDirection === "right") {
          outlinePoints.push([
            currentLine[2],
            outlinePoints[outlinePoints.length - 1][1],
          ]);
        } else {
          outlinePoints.push([
            outlinePoints[outlinePoints.length - 1][0],
            currentLine[3],
          ]);
        }

        if (currentDirection === "up" || currentDirection === "down") {
          outlinePoints.push([
            currentLine[2] +
              (currentLine[2] - outlinePoints[outlinePoints.length - 1][0]),
            outlinePoints[outlinePoints.length - 1][1],
          ]);
        } else {
          outlinePoints.push([
            outlinePoints[outlinePoints.length - 1][0],
            currentLine[3] +
              (currentLine[3] - outlinePoints[outlinePoints.length - 1][1]),
          ]);
        }
        forwardPass = false;
      } else {
        if (currentDirection === "up") {
          relativeDirection =
            outlinePoints[outlinePoints.length - 1][0] < currentLine[0]
              ? "left"
              : "right";
          if (nextDirection === relativeDirection) {
            outlinePoints.push([
              outlinePoints[outlinePoints.length - 1][0],
              currentLine[3] + width / 2,
            ]);
          } else {
            outlinePoints.push([
              outlinePoints[outlinePoints.length - 1][0],
              currentLine[3] - width / 2,
            ]);
          }
        } else if (currentDirection === "down") {
          relativeDirection =
            outlinePoints[outlinePoints.length - 1][0] < currentLine[0]
              ? "left"
              : "right";
          if (nextDirection === relativeDirection) {
            outlinePoints.push([
              outlinePoints[outlinePoints.length - 1][0],
              currentLine[3] - width / 2,
            ]);
          } else {
            outlinePoints.push([
              outlinePoints[outlinePoints.length - 1][0],
              currentLine[3] + width / 2,
            ]);
          }
        } else if (currentDirection === "left") {
          relativeDirection =
            outlinePoints[outlinePoints.length - 1][1] < currentLine[1]
              ? "up"
              : "down";
          if (nextDirection === relativeDirection) {
            outlinePoints.push([
              currentLine[2] + width / 2,
              outlinePoints[outlinePoints.length - 1][1],
            ]);
          } else {
            outlinePoints.push([
              currentLine[2] - width / 2,
              outlinePoints[outlinePoints.length - 1][1],
            ]);
          }
        } else if (currentDirection === "right") {
          relativeDirection =
            outlinePoints[outlinePoints.length - 1][1] < currentLine[1]
              ? "up"
              : "down";
          if (nextDirection === relativeDirection) {
            outlinePoints.push([
              currentLine[2] - width / 2,
              outlinePoints[outlinePoints.length - 1][1],
            ]);
          } else {
            outlinePoints.push([
              currentLine[2] + width / 2,
              outlinePoints[outlinePoints.length - 1][1],
            ]);
          }
        }
      }
    }
  }

  if (!forwardPass) {
    for (let i = xzistSection.length - 1; i > 0; i--) {
      let currentLine = xzistSection[i];
      let currentDirection = directions[i];
      let prevDirection = directions[i - 1];

      if (currentDirection === "up") {
        relativeDirection =
          outlinePoints[outlinePoints.length - 1][0] < currentLine[0]
            ? "left"
            : "right";
        if (prevDirection === relativeDirection) {
          outlinePoints.push([
            outlinePoints[outlinePoints.length - 1][0],
            currentLine[1] + width / 2,
          ]);
        } else {
          outlinePoints.push([
            outlinePoints[outlinePoints.length - 1][0],
            currentLine[1] - width / 2,
          ]);
        }
      } else if (currentDirection === "down") {
        relativeDirection =
          outlinePoints[outlinePoints.length - 1][0] < currentLine[0]
            ? "left"
            : "right";
        if (prevDirection === relativeDirection) {
          outlinePoints.push([
            outlinePoints[outlinePoints.length - 1][0],
            currentLine[1] - width / 2,
          ]);
        } else {
          outlinePoints.push([
            outlinePoints[outlinePoints.length - 1][0],
            currentLine[1] + width / 2,
          ]);
        }
      } else if (currentDirection === "left") {
        relativeDirection =
          outlinePoints[outlinePoints.length - 1][1] < currentLine[1]
            ? "up"
            : "down";
        if (prevDirection === relativeDirection) {
          outlinePoints.push([
            currentLine[0] + width / 2,
            outlinePoints[outlinePoints.length - 1][1],
          ]);
        } else {
          outlinePoints.push([
            currentLine[0] - width / 2,
            outlinePoints[outlinePoints.length - 1][1],
          ]);
        }
      } else if (currentDirection === "right") {
        relativeDirection =
          outlinePoints[outlinePoints.length - 1][1] < currentLine[1]
            ? "up"
            : "down";
        if (prevDirection === relativeDirection) {
          outlinePoints.push([
            currentLine[0] - width / 2,
            outlinePoints[outlinePoints.length - 1][1],
          ]);
        } else {
          outlinePoints.push([
            currentLine[0] + width / 2,
            outlinePoints[outlinePoints.length - 1][1],
          ]);
        }
      }
    }
  }

  return outlinePoints.flat();
}

// Function to determine if a line is horizontal
export function isHorizontal(line) {
  return line[0][1] === line[1][1];
}

// Given three collinear points p, q, r, the function checks if point q lies on line segment 'pr'
function onSegment(p, q, r) {
  if (
    q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])
  )
    return true;

  return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
  let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

  if (val == 0) return 0; // collinear

  return val > 0 ? 1 : 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2) {
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4) return true;

  // Special Cases
  if (o1 == 0 && onSegment(p1, p2, q1)) return true;
  if (o2 == 0 && onSegment(p1, q2, q1)) return true;
  if (o3 == 0 && onSegment(p2, p1, q2)) return true;
  if (o4 == 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}

// Function to determine if a point is inside a polygon
export function isInPolygon(xzistOutline, candidateLine) {
  // Find the point definitely outside the polygon
  // Get all x coordinates
  const allX = xzistOutline.filter((_, index) => index % 2 === 0);
  // Get all y coordinates
  const allY = xzistOutline.filter((_, index) => index % 2 === 1);

  // Find the minimum of x and y, subtract 10 to make it outside of polygon
  const outsidePoint = [Math.min(...allX) - 10, Math.min(...allY) - 10];

  // Find the center point of the candidate line
  const lineCentrePoint = [
    (candidateLine[0][0] + candidateLine[1][0]) / 2,
    (candidateLine[0][1] + candidateLine[1][1]) / 2,
  ];

  // Create a ray from the outside point to the line centre point
  const ray = [outsidePoint, lineCentrePoint];

  let intersectionCount = 0;

  // For each edge in the polygon
  for (let i = 0; i < xzistOutline.length; i += 2) {
    const polygonEdge = [
      [xzistOutline[i], xzistOutline[i + 1]],
      [
        xzistOutline[(i + 2) % xzistOutline.length],
        xzistOutline[(i + 3) % xzistOutline.length],
      ],
    ];

    // If the ray intersects with the edge, increase the count
    if (doIntersect(ray[0], ray[1], polygonEdge[0], polygonEdge[1])) {
      intersectionCount++;
    }
  }

  // Return true if the count is odd (point is inside the polygon)
  console.log(intersectionCount);
  return intersectionCount % 2 !== 0;
}

export function calculateLineValues(lines) {
  return lines.map((line) => {
    const x1 = line[0][0],
      y1 = line[0][1],
      x2 = line[1][0],
      y2 = line[1][1];
    const length =
      multiplier * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    let centerX = (x1 + x2) / 2;
    let centerY = (y1 + y2) / 2;
    const direction = line[2];

    const annotationOffset = 25; // Offset for annotation text
    switch (direction) {
      case "up":
        centerY -= annotationOffset;
        break;
      case "down":
        centerY += annotationOffset;
        break;
      case "left":
        centerX -= 2 * annotationOffset;
        break;
      case "right":
        centerX += annotationOffset;
        break;
    }

    return {
      length,
      center: [centerX, centerY],
    };
  });
}

export function editPolygon(xzistOutline, axis, editPosition, valueDiff) {
  valueDiff = +(valueDiff / multiplier).toFixed(2);

  console.log(`xzistOutline: ${xzistOutline}`);
  console.log(`axis: ${axis}`);
  console.log(`editPosition: ${editPosition}`);
  console.log(`valueDiff: ${valueDiff}`);

  // Create a new array to avoid mutating the original xzistOutline
  let updatedOutline = [...xzistOutline];

  // Determine which indices we should be checking based on the axis
  let checkIndex = axis === "x" ? 0 : 1;

  // Iterate over the outline array two elements at a time
  for (let i = checkIndex; i < updatedOutline.length; i += 2) {
    // If the current value is greater than editPosition, add valueDiff
    if (updatedOutline[i] > editPosition) {
      updatedOutline[i] += valueDiff;
    }
  }

  // Now that the outline has been updated, calculate the new dimension annotations
  let newAnnotations = createDimensions(updatedOutline, 10); // 10 is the pixelOffset

  // Calculate the new dimension annotation values
  let newValues = calculateLineValues(newAnnotations);

  return [updatedOutline, newAnnotations, newValues];
}

export function editPolygonBySegment(
  xzistOutline,
  axis,
  editPosition,
  valueDiff,
  editSegment
) {
  console.log("editPolygonBySegment");
  valueDiff = +(valueDiff / multiplier).toFixed(2);

  console.log(`xzistOutline: ${xzistOutline}`);
  console.log(`axis: ${axis}`);
  console.log(`editPosition: ${editPosition}`);
  console.log(`valueDiff: ${valueDiff}`);
  console.log(`editSegment: ${editSegment}`);

  // Exit early if the segment is one of the stubby ends.
  if (editSegment === -1 || editSegment === -2) return [xzistOutline, [], []];

  // Create a new array to avoid mutating the original xzistOutline
  let updatedOutline = [...xzistOutline];

  // Determine which indices in updatedOutline we should be adjusting based on the axis.
  let checkIndex = axis === "x" ? 0 : 1;

  // Calculate the number of segments based on the length of updatedOutline.
  const numberOfSegments = updatedOutline.length / 4 - 1;

  let index = editSegment * 2 + 2;
  const direction =
    updatedOutline[index + 2] > updatedOutline[index] ||
    updatedOutline[index + 3] > updatedOutline[index + 1]
      ? 1
      : -1;

  // Loop through the segments starting from the editSegment.
  console.log("indices");
  for (let i = editSegment; i < numberOfSegments; i++) {
    // Calculate the corresponding index in updatedOutline.
    let idx = i * 2 + 4;

    idx = idx + checkIndex;
    console.log(idx);

    // Adjust the values by valueDiff.
    updatedOutline[idx] += direction * valueDiff;
  }

  // Loop through the segments in reverse stopping at the editSegment.
  for (let i = numberOfSegments; i > editSegment; i--) {
    // Calculate the corresponding index in updatedOutline.
    let idx = numberOfSegments * 4 + 4 - i * 2;

    idx = idx + checkIndex;
    console.log(idx);
    // Adjust the values by valueDiff.
    updatedOutline[idx] += direction * valueDiff;
  }

  // Iterate over the outline array two elements at a time
  for (let i = checkIndex; i < updatedOutline.length; i += 2) {
    // Calculate the segment that this index i corresponds to.
    let segmentIdx = Math.floor(i / 4);
    if (
      (segmentIdx >= editSegment && segmentIdx < numberOfSegments) ||
      (segmentIdx < numberOfSegments - editSegment && segmentIdx >= 0)
    ) {
      console.log(`segmentIdx: ${segmentIdx}`);
    }
  }

  // Now that the outline has been updated, calculate the new dimension annotations
  let newAnnotations = createDimensions(updatedOutline, 10); // 10 is the pixelOffset

  // Calculate the new dimension annotation values
  let newValues = calculateLineValues(newAnnotations);

  return [updatedOutline, newAnnotations, newValues];
}

export function editPolygonByNextSegment(
  xzistOutline,
  valueDiff,
  clickedIndex
) {
  console.log("editPolygonBySegment");
  valueDiff = +(valueDiff / multiplier).toFixed(2);

  console.log(`xzistOutline: ${xzistOutline}`);
  console.log(`valueDiff: ${valueDiff}`);
  console.log(`clickedIndex: ${clickedIndex}`);

  // Create a new array to avoid mutating the original xzistOutline
  let updatedOutline = [...xzistOutline];
  console.log(`updatedOutline: ${updatedOutline}`);

  let index = 2 * clickedIndex;
  // Determine which indices in updatedOutline we should be adjusting based on the axis.
  let checkIndex = updatedOutline[index + 2] != updatedOutline[index] ? 0 : 1;

  console.log(`value: ${updatedOutline[index + 2]}`);
  console.log(`value: ${updatedOutline[index]}`);
  console.log(`value: ${updatedOutline[index + 3]}`);
  console.log(`value: ${updatedOutline[index + 1]}`);
  const direction =
    updatedOutline[index + 2] > updatedOutline[index] ||
    updatedOutline[index + 3] > updatedOutline[index + 1]
      ? 1
      : -1;

  index = index + checkIndex;

  console.log(`direction: ${direction}`);
  console.log(`index: ${index}`);

  if (index + 2 >= updatedOutline.length) {
    console.log("-----Too BIG");
    console.log(index + 2 - updatedOutline.length);
    updatedOutline[index + 2 - updatedOutline.length] += direction * valueDiff;
  } else {
    updatedOutline[index + 2] += direction * valueDiff;
  }

  if (index + 4 >= updatedOutline.length) {
    console.log("-----Too BIG");
    console.log(index + 4 - updatedOutline.length);
    updatedOutline[index + 4 - updatedOutline.length] += direction * valueDiff;
  } else {
    updatedOutline[index + 4] += direction * valueDiff;
  }

  // Now that the outline has been updated, calculate the new dimension annotations
  let newAnnotations = createDimensions(updatedOutline, 10); // 10 is the pixelOffset

  // Calculate the new dimension annotation values
  let newValues = calculateLineValues(newAnnotations);

  return [updatedOutline, newAnnotations, newValues];
}

// Function to create dimensions
export function createDimensions(xzistOutline, pixelOffset) {
  let xzistDimensions = [];

  for (let i = 0; i < xzistOutline.length; i = i + 2) {
    let candidateLine = [
      [xzistOutline[i], xzistOutline[(i + 1) % xzistOutline.length]],
      [
        xzistOutline[(i + 2) % xzistOutline.length],
        xzistOutline[(i + 3) % xzistOutline.length],
      ],
    ];
    let adjustedLine;
    let offsetDirection;

    if (isHorizontal(candidateLine)) {
      adjustedLine = candidateLine.map((point) => [
        point[0],
        point[1] - pixelOffset,
      ]);
      offsetDirection = "up";
    } else {
      adjustedLine = candidateLine.map((point) => [
        point[0] - pixelOffset,
        point[1],
      ]);
      offsetDirection = "left";
    }

    if (isInPolygon(xzistOutline, adjustedLine)) {
      if (isHorizontal(candidateLine)) {
        adjustedLine = candidateLine.map((point) => [
          point[0],
          point[1] + pixelOffset,
        ]);
        offsetDirection = "down";
      } else {
        adjustedLine = candidateLine.map((point) => [
          point[0] + pixelOffset,
          point[1],
        ]);
        offsetDirection = "right";
      }
    }

    xzistDimensions.push([...adjustedLine, offsetDirection]);
  }
  console.log(xzistDimensions);
  return xzistDimensions;
}
