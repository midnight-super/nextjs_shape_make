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

import MaterialsOptions from "./QuotesContextMenu/MaterialAndEdgingOptions";

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
  bumpOut,
} from "../utils/designToolUtils";

const TestDesignTool = ({ cadState, cadData, updateParent }) => {
  const layerRef = useRef();
  const stageRef = useRef();

  const [edgeMenuVisible, setEdgeMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOutlineIndex, setClickedOutlineIndex] = useState(null);

  const [originalLength, setOriginalLength] = useState(null);
  const [editPosition, setEditPosition] = useState(null);

  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [textRefs, setTextRefs] = useState([]);
  const [inputField, setInputField] = useState({
    active: false,
    x: 0,
    y: 0,
    value: "",
  });

  const [isResizing, setIsResizing] = useState(false);
  const [thresholdExceeded, setThresholdExceeded] = useState(false);

  const [hoveringDetails, setHoveringDetails] = useState(null);
  const [isHoveringPoint, setIsHoveringPoint] = useState(false);
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);

  const [dbgMousePos, setDbgMousePos] = useState({ x: 0, y: 0 });

  const [resizeIcon, setResizeIcon] = useState(null);

  useEffect(() => {
    const image = new window.Image();

    image.src = "/arrow_h.png";
    image.onload = () => {
      setResizeIcon(image);
    };
  }, []);

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
    console.log(
      "----------------------Hover ended 4 ---------------------------"
    );
  }, 2000); // 100ms delay

  const handleGroupClick = (i, e) => {
    console.log("Clicked group");
    console.log(i);
    setSelectedIndex(i);
  };

  const handleMouseDown = (e) => {
    setThresholdExceeded(false);
    setEdgeMenuVisible(false);
    if (
      e.evt.button !== 0 ||
      inputField.active == true ||
      e.target.className === "Line" ||
      e.target.className === "Text" ||
      e.target.className === "Image"
    ) {
      // The user clicked on a line or a text box.
      // Do not start a new XzistSection.
      setInputField({
        active: false,
      });

      return;
    }
    console.log("Handle mouse down");
  };

  const handleDragEnd = (i, e) => {
    console.log("Drag end");
    const node = e.target;

    // Offset for x and y, which will be added to the current positions
    const xOffset = node.x() - lastPos.x;
    const yOffset = node.y() - lastPos.y;
    console.log(node.x());
    console.log(xOffset);

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
    console.log(node.x());
    setLastPos({ x: node.x(), y: node.y() });
    setIsHoveringPoint(false);
    setIsHoveringEdge(false);
    console.log(
      "----------------------Hover ended 1 ---------------------------"
    );
  };

  const handleMouseUp = (e) => {
    console.log("Mouse Up");

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

    if (isResizing) {
      console.log("isResizing.");

      console.log(hoveringDetails);
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
      console.log(outline);
      console.log(pointsToMove);

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
      cadData.drawn[hoveringDetails.drawnIndex].path = outlineToSVGPath(
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

      setHoveringDetails(hoveringDetails);
    }
    return;
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

    // console.log(closestData)

    if (closestData) {
      closestData.drawnIndex = index;
      // console.log("setting hovering details")
      // console.log(closestData)
      setHoveringDetails(closestData);
      if (closestData.type === "point") {
        setIsHoveringPoint(true);
        setIsHoveringEdge(false);
        console.log(
          "----------------------Hover ended 2---------------------------"
        );
      } else {
        setIsHoveringPoint(false);
        setIsHoveringEdge(true);
      }
    } else {
      setIsHoveringPoint(false);
      setIsHoveringEdge(false);
      console.log(
        "----------------------Hover ended 3---------------------------"
      );
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

    console.log(hoveringDetails.index[0]);
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
    console.log(hoveringDetails);
    if (hoveringDetails.type == "edge") {
      setEdgeMenuVisible(true);
    }
  };

  const handleShapeSelect = (action) => {
    console.log("name: ", action.name);
    console.log("value: ", action.value);
    console.log("Edge index: ", hoveringDetails.index);
    console.log(cadData.drawn[hoveringDetails.drawnIndex]);
    switch (action.name) {
      case "Full Radius":
        // Handle full radius action

        //set an edge label to name: FR, value: x
        cadData.drawn[hoveringDetails.drawnIndex].edgeLabels[
          hoveringDetails.index[0]
        ] = action;
        console.log(
          cadData.drawn[hoveringDetails.drawnIndex].edgeLabels[
            hoveringDetails.index[0]
          ]
        );

        //update the SVG representration
        cadData.drawn[hoveringDetails.drawnIndex].path = outlineToSVGPath(
          cadData.drawn[hoveringDetails.drawnIndex]
        );

        setEdgeMenuVisible(false);
        //update parent
        updateParent(cadData);

        break;
      case "Bump Out":
        bumpOut(
          cadData.drawn[hoveringDetails.drawnIndex],
          hoveringDetails.index
        );

        // //set an edge label to name: FR, value: x
        // cadData.drawn[hoveringDetails.drawnIndex].edgeLabels[hoveringDetails.index[0]] = action
        // console.log(cadData.drawn[hoveringDetails.drawnIndex].edgeLabels[hoveringDetails.index[0]])

        // //update the SVG representration
        // cadData.drawn[hoveringDetails.drawnIndex].path = outlineToSVGPath(cadData.drawn[hoveringDetails.drawnIndex]);

        //update parent
        setEdgeMenuVisible(false);
        updateParent(cadData);
        break;
      // ... any other actions ...
      default:
        console.error("Unknown action:", action);
    }
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
            fill="white"
            stroke="purple"
            strokeWidth={2}
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
              onMouseLeave={handleMouseLeave}
              onDragEnd={(e) => handleDragEnd(i, e)}
              onDragStart={(e) => handleDragStart(i, e)}
              onClick={(e) => handleGroupClick(i, e)}
            >
              {/* <Line
                points={drawn.paddedOutline}
                fill="#DDD"
                stroke="green"
                strokeWidth={0}
                closed={true}
              /> */}

              <Line
                points={drawn.outline}
                fill="#666666"
                stroke={i === selectedIndex ? "red" : "black"}
                strokeWidth={2}
                closed={true}
              />

              {/* <Path
                data={drawn.path}
                fill="white"
                stroke="black"
                strokeWidth={2}
                closed={true}
              /> */}

              {/* {drawn.dimensions &&
                drawn.dimensions.map((line, index) => (
                  <Line
                    key={index}
                    points={[line[0][0], line[0][1], line[1][0], line[1][1]]}
                    stroke="black"
                    strokeWidth={2}
                  />
                ))} */}
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
              onContextMenu={handleContextMenu}
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
                onContextMenu={handleContextMenu}
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
                onContextMenu={handleContextMenu}
                // onMouseUp={(e) => handleDragEndEdge(e)}
              />
            </>
          )}
        </Layer>
      </Stage>

      {edgeMenuVisible && (
        <div
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            zIndex: 1000,
          }}
        >
          <MaterialsOptions onShapeSelect={handleShapeSelect} />
        </div>
      )}

      {inputField.active && (
        <input
          style={{ position: "fixed", left: inputField.x, top: inputField.y }}
          value={inputField.value}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          autoFocus
        />
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
};

export default TestDesignTool;
