import React, { useState, useRef, useEffect } from "react";

import { FaRegEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Download, Move } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DocumentViewer({ imageUrl, alt = "document" }) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  // Calculate initial zoom to fit image in container
  useEffect(() => {
    const calculateInitialZoom = () => {
      if (imageContainerRef.current && imageRef.current) {
        const container = imageContainerRef.current;
        const image = imageRef.current;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Get natural image dimensions
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;

        // Calculate zoom to fit both width and height
        const widthZoom = (containerWidth / naturalWidth) * 100;
        const heightZoom = (containerHeight / naturalHeight) * 100;

        // Take the smaller zoom to ensure full image fits
        const initialZoom = Math.min(widthZoom, heightZoom);

        setZoom(Math.min(initialZoom, 100)); // Cap at 100%
        setContainerDimensions({
          width: containerWidth,
          height: containerHeight,
        });
      }
    };

    // Wait for image to load
    if (imageRef.current && imageRef.current.complete) {
      calculateInitialZoom();
    } else if (imageRef.current) {
      imageRef.current.addEventListener("load", calculateInitialZoom);
    }
  }, [imageUrl]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 25));
    // Reset position when zooming out
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
    // Reset position on rotation
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = alt.replace(/\s+/g, "_") + ".jpg";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleMouseDown = (e) => {
    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageContainerRef.current) {
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const scaledImageWidth = imageRef.current.naturalWidth * (zoom / 100);
      const scaledImageHeight = imageRef.current.naturalHeight * (zoom / 100);

      const maxX = Math.max(0, (scaledImageWidth - containerRect.width) / 2);
      const maxY = Math.max(0, (scaledImageHeight - containerRect.height) / 2);

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Limit movement to prevent image from moving too far
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position, zoom]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaRegEye className="text-[#4971bb]" />
          View Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>View Document</DialogTitle>
          <DialogDescription>
            Use zoom and pan to explore the image in detail
          </DialogDescription>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2 items-center">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white border rounded hover:bg-gray-100"
                aria-label="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <span className="self-center">{Math.round(zoom)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white border rounded hover:bg-gray-100"
                aria-label="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRotate}
                className="p-2 bg-white border rounded hover:bg-gray-100"
                aria-label="Rotate Document"
              >
                <RotateCw size={20} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-white border rounded hover:bg-gray-100"
                aria-label="Download Document"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </DialogHeader>
        <div
          ref={imageContainerRef}
          className="max-w-full h-[600px] overflow-hidden p-4 bg-gray-100 flex justify-center items-center cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div
            className="flex justify-center items-center"
            style={{
              transform: `rotate(${rotation}deg) scale(${
                zoom / 100
              }) translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.3s ease",
              transformOrigin: "center center",
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={alt}
              className="max-w-full max-h-full object-contain shadow-lg"
              draggable="false"
            />
          </div>
        </div>
        <DialogFooter>
          {/* <Button type="submit">Close</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
