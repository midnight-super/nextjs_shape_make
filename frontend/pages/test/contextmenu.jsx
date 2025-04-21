import CutoutOptions from "@/components/QuotesContextMenu/CutoutOptions";
import DrainerCutoutOptions from "@/components/QuotesContextMenu/DrainerCutoutOptions";
import EdgesAndBacksplashOptions from "@/components/QuotesContextMenu/EdgesAndBacksplashOptions";
import HobCutoutOptions from "@/components/QuotesContextMenu/HobCutoutOptions";
import MaterialAndEdgingOptions from "@/components/QuotesContextMenu/MaterialAndEdgingOptions";
import MeasurementOptions from "@/components/QuotesContextMenu/MeasurementOptions";
import PricingEmailPopup from "@/components/QuotesContextMenu/PricingEmailPopup";
import QuotePDF1 from "@/components/QuotesContextMenu/QuotePDF1";
import QuotePDF2 from "@/components/QuotesContextMenu/QuotePDF2";
import RadiusCorner from "@/components/QuotesContextMenu/RadiusCorner";
import ShapingOptions from "@/components/QuotesContextMenu/ShapingOptions";
import SinkCutoutOptions from "@/components/QuotesContextMenu/SinkCutoutOptions";
import SlabImageUpload from "@/components/QuotesContextMenu/SlabImageUpload";
import ZoomMenu from "@/components/QuotesContextMenu/ZoomMenu";
import React, { useState } from "react";

export default function Contextmenu() {
  const handleContextMenu = (e) => {
    e.preventDefault();
    console.log("right click!!");
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (e) => {
    e.preventDefault();
    setMenuVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  // return (
  //   <div className="flex-1 p-4 flex flex-col" onContextMenu={handleRightClick}>
  //     {menuVisible && <ContextMenu position={position} />}
  //   </div>
  // );

  return (
    <div className="flex-1 p-4 flex flex-col gap-8">
      radius corner
      <RadiusCorner />
      zoom menu
      <ZoomMenu />
      edges and Backsplashes
      {/* (make one for radius corner without all other options) */}
      <EdgesAndBacksplashOptions />
      MeasurementOptions
      <MeasurementOptions />
      shapingoptions
      <ShapingOptions />
      MaterialAndEdgingOptions
      <MaterialAndEdgingOptions />
      slabimageupload
      <SlabImageUpload />
      CutoutOptions
      <CutoutOptions />
      sinkcutout options // todo: fix
      <SinkCutoutOptions />
      hobcutout //todo: fix
      <HobCutoutOptions />
      drainer cutout //todo: fix
      <DrainerCutoutOptions />
      PricingEmailPopup
      <PricingEmailPopup />
      quotepdf1
      <QuotePDF1 />
      QuotePDF2
      <QuotePDF2 />
    </div>
  );
}

function ContextMenu({ position }) {
  return (
    <div
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      className="fixed bg-white border border-gray-200 z-50 p-2 rounded-md shadow-lg"
    >
      <div className="cursor-pointer hover:bg-gray-200 p-2 rounded">
        Menu Item 1
      </div>
      <div className="cursor-pointer hover:bg-gray-200 p-2 rounded">
        Menu Item 2
      </div>
      {/* ... other menu items ... */}
    </div>
  );
}
