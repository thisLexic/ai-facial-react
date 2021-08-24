import * as faceapi from "face-api.js";

export const loadModels = () => {
  const modelsPath = process.env.PUBLIC_URL + "/models";
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
  ]);
};

export const getFaces = async ({ video, displaySize, faceMatcher }) => {
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();
  //   const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const resizedDetections = detections;
  const faces = resizedDetections.map((d) =>
    faceMatcher.findBestMatch(d.descriptor)
  );
  return { resizedDetections, faces };
};

export const drawFaces = ({
  canvas,
  resizedDetections,
  width,
  height,
  faces,
}) => {
  canvas.getContext("2d").clearRect(0, 0, width, height);
  faces.forEach((face, i) => {
    const box = resizedDetections[i].detection.box;
    const drawBox = new faceapi.draw.DrawBox(box, {
      label: face.toString(),
    });
    drawBox.draw(canvas);
  });
};

export const loadAIFromImages = async () => {
  const labels = ["Kayama"];
  const facesWithDescriptors = await Promise.all(
    await getFacesWithDescriptors({ labels })
  );
  const faceMatcher = new faceapi.FaceMatcher(facesWithDescriptors, 0.6);
  return faceMatcher;
};

export const getFacesWithDescriptors = async ({ labels }) => {
  return await labels.map(async (label) => {
    const descriptions = [];
    for (let i = 1; i <= 2; i++) {
      const img = await faceapi.fetchImage(
        `${process.env.PUBLIC_URL}/faces/${label}/${i}.jpg`
      );
      const detections = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }

    return new faceapi.LabeledFaceDescriptors(label, descriptions);
  });
};
