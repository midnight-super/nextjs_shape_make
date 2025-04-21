import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const DrawingCanvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [initialPoint, setInitialPoint] = useState(null);
  const [direction, setDirection] = useState("horizontal");
  const [directionInititPoint, setDirectionInititPoint] = useState(null);
  const [directionFlag, setDirectionFlag] = useState(true);
  const [changedPoints, setChangedPoints] = useState(null);
  const [startLabel_x, setStartLabel_x] = useState();
  const [startLabel_y, setStartLabel_y] = useState();
  const borderWidth = 6; // Border width for seamless connection
  const offset = 30; // Offset for parallel lines
  const offset_direction = 130;
  const Directions_pre = Object.freeze({
    START: "start",
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOME: "bottom",
  });
  const Directions_current = Object.freeze({
    SC: "start-current",
    LBT: "left-bottom-top",
    RBT: "right-bottom-top",
    LTB: "left-top-bottom",
    RTB: "rigth-top-bottom",
    BLR: "bottom-left-right",
    TLR: "top-left-right",
    BRL: "bottom-right-left",
    TRL: "top-right-left",
  });
  const [preDirection, setPreDirection] = useState(Directions_pre.START);
  const [currentDirection, setCurrentDirection] = useState(
    Directions_current.SC
  );
  const [customText, setCustomText] = useState("");
  const [textPosition, setTextPosition] = useState(null);
  useEffect(() => {
    console.log("change point detected: ", changedPoints);
  }, [changedPoints]);
  const [stateCounter, setStateCounter] = useState(0);
  const resetdraw = (e) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    setLines([]);
    setCurrentLine(null);
    setIsDrawing(false);
    setPreDirection(Directions_pre.START);
    setCurrentDirection(Directions_current.SC);
    setStateCounter(0);
    setTextPosition(null);
  };
  const startDrawing = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();

    if (e.evt.button === 0) {
      // Check for left mouse button
      if (stateCounter % 2 === 0) {
        setInitialPoint({ x, y });
        setStartLabel_x(x);
        setStartLabel_y(y);
        setTextPosition({ x, y });
        setCurrentLine({ points: [x, y, x, y] });
        setDirectionInititPoint({ x, y });
        setIsDrawing(true);
        setCustomText("600mm");
      } else {
        console.log(direction);
        const [startX, startY, endX, endY] = currentLine.points;
        let parallelLine1, parallelLine2;

        switch (currentDirection) {
          case Directions_current.SC:
            parallelLine1 =
              direction === "vertical"
                ? [startX - offset, startY, endX - offset, endY]
                : [startX, startY + offset, endX, endY + offset];
            parallelLine2 =
              direction === "vertical"
                ? [startX + offset, startY, endX + offset, endY]
                : [startX, startY - offset, endX, endY - offset];

            break;
          case Directions_current.BLR:
            parallelLine1 = [
              startX + offset,
              startY + offset,
              endX,
              endY + offset,
            ];
            parallelLine2 = [
              startX - offset,
              startY - offset,
              endX,
              endY - offset,
            ];
            break;
          case Directions_current.BRL:
            parallelLine1 = [
              startX - offset,
              startY + offset,
              endX,
              endY + offset,
            ];
            parallelLine2 = [
              startX + offset,
              startY - offset,
              endX,
              endY - offset,
            ];
            break;
          case Directions_current.TLR:
            parallelLine1 = [
              startX - offset,
              startY + offset,
              endX,
              endY + offset,
            ];
            parallelLine2 = [
              startX + offset,
              startY - offset,
              endX,
              endY - offset,
            ];
            break;
          case Directions_current.TRL:
            parallelLine1 = [
              startX + offset,
              startY + offset,
              endX,
              endY + offset,
            ];
            parallelLine2 = [
              startX - offset,
              startY - offset,
              endX,
              endY - offset,
            ];
            break;
          case Directions_current.LTB:
            parallelLine1 = [
              startX - offset,
              startY + offset,
              endX - offset,
              endY,
            ];
            parallelLine2 = [
              startX + offset,
              startY - offset,
              endX + offset,
              endY,
            ];
            break;
          case Directions_current.RTB:
            parallelLine1 = [
              startX - offset,
              startY - offset,
              endX - offset,
              endY,
            ];
            parallelLine2 = [
              startX + offset,
              startY + offset,
              endX + offset,
              endY,
            ];
            break;
          case Directions_current.LBT:
            parallelLine1 = [
              startX - offset,
              startY - 2 * offset,
              endX - offset,
              endY,
            ];
            parallelLine2 = [startX + offset, startY, endX + offset, endY];
            break;
          case Directions_current.RBT:
            parallelLine1 = [
              startX - offset,
              startY + offset,
              endX - offset,
              endY,
            ];
            parallelLine2 = [
              startX + offset,
              startY - offset,
              endX + offset,
              endY,
            ];
            break;
        }

        // Finalize the drawing on left button release
        setLines([
          ...lines,
          {
            main: currentLine,
            paral1: parallelLine1,
            paral2: parallelLine2,
          },
        ]);
        setCurrentLine(null);
        setIsDrawing(false);
        setPreDirection(Directions_pre.START);
        setCurrentDirection(Directions_current.SC);
      }

      // Increment stateCounter correctly
      setStateCounter((prevCounter) => prevCounter + 1);
    }
  };
  const createDraw = (
    deltaX,
    deltaY,
    newLine,
    x,
    y,
    startX,
    startY,
    endX,
    endY,
    directionChanged
  ) => {
    let parallelLine1, parallelLine2;
    if (deltaX > deltaY) {
      setDirection("horizontal");
      newLine.points[2] = x;
      newLine.points[3] = initialPoint.y; // Keep y coordinate constant for horizontal direction
      if (x > initialPoint.x) {
        //left-right
        if (y > directionInititPoint.y + offset_direction) {
          //top-bottom
          if (directionFlag) {
            console.log("y_33333");
            setDirectionFlag(false);
            parallelLine1 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX + offset
                : startX - offset,
              startY + offset,
              endX - 2 * offset,
              endY + offset,
            ];
            parallelLine2 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX - offset
                : startX + offset,
              startY - offset,
              endX,
              endY - offset,
            ];
            changeDirection(x, y, -25, 0, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.LEFT);
            setCurrentDirection(Directions_current.LTB);
          }
        } else if (y < directionInititPoint.y - offset_direction) {
          //bottom-top
          if (directionFlag) {
            console.log("y_44444");
            setDirectionFlag(false);
            parallelLine1 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX + offset
                : startX - offset,
              startY + offset,
              endX + offset,
              endY + offset,
            ];
            parallelLine2 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX - offset
                : startX + offset,
              startY - offset,
              endX - offset,
              endY - offset,
            ];
            changeDirection(x, y, 0, 25, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.LEFT);
            setCurrentDirection(Directions_current.LBT);
          }
        }
      } else {
        //right-left
        if (y > directionInititPoint.y + offset_direction) {
          //top-bottom
          if (directionFlag) {
            console.log("y_33333");
            setDirectionFlag(false);
            parallelLine1 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX - offset
                : startX + offset,
              startY + offset,
              endX + 2 * offset,
              endY + offset,
            ];
            parallelLine2 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX + offset
                : startX - offset,
              startY - offset,
              endX,
              endY - offset,
            ];
            changeDirection(x, y, 25, 0, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.RIGHT);
            setCurrentDirection(Directions_current.RTB);
          }
        } else if (y < directionInititPoint.y - offset_direction) {
          //bottom-top
          if (directionFlag) {
            console.log("y_44444");
            setDirectionFlag(false);
            parallelLine1 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX - offset
                : startX + offset,
              startY + offset,
              endX,
              endY + offset,
            ];
            parallelLine2 = [
              preDirection === Directions_pre.START
                ? startX
                : preDirection === Directions_pre.BOTTOME
                ? startX + offset
                : preDirection === Directions_pre.BOTTOME
                ? startX + offset
                : startX - offset,
              startY - offset,
              endX + 2 * offset,
              endY - offset,
            ];
            changeDirection(x, y, 25, 0, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.RIGHT);
            setCurrentDirection(Directions_current.RBT);
          }
        }
      }
    } else {
      setDirection("vertical");
      newLine.points[2] = initialPoint.x;
      newLine.points[3] = y; // Keep x coordinate constant for vertical direction
      if (y > initialPoint.y) {
        //top-bottom
        if (x > directionInititPoint.x + offset_direction) {
          //left-right
          if (directionFlag) {
            console.log("x_33333");
            setDirectionFlag(false);
            parallelLine1 = [
              startX - offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY - offset
                : startY + offset,
              endX - offset,
              endY,
            ];
            parallelLine2 = [
              startX + offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY + offset
                : preDirection === Directions_pre.RIGHT
                ? startY + offset
                : startY - offset,
              endX + offset,
              endY - 2 * offset,
            ];
            changeDirection(x, y, 0, -25, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.TOP);
            setCurrentDirection(Directions_current.TLR);
          }
        } else if (x < directionInititPoint.x - offset_direction) {
          //right-left
          if (directionFlag) {
            console.log("x_44444");
            setDirectionFlag(false);
            parallelLine1 = [
              startX - offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY - offset
                : startY + offset,
              endX - offset,
              endY - 2 * offset,
            ];
            parallelLine2 = [
              startX + offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY + offset
                : startY - offset,
              endX + offset,
              endY,
            ];
            changeDirection(x, y, 0, -25, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.TOP);
            setCurrentDirection(Directions_current.TRL);
          }
        }
      } else {
        //bottom-top
        if (x > directionInititPoint.x + offset_direction) {
          if (directionFlag) {
            //left-right
            console.log("x_33333");
            setDirectionFlag(false);
            parallelLine1 = [
              startX - offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY + offset
                : startY - offset * 2,
              endX - offset,
              endY,
            ];
            parallelLine2 = [
              startX + offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY - offset
                : startY + offset / 4,
              endX + offset,
              endY + 2 * offset,
            ];
            changeDirection(x, y, 0, 25, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.BOTTOME);
            setCurrentDirection(Directions_current.BLR);
          }
        } else if (x < directionInititPoint.x - offset_direction) {
          //right_left
          if (directionFlag) {
            console.log("x_44444");
            setDirectionFlag(false);
            parallelLine1 = [
              startX - offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY + offset
                : startY - 2 * offset,
              endX - offset,
              endY + 2 * offset,
            ];
            parallelLine2 = [
              startX + offset,
              preDirection === Directions_pre.START
                ? startY
                : preDirection === Directions_pre.RIGHT
                ? startY - offset
                : startY,
              endX + offset,
              endY,
            ];
            changeDirection(x, y, 0, 25, parallelLine1, parallelLine2);
            directionChanged = true;
            setPreDirection(Directions_pre.BOTTOME);
            setCurrentDirection(Directions_current.BRL);
          }
        }
      }
    }
    if (!directionChanged) setCurrentLine(newLine);
  };
  const draw = (e) => {
    if (!isDrawing) return;

    const { x, y } = e.target.getStage().getPointerPosition();
    const newLine = { ...currentLine };
    const deltaX = Math.abs(x - initialPoint.x);
    const deltaY = Math.abs(y - initialPoint.y);
    const [startX, startY, endX, endY] = currentLine.points;
    let directionChanged = false;
    let parallelLine1, parallelLine2;
    // Determine the predominant direction of mouse movement
    createDraw(deltaX, deltaY, newLine, x, y, startX, startY, endX, endY);
  };

  const changeDirection = (x, y, m_x, m_y, parallelLine1, parallelLine2) => {
    {
      console.log("direction changed.");

      // Execute only if called programmatically
      {
        const lastPoint =
          direction === "horizontal"
            ? { x: currentLine.points[2] + m_x, y: currentLine.points[3] + m_y }
            : {
                x: currentLine.points[2] + m_x,
                y: currentLine.points[3] + m_y,
              };

        setLines([
          ...lines,
          {
            main: currentLine,
            paral1: parallelLine1,
            paral2: parallelLine2,
          },
        ]);
        setInitialPoint(lastPoint);
        setDirectionInititPoint(lastPoint);
        setCurrentLine({
          points: [lastPoint.x, lastPoint.y, lastPoint.x, lastPoint.y],
        });
        setDirection(direction === "horizontal" ? "vertical" : "horizontal");
        setDirectionFlag(true);
      }
    }
  };
  const renderLine = (line, key) => {
    const { main, paral1, paral2 } = line;

    const startX = main.points[0];
    const startY = main.points[1];
    const endX = main.points[2];
    const endY = main.points[3];
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const isHorizontal = width > height;

    let labelX = startX + width / 2;
    let labelY = startY - 20;

    if (!isHorizontal) {
      labelX = startX;
      labelY = startY + height / 2;
    }

    if (startX > endX || startY > endY) {
      if (isHorizontal) {
        labelX = startX - width / 2;
      } else {
        labelY = startY - height / 2;
      }
    }

    return (
      <>
        <Line key={key} points={main.points} stroke="rgb(0, 128, 1)" strokeWidth={50} />
        <Line
          key={`${key}-parallel1`}
          points={paral1}
          stroke="rgb(132, 0, 128)"
          strokeWidth={borderWidth}
          dash={[10, 5]}
        />
        <Line
          key={`${key}-parallel2`}
          points={paral2}
          stroke="rgb(132, 0, 128)"
          strokeWidth={borderWidth}
          dash={[10, 5]}
        />
        {isHorizontal ? (
          <>
            <Text
              key={`${key}-text1`}
              text={`${width * 6}mm`}
              x={labelX}
              y={startY > endY ? endY - 20 : startY - 20}
              fontSize={15}
              fill="black"
              align="center"
            />
          </>
        ) : (
          <>
            <Text
              key={`${key}-text2`}
              text={`${height * 6}mm`}
              x={startX > endX ? endX - 50 : startX - 50}
              y={labelY}
              fontSize={15}
              fill="black"
              align="center"
            />
          </>
        )}
      </>
    );
  };

  const renderLine_current = (line, key) => {
    const startX = line.points[0];
    const startY = line.points[1];
    const endX = line.points[2];
    const endY = line.points[3];
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const isHorizontal = width > height;

    let labelX = startX + width / 2;
    let labelY = startY - 20;

    if (!isHorizontal) {
      labelX = startX - 50;
      labelY = startY + height / 2;
    }

    if (startX > endX || startY > endY) {
      if (isHorizontal) {
        labelX = startX - width / 2;
      } else {
        labelY = startY - height / 2;
      }
    }
    let parallelLine1, parallelLine2;
    // Calculate points for parallel lines
    parallelLine1 = isHorizontal
      ? [startX, startY - offset, endX, endY - offset]
      : [startX - offset, startY, endX - offset, endY];

    parallelLine2 = isHorizontal
      ? [startX, startY + offset, endX, endY + offset]
      : [startX + offset, startY, endX + offset, endY];

    switch (currentDirection) {
      case Directions_current.SC:
        parallelLine1 =
          direction === "vertical"
            ? [startX - offset, startY, endX - offset, endY]
            : [startX, startY + offset, endX, endY + offset];
        parallelLine2 =
          direction === "vertical"
            ? [startX + offset, startY, endX + offset, endY]
            : [startX, startY - offset, endX, endY - offset];

        break;
      case Directions_current.BLR:
        parallelLine1 = [startX + offset, startY + offset, endX, endY + offset];
        parallelLine2 = [startX - offset, startY - offset, endX, endY - offset];
        break;
      case Directions_current.BRL:
        parallelLine1 = [startX - offset, startY + offset, endX, endY + offset];
        parallelLine2 = [startX + offset, startY - offset, endX, endY - offset];
        break;
      case Directions_current.TLR:
        parallelLine1 = [startX - offset, startY + offset, endX, endY + offset];
        parallelLine2 = [startX + offset, startY - offset, endX, endY - offset];
        break;
      case Directions_current.TRL:
        parallelLine1 = [startX + offset, startY + offset, endX, endY + offset];
        parallelLine2 = [startX - offset, startY - offset, endX, endY - offset];
        break;
      case Directions_current.LTB:
        parallelLine1 = [startX - offset, startY + offset, endX - offset, endY];
        parallelLine2 = [startX + offset, startY - offset, endX + offset, endY];
        break;
      case Directions_current.RTB:
        parallelLine1 = [startX - offset, startY - offset, endX - offset, endY];
        parallelLine2 = [startX + offset, startY + offset, endX + offset, endY];
        break;
      case Directions_current.LBT:
        parallelLine1 = [
          startX - offset,
          startY - 2 * offset,
          endX - offset,
          endY,
        ];
        parallelLine2 = [startX + offset, startY, endX + offset, endY];
        break;
      case Directions_current.RBT:
        parallelLine1 = [startX - offset, startY + offset, endX - offset, endY];
        parallelLine2 = [startX + offset, startY - offset, endX + offset, endY];
        break;
    }

    return (
      <>
        <Line key={key} points={line.points} stroke="rgb(0, 128, 1)" strokeWidth={50} />
        <Line
          key={`${key}-parallel1`}
          points={parallelLine1}
          stroke="rgb(132, 0, 128)"
          strokeWidth={borderWidth}
          dash={[10, 5]}
        />
        <Line
          key={`${key}-parallel2`}
          points={parallelLine2}
          stroke="rgb(132, 0, 128)"
          strokeWidth={borderWidth}
          dash={[10, 5]}
        />
        {isHorizontal ? (
          <>
            <Text
              key={`${key}-text1`}
              text={`${width * 6}mm`}
              x={labelX}
              y={startY > endY ? endY - 20 : startY - 20}
              fontSize={15}
              fill="black"
              align="center"
            />
          </>
        ) : (
          <>
            <Text
              key={`${key}-text2`}
              text={`${height * 6}mm`}
              x={startX > endX ? endX - 50 : startX - 50}
              y={labelY}
              fontSize={15}
              fill="black"
              align="center"
            />
          </>
        )}
      </>
    );
  };
  return (
    <div onContextMenu={resetdraw}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        style={{ border: "1px solid black" }}
      >
        <Layer>
          {lines.map((line, i) => renderLine(line, i))}
          {isDrawing &&
            currentLine &&
            renderLine_current(currentLine, "current")}
          {textPosition && (
            <Text
              text={customText}
              x={textPosition.x}
              y={textPosition.y}
              fontSize={15}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingCanvas;
