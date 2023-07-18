import logo from './res.jpg'
import { useRef, useState } from 'react';
import './App.css';

const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ]
};

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

let localStream;
let pc1Local;
let pc1Remote

function App() {

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const [startBtn, setStartBtn] = useState(false);
  const [callBtn, setCallBtn] = useState(true);
  const [hangUpBtn, setHangUpBtn] = useState(true);

  function gotRemoteStream1(e) {
    if (remoteVideoRef.current.srcObject !== e.streams[0]) {
      remoteVideoRef.current.srcObject = e.streams[0];
      console.log('pc1: received remote stream');
    }
  }

  function iceCallback1Local(event) {
    handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
  }

  function iceCallback1Remote(event) {
    handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote');
  }

  function handleCandidate(candidate, dest, prefix, type) {
    dest.addIceCandidate(candidate)
      .then(onAddIceCandidateSuccess, onAddIceCandidateError);
    console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`);
  }

  function onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.');
  }

  function onAddIceCandidateError(error) {
    console.log(`Failed to add ICE candidate: ${error.toString()}`);
  }

  function gotDescription1Local(desc) {
    pc1Local.setLocalDescription(desc);
    console.log(`Offer from pc1Local\n${desc.sdp}`);
    pc1Remote.setRemoteDescription(desc);
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError);
  }

  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  function gotDescription1Remote(desc) {
    pc1Remote.setLocalDescription(desc);
    console.log(`Answer from pc1Remote\n${desc.sdp}`);
    pc1Local.setRemoteDescription(desc);
  }

  // Handle Start Button
  const handleStartStream = async () => {
    console.log('Requesting local stream');
    setStartBtn(true);
    setCallBtn(false);
    try {
      // Local Stream
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      localVideoRef.current.srcObject = localStream;
      console.log('Got MediaStream:', localStream);
    } catch (error) {
      console.log("Error creating local stream", error);
    }
  }

  // Handle Call Button
  const handleCallStream = async () => {
    console.log('Starting calls');
    setCallBtn(true);
    setHangUpBtn(false)
    const audioTracks = localStream.getAudioTracks();
    const videoTracks = localStream.getVideoTracks();
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    const servers = null;
    pc1Local = new RTCPeerConnection(servers);
    pc1Remote = new RTCPeerConnection(servers);

    pc1Remote.ontrack = gotRemoteStream1;
    pc1Local.onicecandidate = iceCallback1Local;
    pc1Remote.onicecandidate = iceCallback1Remote;
    console.log('pc1: created local and remote peer connection objects');
    localStream.getTracks().forEach(track => pc1Local.addTrack(track, localStream));
    console.log('Adding local stream to pc1Local');
    pc1Local
      .createOffer(offerOptions)
      .then(gotDescription1Local, onCreateSessionDescriptionError);
  }

  // Handle Hang Up Button
  const handleHangUpStream = async () => {
    setCallBtn(false);
    setHangUpBtn(true);
    console.log('Ending calls');
    pc1Local.close();
    pc1Remote.close();
    pc1Local = pc1Remote = null;
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
