import { Box, Button, Card, IconButton, Stack } from '@mui/material';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  hideControls?: boolean
  playing?: boolean
  style?: {}
}

const VideoPlayer = ({ url, hideControls, playing, style }: VideoPlayerProps) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const player = useRef<ReactPlayer>(null);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleEnd = () => {
    console.log('Video ended');
    setIsReady(true);
  };

  const handleSeek = (seconds: number) => {
    // Ideally, the seek event would be fired whenever the user moves the built in Youtube video slider to a new timestamp.
    // However, the youtube API no longer supports seek events (https://github.com/cookpete/react-player/issues/356), so this no longer works

    // You'll need to find a different way to detect seeks (or just write your own seek slider and replace the built in Youtube one.)
    // Note that when you move the slider, you still get play, pause, buffer, and progress events, can you use those?

    console.log(
      "This never prints because seek decetion doesn't work: ",
      seconds,
    );
  };

  const handlePlay = () => {
    console.log(
      'User played video at time: ',
      player.current?.getCurrentTime(),
    );
  };

  const handlePause = () => {
    console.log(
      'User paused video at time: ',
      player.current?.getCurrentTime(),
    );
  };

  const handleBuffer = () => {
    console.log('Video buffered');
  };

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    console.log('Video progress: ', state);
  };

  return (
    // <Box
    //   width="100%"
    //   height="100%"
    //   display="flex"
    //   alignItems="center"
    //   justifyContent="center"
    //   flexDirection="column"
    // // >
    // <ReactPlayer
    //   ref={player}
    //   url={url}
    //   playing={!!playing}
    //   controls={true}
    //   onReady={handleReady}
    //   onEnded={handleEnd}
    //   onSeek={handleSeek}
    //   onPlay={handlePlay}
    //   onPause={handlePause}
    //   onBuffer={handleBuffer}
    //   onProgress={handleProgress}
    //   width={style?.['width'] ?? '700px'}
    //   height={style?.['height'] ?? '360px'}
    //   // height="500px"
    //   style={style ?? {
    //     pointerEvents: hideControls ? 'none' : 'auto',
    //     // marginTop: '25px'
    //   }}
      
    <></>
  );
};

export default VideoPlayer;
