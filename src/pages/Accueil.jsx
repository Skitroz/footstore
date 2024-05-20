import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BG from '../img/france.jpeg';

const Product = ({ image, altText, buttonText, buttonStyles }) => (
  <div className="flex justify-center flex-col items-center mt-4">
    <img src={image} alt={altText} />
    <button className="text-white bg-blue-800 mt-1 text-xl" style={buttonStyles}>
      {buttonText}
    </button>
  </div>
);

const buttonStyles = {
  WebkitClipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
  clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
  padding: '4px 15px'
};

export default function Accueil() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/produit')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Une erreur est survenue :", error);
      });
  }, []);

  return (
    <>
      <img src={BG} alt="" width={1600} className="mx-auto" />
      <h1 className="text-center text-3xl font-bold my-4">Nouveauté</h1>
      <div className='grid grid-cols-6 grid-flow-col'>
        {products.map(product => (
          <Product 
            key={product.id}
            image={product.image_url}
            altText={product.alt_text}
            buttonText="Commander"
            buttonStyles={buttonStyles}
          />
        ))}
      </div>
    </>
  );
}
