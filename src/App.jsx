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

  // 3D rotation state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Cursor trail positions
  const [trail, setTrail] = useState([]);

  // Typewriter effect
  const [bioText, setBioText] = useState("made by @raydongg");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect logic
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

  // Fetch view count
  useEffect(() => {
    fetch('/increment-view')
      .then(response => response.json())
      .then(data => setViewCount(data.viewCount))
      .catch(error => console.error('Error:', error));
  }, []);

  // Audio & timer logic
  useEffect(() => {
    const audioElement = document.getElementById('audio');

    if (!isPlaying && isOverlayClicked) {
      audioPlay();
      setIsPlaying(true);
    }

    const interval = setInterval(() => {
      const elapsedTime = Math.round(audioElement.currentTime);
      setCurrentTime(elapsedTime);

      if (elapsedTime >= maxTime) {
        audioElement.currentTime = 0;
        setCurrentTime(0);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, isOverlayClicked, maxTime]);

  // Copy handlers
  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopyStatus('Copied');
        setCssLabel('Copied');
        setTimeout(() => {
          setCopyStatus('');
          setCssLabel('Copy BTC Address');
        }, 2000);
      })
      .catch(error => console.error('Error copying address:', error));
  };

  const handleCopyAddress1 = (address) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopyStatus('Copied');
        setCssLabel1('Copied');
        setTimeout(() => {
          setCopyStatus('');
          setCssLabel1('Copy LTC Address');
        }, 2000);
      })
      .catch(error => console.error('Error copying address:', error));
  };

  function audioPlay() {
    const audio = document.getElementById('audio');
    audio.volume = 1;
    audio.play();
  }

  const handlePlayPause = () => {
    const audioElement = document.getElementById('audio');
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setIsOverlayClicked(true);
    audioPlay();
    setEntered(true);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // 3D rotation based on mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rotateX = ((e.clientY - centerY) / centerY) * 10; // max 10deg
      const rotateY = ((e.clientX - centerX) / centerX) * 10; // max 10deg
      setRotation({ x: rotateX, y: rotateY });

      // Update trail positions
      setTrail(trail => {
        const newTrail = [...trail, { x: e.clientX, y: e.clientY, id: Date.now() }];
        // Limit trail length to 15 dots
        if (newTrail.length > 15) newTrail.shift();
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className='app-container' style={{ cursor: 'none' }}>
      <video autoPlay loop muted className='video-background'>
        <source src={bg} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {/* Cursor trail dots */}
      {trail.map(dot => (
        <div
          key={dot.id}
          className="cursor-trail-dot"
          style={{
            left: dot.x - 5,
            top: dot.y - 5,
            position: 'fixed',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            pointerEvents: 'none',
            mixBlendMode: 'difference',
            opacity: 0.4,
            transition: 'opacity 0.3s',
            zIndex: 9999,
          }}
        />
      ))}

      {showOverlay && (
        <div className='overlay' onClick={handleOverlayClick}>
          <p1 className='click'>Click Anywhere</p1>
        </div>
      )}

      <div
        className={`main-container ${entered ? 'entered' : ''}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
          perspective: '800px',
        }}
      >
        <img src={view} className='view' alt="View Icon" />
        <p1 className='num'>{viewCount}</p1>
        <img src={pfp} className='pfp' alt="Profile Picture" />
        <div className='info' >
          <h1 className='name'>raydon</h1>
          <h1 className='bio'>{bio}</h1>
        </div>
        <div className='links'>
          <a href="" target="_blank" rel="noopener noreferrer">
            <img src={twitter} className='link1' alt="Twitter" />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <img src={git} className='link2' alt="GitHub" />
          </a>
          <a href="https://www.instagram.com/dangerincord/" target="_blank" rel="noopener noreferrer">
            <img src={insta} className='link3' alt="Instagram" />
          </a>
          <a href="https://www.youtube.com/channel/raydongg" target="_blank" rel="noopener noreferrer">
            <img src={yt} className='link4' alt="YouTube" />
          </a>
          <a href="https://discord.com/users/raydongg" target="_blank" rel="noopener noreferrer">
            <img src={discord} className='link5' alt="Discord" />
          </a>
        </div>
        <div className='song'>
          <div className='progress-bar-container'>
            <div className='progress-bar' style={{ width: `${(currentTime / maxTime) * 100}%` }} />
          </div>
          <a href='' target='_blank' rel='noopener noreferrer'>
            <img src={cover} className='songcover' alt='' />
          </a>
          <div className='songinfo'>
            <p1 className='songtitle'>alot</p1>
            <p1 className='artist'>by 21savage</p1>
            <p1 className='album' href>.-.</p1>
          </div>
          <div className='time-label'>
            {formatTime(currentTime)} / {formatTime(maxTime)}
          </div>
          <audio id='audio' src={stop} />
        </div>
      </div>
    </div>
  );
}

export default App;
