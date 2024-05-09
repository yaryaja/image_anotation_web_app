import Image from './Image';
import './ShowImage.css'; // Import CSS file for styling

const ShowImage = ({ images }) => {
  const show = (image, index) => {
    return <Image key={index} image={image} />;
  };

  return (
    <div className="container">
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            {show(image, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowImage;


// import Image from './Image';
// import './ShowImage.css';

// const ShowImage = ({ images }) => {
//   const show = (image, index) => {
//     // Modify the src attribute to fetch the image from the backend
//     const src = `/images/${image}`;
//     return <Image key={index} src={src} alt={image} />;
//   };

//   return (
//     <div className="container">
//       <div className="image-grid">
//         {images.map((image, index) => (
//           <div key={index} className="image-item">
//             {show(image, index)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ShowImage;