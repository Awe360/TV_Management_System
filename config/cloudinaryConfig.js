import { v2 as cloudinary } from 'cloudinary';

// Set up Cloudinary with your cloud name, API key, and secret
cloudinary.config({
  cloud_name: 'dtinrmkcf',
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: 'A6ch0xk3o9dY7N8AfbCNFYduDwg'
});

export default cloudinary;
