import logo from './res.jpg'
import { useEffect, useRef, useState } from 'react';
import './App.css';

import { createRoomRef} from './utils/firebase.utils';
import chalk from 'chalk';


const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};


function App() {

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const [localStream, setLocalStream] = useState(null);

  const [startBtn, setStartBtn] = useState(false);
  const [callBtn, setCallBtn] = useState(true);
  const [hangUpBtn, setHangUpBtn] = useState(true);

  useEffect(() => {
    localVideoRef.current.srcObject = localStream;
    console.log('Got MediaStream:', localStream);
  }, [localStream]);

  const handleStartStream = async () => {
    setStartBtn(true);
    setCallBtn(false);
    try {
      // Local Stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalStream(stream);
    }

  }

  const handleCallStream = async () => {
    setCallBtn(true);
    setHangUpBtn(false)
    try {
      const videoTracks = localStream.getVideoTracks();
      const audioTracks = localStream.getAudioTracks();
      if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
      }
      if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
      }
    } catch (error) {
      console.error('Error stopping media devices.', error);
    }
  }

  const handleHangUpStream = async () => {
    try {
      setCallBtn(false);
      setHangUpBtn(true);
    } catch (error) {
      console.error('Error stopping media devices.', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{
          width: '600px',
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            controls
            controlsList='nodownload noremoteplayback'
            poster={logo}
            style={{
              width: '100%',
            }}
            disablePictureInPicture
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            controls
            controlsList='nodownload noremoteplayback'
            poster={logo}
            style={{
              width: '100%',
            }}
            disablePictureInPicture
          />

        </div>
        <div style={{
          display: 'flex',
          minWidth: '200px',
          justifyContent: 'space-between'
        }}>
          <button onClick={handleStartStream} disabled={startBtn}>Start</button>
          <button onClick={handleCallStream} disabled={callBtn}>Call</button>
          <button onClick={handleHangUpStream} disabled={hangUpBtn}>Hang Up</button>

        </div>
      </header>
    </div>
  );
}

export default App;
