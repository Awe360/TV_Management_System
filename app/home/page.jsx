"use client"

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { dataBase } from '../../config/firebase'; // Your Firestore config

const HomePage = () => {
  const [tvOptions, setTvOptions] = useState([]);
  const [selectedTV, setSelectedTV] = useState('');
  const [currentMedia, setCurrentMedia] = useState(null);

  // Fetch TV options in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(dataBase, 'registeredTV'), (snapshot) => {
      const tvs = snapshot.docs.map(doc => doc.data().ID);
      setTvOptions(tvs);
      if (tvs.length > 0) setSelectedTV(tvs[0]); // Set default selected TV
    });
    
    // Cleanup listener
    return () => unsubscribe();
  }, []);

  // Fetch current media when selected TV changes
  useEffect(() => {
    if (!selectedTV) return;
    const unsubscribe = onSnapshot(collection(dataBase, selectedTV), (snapshot) => {
      const media = snapshot.docs.map(doc => doc.data());
      setCurrentMedia(media[0] || null); // Assuming one media per TV
    });

    return () => unsubscribe();
  }, [selectedTV]);

  // Helper function to check if media type starts with a given prefix
  const mediaTypeValid = (mediaType, prefix) => {
    return mediaType && mediaType.startsWith(prefix);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center  ">
      {/* Header */}
      <header className="text-4xl font-semibold text-gray-800 pt-5 ">
        <h1 className='text-yellow-400 font-bold'>Welcome to the Media Upload System</h1>
      </header>

      {/* TV Selection Dropdown */}
      <div className="mb-6">
        <label htmlFor="tv-select" className="block text-lg font-medium text-gray-700 mb-2 pt-5">
          Select a TV to see what contents are displaying now
        </label>
        <select
          id="tv-select"
          value={selectedTV}
          onChange={(e) => setSelectedTV(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tvOptions.map(tv => (
            <option key={tv} value={tv}>{tv}</option>
          ))}
        </select>
      </div>

      {/* Current Media Display */}
      <div className="mb-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Media</h2>
        {currentMedia ? (
          mediaTypeValid(currentMedia.mediaType, 'image') && !currentMedia.mediaType.includes('gif') ? (
            <img src={currentMedia.media} alt="Current Media" className="mx-auto rounded-lg shadow-md" />
          ) : mediaTypeValid(currentMedia.mediaType, 'video') ? (
            <video controls className="mx-auto rounded-lg shadow-md" width="300">
              <source src={currentMedia.media} type={currentMedia.mediaType} />
              Your browser does not support the video tag.
            </video>
          ) : currentMedia.mediaType === 'image/gif' ? (
            <img src={currentMedia.media} alt="Current GIF" className="mx-auto rounded-lg shadow-md" />
          ) : (
            <p className="text-gray-500">No media uploaded yet.</p>
          )
        ) : (
          <p className="text-gray-500">No media uploaded yet.</p>
        )}
      </div>

      {/* Upload Button */}
      <div>

      </div>
    </div>
  );
};

export default HomePage;
