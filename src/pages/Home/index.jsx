import React from 'react';
import SparklesHero from '../../components/SparklesHero';
import IEEELinksSection from './IEEELinksSection';
import LazySection from '../../components/LazySection';
import PartnersSection from './PartnersSection';
import MissionVisionSection from './MissionVisionSection';
import ExComSection from './ExComSection';
import PhotoCatalogueSection from './PhotoCatalogueSection';

const Home = ({ isDark }) => (
  <main>
    <SparklesHero isDark={isDark} />
    <IEEELinksSection />
    <LazySection minHeight="300px"><PartnersSection /></LazySection>
    <LazySection minHeight="400px"><MissionVisionSection /></LazySection>
    <LazySection minHeight="600px"><ExComSection /></LazySection>
    <LazySection minHeight="500px"><PhotoCatalogueSection /></LazySection>
  </main>
);

export default Home;
