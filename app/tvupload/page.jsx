'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { dataBase } from '../../config/firebase'; // Import Firestore config
import { collection, addDoc, getDocs, deleteDoc, query, limit, serverTimestamp } from 'firebase/firestore';

const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(''); // Initialized as empty string to prevent undefined
  const [name, setName] = useState('');
  const [existingFile, setExistingFile] = useState(null);
  const [selectedTV, setSelectedTV] = useState('TV1'); // Default to TV1
  const [tvOptions, setTvOptions] = useState([]);

  const fetchCollection = (tvName) => {
    return collection(dataBase, tvName); // Return collection reference based on TV selection
  };

  const tvDisplayRef = fetchCollection(selectedTV); // Fetch the correct collection based on the selected TV

  // Fetch the existing file when the component mounts
  useEffect(() => {
    const fetchExistingFile = async () => {
      const querySnapshot = await getDocs(tvDisplayRef);
      querySnapshot.forEach((docSnapshot) => {
        setExistingFile(docSnapshot.data()); // Assuming only one file is stored
      });
    };
    fetchExistingFile();
  }, [selectedTV]); // Run when TV selection changes

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMediaType(selectedFile?.type); // Ensure mediaType is set
  };

  const handleDeleteExistingDocument = async () => {
    try {
      const q = query(tvDisplayRef, limit(1)); // Query for the existing document
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0]; // Get the first (and only) document
        console.log('Deleting existing document:', docToDelete.id);
        await deleteDoc(docToDelete.ref); // Delete the document
      }
    } catch (error) {
      console.error('Error deleting existing document:', error);
      throw new Error('Failed to delete the existing document');
    }
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);

      // First, delete the previous file (if any)
      try {
        await handleDeleteExistingDocument();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'react-upload'); // Replace with your Cloudinary upload preset

        let uploadUrl;
        if (mediaType.startsWith('video')) {
          uploadUrl = 'https://api.cloudinary.com/v1_1/dtinrmkcf/video/upload'; // Video upload endpoint
        } else if (mediaType.startsWith('image')) {
          uploadUrl = 'https://api.cloudinary.com/v1_1/dtinrmkcf/image/upload'; // Image upload endpoint
        } else if (mediaType === 'image/gif') {
          uploadUrl = 'https://api.cloudinary.com/v1_1/dtinrmkcf/image/upload'; // GIF upload endpoint (same as images)
        } else {
          alert('Please upload a valid media type (image, video, or GIF).');
          return;
        }

        // Upload the file to Cloudinary
        const { data } = await axios.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const cloudinaryUrl = data.secure_url;
        setMediaUrl(cloudinaryUrl);

        // Save the new media URL and timestamp to Firestore
        await addDoc(tvDisplayRef, {
          name,
          media: cloudinaryUrl,
          mediaType,
          timestamp: serverTimestamp(), // Add timestamp
        });

        alert('Media uploaded and saved successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
    }
  };

useEffect(() => {
  const fetchTvOptions = async () => {
    const querySnapshot = await getDocs(collection(dataBase, 'registeredTV'));
    const tvs = querySnapshot.docs.map(doc => doc.data().ID); // Assuming each TV's ID is stored in the doc ID
    setTvOptions(tvs);
  };
  fetchTvOptions();
}, []);


  return (
    <div className=" md:mx-16">
    <div className=" p-6 rounded-lg shadow-lg min-h-screen grid  grid-cols-2 gap-5 md:gap-1 bg-gray-100 ">
       <div className=" ">
      
      <h2 className="text-3xl font-semibold text-blue-500 mb-6 text-center">Upload Media </h2>

      {/* Dropdown for selecting TV */}
      <div className="mb-4">
        <label htmlFor="tv-select" className="block text-lg font-medium text-gray-700 mb-2">Select TV</label>
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

      <div className="mb-4">
        <label htmlFor="media-name" className="block text-lg font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          id="media-name"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 mb-2">Choose Media</label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
     </div>
      
      <div className="">

      {mediaUrl && mediaType && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-center text-blue-500 mb-4">Uploaded Media Preview</h3>
          <div className="flex justify-center">
            {mediaType.startsWith('image') && !mediaType.includes('gif') && (
              <img src={mediaUrl} alt="Uploaded" width="300" className="rounded-lg shadow-md" />
            )}
            {mediaType.startsWith('video') && (
              <video width="300" controls className="rounded-lg shadow-md">
                <source src={mediaUrl} type={mediaType} />
                Your browser does not support the video tag.
              </video>
            )}
            {mediaType === 'image/gif' && (
              <img src={mediaUrl} alt="Uploaded GIF" width="300" className="rounded-lg shadow-md" />
            )}
          </div>
        </div>
      )}

      {existingFile && !file && (
        <div className="mt-8">
          <h3 className="text-xl text-center font-medium text-blue-500 mb-4">Current Media Preview</h3>
          <div className="flex justify-center">
            {existingFile.media && existingFile.mediaType && (
              <>
                {existingFile.mediaType.startsWith('image') && !existingFile.mediaType.includes('gif') && (
                  <img src={existingFile.media} alt="Existing Media" width="300" className="rounded-lg shadow-md" />
                )}
                {existingFile.mediaType.startsWith('video') && (
                  <video width="300" controls className="rounded-lg shadow-md">
                    <source src={existingFile.media} type={existingFile.mediaType} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {existingFile.mediaType === 'image/gif' && (
                  <img src={existingFile.media} alt="Existing GIF" width="300" className="rounded-lg shadow-md" />
                )}
              </>
            )}
          </div>
        </div>
        
      )}
    </div>
    </div>
    </div>
    
  );
};

export default MediaUpload;