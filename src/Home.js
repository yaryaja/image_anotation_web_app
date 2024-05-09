import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import ShowImage from './ShowImage';
import DropBox from './DropBox';
import Navbar from './navbar';

function Home() {
    const [images, setImages] = useState([]);
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
	const [selectedLabel, setSelectedLabel] = useState(''); // State to store the selected label
	const [anotation,setAnotation]=useState({})
    const navigate = useNavigate(); // Initialize useNavigate hook
    const labels = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck'];

    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        if (token) {
            setLoggedIn(true);
        } else {
            // If no token, navigate to authentication page
            navigate('/');
        }
    }, [navigate]);


	const showAllImages = () => {
		navigate('/ShowImage'); // Navigate to the 'allimages' route
	};
  


	const onDrop = useCallback((files) => {
	  setAcceptedFiles(files);
	  setSelectedLabel('');
	  files.forEach((file, index) => {
		const reader = new FileReader();
		reader.onload = function (e) {
		  setImages((prevState) => [
			...prevState,
			{ id: index, src: e.target.result },
		  ]);
		};
		reader.readAsDataURL(file);
	  });
	}, []);


	
  
	const uploadFiles = useCallback(async () => {
		const formData = new FormData();
		acceptedFiles.forEach((file) => {
		  formData.append('images', file, file.name);
		//   filenames.append(file.name)
		//   console.log("filenames",filenames)
		});

		for (const [filePath, annotation] of Object.entries(anotation)) {
			formData.append('annotations', JSON.stringify({ filePath, annotation }));
		  }
		
		try {
			const response = await fetch('http://localhost:5000/', {
				method: 'POST',
				body: formData,
			});
			// console.log("resonse",response.data)
		
			
			
			if (response.status==200) {
				console.log("updated succesfully")
				// Fetch the updated list of images from the backend
				// No need to update the state here, as ImageFetcher will handle it
				// setShouldFetchImages(true);
			} else {
				console.error('Error uploading files:', response.status);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}, [acceptedFiles,anotation]);

    return (
        <div className="App">
			<Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <DropBox onDrop={onDrop} anotation={anotation} setAnotation={setAnotation} />
            <ShowImage images={images} />
            <div>
                {images.length > 0 && (
                    <div>
                        <button className="btn btn-primary" onClick={uploadFiles}>
                            Upload
                        </button>
                    </div>
                )}
            </div>
			<div>
				<button className="btn btn-primary" onClick={showAllImages}>
					All Images
				</button>
			</div>
        </div>
    );
}

export default Home;
