import React from 'react';
import YouTube from 'react-youtube';
import '../styles/App.css';

const Landing: React.FC = () => {
  const videoId = 'u35WIs62R2M';

  const videoOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: videoId, 
    },
  };

  return (
    <div className="App">
      <div className="youtube-background">
        <YouTube videoId={videoId} opts={videoOptions} className="youtube-video" />
      </div>

      <div className="content">
        <h1>Bienvenue sur CineApp !</h1>
        <div className="buttons">
          <a href="/login" className="btn btn-out">
            Se connecter
          </a>
          <a href="/register" className="btn btn-out">
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
