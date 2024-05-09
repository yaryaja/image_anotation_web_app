import React, { useState, useEffect } from 'react';

function ShowAllImages() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Make a GET request to fetch all images
        fetch('http://localhost:5000/allimages')
            .then(response => response.json())
            .then(data => {
                // Set the fetched images to the state
                setImages(data);
            })
            .catch(error => console.error('Error fetching images:', error));
    }, []);
    
    
    return (
        <div>
            <h2>All Images</h2>
            <div className="image-container">
               
                {/* Iterate over the images array */}
                {images.map(image => (
                    <img
                        key={image._id}
                        src={`http://localhost:5000/${image.filename}`}
                        alt={image.filename}
                        className="image-item"
                    />
                ))}
            </div>
        </div>

    );
}

export default ShowAllImages;
