import React from 'react';

interface PokemonThemeProps {
  children: React.ReactNode;
}

const PokemonTheme: React.FC<PokemonThemeProps> = ({ children }) => {
  return (
    <div className="min-h-screen p-8 relative">
      <video 
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/pokemon-in-the-wild.mp4" type="video/mp4" />
      </video>
      
      <div className="fixed top-0 left-0 w-full h-full bg-black/20 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-6xl font-bold text-white mb-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Pokemon Typing Challenge
          </h1>
       
        </div>

        {children}
      </div>
    </div>
  );
};

export default PokemonTheme;