import * as faceapi from "face-api.js";

export const loadModels = () => {
  const modelsPath = process.env.PUBLIC_URL + "/models";
  const otherModelsPath = process.env.PUBLIC_URL + "/other_models";

  faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath);
  faceapi.nets.faceLandmark68Net.loadFromUri(otherModelsPath);
  faceapi.nets.faceExpressionNet.loadFromUri(otherModelsPath);
};

export const getFaces = async ({ video, displaySize }) => {
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  //   const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const resizedDetections = detections;
  return { resizedDetections };
};

export const drawFaces = ({ canvas, resizedDetections, width, height }) => {
  canvas.getContext("2d").clearRect(0, 0, width, height);
  faceapi.draw.drawDetections(canvas, resizedDetections);
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
};
