import React from 'react';
import '../styles/MeshBackground.css';

/* Fixed full-screen background blobs that slowly drift.
   Rendered once in App.jsx, visible on every page. */
const MeshBackground = () => (
  <div className="mesh-bg" aria-hidden="true">
    <div className="mesh-blob mesh-blob--1" />
    <div className="mesh-blob mesh-blob--2" />
    <div className="mesh-blob mesh-blob--3" />
  </div>
);

export default MeshBackground;
