import React, { useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";

const FIXED_WIDTH = 50;

import {
  createPerimeterPolygon,
  konvaRectToXzistRect,
  xzistRectToKonvaPolygon,
  xzistRectToKonvaPolygonOriented,
} from "../utils/geometryFunctions";

import _ from "lodash";

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function renderEdgeLengths(perimeterPolygon) {
  const edgeLengths = [];
  const points = perimeterPolygon.points;

  // Remove duplicate consecutive points
  const cleanedPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    if (
      i === 0 ||
      points[i] !== points[i - 2] ||
      points[i + 1] !== points[i - 1]
    ) {
      cleanedPoints.push(points[i]);
      cleanedPoints.push(points[i + 1]);
    }
  }

  // Merge successive points along the same line
  const mergedPoints = [cleanedPoints[0], cleanedPoints[1]];
  for (let i = 2; i < cleanedPoints.length; i += 2) {
    const prevX = cleanedPoints[i - 2];
    const prevY = cleanedPoints[i - 1];
    const currX = cleanedPoints[i];
    const currY = cleanedPoints[i + 1];
    const nextX = cleanedPoints[(i + 2) % cleanedPoints.length];
    const nextY = cleanedPoints[(i + 3) % cleanedPoints.length];

    if (
      (prevX === currX && currX === nextX) ||
      (prevY === currY && currY === nextY)
    ) {
      // Skip the current point as it is in the same line as the previous and next points
      continue;
    }

    mergedPoints.push(currX);
    mergedPoints.push(currY);
  }

  // Calculate edge lengths and center points
  for (let i = 0; i < mergedPoints.length; i += 2) {
    const x1 = mergedPoints[i];
    const y1 = mergedPoints[i + 1];
    const x2 = mergedPoints[(i + 2) % mergedPoints.length];
    const y2 = mergedPoints[(i + 3) % mergedPoints.length];

    const length = calculateDistance(x1, y1, x2, y2);
    if (length === 0) {
      // Skip edges with length of 0
      continue;
    }

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    edgeLengths.push({ length, midX, midY });
  }

  return edgeLengths;
}

