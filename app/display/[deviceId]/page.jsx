'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataBase } from '../../../config/firebase'; // Adjust the path as needed
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';

const TVScreen = () => {
  const [collectionData, setCollectionData] = useState(null); // Store fetched data
  const [error, setError] = useState(null); // Store errors if any
  const router = useRouter();

  // Retrieve adminId and deviceId from localStorage
  const adminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null;
  const deviceId = typeof window !== 'undefined' ? localStorage.getItem('deviceId') : null;

  useEffect(() => {
    const validateAdminId = async () => {
      try {
        if (adminId) {
          const adminDocRef = doc(dataBase, 'admin', adminId);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists()) {
            console.log('Admin ID is valid:', adminDocSnap.data());
            router.push('/home');
          } else {
            setError('Invalid Admin ID');
          }
        } else if (!deviceId) {
          setError('No Admin ID or Device ID found in localStorage');
        }
      } catch (err) {
        console.error('Error validating adminId:', err);
        setError('Error validating Admin ID');
      }
    };

    validateAdminId();
  }, [adminId, deviceId, router]);

  useEffect(() => {
    if (!deviceId) return;

    const tvCollectionRef = collection(dataBase, deviceId);
    const tvQuery = query(tvCollectionRef, orderBy('timestamp', 'desc'), limit(1));

    const unsubscribe = onSnapshot(tvQuery, (snapshot) => {
      if (!snapshot.empty) {
        const latestData = snapshot.docs[0].data();
        console.log('Latest Data:', latestData);
        setCollectionData(latestData);
      } else {
        setCollectionData(null);
      }
    });

    return () => unsubscribe();
  }, [deviceId]);

  // Render loading or error states
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
