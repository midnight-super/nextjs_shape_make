import PropTypes from 'prop-types'

import React, { createRef, useState , useEffect, useRef } from "react";
import { Circle, Path, Stage, Layer, Line, Rect, Group, Text} from "react-konva";

import {
  calculateLineValues,
  getXzistOutline,
  createDimensions,
  editPolygon,
  editPolygonBySegment,
  editPolygonByNextSegment,
  getLineSegmentIndex,
  findClosestPoint,
  findClosest
} from "../utils/designToolUtils";

const CadTool = ({ cadState, cadData, onChange }) => {
    const stageRef = useRef();


    const addExclamation = () => {
        cadData.testString = cadData.testString ? cadData.testString + '!' : '!';
        onChange(cadData)
    }

    const handleMouseDown = (e) => {
          
        setThresholdExceeded(false);
        if ((e.evt.button !== 0 || inputField.active == true || e.target.className === 'Line' || e.target.className === 'Text') && !drawing) {
            // The user clicked on a line to start a drag operation.
            // Do not start a new XzistSection.
            setInputField({
            active: false,
            });

            return;
        }
        console.log("Handle mouse down")
        
        
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
        const newPoint = [mousePos.x, mousePos.y];
        
        if (!drawing) {
            setDrawing(true);
            setXzistSection([[...newPoint, ...newPoint]]);
        } else {
            setXzistSection([...xzistSection, [...xzistSection[xzistSection.length - 1].slice(2), ...newPoint, ...newPoint]]);
            const lastLine = xzistSection[xzistSection.length - 1];
            const start = lastLine.slice(0, 2);
            const deltaX = mousePos.x - start[0];
            const deltaY = mousePos.y - start[1];
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setLastOrientation('horizontal');
            } else {
                setLastOrientation('vertical');
            }
        
        }
        
        
      };
    const handleMouseUp = (e) => { alert("Up") };
    const handleMouseMove = (e) => {  };


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

          
        </Layer>
      </Stage>
      
    </>
  );

//   return (
    
//     <div>
//       <div>The current CAD State is: {cadState}</div>
//       <div>The current CAD Data is: {cadData.testString}</div>

//       <button onClick={addExclamation}>
//         Add ! to State  
//       </button>
//     </div>
//   )
}

CadTool.propTypes = {
  cadState: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

export default CadTool