const TestDesignTool = () => {
  const [drawing, setDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [xzistRectangles, setXZistRectangles] = useState([]);
  const [konvaPolygon, setKonvaPolygon] = useState(null);
  const [perimeterPolygon, setPerimeterPolygon] = useState({ points: [] });
  const [insertionIndicies, setInsertionIndicies] = useState([]);

  const [livePerimeterPolygon, setLivePerimeterPolygon] = useState({
    points: [],
  });

  const [rectProps, setRectProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [direction, setDirection] = useState("");

  const [liveXzistRect, setLiveXzistRect] = useState();
  const [xzistPolygon, setXzistPolygon] = useState({ points: [] });

  const handleClick = (e) => {
    // get cursor position
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();

    // getting direction of currently drawing rectangle
    let liveRectDirection;

    if (Math.abs(rectProps.width) > Math.abs(rectProps.height)) {
      if (rectProps.width > 0) {
        liveRectDirection = "right";
      } else {
        liveRectDirection = "left";
      }
    } else {
      if (rectProps.height > 0) {
        liveRectDirection = "down";
      } else {
        liveRectDirection = "up";
      }
    }

    // Double click, handle finishing drawing a polygon as a set of rectangles
    if (e.evt.detail === 2) {
      setDrawing(false);
      setRectangles((prevRectangles) => [...prevRectangles, rectProps]);

      // convert konva rect to xzist rect which contains top, bottom, left, right
      const newXzistRectangle = konvaRectToXzistRect(
        rectProps,
        liveRectDirection
      );

      setXZistRectangles((prevXzistRectangles) => [
        ...prevXzistRectangles,
        newXzistRectangle,
      ]);

      // konva polygon to be used later
      const newKonvaPolygon = xzistRectToKonvaPolygon(newXzistRectangle);
      setKonvaPolygon(newKonvaPolygon);
      return;
    }

    if (!drawing) {
      setDrawing(true);
      setRectProps({
        x: mousePos.x,
        y: mousePos.y,
        width: 0,
        height: 0,
      });
    }
    if (drawing) {
      //* UPDATE RECTANGLE AND XZIST RECTANGLE VALUES
      setRectProps({
        x:
          Math.abs(rectProps.width) > Math.abs(rectProps.height)
            ? mousePos.x
            : rectProps.x,
        y:
          Math.abs(rectProps.width) > Math.abs(rectProps.height)
            ? rectProps.y
            : mousePos.y,
        width: 0,
        height: 0,
      });

      setRectangles((prevRectangles) => [...prevRectangles, rectProps]);

      // converting last drawn rectangle into an xzist rectangle
      const newXzistRectangle = konvaRectToXzistRect(
        rectProps,
        liveRectDirection
      );

      setXZistRectangles((prevXzistRectangles) => [
        ...prevXzistRectangles,
        newXzistRectangle,
      ]);

      // if we have previously drawn any rectangles, get the previous rectangle, convert it to a polygon
      // this is important because we need to know where to insert to create the perimeter polygon
      // * CREATE PERIMETER POLYGON
      if (xzistRectangles.length > 0) {
        const lastXzistRectangle = xzistRectangles[xzistRectangles.length - 1];

        const { newKonvaPolygon, indexOffsets } =
          xzistRectToKonvaPolygonOriented(
            newXzistRectangle,
            lastXzistRectangle
          );
        setKonvaPolygon(newKonvaPolygon);

        setPerimeterPolygon(
          createPerimeterPolygon(
            perimeterPolygon,
            newKonvaPolygon,
            insertionIndicies,
            newXzistRectangle
          )
        );

        // update index offsets for the next insertion
        setInsertionIndicies(indexOffsets);
      } else {
        // if no previous rectangles, make polygon equal to the current rectangle
        const { newKonvaPolygon, indexOffsets } =
          xzistRectToKonvaPolygonOriented(newXzistRectangle);

        setKonvaPolygon(newKonvaPolygon);

        setPerimeterPolygon(
          createPerimeterPolygon(
            perimeterPolygon,
            newKonvaPolygon,
            insertionIndicies,
            newXzistRectangle
          )
        );

        setInsertionIndicies(indexOffsets);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();

    const width = mousePos.x - rectProps.x;
    const height = mousePos.y - rectProps.y;

    let localRectProps;

    if (rectangles.length === 0) {
      if (Math.abs(width) > Math.abs(height)) {
        setRectProps((prevProps) => ({
          ...prevProps,
          width,
          height: FIXED_WIDTH,
        }));
      } else {
        setRectProps((prevProps) => ({
          ...prevProps,
          height,
          width: FIXED_WIDTH,
          // ...(height > 0 && { height: FIXED_WIDTH }),
        }));
      }
    } else {
      let currentRectangleDirection;
      const lastXzistRect = xzistRectangles[xzistRectangles.length - 1];

      // if (Math.abs(rectProps.width) > Math.abs(rectProps.height)) {
      if (
        lastXzistRect.direction === "up" ||
        lastXzistRect.direction === "down"
      ) {
        if (rectProps.width > 0) {
          currentRectangleDirection = "right";
          setDirection("right");
        } else {
          currentRectangleDirection = "left";
          setDirection("left");
        }
      } else {
        if (rectProps.height > 0) {
          currentRectangleDirection = "down";
          setDirection("down");
        } else {
          currentRectangleDirection = "up";
          setDirection("up");
        }
      }

      const lastRect = rectangles[rectangles.length - 1];

      switch (lastXzistRect.direction) {
        case "up":
          setRectProps((prevProps) => ({
            ...prevProps,
            width,
            height: FIXED_WIDTH,
          }));
          localRectProps = { ...rectProps, height: FIXED_WIDTH, width };

          break;
        case "down":
          setRectProps((prevProps) => ({
            ...prevProps,
            width,
            height: -FIXED_WIDTH,
          }));
          localRectProps = { ...rectProps, height: -FIXED_WIDTH, width };

          break;
        case "left":
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: FIXED_WIDTH,
          }));
          localRectProps = { ...rectProps, height, width: FIXED_WIDTH };

          // code block
          break;
        case "right":
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: -FIXED_WIDTH,
          }));

          localRectProps = { ...rectProps, height, width: -FIXED_WIDTH };

          // code block
          break;
        default:
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: -FIXED_WIDTH,
            // x: getEdge(lastRect, "right"),
          }));
          localRectProps = { ...rectProps, height, width: -FIXED_WIDTH };

        // code block
      }
      switch (currentRectangleDirection) {
        case "up":
          setRectProps((prevProps) => ({
            ...prevProps,
            y: lastXzistRect.top,
          }));
          localRectProps = { ...rectProps, y: lastXzistRect.top };

          break;
        case "down":
          setRectProps((prevProps) => ({
            ...prevProps,
            y: lastXzistRect.bottom,
          }));

          localRectProps = { ...rectProps, y: lastXzistRect.bottom };

          break;
        case "left":
          setRectProps((prevProps) => ({
            ...prevProps,
            x: lastXzistRect.left,
          }));
          localRectProps = { ...rectProps, y: lastXzistRect.left };

          // code block
          break;
        case "right":
          setRectProps((prevProps) => ({
            ...prevProps,
            x: lastXzistRect.right,
          }));
          localRectProps = { ...rectProps, y: lastXzistRect.right };

          // code block
          break;
        default:
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: -FIXED_WIDTH,
            // x: getEdge(lastRect, "right"),
          }));
          localRectProps = { ...rectProps, height, width: -FIXED_WIDTH };

        // code block
      }
    }

    // set live perimeter to deepclone of normal perimeter
    let lastRectDirection;

    if (Math.abs(rectProps.width) > Math.abs(rectProps.height)) {
      if (rectProps.width > 0) {
        lastRectDirection = "right";
      } else {
        lastRectDirection = "left";
      }
    } else {
      if (rectProps.height > 0) {
        lastRectDirection = "down";
      } else {
        lastRectDirection = "up";
      }
    }

    const newXzistRectangle = konvaRectToXzistRect(
      rectProps,
      lastRectDirection
    );

    let xzistPolygon;
    if (rectangles.length > 0) {
      const lastXzistRectangle = xzistRectangles[xzistRectangles.length - 1];
      xzistPolygon = xzistRectToKonvaPolygonOriented(
        newXzistRectangle,
        lastXzistRectangle
      ).newKonvaPolygon;
    } else {
      xzistPolygon =
        xzistRectToKonvaPolygonOriented(newXzistRectangle).newKonvaPolygon;
    }

    setXzistPolygon(xzistPolygon);

    let tempPerimeterPolygon = _.cloneDeep(perimeterPolygon);

    tempPerimeterPolygon = createPerimeterPolygon(
      tempPerimeterPolygon,
      xzistPolygon,
      insertionIndicies,
      newXzistRectangle
    );
    // tempPerimeterPolygon = [...tempPerimeterPolygon];
    setLivePerimeterPolygon(tempPerimeterPolygon);
  };

  const logInfo = () => {
    setLivePerimeterPolygon();
    console.log(rectangles);

    const lastRect = rectangles[rectangles.length - 1];

    console.log("perimeter");
    console.log(perimeterPolygon);
    console.log(konvaPolygon);

    console.log("xzist polygon");
    console.log(xzistPolygon);
  };

  return (
    <div className="flex-1">
      <button className="btn" onClick={logInfo}>
        Log Info
      </button>
      <div>
        <div>
          xzistPolygon:{" "}
          {xzistPolygon &&
            xzistPolygon.points.map((p, i, pointsArray) => {
              if (i % 2 === 0) {
                return <span>[{Math.floor(p)}, </span>;
              } else {
                return <span>{Math.floor(p)} ], </span>;
              }
            })}
        </div>
        insertionIndicies, newXzistRectangle
      </div>
      <h1>
        Current Rect{" "}
        <span>
          x: {rectProps.x}, y:{rectProps.y}, width: {rectProps.width}, height:{" "}
          {rectProps.height},
        </span>
        <span>Current Direction: {direction}</span>
      </h1>
      <h1 className="text-xl font-bold">
        Perimeter polygon points:{" "}
        {perimeterPolygon.points.map((p, i, pointsArray) => {
          if (i % 2 === 0) {
            return <span>[{Math.floor(p)}, </span>;
          } else {
            return <span>{Math.floor(p)} ], </span>;
          }
        })}
      </h1>

      <Stage
        className="bg-gray-100"
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {rectangles.map((rect, index) => (
            <Rect
              key={index}
              {...rect}
              fill="rgba(0, 162, 255, 0.5)"
              stroke={"red"}
              strokeWidth={2}
            />
          ))}

          {drawing && <Rect {...rectProps} fill="rgba(0, 162, 255, 0.5)" />}

          {perimeterPolygon && (
            <Line
              fill="#00D2FF"
              stroke="red"
              strokeWidth={5}
              points={perimeterPolygon.points}
              closed={true}
            />
          )}

          {livePerimeterPolygon && (
            <Line
              fill="#00D2FF"
              stroke="green"
              strokeWidth={5}
              points={livePerimeterPolygon.points}
              closed={true}
            />
          )}

          {konvaPolygon && (
            <Line
              fill="#00D2FF"
              stroke="black"
              strokeWidth={2}
              points={konvaPolygon.points}
              closed={konvaPolygon.closed}
            />
          )}

          {livePerimeterPolygon &&
            renderEdgeLengths(livePerimeterPolygon).map((edge, index) => (
              <React.Fragment key={index}>
                <Text
                  x={edge.midX}
                  y={edge.midY}
                  text={edge.length.toFixed(1)}
                  fontSize={14}
                  fontStyle="bold"
                  fill="black"
                  offsetX={0}
                  offsetY={0}
                />
              </React.Fragment>
            ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default TestDesignTool;
