import React from 'react';
import SparklesHero from '../../components/SparklesHero';
import IEEELinksSection from './IEEELinksSection';
import PartnersSection from './PartnersSection';
import MissionVisionSection from './MissionVisionSection';
import ExComSection from './ExComSection';
import PhotoCatalogueSection from './PhotoCatalogueSection';

const Home = ({ isDark }) => (
  <main>
    <SparklesHero isDark={isDark} />
    <IEEELinksSection />
    <PartnersSection />
    <MissionVisionSection />
    <ExComSection />
    <PhotoCatalogueSection />
  </main>
);

export default Home;
