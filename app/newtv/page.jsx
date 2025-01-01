'use client'

import React, { useState } from 'react';
import { dataBase } from '../../config/firebase'; // Your Firebase configuration file
import { collection, addDoc } from 'firebase/firestore';

const RegisterTVPage = () => {
  const [tvData, setTvData] = useState({
    ID: '',
    model: '',
    size: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTvData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tvData.ID || !tvData.model || !tvData.size) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      // Add TV to the 'registeredTV' collection
      const tvCollectionRef = collection(dataBase, 'registeredTV');
      await addDoc(tvCollectionRef, tvData);

      // Create a new collection with the TV ID and add a document inside it
      const newTvCollectionRef = collection(dataBase, tvData.ID); // Use TV ID as collection name
      await addDoc(newTvCollectionRef, {
        status: 'active', // Example initial data
        registeredAt: new Date(),
      });

      setMessage('TV registered successfully!');
      setTvData({ ID: '', model: '', size: '' }); // Clear the form
    } catch (error) {
      console.error('Error registering TV:', error);
      setMessage('Failed to register TV. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Register New TV</h1>
        {message && <p className="text-center text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="ID" className="block text-sm font-medium mb-1">
              TV ID
            </label>
            <input
              type="text"
              name="ID"
              id="ID"
              value={tvData.ID}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium mb-1">
              Model
            </label>
            <input
              type="text"
              name="model"
              id="model"
              value={tvData.model}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="size" className="block text-sm font-medium mb-1">
              Size
            </label>
            <input
              type="text"
              name="size"
              id="size"
              value={tvData.size}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Register TV
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTVPage;
