import React, { useState, useEffect } from 'react';
import './App.css';
import pfp from './images/pfp1.gif';
import view from './images/viewW.svg';
import twitter from './images/x.png';
import insta from './images/insta.png';
import yt from './images/yt.png';
import discord from './images/discord.png';
import cover from './images/cover.png';
import stop from './song/stopplayin.mp3';
import bg from './videos/car.mp4';
import git from './images/git2.png';

function App() {
  const [viewCount, setViewCount] = useState(860);
  const [currentTime, setCurrentTime] = useState(0);
  const maxTime = 288;
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isOverlayClicked, setIsOverlayClicked] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [cssLabel, setCssLabel] = useState('Copy BTC Address');
  const [cssLabel1, setCssLabel1] = useState('Copy LTC Address');
  const [bio, setBio] = useState('');
  const [entered, setEntered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const [bioText, setBioText] = useState("made by @raydongg");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isTyping) {
        if (index < bioText.length) {
          setBio(prevBio => prevBio + bioText.charAt(index));
          setIndex(prevIndex => prevIndex + 1);
        } else {
          setIsTyping(false);
        }
      } else {
        if (index >= 0) {
          setBio(prevBio => prevBio.slice(0, index));
          setIndex(prevIndex => prevIndex - 1);
        } else {
          setIsTyping(true);
        }
      }
    }, 50);
    return () => clearInterval(timer);
  }, [bioText, index, isTyping]);

  useEffect(() => {
    fetch('/increment-view')
      .then(res => res.json())
      .then(data => setViewCount(data.viewCount))
      .catch(err => console.error(err));
  }, []);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  useEffect(() => {
    const audioElement = document.getElementById('audio');

    if (!isPlaying && isOverlayClicked) {
      audioPlay();
      setIsPlaying(true);
    }

    const interval = setInterval(() => {
      if (audioElement) {
        const elapsedTime = Math.round(audioElement.currentTime);
        setCurrentTime(elapsedTime);

        if (elapsedTime >= maxTime) {
          audioElement.currentTime = 0;
          setCurrentTime(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isOverlayClicked]);

  useEffect(() => {
    const handleMouseMove = e => {
      const newTrail = [...trail, { x: e.clientX, y: e.clientY, id: Date.now() }];
      setTrail(newTrail.slice(-20)); // keep last 20 dots

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const tiltX = (dy / centerY) * 10;
      const tiltY = -(dx / centerX) * 10;

      setRotation({ x: tiltX, y: tiltY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [trail]);

  const handleCopyAddress = (address, labelSetter) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopyStatus('Copied');
      labelSetter('Copied');
      setTimeout(() => {
        setCopyStatus('');
        labelSetter(labelSetter === setCssLabel ? 'Copy BTC Address' : 'Copy LTC Address');
      }, 2000);
    });
  };

  function audioPlay() {
    const audio = document.getElementById('audio');
    audio.volume = 1;
    audio.play();
  }

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setIsOverlayClicked(true);
    audioPlay();
    setEntered(true);
  };

  return (
    <div className="app-container">
      <video autoPlay loop muted className="video-background">
        <source src={bg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showOverlay && (
        <div className="overlay" onClick={handleOverlayClick}>
          <p1 className="click">Click Anywhere</p1>
        </div>
      )}

      <div
        className={`main-container ${entered ? 'entered' : ''}`}
        style={{
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          top: '50%',
          left: '50%',
          position: 'absolute',
        }}
      >
        <img src={view} className="view" alt="View Icon" />
        <p1 className="num">{viewCount}</p1>
        <img src={pfp} className="pfp" alt="Profile" />
        <div className="info">
          <h1 className="name">raydon</h1>
          <h1 className="bio">{bio}</h1>
        </div>
        <div className="links">
          <a href="#"><img src={twitter} className="link1" alt="X" /></a>
          <a href="#"><img src={git} className="link2" alt="Git" /></a>
          <a href="https://www.instagram.com/dangerincord/" target="_blank"><img src={insta} className="link3" alt="Insta" /></a>
          <a href="https://www.youtube.com/channel/raydongg" target="_blank"><img src={yt} className="link4" alt="YT" /></a>
          <a href="https://discord.com/users/raydongg" target="_blank"><img src={discord} className="link5" alt="Discord" /></a>
        </div>
        <div className="song">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${(currentTime / maxTime) * 100}%` }} />
          </div>
          <img src={cover} className="songcover" alt="Cover" />
          <div className="songinfo">
            <p1 className="songtitle">alot</p1>
            <p1 className="artist">by 21savage</p1>
          </div>
          <div className="time-label">
            {formatTime(currentTime)} / {formatTime(maxTime)}
          </div>
          <audio id="audio" src={stop}></audio>
        </div>
      </div>

      {trail.map(dot => (
        <div
          key={dot.id}
          className="cursor-trail"
          style={{ left: dot.x + 'px', top: dot.y + 'px' }}
        />
      ))}
    </div>
  );
}

export default App;
