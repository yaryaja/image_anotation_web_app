import React, { useEffect, useState } from 'react';
import ShowImage from './ShowImage';

const ImageFetcher = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from the backend
    fetch('/api/images')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  return <ShowImage images={images} />;
};

export default ImageFetcher;