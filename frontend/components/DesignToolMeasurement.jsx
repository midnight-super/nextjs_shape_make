import React, { createRef, useState, useEffect, useRef } from "react";
import {
  Circle,
  Path,
  Stage,
  Layer,
  Line,
  Rect,
  Group,
  Text,
  Image,
} from "react-konva";
import debounce from "lodash/debounce";

import MeasurementOptions from "./QuotesContextMenu/MeasurementOptions";

import PropTypes from "prop-types";

import {
  calculateLineValues,
  getXzistOutline,
  createDimensions,
  editPolygonByNextSegment,
  getLineSegmentIndex,
  findClosest,
  outlineToSVGPath,
  expandOutline,
  rotateOutline,
  createEdges,
} from "../utils/designToolUtils";
import { Card } from "@chakra-ui/react";

import { Canvg } from "canvg";

const TestDesignTool = ({ cadState, cadData, updateParent, updateSvg }) => {
  const layerRef = useRef();
  const stageRef = useRef();

  const [menuVisible, setMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOutlineIndex, setClickedOutlineIndex] = useState(null);

  const [originalLength, setOriginalLength] = useState(null);
  const [editPosition, setEditPosition] = useState(null);
  const [editSegment, setEditSegment] = useState(null);

  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [textRefs, setTextRefs] = useState([]);
  const [inputField, setInputField] = useState({
    active: false,
    x: 0,
    y: 0,
    value: "",
  });

  const [lastOrientation, setLastOrientation] = useState(null); // 'horizontal', 'vertical', or null

  const [drawing, setDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [thresholdExceeded, setThresholdExceeded] = useState(false);

  const [hoveringDetails, setHoveringDetails] = useState(null);
  const [isHoveringPoint, setIsHoveringPoint] = useState(false);
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);
  const [prev, setPrev] = useState(null);

  const WIDTH = 60;
  const THRESHOLD = WIDTH / 2;

  const [dbgDistance, setDbgDistance] = useState(0);
  const [dbgMousePos, setDbgMousePos] = useState({ x: 0, y: 0 });
  const [dbgEndOfLine, setDbgEndOfLine] = useState({ x: 0, y: 0 });

  const [resizeIcon, setResizeIcon] = useState(null);

  useEffect(() => {
    const image = new window.Image();

    image.src = "/arrow_h.png";
    image.onload = () => {
      setResizeIcon(image);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const stage = stageRef.current;
      const dataURL = stage.toDataURL();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new window.Image();
      img.src = dataURL;
      updateSvg(dataURL);
    })();
  }, [drawing]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedIndex !== null) {
        cadData.drawn.splice(selectedIndex, 1);

        // Reset the selected index
        setSelectedIndex(null);
        updateParent(cadData);
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  useEffect(() => {
    const newRefs = cadData.drawn?.map((_, i) =>
      cadData.drawn[i].dimensionValues
        ? Array(cadData.drawn[i].dimensionValues.length)
            .fill()
            .map(() => createRef())
        : []
    );
    setTextRefs(newRefs);
    console.log("Set Refs!");
  }, [cadData.drawn]);

  const handleMouseLeave = debounce(() => {
    setIsHoveringPoint(false);
    setIsHoveringEdge(false);
    // console.log("----------------------Hover ended 4 ---------------------------")
  }, 2000); // 100ms delay

  const handleGroupClick = (i, e) => {
    console.log("Clicked group");
    console.log(i);
    setSelectedIndex(i);
  };

  const handleOptionSelect = (action) => {
    setMenuVisible(false);
    let outline = [];
    switch (action) {
      case "rotateClockwise":
        console.log("CW");
        // Handle rotate clockwise
        console.log(cadData.drawn[hoveringDetails.drawnIndex]);
        outline = rotateOutline(
          cadData.drawn[hoveringDetails.drawnIndex].outline,
          "clockwise"
        );

        cadData.drawn[hoveringDetails.drawnIndex].outline = outline;
        cadData.drawn[hoveringDetails.drawnIndex].dimensions = createDimensions(
          outline,
          10
        );
        cadData.drawn[hoveringDetails.drawnIndex].dimensionValues =
          calculateLineValues(
            cadData.drawn[hoveringDetails.drawnIndex].dimensions
          );
        cadData.drawn[hoveringDetails.drawnIndex].paddedOutline = expandOutline(
          outline,
          15
        );
        updateParent(cadData);

        break;
      case "rotateCounterClockwise":
        console.log("CCW");
        // Handle rotate counter-clockwise
        console.log(cadData.drawn[hoveringDetails.drawnIndex]);
        outline = rotateOutline(
          cadData.drawn[hoveringDetails.drawnIndex].outline,
          "counterclockwise"
        );

        cadData.drawn[hoveringDetails.drawnIndex].outline = outline;
        cadData.drawn[hoveringDetails.drawnIndex].dimensions = createDimensions(
          outline,
          10
        );
        cadData.drawn[hoveringDetails.drawnIndex].dimensionValues =
          calculateLineValues(
            cadData.drawn[hoveringDetails.drawnIndex].dimensions
          );
        cadData.drawn[hoveringDetails.drawnIndex].paddedOutline = expandOutline(
          outline,
          15
        );
        updateParent(cadData);
        break;
      default:
        console.error("Unknown action:", action);
    }
  };

  const changeDirection = (x, y) => {
    const newPoint = [x, y];
    const lastLine = cadData.live.section[cadData.live.section.length - 1];

    cadData.live.section = [
      ...cadData.live.section,
      [
        ...cadData.live.section[cadData.live.section.length - 1].slice(2),
        ...newPoint,
        ...newPoint,
      ],
    ];

    // const start = lastLine.slice(0, 2);
    // const deltaX = x - start[0];
    // const deltaY = y - start[1];
    // if (Math.abs(deltaX) > Math.abs(deltaY)) {
    //   setLastOrientation("horizontal");
    // } else {
    //   setLastOrientation("vertical");
    // }
  };

  const handleMouseDown = (e) => {
    setMenuVisible(false);
    setThresholdExceeded(false);
    if (
      (e.evt.button !== 0 ||
        inputField.active == true ||
        e.target.className === "Line" ||
        e.target.className === "Text" ||
        e.target.className === "Image") &&
      !drawing
    ) {
      // The user clicked on a line or a text box.
      // Do not start a new XzistSection.
      setInputField({
        active: false,
      });

      return;
    }
    console.log("Handle mouse down");

    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();
    const newPoint = [mousePos.x, mousePos.y];

    if (!drawing) {
      setDrawing(true);
      setPrev(mousePos);
      cadData.live = {};
      cadData.live.section = [[...newPoint, ...newPoint]];
    }
  };

  const handleDragEnd = (i, e) => {
    console.log("Drag end");
    const node = e.target;

    // Offset for x and y, which will be added to the current positions
    const xOffset = node.x() - lastPos.x;
    const yOffset = node.y() - lastPos.y;
    // console.log(node.x())
    // console.log(xOffset)

    // Deep copy the state arrays
    let newCadDataDrawn = JSON.parse(JSON.stringify(cadData.drawn));

    //Update drawn array
    for (let j = 0; j < newCadDataDrawn[i].outline.length; j += 2) {
      newCadDataDrawn[i].outline[j] += xOffset;
      newCadDataDrawn[i].outline[j + 1] += yOffset;
    }

    //Update drawn array
    for (let j = 0; j < newCadDataDrawn[i].paddedOutline.length; j += 2) {
      newCadDataDrawn[i].paddedOutline[j] += xOffset;
      newCadDataDrawn[i].paddedOutline[j + 1] += yOffset;
    }

    newCadDataDrawn[i].dimensions = newCadDataDrawn[i].dimensions.map(
      (line) => {
        return line.map((point) => {
          return [point[0] + xOffset, point[1] + yOffset];
        });
      }
    );

    newCadDataDrawn[i].dimensionValues = newCadDataDrawn[i].dimensionValues.map(
      (obj) => {
        return {
          ...obj,
          center: [obj.center[0] + xOffset, obj.center[1] + yOffset],
        };
      }
    );

    newCadDataDrawn[i].path = outlineToSVGPath(newCadDataDrawn[i]);

    node.position(lastPos);

    // Set the updated state arrays
    cadData.drawn = newCadDataDrawn;
    updateParent(cadData);

    // Update the last position state
    setLastPos({ x: node.x(), y: node.y() });
  };

  const handleDragStart = (i, e) => {
    console.log("drag started");
    setSelectedIndex(i);
    const node = e.target;
    setLastPos({ x: node.x(), y: node.y() });
    setIsHoveringPoint(false);
    setIsHoveringEdge(false);
    // console.log("----------------------Hover ended 1 ---------------------------")
  };

  const handleMouseUp = (e) => {
    console.log("Mouse Up");

    if (drawing) {
      cadData.live.section = cadData.live.section.slice(0, -2);
      const completedXzistSection = cadData.live.section;

      console.log(completedXzistSection);

      setDrawing(false);
      setLastOrientation(null);

      console.log(cadData.drawn);
      cadData.live = createEdges(cadData.live);
      cadData.drawn = cadData.drawn
        ? [...cadData.drawn, cadData.live]
        : [cadData.live];
      console.log(cadData.drawn);
      console.log("**********************************************");

      cadData.live = {};
      updateParent(cadData);
    }

    if (isResizing) {
      setIsResizing(false);
      updateParent(cadData);
      console.log("Resizing complete");
    }
  };

  const handleTextClick = (e, index, i) => {
    console.log("HandleTextClick");
    if (textRefs[i][index].current) {
      console.log("is current");
      const absolutePos = textRefs[i][index].current.getAbsolutePosition();
      console.log(absolutePos); // Logs the absolute position of the clicked Text element
    }

    const segment = getLineSegmentIndex(index, cadData.drawn[i].section.length);

    const stage = stageRef.current;
    const stageBox = stage.container().getBoundingClientRect();
    console.log("Stage Box:", stageBox);

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    console.log(scrollX);
    console.log(scrollY);

    const annotation = cadData.drawn[i].dimensions[index];
    const values = cadData.drawn[i].dimensionValues[index];

    // Check if the line is horizontal or vertical
    let lineAxis = "x";
    if (annotation[2] == "left" || annotation[2] == "right") {
      lineAxis = "y";
    }

    // Assuming you have the x and y values from your state or props:
    const absoluteX = stageBox.left + values.center[0] + scrollX;
    const absoluteY = stageBox.top + values.center[1] + scrollY;
    console.log("absolutes");
    console.log(absoluteX);
    console.log(absoluteY);

    setInputField({
      active: true,
      // Add stage's position to the text's position
      x: absoluteX,
      y: absoluteY,
      value: values.length.toString(),
    });

    let position = null;
    if (lineAxis == "x") {
      position = values.center[0];
    } else {
      position = values.center[1];
    }
    setClickedIndex(index);
    setClickedOutlineIndex(i);
    setOriginalLength(values.length);
    setEditPosition(position);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const newValue = e.target.value;
      const valueDiff = newValue - originalLength;
      console.log();

      const [newXzistOutline, newAnnotations, newValues] =
        editPolygonByNextSegment(
          cadData.drawn[clickedOutlineIndex].outline,
          valueDiff,
          clickedIndex
        );

      cadData.drawn[clickedOutlineIndex].outline = newXzistOutline;
      cadData.drawn[clickedOutlineIndex].dimensions = newAnnotations;
      cadData.drawn[clickedOutlineIndex].dimensionValues = newValues;
      //cadData.drawn[clickedOutlineIndex].paddedOutline = newPaddedOutline; TODO

      setInputField({ active: false });
      setClickedIndex(null);
      setClickedOutlineIndex(null);
      setOriginalLength(null);
      updateParent(cadData);
    }
  };

  const handleInputChange = (e) => {
    setInputField((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();
    setDbgMousePos(mousePos);

    console.log("drawing", drawing);

    if (!drawing) {
      if (isResizing) {
        console.log("isResizing.");

        // console.log(hoveringDetails)
        let direction =
          cadData.drawn[hoveringDetails.drawnIndex].dimensions[
            hoveringDetails.index[0]
          ][2];
        let outline = cadData.drawn[hoveringDetails.drawnIndex].outline;

        let pointsToMove = wrapSliceIndicies(
          outline,
          2 * hoveringDetails.index[0],
          4
        );

        console.log(direction);
        // console.log(outline)
        // console.log(pointsToMove);

        if (direction == "left" || direction == "right") {
          outline[pointsToMove[0]] = mousePos.x;
          outline[pointsToMove[2]] = mousePos.x;
          hoveringDetails.x[0] = mousePos.x;
          hoveringDetails.x[1] = mousePos.x;
        }

        if (direction == "up" || direction == "down") {
          outline[pointsToMove[1]] = mousePos.y;
          outline[pointsToMove[3]] = mousePos.y;
          hoveringDetails.y[0] = mousePos.y;
          hoveringDetails.y[1] = mousePos.y;
        }
        outline.path = outlineToSVGPath(
          cadData.drawn[hoveringDetails.drawnIndex]
        );
        cadData.drawn[hoveringDetails.drawnIndex].dimensions = createDimensions(
          outline,
          10
        );
        cadData.drawn[hoveringDetails.drawnIndex].dimensionValues =
          calculateLineValues(
            cadData.drawn[hoveringDetails.drawnIndex].dimensions
          );
        cadData.drawn[hoveringDetails.drawnIndex].paddedOutline = expandOutline(
          outline,
          15
        );

        //setHoveringDetails(hoveringDetails)
      }
      return;
    }

    if (!cadData.live) {
      return;
    }

    const lastLine = cadData.live.section[cadData.live.section.length - 1];

    const start = lastLine.slice(0, 2);
    const deltaX = mousePos.x - start[0];
    const deltaY = mousePos.y - start[1];

    if (lastOrientation === null) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        cadData.live.section = [
          ...cadData.live.section.slice(0, -1),
          [...start, mousePos.x, start[1]],
        ];
      } else {
        cadData.live.section = [
          ...cadData.live.section.slice(0, -1),
          [...start, start[0], mousePos.y],
        ];
      }
    } else if (lastOrientation === "horizontal") {
      cadData.live.section = [
        ...cadData.live.section.slice(0, -1),
        [...start, start[0], mousePos.y],
      ];
    } else if (lastOrientation === "vertical") {
      cadData.live.section = [
        ...cadData.live.section.slice(0, -1),
        [...start, mousePos.x, start[1]],
      ];
    }

    // Calculate distance from end of last line in the current XzistSection
    let endOfLastLine = { x: 0, y: 0 };

    if (cadData.live.section.length > 0) {
      let lastLine = cadData.live.section[cadData.live.section.length - 1];
      endOfLastLine = { x: lastLine[0], y: lastLine[1] };
    } else {
      endOfLastLine = { x: mousePos.x, y: mousePos.y };
    }

    let x = endOfLastLine.x - mousePos.x;
    let y = endOfLastLine.y - mousePos.y;
    let dist = Math.sqrt(x * x + y * y);

    setDbgDistance(dist); // Update debug state.

    setDbgEndOfLine(endOfLastLine);

    // Check if distance exceeds threshold
    if (dist > THRESHOLD) {
      setThresholdExceeded(true);
    }

    // If cursor returns within threshold, remove last line
    // if (
    //   thresholdExceeded &&
    //   dist <= THRESHOLD &&
    //   cadData.live.section.length > 1
    // ) {
    //   setThresholdExceeded(false);

    //   cadData.live.section = cadData.live.section.slice(0, -1);

    //   // Toggle lastOrientation
    //   if (lastOrientation) {
    //     setLastOrientation(
    //       lastOrientation === "horizontal" ? "vertical" : "horizontal"
    //     );
    //   }
    // }

    cadData.live.outline = getXzistOutline(cadData.live.section, WIDTH);
    cadData.live.path = outlineToSVGPath(cadData.live);
    cadData.live.dimensions = createDimensions(cadData.live.outline, 10);
    cadData.live.dimensionValues = calculateLineValues(cadData.live.dimensions);
    cadData.live.paddedOutline = expandOutline(cadData.live.outline, 15);

    const lastLineInfo = cadData.live.section[cadData.live.section.length - 1];
    const startInfo = lastLineInfo.slice(0, 2);
    const deltaXInfo = mousePos.x - prev.x;
    const deltaYInfo = mousePos.y - prev.y;

    if (Math.abs(deltaXInfo) >= 100 || Math.abs(deltaYInfo) >= 100) {
      setPrev(mousePos);

      let orientation = "horizontal";

      if (Math.abs(deltaXInfo) > Math.abs(deltaYInfo)) {
        orientation = "vertical";
      }

      if (!lastOrientation) {
        setLastOrientation(orientation);

        return;
      }

      console.log(
        deltaXInfo,
        deltaYInfo,
        orientation,
        "orientation",
        lastOrientation
      );

      if (orientation !== lastOrientation) {
        changeDirection(mousePos.x, mousePos.y);
        setLastOrientation(orientation);
      }
    }
  };

  const handleMouseEnter = (index, event) => {
    console.log("Hovering over outline with index: ", index);
  };

  const handleMouseMoveOutline = (index, event) => {
    const mousePos = event.target.getStage().getPointerPosition();
    if (isResizing) {
      return;
    }

    const outline = cadData.drawn[index].outline;
    let closestData = findClosest(mousePos, outline);

    console.log(closestData);

    if (closestData) {
      closestData.drawnIndex = index;
      // console.log("setting hovering details")
      // console.log(closestData)
      setHoveringDetails(closestData);
      if (closestData.type === "point") {
        setIsHoveringPoint(true);
        setIsHoveringEdge(false);
        // console.log("----------------------Hover ended 2---------------------------")
      } else {
        setIsHoveringPoint(false);
        setIsHoveringEdge(true);
      }
    } else {
      setIsHoveringPoint(false);
      setIsHoveringEdge(false);
      // console.log("----------------------Hover ended 3---------------------------")
    }
  };

  function wrapSlice(arr, start, end) {
    console.log("Wrapper");
    console.log(start, end);
    const length = arr.length;
    console.log(length);
    let result = [];

    for (let i = start; i < start + end; i++) {
      result.push(arr[i % length]);
    }

    return result;
  }

  function wrapSliceIndicies(arr, start, end) {
    console.log("Wrapper");
    console.log(start, end);
    const length = arr.length;
    console.log(length);
    let result = [];

    for (let i = start; i < start + end; i++) {
      result.push(i % length);
    }

    return result;
  }

  const handleDragStartEdge = (event) => {
    setIsResizing(true);
    const node = event.target;
    console.log(node.x());
    setLastPos({ x: node.x(), y: node.y() });

    // console.log(hoveringDetails.index[0])
    let direction =
      cadData.drawn[hoveringDetails.drawnIndex].dimensions[
        hoveringDetails.index[0]
      ][2];
    console.log(direction);
    console.log(cadData.drawn[hoveringDetails.drawnIndex].outline);

    if (
      direction == "left" ||
      direction == "right" ||
      direction == "up" ||
      direction == "down"
    ) {
      let outline = cadData.drawn[hoveringDetails.drawnIndex].outline;
      console.log(
        outline.slice(
          2 * hoveringDetails.index[0],
          2 * hoveringDetails.index[1] + 2
        )
      );
      console.log(wrapSlice(outline, 2 * hoveringDetails.index[0], 4));
    }

    console.log("Drag edge started");
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault(); // Prevent default context menu

    setPosition({
      x: e.evt.clientX,
      y: e.evt.clientY,
    });

    setMenuVisible(true);
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {cadData.live?.outline && (
            <>
              <Line
                points={cadData.live.outline}
                fill="#DDD"
                stroke="black"
                strokeWidth={0}
                closed={true}
                draggable
              />

              <Line
                points={cadData.live.paddedOutline}
                fill="#DDD"
                stroke="green"
                strokeWidth={0}
                closed={true}
                draggable
              />
            </>
          )}

          <Path
            data={cadData.live?.path}
            fill="green"
            stroke="purple"
            strokeWidth={10}
            closed={true}
          />

          {cadData.live?.dimensions?.map((line, index) => (
            <Line
              key={index}
              points={[line[0][0], line[0][1], line[1][0], line[1][1]]}
              stroke="black"
              strokeWidth={2}
            />
          ))}

          {cadData.live?.dimensionValues?.map(
            (lineValue, i) =>
              lineValue.center ? ( // Check if lineValue.center exists
                <Text
                  key={i}
                  x={lineValue.center[0]}
                  y={lineValue.center[1]}
                  text={lineValue.length.toString() + "mm"}
                  fontSize={12}
                  fill="black"
                />
              ) : null // Render nothing if lineValue.center doesn't exist
          )}

          {/* {isHoveringEdge && hoveringDetails &&
    <Line 
        points={[
            hoveringDetails.x[0], hoveringDetails.y[0],
            hoveringDetails.x[1], hoveringDetails.y[1]
        ]}
        stroke="red"  // Choose a color that stands out
        strokeWidth={5} // Decide a suitable width
        draggable
    />
} */}

          {cadData.drawn?.map((drawn, i) => (
            <Group
              ref={layerRef}
              key={i}
              draggable
              hitGraphEnabled={true}
              hitStrokeWidth={100}
              onMouseEnter={(e) => handleMouseEnter(i, e)}
              onMouseMove={(e) => handleMouseMoveOutline(i, e)}
              onContextMenu={handleContextMenu}
              onMouseLeave={handleMouseLeave}
              onDragEnd={(e) => handleDragEnd(i, e)}
              onDragStart={(e) => handleDragStart(i, e)}
              onClick={(e) => handleGroupClick(i, e)}
            >
              <Line
                points={drawn.paddedOutline}
                fill="#DDD"
                stroke="green"
                strokeWidth={0}
                closed={true}
              />

              <Line
                points={drawn.outline}
                fill="#00D2FF"
                stroke={i === selectedIndex ? "red" : "black"}
                strokeWidth={2}
                closed={true}
              />

              {drawn.dimensions &&
                drawn.dimensions.map((line, index) => (
                  <Line
                    key={index}
                    points={[line[0][0], line[0][1], line[1][0], line[1][1]]}
                    stroke="black"
                    strokeWidth={2}
                  />
                ))}
              {textRefs &&
                drawn.dimensionValues &&
                drawn.dimensionValues.map((lineValue, index) => (
                  <Text
                    //ref={textRefs[i][index]}
                    ref={
                      textRefs[i] && textRefs[i][index]
                        ? textRefs[i][index]
                        : null
                    }
                    key={index}
                    x={lineValue.center[0]}
                    y={lineValue.center[1]}
                    text={lineValue.length.toString() + "mm"}
                    fontSize={12}
                    fill="black"
                    onClick={(e) => handleTextClick(e, index, i)}
                  />
                ))}
            </Group>
          ))}

          {isHoveringPoint && hoveringDetails && (
            <Circle
              x={hoveringDetails.x}
              y={hoveringDetails.y}
              radius={7} // Decide a suitable radius
              fill="red" // Choose a color that stands out
              stroke="black"
              strokeWidth={1}
            />
          )}

          {((isHoveringEdge && hoveringDetails) || isResizing) && (
            <>
              <Line
                points={[
                  hoveringDetails.x[0],
                  hoveringDetails.y[0],
                  hoveringDetails.x[1],
                  hoveringDetails.y[1],
                ]}
                stroke="red" // Choose a color that stands out
                strokeWidth={5} // Decide a suitable width
                hitStrokeWidth={20}
                listening={false}
              />

              <Image
                x={(hoveringDetails.x[0] + hoveringDetails.x[1]) / 2 - 15} // Coordinates where you want to show the icon
                y={(hoveringDetails.y[0] + hoveringDetails.y[1]) / 2 - 15}
                image={resizeIcon}
                width={30} // Adjust as needed
                height={30} // Adjust as needed
                onMouseEnter={() => {
                  setIsHoveringEdge(true);
                }}
                onMouseDown={(e) => handleDragStartEdge(e)}
                // onMouseUp={(e) => handleDragEndEdge(e)}
              />
            </>
          )}
        </Layer>
      </Stage>

      {inputField.active && (
        <input
          style={{ position: "fixed", left: inputField.x, top: inputField.y }}
          value={inputField.value}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          autoFocus
        />
      )}
      {menuVisible && (
        <div
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            zIndex: 1000,
          }}
        >
          <MeasurementOptions onOptionSelect={handleOptionSelect} />
        </div>
      )}
      <p>Hovering Edge: {isHoveringEdge ? "Yes" : "No"}</p>
      <p>
        Mouse Position: ({dbgMousePos.x}, {dbgMousePos.y})
      </p>
    </>
  );
};

TestDesignTool.propTypes = {
  cadState: PropTypes.string.isRequired,
  cadData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateSvg: PropTypes.func.isRequired,
};

export default TestDesignTool;
