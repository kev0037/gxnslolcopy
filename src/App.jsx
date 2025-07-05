import React, { useState, useEffect, useRef } from 'react';
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

  // Magnetic 3D tilt refs and constants
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);
  const maxRotate = 15;

  // Typewriter effect
  const [bioText, setBioText] = useState("made by @raydongg");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

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
      .then(response => response.json())
      .then(data => setViewCount(data.viewCount))
      .catch(error => console.error('Error:', error));
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
      const elapsedTime = Math.round(audioElement.currentTime);
      setCurrentTime(elapsedTime);

      if (elapsedTime >= maxTime) {
        audioElement.currentTime = 0;
        setCurrentTime(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isOverlayClicked, maxTime]);

  // Magnetic 3D tilt effect handlers
  const onMouseMove = (e) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Normalize cursor position from -1 to 1
      const normalizedX = deltaX / (rect.width / 2);
      const normalizedY = deltaY / (rect.height / 2);

      const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

      const rotateX = clamp(-normalizedY, -1, 1) * maxRotate;
      const rotateY = clamp(normalizedX, -1, 1) * maxRotate;

      container.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  };

  const onMouseLeave = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    const container = containerRef.current;
    if (!container) return;
    container.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
  };

  // Copy address handlers (kept unchanged)
  const handleCopyAddress = (address, label) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopyStatus('Copied');
        setCssLabel('Copied');
        setTimeout(() => {
          setCopyStatus('');
          setCssLabel('Copy BTC Address');
        }, 2000);
      })
      .catch(console.error);
  };

  const handleCopyAddress1 = (address, label) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopyStatus('Copied');
        setCssLabel1('Copied');
        setTimeout(() => {
          setCopyStatus('');
          setCssLabel1('Copy LTC Address');
        }, 2000);
      })
      .catch(console.error);
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

  return (
    <div className='app-container'>
      <video autoPlay loop muted className='video-background'>
        <source src={bg} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      {showOverlay && (
        <div className='overlay' onClick={handleOverlayClick}>
          <p1 className='click'>Click Anywhere</p1>
        </div>
      )}
      <div
        ref={containerRef}
        className={`main-container ${entered ? 'entered' : ''}`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <img src={view} className='view' alt="View Icon" />
        <p1 className='num'>{viewCount}</p1>
        <img src={pfp} className='pfp' alt="Profile Picture" />
        <div className='info'>
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
