import React, { useEffect, useRef, useState } from "react";

type Props = {
  status: string // 'recording' if the user is recording video.
  style?: {}
}

const CameraViewer = ({status, style}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (status === 'recording')
    {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing camera stream:', error);
      });
    }
    else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  return (
    // <video ref={videoRef} style={style} />
    <></>
  );
};

export default CameraViewer;