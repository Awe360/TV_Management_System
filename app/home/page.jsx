"use client"

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { dataBase } from '../../config/firebase'; 
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTvCount } from '@/redux/slices/tvSlice';

const HomePage = () => {
  const [tvOptions, setTvOptions] = useState([]);
  const [selectedTV, setSelectedTV] = useState('');
  const [currentMedia, setCurrentMedia] = useState(null);
  const[isLoading,setIsLoading]=useState(false);
  const[temp,setTemp]=useState(0);
  const dispatch=useDispatch();
  const totTv=useSelector((state)=>state.tvReducer.totTV);
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(dataBase, 'registeredTV'), (snapshot) => {
      const tvs = snapshot.docs.map(doc => doc.data().ID);
      console.log("awoke:",tvs.length)
      setTvOptions(tvs);
      setTemp(tvs.length);
      dispatch(setTvCount(tvs.length));
      
      if (tvs.length > 0) setSelectedTV(tvs[0]); 
    });
    
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    if (!selectedTV) return;
    const unsubscribe = onSnapshot(collection(dataBase, selectedTV), (snapshot) => {
      const media = snapshot.docs.map(doc => doc.data());
      setCurrentMedia(media[0] || null); 
    });

    return () => unsubscribe();
  }, [selectedTV]);

  const mediaTypeValid = (mediaType, prefix) => {
    return mediaType && mediaType.startsWith(prefix);
  };
  console.log("total tv:",totTv);
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center  ">
      {/* Header */}
      <header className="text-4xl font-semibold text-gray-800 pt-5 w-full ">
        <h1 className='bg-yellow-400 py-2 font-bold text-center font-serif'>Welcome to the Media Upload System</h1>
      </header>
      {temp>0 ? <div className="bg-green-500 text-white text-3xl p-2 w-full text-center">Total Registered TVs:<span className='text-blue-500 font-bold font-mono text-3xl mx-2 '>{totTv}</span></div>:null}
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
            <video controls className="mx-auto rounded-lg shadow-md" width="500">
              <source src={currentMedia.media} type={currentMedia.mediaType} />
              Your browser does not support the video tag.
            </video>
          ) : currentMedia.mediaType === 'image/gif' ? (
            <img src={currentMedia.media} alt="Current GIF" className="mx-auto rounded-lg shadow-md" />
          ) : (
            <Loader className='w-10 h-10 animate-spin  mx-auto' />
          )
        ) : (
          <Loader className='w-10 h-10 animate-spin  mx-auto' />
        )}
      </div>

     
      <div>

      </div>
    </div>
  );
};

export default HomePage;
