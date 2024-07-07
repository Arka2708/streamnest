import "./App.css";
import VideoPlayer from "./VideoPlayer";
import { useRef,useState } from "react";
import videojs from "video.js";
function App() {
  const [videoLink, setVideoLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); 
  const playerRef = useRef(null);
  const uploadVideo = (videoFile) => {
    const formData = new FormData();
    formData.append('file', videoFile);

    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      setVideoLink(data.videoUrl); // Assuming 'data.videoUrl' is the key for the video link in your response
    })
    .catch(error => console.error('Error:', error));
    
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Update the state with the selected file
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      uploadVideo(selectedFile); // Call uploadVideo with the selected file
    }
  };
  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL",
      },
    ],
  };
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <>
    <div>
        <h1>STREAM-NXT</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUploadClick}>Upload Video</button>
      {videoLink && <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />}
      </div>
    </>
  );
}

export default App;