'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated import
import { dataBase } from '../../config/firebase'; // Firestore config
import { collection, query, where, getDocs } from 'firebase/firestore';

const TVDisplayPage = () => {
  const router = useRouter(); // Correctly initialize router
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const validateAdminOrDeviceId = async () => {
      const storedAdminId = localStorage.getItem('adminId');
      const storedDeviceId = localStorage.getItem('deviceId');

      if (storedAdminId) {
        try {
          const q = query(
            collection(dataBase, 'admin'),
            where('ID', '==', storedAdminId)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            router.push('/home');
            return;
          } else {
            setError('Invalid Admin ID. Please log in again.');
          }
        } catch (error) {
          console.error('Error validating Admin ID:', error);
          setError('An error occurred while validating Admin ID.');
        }
      } else if (storedDeviceId) {
        try {
          const q = query(
            collection(dataBase, 'registeredTV'),
            where('ID', '==', storedDeviceId)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            router.push(`/display/${storedDeviceId}`);
            return;
          } else {
            setError('Invalid Device ID.');
          }
        } catch (error) {
          console.error('Error validating Device ID:', error);
          setError('An error occurred while validating Device ID.');
        }
      } else {
        setShowInput(true);
      }
      setValidating(false);
    };

    validateAdminOrDeviceId();
  }, [router]);

  const handleIdSubmit = async (e) => {
    e.preventDefault();

    const enteredId = e.target.inputId.value.trim();
    setInputId(enteredId);
    setLoading(true);
    setError(null);

    try {
      const adminQuery = query(
        collection(dataBase, 'admin'),
        where('ID', '==', enteredId)
      );
      const adminSnapshot = await getDocs(adminQuery);

      if (!adminSnapshot.empty) {
        localStorage.setItem('adminId', enteredId);
        router.push('/home');
        return;
      }

      const tvQuery = query(
        collection(dataBase, 'registeredTV'),
        where('ID', '==', enteredId)
      );
      const tvSnapshot = await getDocs(tvQuery);

      if (!tvSnapshot.empty) {
        localStorage.setItem('deviceId', enteredId);
        router.push(`/display/${enteredId}`);
        return;
      }

      setError('Invalid ID. Please enter a valid Admin ID or Device ID.');
    } catch (error) {
      console.error('Error validating ID:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto text-center bg-black rounded-lg shadow-xl p-4">
        {validating ? (
          <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-4">
              {loading
                ? 'Validating your ID...'
                : inputId
                ? `Welcome ${inputId}`
                : 'Please Enter Your Admin or Device ID'}
            </h1>

            {showInput && (
              <form onSubmit={handleIdSubmit}>
                <input
                  type="text"
                  name="inputId"
                  placeholder="Enter Admin or Device ID"
                  className="p-2 mb-4 text-black"
                  required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Submit
                </button>
              </form>
            )}

            {error && <p className="text-lg text-red-500">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default TVDisplayPage;
