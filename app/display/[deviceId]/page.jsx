'use client';

import React, { useState, useEffect } from 'react';
import { dataBase } from '../../../config/firebase'; // Import Firestore config
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Use Next.js navigation

const TVScreen = () => {
  const [collectionData, setCollectionData] = useState(null); // Store fetched data
  const [error, setError] = useState(null); // Store errors if any
  const router = useRouter(); // Use Next.js router for navigation

  // Get adminId and deviceId from localStorage
  const adminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null;
  const deviceId = typeof window !== 'undefined' ? localStorage.getItem('deviceId') : null;

  useEffect(() => {
    // If adminId exists, validate it
    const checkAdminId = async () => {
      try {
        const adminDocRef = doc(dataBase, 'admin', adminId); // Reference to the admin document
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          console.log('Admin ID is valid:', adminDocSnap.data());
          router.push('/home'); // Navigate to the home page if adminId is valid
        } else {
          setError('Invalid Admin ID');
        }
      } catch (err) {
        console.error('Error checking adminId:', err);
        setError('Error validating Admin ID');
      }
    };

    if (adminId) {
      checkAdminId();
    } else if (!deviceId) {
      // If neither adminId nor deviceId exists, show error
      setError('No Admin ID or Device ID found in localStorage');
    }
  }, [adminId, deviceId, router]);

  // Reference to the specific collection based on the deviceId
  const tvCollectionRef = deviceId ? collection(dataBase, deviceId) : null;

  // Query to get the latest document (based on timestamp or any other field)
  const tvQuery = tvCollectionRef
    ? query(tvCollectionRef, orderBy('timestamp', 'desc'), limit(1))
    : null;

  // Real-time listener for Firestore data if deviceId exists
  useEffect(() => {
    if (!tvQuery) return;

    const unsubscribe = onSnapshot(tvQuery, (snapshot) => {
      // Get the latest document
      const latestData = snapshot.docs[0]?.data();
      console.log(latestData); // Log the latest data for debugging

      setCollectionData(latestData); // Set the data to state
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [tvQuery]);

  // Handle loading and error states
  if (error) {
    return <p className="text-lg text-red-500">{error}</p>;
  }

  if (!adminId && !deviceId) {
    return <p className="text-lg text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto text-center bg-black rounded-lg shadow-xl p-4">
        <h1 className="text-3xl font-bold text-white mb-4">TV Screen</h1>

        {/* Display the media content */}
        {!collectionData ? (
          <p className="text-lg text-gray-500">Loading media...</p>
        ) : (
          <div className="relative">
            {/* Display Image */}
            {collectionData.media && collectionData.media.includes('image') && !collectionData.media.includes('gif') && (
              <img
                src={collectionData.media}
                alt="Uploaded"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            {/* Display Video */}
            {collectionData.media && collectionData.media.includes('video') && (
              <video className="w-full h-64 object-cover rounded-lg" controls>
                <source src={collectionData.media} />
                Your browser does not support the video tag.
              </video>
            )}
            {/* Display GIF */}
            {collectionData.media && collectionData.media.includes('gif') && (
              <img
                src={collectionData.media}
                alt="Uploaded GIF"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TVScreen;
