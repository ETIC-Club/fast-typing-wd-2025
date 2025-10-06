import React from 'react';

interface PokemonThemeProps {
  children: React.ReactNode;
}

const ComicTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen p-4 sm:p-8 relative overflow-hidden ">
      <video 
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/pokemon-in-the-wild.mp4" type="video/mp4" />
      </video>
      
      {/* Comic halftone overlay */}
      <div className="fixed top-0 left-0 w-full h-full z-0" 
           style={{
             backgroundSize: '4px 4px',
             opacity: 0.3
           }}></div>
      

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-2 uppercase tracking-wider"
              style={{
                textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0px 4px 0px #000, 4px 0px 0px #000, 0px -4px 0px #000, -4px 0px 0px #000',
                WebkitTextStroke: '2px black'
              }}>
            POKEMON TYPING!
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ComicTheme;