import React, { useState } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

const FIXED_WIDTH = 50;

import {
  createPerimeterPolygon,
  konvaRectToXzistRect,
  xzistRectToKonvaPolygon,
  xzistRectToKonvaPolygonOriented,
} from "../utils/geometryFunctions";

const TestDesignTool = () => {
  const [drawing, setDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [xzistRectangles, setXZistRectangles] = useState([]);
  const [konvaPolygon, setKonvaPolygon] = useState(null);
  const [perimeterPolygon, setPerimeterPolygon] = useState({ points: [] });
  const [insertionIndicies, setInsertionIndicies] = useState([]);

  const [rectProps, setRectProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [direction, setDirection] = useState("");

  const handleClick = (e) => {
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();

    // setting direction

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

    if (e.evt.detail === 2) {
      // Double click
      setDrawing(false);
      setRectangles((prevRectangles) => [...prevRectangles, rectProps]);

      // Adding to zxist rectangles
      const newXzistRectangle = konvaRectToXzistRect(
        rectProps,
        lastRectDirection,
        "clockwise",
        "top-left"
      );

      const newKonvaPolygon = xzistRectToKonvaPolygon(newXzistRectangle);
      setKonvaPolygon(newKonvaPolygon);

      setXZistRectangles((prevXzistRectangles) => [
        ...prevXzistRectangles,
        newXzistRectangle,
      ]);
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
    } else {
      setRectangles((prevRectangles) => [...prevRectangles, rectProps]);

      // Adding to zxist rectangles
      const newXzistRectangle = konvaRectToXzistRect(
        rectProps,
        lastRectDirection,
        "clockwise",
        "top-left"
      );

      if (xzistRectangles.length > 0) {
        const lastXzistRectangle = xzistRectangles[xzistRectangles.length - 1];
        // const newKonvaPolygon = xzistRectToKonvaPolygon(newXzistRectangle);
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

        console.log("INDEX OFFSETS.........");
        console.log(indexOffsets);

        setInsertionIndicies(indexOffsets);
      } else {
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

      setXZistRectangles((prevXzistRectangles) => [
        ...prevXzistRectangles,
        newXzistRectangle,
      ]);

      // ==============================================
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
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();

    const width = mousePos.x - rectProps.x;
    const height = mousePos.y - rectProps.y;

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

          break;
        case "down":
          setRectProps((prevProps) => ({
            ...prevProps,
            width,
            height: -FIXED_WIDTH,
          }));

          break;
        case "left":
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: FIXED_WIDTH,
          }));

          // code block
          break;
        case "right":
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: -FIXED_WIDTH,
          }));

          // code block
          break;
        default:
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: -FIXED_WIDTH,
            // x: getEdge(lastRect, "right"),
          }));

        // code block
      }
      switch (currentRectangleDirection) {
        case "up":
          setRectProps((prevProps) => ({
            ...prevProps,
            y: lastXzistRect.top,
          }));

          break;
        case "down":
          setRectProps((prevProps) => ({
            ...prevProps,
            y: lastXzistRect.bottom,
          }));

          break;
        case "left":
          setRectProps((prevProps) => ({
            ...prevProps,
            x: lastXzistRect.left,
          }));

          // code block
          break;
        case "right":
          setRectProps((prevProps) => ({
            ...prevProps,
            x: lastXzistRect.right,
          }));

          // code block
          break;
        default:
          setRectProps((prevProps) => ({
            ...prevProps,
            height,
            width: -FIXED_WIDTH,
            // x: getEdge(lastRect, "right"),
          }));

        // code block
      }
    }
  };

  const logInfo = () => {
    console.log(rectangles);

    const lastRect = rectangles[rectangles.length - 1];

    console.log("perimeter");
    console.log(perimeterPolygon);
    console.log(konvaPolygon);
  };

  return (
    <div className="flex-1">
      <button className="btn" onClick={logInfo}>
        Log Info
      </button>
      <h1>No of Rect: {rectangles.length}</h1>
      <h1>
        Last Rect{" "}
        {rectangles.length > 0 && (
          <span>
            x: {rectangles[rectangles.length - 1].x}, y:
            {rectangles[rectangles.length - 1].y}, width:{" "}
            {rectangles[rectangles.length - 1].width}, height:{" "}
            {rectangles[rectangles.length - 1].height},
          </span>
        )}
      </h1>
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
          {konvaPolygon && (
            <Line
              fill="#00D2FF"
              stroke="black"
              strokeWidth={2}
              points={konvaPolygon.points}
              closed={konvaPolygon.closed}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default TestDesignTool;
