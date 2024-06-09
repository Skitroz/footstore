import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BG from '../img/france.jpeg';

const Product = ({ image, altText, buttonText, buttonStyles, title, price }) => (
  <div className="flex justify-center flex-col items-center mt-4">
    <img src={image} alt={altText} />
    <h3 className='text-lg font-medium mb-[-5px] text-center'>{title}</h3>
    <p className='text-md'>{price} €</p>
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

  const newProducts = products.filter(product => product.isNew);

  return (
    <>
      <img src={BG} alt="" width={1600} className="mx-auto" />
      <h1 className="text-center text-3xl font-bold my-4">Nouveauté</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-[100px]'>
        {newProducts.map(product => (
          <Product 
            key={product.id}
            image={product.images[0]?.url}
            altText={product.name}
            title={product.name}
            price={product.price}
            buttonText="Commander"
            buttonStyles={buttonStyles}
          />
        ))}
      </div>
    </>
  );
}
