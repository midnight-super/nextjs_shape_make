export function konvaRectToXzistRect(
  konvaRect,
  direction,
  rotation = "clockwise",
  start = "top-left"
) {
  const { x, y, width, height } = konvaRect;

  let top, bottom, left, right;

  if (width >= 0) {
    left = x;
    right = x + width;
  } else {
    left = x + width;
    right = x;
  }

  if (height >= 0) {
    top = y;
    bottom = y + height;
  } else {
    top = y + height;
    bottom = y;
  }

  const xzistRect = {
    top,
    bottom,
    left,
    right,
    direction,
    rotation,
    start,
  };

  return xzistRect;
}

export function xzistRectToKonvaPolygon(xzistRect) {
  const { top, bottom, left, right, rotation, start } = xzistRect;

  let points = [];

  const topLeft = [left, top];
  const topRight = [right, top];
  const bottomLeft = [left, bottom];
  const bottomRight = [right, bottom];

  const corners = {
    "top-left": topLeft,
    "top-right": topRight,
    "bottom-left": bottomLeft,
    "bottom-right": bottomRight,
  };

  const startingCorner = corners[start];

  if (!startingCorner) {
    throw new Error(
      "Invalid start value. Must be one of: top-left, top-right, bottom-left, bottom-right."
    );
  }

  if (rotation === "clockwise") {
    if (start === "top-left") {
      points = [topLeft, topRight, bottomRight, bottomLeft];
    } else if (start === "top-right") {
      points = [topRight, bottomRight, bottomLeft, topLeft];
    } else if (start === "bottom-right") {
      points = [bottomRight, bottomLeft, topLeft, topRight];
    } else {
      // start === "bottom-left"
      points = [bottomLeft, topLeft, topRight, bottomRight];
    }
  } else if (rotation === "counterclockwise") {
    if (start === "top-left") {
      points = [topLeft, bottomLeft, bottomRight, topRight];
    } else if (start === "top-right") {
      points = [topRight, topLeft, bottomLeft, bottomRight];
    } else if (start === "bottom-right") {
      points = [bottomRight, topRight, topLeft, bottomLeft];
    } else {
      // start === "bottom-left"
      points = [bottomLeft, bottomRight, topRight, topLeft];
    }
  } else {
    throw new Error(
      "Invalid direction value. Must be either clockwise or counterclockwise."
    );
  }

  const konvaPolygon = {
    points: points.flat(),
    closed: false,
  };

  return konvaPolygon;
}

