import React, { useRef, useState, useEffect } from 'react';

export default function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [stream, setStream] = useState(null);
  const intervalRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Set cookie helper
  function setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
  }

  // Start camera and countdown (auto-start)
  const startCapture = async () => {
    setCapturing(true);
    setCountdown(20);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      let time = 20;
      intervalRef.current = setInterval(() => {
        time -= 1;
        setCountdown(time);
        if (time <= 0) {
          clearInterval(intervalRef.current);
          capturePhoto();
        }
      }, 1000);
    } catch (err) {
      alert('Camera access denied or not available.');
      setCapturing(false);
    }
  };

  // Capture photo and send to backend
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('image', blob, 'photo.jpg');
      try {
        const res = await fetch('http://localhost:5000/analyze_image_sentiment', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        // Extract sentiment from response and set cookie
        let sentiment = '';
        if (data && typeof data === 'object' && data.sentiment) {
          sentiment = data.sentiment;
        } else if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
          sentiment = data.candidates[0].content.parts[0].text;
        } else {
          sentiment = JSON.stringify(data);
        }
        setCookie('latestSentiment', sentiment, 7);
      } catch (err) {
        setCookie('latestSentiment', 'neutral', 7);
      }
      setCapturing(false);
      // Wait 20s before next capture
      setTimeout(() => {
        startCapture();
      }, 20000);
    }, 'image/jpeg');
  };

  // Only auto-start when showCamera is true
  useEffect(() => {
    if (showCamera) {
      setShowPreview(true); // Show preview when camera is first started
      startCapture();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line
  }, [showCamera]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {!showCamera && (
        <button
          onClick={() => setShowCamera(true)}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/80 transition"
        >
          Show Camera Preview
        </button>
      )}
      {showCamera && (
        <>
          {showPreview && capturing && (
            <div className="flex flex-col items-center gap-2">
              <video ref={videoRef} className="rounded-lg w-full max-w-xs" autoPlay playsInline muted />
              <div className="text-lg font-bold text-primary">Photo in: {countdown}s</div>
            </div>
          )}
          <button
            onClick={() => setShowPreview((prev) => !prev)}
            className="px-4 py-2 bg-gray-300 rounded-lg font-semibold mt-2"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
} 