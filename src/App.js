import logo from './res.jpg'
import { useRef, useState } from 'react';
import './App.css';

import { registerPeerConnectionListeners } from './webrtc.utils';
import { createRoom } from './utils/firebase.utils';


const constraints = {
  'video': true,
  'audio': true
}

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


let localStream = null;
// let remoteStream = null;

function App() {

  const videoRef = useRef();

  const [startBtn, setStartBtn] = useState(false);
  const [stopBtn, setStopBtn] = useState(true);


  const handleStartStream = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = localStream;
      console.log('Got MediaStream:', localStream);

      setStartBtn(true);
      setStopBtn(false);

      createRoom();

    } catch (error) {
      console.error('Error starting media devices.', error);
    }
    // const displayMedia = await navigator.mediaDevices.getDisplayMedia();
    // console.log("display media", displayMedia);
  }

  const handleStopStream = async (event) =>{
    try {
      setStartBtn(false);
      setStopBtn(true);
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
            ref={videoRef}
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
          display:'flex',
          minWidth:'100px',
          justifyContent:'space-between'
        }}>
          <button onClick={handleStartStream} disabled={startBtn}>Start</button>
          <button onClick={handleStopStream} disabled={stopBtn}>Stop</button>
        </div>
      </header>
    </div>
  );
}

export default App;
