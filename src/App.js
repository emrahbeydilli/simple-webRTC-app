import logo from './res.jpg'
import { useRef } from 'react';
import './App.css';

function App() {
  const videoRef = useRef();

  const constraints = {
    'video': true,
    'audio': true
  }

  const handleGetMedia = async () => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      console.log('Got MediaStream:', stream);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
    // const displayMedia = await navigator.mediaDevices.getDisplayMedia();
    // console.log("display media", displayMedia);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{
          width:'600px',
        }}>
          <video ref={videoRef} autoPlay controls={false} poster={logo} style={{
            width:'100%',
          }}></video>
        </div>
        <button onClick={handleGetMedia} >Tıkla!</button>
      </header>
    </div>
  );
}

export default App;