export function xzistRectToKonvaPolygonOriented(xzistRect, prevXzistRect) {
  //   const { } = xzistRect

  let indexOffsets = [];

  if (prevXzistRect) {
    switch (prevXzistRect.direction) {
      case "up":
        if (prevXzistRect.rotation === "clockwise") {
          if (xzistRect.direction === "right") {
            xzistRect.start = "top-left";
            xzistRect.rotation = "clockwise";

            indexOffsets = [1, 3];
          }

          if (xzistRect.direction === "left") {
            xzistRect.start = "bottom-right";
            xzistRect.rotation = "clockwise";
            indexOffsets = [3, 1];
          }
        }

        if (prevXzistRect.rotation === "counterclockwise") {
          if (xzistRect.direction === "right") {
            xzistRect.start = "bottom-left";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [3, 1];
          }

          if (xzistRect.direction === "left") {
            xzistRect.start = "top-right";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [1, 3];
          }
        }

        break;
      case "down":
        if (prevXzistRect.rotation === "clockwise") {
          if (xzistRect.direction === "right") {
            xzistRect.start = "top-left";
            xzistRect.rotation = "clockwise";
            indexOffsets = [1, 3];
          }

          if (xzistRect.direction === "left") {
            xzistRect.start = "bottom-right";
            xzistRect.rotation = "clockwise";
            indexOffsets = [3, 1];
          }
        }

        if (prevXzistRect.rotation === "counterclockwise") {
          if (xzistRect.direction === "right") {
            xzistRect.start = "bottom-left";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [3, 1];
          }

          if (xzistRect.direction === "left") {
            xzistRect.start = "top-right";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [1, 3];
          }
        }

        break;
      case "left":
        if (prevXzistRect.rotation === "clockwise") {
          if (xzistRect.direction === "up") {
            xzistRect.start = "bottom-left";
            xzistRect.rotation = "clockwise";
            indexOffsets = [1, 3];
          }

          if (xzistRect.direction === "down") {
            xzistRect.start = "top-right";
            xzistRect.rotation = "clockwise";
            indexOffsets = [3, 1];
          }
        }

        if (prevXzistRect.rotation === "counterclockwise") {
          if (xzistRect.direction === "up") {
            xzistRect.start = "bottom-right";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [3, 1];
          }

          if (xzistRect.direction === "down") {
            xzistRect.start = "top-left";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [1, 3];
          }
        }

        break;
      case "right":
        if (prevXzistRect.rotation === "clockwise") {
          if (xzistRect.direction === "up") {
            xzistRect.start = "bottom-left";
            xzistRect.rotation = "clockwise";
            indexOffsets = [1, 3];
          }

          if (xzistRect.direction === "down") {
            xzistRect.start = "top-right";
            xzistRect.rotation = "clockwise";
            indexOffsets = [3, 1];
          }
        }

        if (prevXzistRect.rotation === "counterclockwise") {
          if (xzistRect.direction === "up") {
            xzistRect.start = "bottom-right";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [3, 1];
          }

          if (xzistRect.direction === "down") {
            xzistRect.start = "top-left";
            xzistRect.rotation = "counterclockwise";
            indexOffsets = [1, 3];
          }
        }

        break;

      default:
        break;
    }
  } else {
    if (xzistRect.direction === "left" || xzistRect.direction === "right") {
      xzistRect.start = "top-left";
      xzistRect.rotation = "clockwise";
      indexOffsets = [1, 3];
    }

    if (xzistRect.direction === "up" || xzistRect.direction === "down") {
      xzistRect.start = "top-right";
      xzistRect.rotation = "clockwise";
      indexOffsets = [3, 1];
    }
  }

  return {
    newKonvaPolygon: xzistRectToKonvaPolygon(xzistRect),
    indexOffsets,
  };
}

export function createPerimeterPolygon(
  perimeterPolygon,
  xzistRectPolygon,
  insertionIndicies,
  xzistRect
) {
  let usedInsertionIndex;

  // in the case of an empty polygon
  if (insertionIndicies[0] === insertionIndicies[1]) {
    usedInsertionIndex = 0;
  }

  if (insertionIndicies[0] !== insertionIndicies[1]) {
    switch (xzistRect.direction) {
      case "up":
        usedInsertionIndex = 0;
        break;
      case "down":
        usedInsertionIndex = 1;
        break;

      case "left":
        usedInsertionIndex = 0;
        break;

      case "right":
        usedInsertionIndex = 1;
        break;

      default:
        console.log("ERROR");
        break;
    }
  }

  // usedInsertionIndex =
  //   usedInsertionIndex + (perimeterPolygon.usedInsertionIndex || 0);

  // console.log("permieter polygon");
  // console.log(perimeterPolygon.points);
  // console.log("xzist rect polygon ");
  // console.log(xzistRectPolygon.points);
  // console.log("insertion index");

  console.log(xzistRect.direction);
  console.log("used insertion index");
  console.log(usedInsertionIndex);
  console.log("insertion indicies");
  console.log(insertionIndicies);
  console.log(insertionIndicies[usedInsertionIndex]);

  console.log("previously used index");
  console.log(perimeterPolygon.previouslyUsedInsertionIndex);

  let currentInsertionPoint =
    insertionIndicies[usedInsertionIndex] +
      perimeterPolygon.previouslyUsedInsertionIndex || 0;

  perimeterPolygon.points.splice(
    2 * currentInsertionPoint,
    0,
    xzistRectPolygon.points
  );

  return {
    points: perimeterPolygon.points.flat(),
    closed: true,
    previouslyUsedInsertionIndex: currentInsertionPoint,
    // insertionIndicies:
  };
}
