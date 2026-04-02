import React from 'react';
import SparklesHero from '../../components/SparklesHero';

const Home = ({ isDark }) => {
  return (
    <main>
      <SparklesHero isDark={isDark} />
      {/* Additional home page sections go here */}
    </main>
  );
};

export default Home;
