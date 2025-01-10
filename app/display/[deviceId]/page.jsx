'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { dataBase } from '@/config/firebase';
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setDeviceType } from '@/redux/slices/tvSlice';

const TVScreen = () => {
  const [collectionData, setCollectionData] = useState(null);
  const [error, setError] = useState(null);
  const[load,setLoad]=useState(false);
  const router = useRouter();

  const adminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null;
  const deviceId = typeof window !== 'undefined' ? localStorage.getItem('deviceId') : null;
  const dispatch=useDispatch();
  const deviceType=useSelector((state)=>state.tvReducer.deviceType);

  useEffect(() => {
    const validateAdminId = async () => {
      try {
        if (adminId) {
          dispatch(setDeviceType("Admin"))
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
    dispatch(setDeviceType("TV"))

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

  if (error) {
    return <p className="text-lg text-red-500">{error}</p>;
  }

  if (!adminId && !deviceId) {
    return <p className="text-lg text-gray-500"><Loader className='w-10 h-10 animate-spin  mx-auto' /></p>;
  }

  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 w-screen h-screen flex items-center justify-center">
      <div className="w-full h-full text-center flex flex-col items-center justify-center">
        
  
        {!collectionData ? (
          <p className="text-lg text-gray-400">
            <Loader className="w-12 h-12 animate-spin mx-auto text-blue-500" />
          </p>
        ) : (
          <div className="relative w-full h-full bg-black overflow-hidden">
           
            {collectionData.media &&
              collectionData.media.includes("image") &&
              !collectionData.media.includes("gif") && (
                <img
                  src={collectionData.media}
                  alt="Uploaded"
                  className="w-full h-full object-fit"
                />
              )}
            
            {collectionData.media &&
              collectionData.media.includes("video") && (
                <video
                  className="w-full h-full object-fit"
                  controls
                  autoPlay
                  loop
                  muted
                >
                  <source src={collectionData.media} />
                  Your browser does not support the video tag.
                </video>
              )}
           
            {collectionData.media &&
              collectionData.media.includes("gif") && (
                <img
                  src={collectionData.media}
                  alt="Uploaded GIF"
                  className="w-full h-full object-fit"
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
  
  
  
};

export default TVScreen;
