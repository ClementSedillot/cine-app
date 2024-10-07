import React from 'react';
import YouTube from 'react-youtube';
import '../styles/App.css';

const Landing: React.FC = () => {
  const videoId = 'u35WIs62R2M';

  // Options de configuration pour le lecteur YouTube
  const videoOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: videoId, // Nécessaire pour activer le loop sur YouTube
    },
  };

  return (
    <div className="App">
      {/* Contexte de la vidéo en arrière-plan */}
      <div className="youtube-background">
        <YouTube videoId={videoId} opts={videoOptions} className="youtube-video" />
      </div>

      {/* Contenu placé par-dessus la vidéo */}
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
