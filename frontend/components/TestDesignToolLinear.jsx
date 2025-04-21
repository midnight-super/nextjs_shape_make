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
} from "react-konva";

import PropTypes from "prop-types";

import {
  calculateLineValues,
  getXzistOutline,
  createDimensions,
  editPolygon,
  editPolygonBySegment,
  editPolygonByNextSegment,
  getLineSegmentIndex,
  findClosestPoint,
  findClosest,
} from "../utils/designToolUtils";

//temporary, will need to be removed and replaced with imported menus
const CustomContextMenu = ({ x, y }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: x,
      backgroundColor: "white",
      border: "1px solid black",
      zIndex: 1000,
    }}
  >
    <div>Option 1</div>
    <div>Option 2</div>
    {/* ... other options ... */}
  </div>
);

const TestDesignTool = ({ cadState, cadData, onChange }) => {
  const [menuPosition, setMenuPosition] = useState(null);

  const closeMenu = () => {
    setMenuPosition(null);
  };

  const layerRef = useRef();
  const stageRef = useRef();

  const [mode, setMode] = useState("other");

  const [clickedIndex, setClickedIndex] = useState(null);
  const [clickedOutlineIndex, setClickedOutlineIndex] = useState(null);
  const [axis, setAxis] = useState(null);
  const [originalLength, setOriginalLength] = useState(null);
  const [editPosition, setEditPosition] = useState(null);
  const [editSegment, setEditSegment] = useState(null);

  const [lastPos, setLastPos] = useState({ x: 0, y: 0 }); // Add this state

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [textRefs, setTextRefs] = useState([]);
  const [inputField, setInputField] = useState({
    active: false,
    x: 0,
    y: 0,
    value: "",
  });

  const [xzistSections, setXzistSections] = useState([]);
  const [xzistSection, setXzistSection] = useState([]);
  const [lastOrientation, setLastOrientation] = useState(null); // 'horizontal', 'vertical', or null

  const [drawing, setDrawing] = useState(false);
  const [thresholdExceeded, setThresholdExceeded] = useState(false);

  const [xzistDimensionLines, setXzistDimesionLines] = useState([]);
  const [xzistOutlinePoints, setXzistOutlinePoints] = useState([]);

  const [xzistDimensionAnnotations, setXzistDimensionAnnotations] = useState(
    []
  );
  const [zxistDimensionLineValues, setZxistDimensionLineValues] = useState([]);
  const [xzistDimensionAnnotationValues, setXzistDimensionAnnotationValues] =
    useState([]);

  const [xzistOutlines, setXzistOutlines] = useState([]);

  const [hoverCirclePos, setHoverCirclePos] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveringDetails, setHoveringDetails] = useState(null);
  const [isHoveringPoint, setIsHoveringPoint] = useState(false);
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);

  const WIDTH = 60;
  const THRESHOLD = WIDTH / 2;

  const [dbgDistance, setDbgDistance] = useState(0);
  const [dbgMousePos, setDbgMousePos] = useState({ x: 0, y: 0 });
  const [dbgEndOfLine, setDbgEndOfLine] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedIndex !== null) {
        // Delete the element from each array and update the state
        setXzistSections((prev) => prev.filter((_, i) => i !== selectedIndex));
        setXzistOutlines((prev) => prev.filter((_, i) => i !== selectedIndex));
        setXzistDimensionAnnotations((prev) =>
          prev.filter((_, i) => i !== selectedIndex)
        );
        setXzistDimensionAnnotationValues((prev) =>
          prev.filter((_, i) => i !== selectedIndex)
        );

        // Reset the selected index
        setSelectedIndex(null);
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
    const newRefs = xzistOutlines.map((_, i) =>
      xzistDimensionAnnotationValues[i]
        ? Array(xzistDimensionAnnotationValues[i].length)
            .fill()
            .map(() => createRef())
        : []
    );
    setTextRefs(newRefs);
  }, [xzistOutlines, xzistDimensionAnnotationValues]);

  const handleGroupClick = (i, e) => {
    console.log("Clicked group");
    console.log(i);
    setSelectedIndex(i);
  };

  const handleMouseDown = (e) => {
    switch (mode) {
      case "drawing":
        setThresholdExceeded(false);
        if (
          (e.evt.button !== 0 ||
            inputField.active == true ||
            e.target.className === "Line" ||
            e.target.className === "Text") &&
          !drawing
        ) {
          // The user clicked on a line to start a drag operation.
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
          setXzistSection([[...newPoint, ...newPoint]]);
        } else {
          setXzistSection([
            ...xzistSection,
            [
              ...xzistSection[xzistSection.length - 1].slice(2),
              ...newPoint,
              ...newPoint,
            ],
          ]);
          const lastLine = xzistSection[xzistSection.length - 1];
          const start = lastLine.slice(0, 2);
          const deltaX = mousePos.x - start[0];
          const deltaY = mousePos.y - start[1];
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setLastOrientation("horizontal");
          } else {
            setLastOrientation("vertical");
          }
        }
        break;

      case "shaping":
        // new code for selecting mode
        break;

      case "edging":
        // new code for annotating mode
        break;

      default:
        // default behavior
        break;
    }
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
    let newOutlines = JSON.parse(JSON.stringify(xzistOutlines));
    let newDimensionAnnotations = JSON.parse(
      JSON.stringify(xzistDimensionAnnotations)
    );
    let newDimensionAnnotationValues = JSON.parse(
      JSON.stringify(xzistDimensionAnnotationValues)
    );

    console.log(newOutlines);
    // Update the outlines with the new position

    for (let j = 0; j < newOutlines[i].length; j += 2) {
      newOutlines[i][j] += xOffset;
      newOutlines[i][j + 1] += yOffset;
    }

    // Update the dimension annotations with the new position
    newDimensionAnnotations[i] = newDimensionAnnotations[i].map((line) => {
      return line.map((point) => {
        return [point[0] + xOffset, point[1] + yOffset];
      });
    });

    // Update the dimension annotation values with the new position
    newDimensionAnnotationValues[i] = newDimensionAnnotationValues[i].map(
      (obj) => {
        return {
          ...obj,
          center: [obj.center[0] + xOffset, obj.center[1] + yOffset],
        };
      }
    );

    console.log(newOutlines);
    node.position(lastPos);

    // Set the updated state arrays
    setXzistOutlines(newOutlines);
    setXzistDimensionAnnotations(newDimensionAnnotations);
    setXzistDimensionAnnotationValues(newDimensionAnnotationValues);

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
  };

  // Function to calculate control points for quadratic curve
  const getControlPoints = (start, end, radius) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / len;
    const dirY = dy / len;

    return {
      c1: {
        x: start.x + radius * dirX,
        y: start.y + radius * dirY,
      },
      c2: {
        x: end.x - radius * dirX,
        y: end.y - radius * dirY,
      },
    };
  };

  const RoundedPolygon = ({ points, radii, ...props }) => {
    const path = points.reduce((acc, point, index, arr) => {
      const radius = radii[index];
      const nextIndex = (index + 1) % arr.length;
      const nextPoint = arr[nextIndex];
      const nextRadius = radii[nextIndex];

      if (radius) {
        const { c1, c2 } = getControlPoints(point, nextPoint, radius);
        return (
          acc + `L ${c1.x},${c1.y} Q ${point.x},${point.y} ${c2.x},${c2.y} `
        );
      } else {
        return acc + `L ${point.x},${point.y} `;
      }
    }, `M ${points[0].x},${points[0].y} `);

    return <Path data={path} {...props} />;
  };

  const handleMouseUp = (e) => {
    switch (mode) {
      case "drawing":
        if (e.evt.detail === 2 && drawing) {
          const completedXzistSection = xzistSection.slice(0, -2);
          setDrawing(false);
          setLastOrientation(null);
          setXzistSections([...xzistSections, completedXzistSection]);
          setXzistSection([]);
          let completedXzistOutline = getXzistOutline(
            completedXzistSection,
            WIDTH
          );
          setXzistOutlines([...xzistOutlines, completedXzistOutline]);
          setXzistOutlinePoints([]);
          setXzistDimensionAnnotations([
            ...xzistDimensionAnnotations,
            xzistDimensionLines,
          ]);
          setXzistDimesionLines([]);
          setXzistDimensionAnnotationValues([
            ...xzistDimensionAnnotationValues,
            zxistDimensionLineValues, // wrap inside an array
          ]);
          setZxistDimensionLineValues([]);

          console.log("---------------");
          console.log(xzistDimensionLines);
        }
        break;

      case "shaping":
        // new code for selecting mode
        break;

      case "edging":
        // new code for annotating mode
        break;

      default:
        // default behavior
        break;
    }
  };

  const handleTextClick = (e, index, i) => {
    console.log("HandleTextClick");
    if (textRefs[i][index].current) {
      console.log("is current");
      const absolutePos = textRefs[i][index].current.getAbsolutePosition();
      console.log(absolutePos); // Logs the absolute position of the clicked Text element

      // Rest of your logic...
    }
    console.log(xzistDimensionAnnotationValues[i]);
    console.log(xzistSections);
    console.log(xzistSections[i].length);
    console.log(xzistOutlines[0]);

    const segment = getLineSegmentIndex(index, xzistSections[i].length);
    console.log(segment);

    console.log("--------------------");

    const stage = stageRef.current;
    const stageBox = stage.container().getBoundingClientRect();
    console.log("Stage Box:", stageBox);

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    console.log(scrollX);
    console.log(scrollY);

    const annotation = xzistDimensionAnnotations[i][index];
    const values = xzistDimensionAnnotationValues[i][index];

    console.log(xzistDimensionAnnotations[i][index]);
    console.log(xzistDimensionAnnotationValues[i][index]);

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
    setAxis(lineAxis);
    setOriginalLength(values.length);
    setEditPosition(position);
    setEditSegment(segment);

    console.log(lineAxis);
    console.log(values.length);
    console.log(i);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const newValue = e.target.value;
      const valueDiff = newValue - originalLength;
      console.log();
      //const [newXzistOutline, newAnnotations, newValues] = editPolygonBySegment(xzistOutlines[clickedOutlineIndex], axis, editPosition, valueDiff, editSegment);
      const [newXzistOutline, newAnnotations, newValues] =
        editPolygonByNextSegment(
          xzistOutlines[clickedOutlineIndex],
          valueDiff,
          clickedIndex
        );

      let updatedOutlines = [...xzistOutlines];
      updatedOutlines[clickedOutlineIndex] = newXzistOutline;

      let updatedAnnotations = [...xzistDimensionAnnotations];
      updatedAnnotations[clickedOutlineIndex] = newAnnotations;

      let updatedValues = [...xzistDimensionAnnotationValues];
      updatedValues[clickedOutlineIndex] = newValues;

      setXzistOutlines(updatedOutlines);
      setXzistDimensionAnnotations(updatedAnnotations);
      setXzistDimensionAnnotationValues(updatedValues);

      setInputField({ active: false });
      setClickedIndex(null);
      setClickedOutlineIndex(null);
      setAxis(null);
      setOriginalLength(null);
    }
  };

  const handleInputChange = (e) => {
    setInputField((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleMouseMove = (e) => {
    switch (mode) {
      case "drawing":
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
        setDbgMousePos(mousePos);

        if (!drawing) return;

        const lastLine = xzistSection[xzistSection.length - 1];
        const start = lastLine.slice(0, 2);
        const deltaX = mousePos.x - start[0];
        const deltaY = mousePos.y - start[1];

        if (lastOrientation === null) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setXzistSection([
              ...xzistSection.slice(0, -1),
              [...start, mousePos.x, start[1]],
            ]);
          } else {
            setXzistSection([
              ...xzistSection.slice(0, -1),
              [...start, start[0], mousePos.y],
            ]);
          }
        } else if (lastOrientation === "horizontal") {
          setXzistSection([
            ...xzistSection.slice(0, -1),
            [...start, start[0], mousePos.y],
          ]);
        } else if (lastOrientation === "vertical") {
          setXzistSection([
            ...xzistSection.slice(0, -1),
            [...start, mousePos.x, start[1]],
          ]);
        }

        // Calculate distance from end of last line in the current XzistSection
        let endOfLastLine = { x: 0, y: 0 };

        if (xzistSection.length > 0) {
          let lastLine = xzistSection[xzistSection.length - 1];
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
        if (thresholdExceeded && dist <= THRESHOLD && xzistSection.length > 1) {
          setThresholdExceeded(false);
          setXzistSection(xzistSection.slice(0, -1));

          // Toggle lastOrientation
          if (lastOrientation) {
            setLastOrientation(
              lastOrientation === "horizontal" ? "vertical" : "horizontal"
            );
          }
        }

        let outline = getXzistOutline(xzistSection, WIDTH);

        console.log("Outline---");
        console.log(outline.slice());
        let dimensions = createDimensions(outline, 10);
        setXzistOutlinePoints(outline);
        console.log(dimensions);
        setXzistDimesionLines(dimensions);
        // then in your handleMouseMove
        setZxistDimensionLineValues(calculateLineValues(dimensions));
        break;

      case "shaping":
        // new code for selecting mode

        //identify the inmdex of the piece selected as well as which corner or edge we have selected

        break;

      case "edging":
        // new code for annotating mode
        break;

      default:
        // default behavior
        break;
    }
  };

  const handleMouseEnter = (index, event) => {
    console.log("Hovering over outline with index: ", index);
  };

  // const handleMouseMoveOutline = (index, event) => {
  //   const THRESHOLD = 20; // Decide a suitable threshold value, maybe the radius of the circle or slightly more.
  //   const mousePos = event.target.getStage().getPointerPosition();
  //   const outline = xzistOutlines[index];
  //   const closestData = findClosestPoint(mousePos, outline);

  //   const distance = Math.sqrt((closestData.coordinates.x - mousePos.x) ** 2 + (closestData.coordinates.y - mousePos.y) ** 2);
  //   console.log(distance)

  //   if (distance < THRESHOLD) {
  //       console.log("Closest point index:", closestData.index);
  //       setHoverCirclePos(closestData.coordinates);
  //       setIsHovering(true);
  //   } else {
  //       setIsHovering(false);
  //   }
  // };

  const handleMouseMoveOutline = (index, event) => {
    const mousePos = event.target.getStage().getPointerPosition();
    const outline = xzistOutlines[index];
    const closestData = findClosest(mousePos, outline);

    if (closestData) {
      setHoveringDetails(closestData);
      if (closestData.type === "point") {
        setIsHoveringPoint(true);
        setIsHoveringEdge(false);
      } else {
        setIsHoveringPoint(false);
        setIsHoveringEdge(true);
      }
    } else {
      setIsHoveringPoint(false);
      setIsHoveringEdge(false);
    }
  };

  const handleRightClick = (outlineIndex, event) => {
    console.log("Right click");

    event.evt.preventDefault(); // Prevent default context menu
    if (!isHoveringPoint && !isHoveringEdge) {
      return;
    }
    console.log(hoveringDetails);
    const stage = event.target.getStage();
    const pointerPos = stage.getPointerPosition();

    const stageBox = stage.container().getBoundingClientRect();

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Assuming you have the x and y values from your state or props:
    const absolute = {
      x: stageBox.left + pointerPos.x + scrollX,
      y: stageBox.top + pointerPos.y + scrollY,
    };

    setMenuPosition(absolute);

    // event.evt.preventDefault();  // This prevents the browser context menu from appearing.
    // const outline = xzistOutlines[outlineIndex];
    // setSelectedIndex(outlineIndex);

    // const stage = event.target.getStage();
    // const mousePos = stage.getPointerPosition();
    // const closestPoint = findClosestPoint(mousePos, outline);

    // console.log(`Outline Index: ${outlineIndex}, Point Index: ${closestPoint.index}`);
  };

  return (
    <>
      {menuPosition && (
        <CustomContextMenu x={menuPosition.x} y={menuPosition.y} />
      )}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <Rect
            width={window.innerWidth}
            height={window.innerHeight}
            fill="white"
          />
          {xzistOutlinePoints && (
            <Line
              points={xzistOutlinePoints}
              fill="#DDD"
              stroke="black"
              strokeWidth={0}
              closed={true}
              draggable
            />
          )}

          {xzistDimensionLines.map((line, index) => (
            <Line
              key={index}
              points={[line[0][0], line[0][1], line[1][0], line[1][1]]}
              stroke="black"
              strokeWidth={2}
            />
          ))}

          {zxistDimensionLineValues.map((lineValue, i) =>
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

          {isHoveringEdge && hoveringDetails && (
            <Line
              points={[
                hoveringDetails.x[0],
                hoveringDetails.y[0],
                hoveringDetails.x[1],
                hoveringDetails.y[1],
              ]}
              stroke="red" // Choose a color that stands out
              strokeWidth={3} // Decide a suitable width
            />
          )}

          {xzistOutlines.map((outline, i) => (
            <Group
              ref={layerRef}
              key={i}
              draggable
              hitGraphEnabled={true}
              hitStrokeWidth={100}
              onMouseEnter={(e) => handleMouseEnter(i, e)}
              onMouseMove={(e) => handleMouseMoveOutline(i, e)}
              onMouseLeave={() => {
                setIsHoveringPoint(false);
                setIsHoveringEdge(false);
              }}
              onContextMenu={(e) => handleRightClick(i, e)}
              onDragEnd={(e) => handleDragEnd(i, e)}
              onDragStart={(e) => handleDragStart(i, e)}
              onClick={(e) => handleGroupClick(i, e)}
            >
              <Line
                points={outline}
                fill="#00D2FF"
                stroke={i === selectedIndex ? "red" : "black"}
                strokeWidth={2}
                closed={true}
              />

              {xzistDimensionAnnotations[i] &&
                xzistDimensionAnnotations[i].map((line, index) => (
                  <Line
                    key={index}
                    points={[line[0][0], line[0][1], line[1][0], line[1][1]]}
                    stroke="black"
                    strokeWidth={2}
                  />
                ))}
              {xzistDimensionAnnotationValues[i] &&
                xzistDimensionAnnotationValues[i].map((lineValue, index) => (
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

          {/* {xzistSections.map((xzistSection, i) => (
            <Line 
              key={i} 
              points={xzistSection.flat()} 
              stroke="#000" 
              strokeWidth={10} 
              lineCap="round" 
              draggable 
            />
          ))} */}

          {/* {drawing && <Line points={xzistSection.flat()} stroke="#f00" strokeWidth={1} lineCap="round" />} */}
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
      <button onClick={() => setMode("drawing")}>Drawing Mode</button>
      <button onClick={() => setMode("shaping")}>Shaping Mode</button>
      <button onClick={() => setMode("edging")}>Edging Mode</button>

      <div style={{ position: "absolute", top: 10, left: 10 }}>
        {" "}
        {/* Debug Info Box */}
        <p>Threshold Exceeded: {thresholdExceeded ? "Yes" : "No"}</p>
        <p>Distance: {dbgDistance}</p>
        <p>
          Mouse Position: ({dbgMousePos.x}, {dbgMousePos.y})
        </p>
        <p>
          Last Line End: ({dbgEndOfLine.x}, {dbgEndOfLine.y}){" "}
        </p>
      </div>
    </>
  );
};

TestDesignTool.propTypes = {
  cadState: PropTypes.string.isRequired,
  cadData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TestDesignTool;
