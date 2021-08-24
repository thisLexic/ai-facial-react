import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { loadModels, getFaces, drawFaces } from "./Video_AI";

import * as faceapi from "face-api.js";

const videoConstraints = {
  width: 640,
  height: 840,
  facingMode: "user",
};

export default function Video() {
  const [isModelsReady, setIsModelsReady] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let interval;

  useEffect(() => {
    loadModels().then(setIsModelsReady(true));
  }, []);

  const handleWebcamPlay = async () => {
    const { width, height } = webcamRef.current.props.videoConstraints;
    const displaySize = { width, height };

    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
      webcamRef.current.video
    );
    faceapi.matchDimensions(canvasRef.current, displaySize);

    while (!isModelsReady) {}

    interval = setInterval(async () => {
      const { resizedDetections } = await getFaces({
        video: webcamRef.current.video,
        displaySize,
      });
      drawFaces({
        canvas: canvasRef.current,
        resizedDetections,
        width,
        height,
      });
    }, 100);
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <Webcam
        audio={false}
        ref={webcamRef}
        onPlay={handleWebcamPlay}
        videoConstraints={videoConstraints}
      />
    </div>
  );
}
