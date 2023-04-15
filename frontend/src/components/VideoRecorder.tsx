import React, { memo, useEffect, useRef, useState } from 'react';
import { ReactMediaRecorder, useReactMediaRecorder } from 'react-media-recorder';
import AWS from 'aws-sdk';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import { Box, Button, createTheme, Divider, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import CameraViewer from './CameraViewer';


const s3 = new AWS.S3({
  accessKeyId: 'AKIARC474JF23TPYBQF7',
  secretAccessKey: '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',
  region: 'us-east-1',
});

const theme = createTheme({
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 25,
  },
});




const uploadToS3 = async (blob: Blob): Promise<string> => {
  const key: string = `videos/${Date.now()}.mp4`;

  const params = {
    Bucket: 'inventiv-s3-2',
    Key: key,
    Body: blob,
  };
  return new Promise((resolve, reject) => {
    s3.putObject(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        console.log('Upload successful to S3.');
        resolve(key);
      }
    });

    
  });
};




const VideoRecorder = () => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [email, setEmail] = useState('');
  const [persona, setPersona] = useState('');
  const [playing, setPlaying] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });


  // const s3_host = 'https://inventiv-s3.s3.us-east-1.amazonaws.com/'

  useEffect(() => {

    setPlaying(false);

  }, );

  const handleReplay = () => {
    setPlaying(true);
  }


  const handleOnStop = (blobUrl: string, blob: Blob) => {
    
    setVideoBlob(blob);
  };

  const handleUploadButtonClick = async () => {
    if (!!videoBlob)
    {
      setEmail('');

      try {
        const key: string = await uploadToS3(videoBlob);

        const response = await axios.post('/testapp/api/send-email/',
          {
            email,
            persona,
            key
          }
        );
    
        console.log(response.data);

        
      } catch (error) {
        console.error('S3 Error:', error);
      }
    }
    
  }

  return (
    <>
    <Box width="80%" display="flex" gap='1' margin='10px' flexDirection={'column'}>
      <div style={{height: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
        <div style={{height: '50px', width: '50px', display: 'flex'}}>
          {/* <img src={'/static/Logo.svg'} /> */}
        </div>
        <span style={{textTransform: 'uppercase', letterSpacing: '0.088em', fontFamily: 'YAEl46n1V_s-0', lineHeight: '1.4em', fontWeight: '500', color: '#f3f4f4', fontSize: 'xx-large'}}>
          Inventiv
        </span>
      </div>
    </Box>
    <ThemeProvider theme={theme}>
      <Typography style={{fontFamily: 'Poppins', fontWeight: '200', lineHeight: '10px'}}>Record a 5-minute video with the script below to create your avatar. This is a one-time requirement.</Typography>
    </ThemeProvider>
    {/* <Typography variant="h5" style={{marginTop: '20px', fontFamily: 'Poppins', fontWeight: '100', lineHeight: '10px'}}>Recording Guidelines.</Typography> */}
    
    
    <a target="_blank" style={{marginTop: "20px", color: '#12e1b9'}} href="https://inventiv.notion.site/Recording-Guidelines-for-Avatar-Creation-4f228e74c99242fca614085a866f382f">Recording Guidelines</a>
    
    <div style={{display: 'flex', flexDirection: 'row', gap: '50px', marginTop: '50px'}}>
      <Box
        border={1}
        borderColor="grey"
        height={400}
        width={500}
        display="flex"
        // justifyContent="center"
        // alignItems="center"
        color="white"
        fontSize={24}
        flexDirection={'column'}
        padding={2}
      >
        <Typography variant="h5" display={'flex'} justifyContent={'center'} alignItems={'center'}>Script</Typography>
        <Divider />
        <p style={{overflow: 'scroll', fontSize: 'large'}}>
        “The Hitchhiker’s Guide to the Galaxy” is a science fiction comedy series written by Douglas Adams. The series follows the adventures of Arthur Dent, a normal human being who is taken on a wild journey through the galaxy after Earth is destroyed to make way for a hyperspace bypass. He is joined by Ford Prefect, an alien researcher for the eponymous “Hitchhiker’s Guide to the Galaxy”, and the depressed robot Marvin.
Throughout the series, the trio encounters a variety of strange and absurd beings, including Zaphod Beeblebrox, the eccentric two-headed president of the galaxy, Trillian, the only other survivor of Earth’s destruction, and the Vogons, a bureaucratic alien race responsible for the destruction of Earth. The narrative is filled with humor, satire, and philosophical musings on the nature of existence.
The “Hitchhiker’s Guide to the Galaxy” is a fictional guidebook that provides useful tips and information for space travelers, and serves as a constant source of comedy and irony throughout the series. The guidebook is described as being written by the “greatest minds in the galaxy” and is filled with absurd and sometimes inaccurate information, but is always there to offer guidance in the face of the unknown.
One of the key themes in “The Hitchhiker’s Guide to the Galaxy” is the idea that the universe is a chaotic and unpredictable place, and that attempts to make sense of it are ultimately futile. This is reflected in the narrative, which often takes unexpected turns and subverts traditional science fiction conventions.
Another central theme is the concept of the ultimate answer to the ultimate question of life, the universe, and everything, which is famously calculated to be 42. This joke plays on the idea that finding the answer to the big questions of life is an impossible task, and that any answer we come up with is likely to be absurd and meaningless.
“The Hitchhiker’s Guide to the Galaxy” is a unique and imaginative series that blends science fiction, humor, and satire in a way that is both entertaining and thought-provoking. Its characters, humor, and ideas have become cultural touchstones and have inspired a generation of science fiction fans and writers. Whether you’re a fan of science fiction, humor, or just enjoy a good laugh, “The Hitchhiker’s Guide to the Galaxy” is definitely worth checking out.
In conclusion, “The Hitchhiker’s Guide to the Galaxy” is a hilarious and unique series that explores the absurdity and unpredictability of the universe. Its blend of science fiction, humor, and satire makes it a timeless classic that will continue to be loved and enjoyed for generations to come.
        </p>
      </Box>
      <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <VideoPlayer url={mediaBlobUrl}/>
      </div>
    </div>
      
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'50px'} gap={'16px'}>
      <Typography>We'll email you when your avatar is ready. It usually takes a few hours.</Typography>
        <TextField
      label="Email"
      variant="outlined"
      value={email}
      onChange={(e) => {
        e.preventDefault();
        setEmail(e.target.value)}}
      fullWidth
        />
      <Button onClick={handleUploadButtonClick} disabled={!email}>Upload for processing</Button>
    </Box>
    
    </>
  );
};

export default VideoRecorder;
