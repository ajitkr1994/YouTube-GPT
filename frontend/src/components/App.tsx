import { useEffect, useRef } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={500} height={500} autoPlay controls />;
};

const App = () => (
  <ReactMediaRecorder
    video
    render={({ previewStream }) => {
      return <VideoPreview stream={previewStream} />;
    }}
  />
);

export default App;