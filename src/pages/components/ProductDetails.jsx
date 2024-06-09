import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const badgesData = {
  Ligue1: {
    teams: {
      PSG: ["Ligue 1", "UEFA Foundation"],
      Marseille: ["Ligue 1"],
      Lyon: ["Ligue 1", "UEFA Foundation"],
    },
  },
  PremierLeague: {
    teams: {
      Liverpool: ["Premier League, no room for racism, UEFA Foundation"],
      ManchesterUnited: ["Premier League", "UEFA Foundation"],

    },
  },
};

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [availableBadges, setAvailableBadges] = useState([]);
  const [isFlocage, setIsFlocage] = useState(false);
  const [flocageName, setFlocageName] = useState('');
  const [flocageNumber, setFlocageNumber] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/produit/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du produit :', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (selectedLeague && selectedTeam) {
      setAvailableBadges(badgesData[selectedLeague].teams[selectedTeam] || []);
    } else {
      setAvailableBadges([]);
    }
  }, [selectedLeague, selectedTeam]);

  const handleBadgeChange = (badge) => {
    setSelectedBadges((prevSelectedBadges) =>
      prevSelectedBadges.includes(badge)
        ? prevSelectedBadges.filter((b) => b !== badge)
        : [...prevSelectedBadges, badge]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log({
      size,
      selectedBadges,
      isFlocage,
      flocageName,
      flocageNumber
    });
  };

  if (!product) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='mx-[100px]'>
      <p>{product.description}</p>
      <div className='flex gap-[150px]'>
        <div className="image-gallery">
          <Carousel showThumbs={true} dynamicHeight={false} width={600}>
            {product.images.map((image, index) => (
              <div key={index}>
                <img src={image.url} alt={product.name} />
              </div>
            ))}
          </Carousel>
        </div>
        <div>
          <h1 className='text-2xl font-medium'>{product.name}</h1>
          <p className='font-light'>Vente : {product.products_sold}</p>
          <p className='text-red-800 text-xl font-bold mt-4'>{product.price} €</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="size" className='block mt-2'>Taille :</label>
              <select id="size" value={size} onChange={(e) => setSize(e.target.value)} className='border rounded px-2 py-1'>
                <option value="">Sélectionnez une taille</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <div>
              <label htmlFor="league" className='block mt-2'>Ligue :</label>
              <select id="league" value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className='border rounded px-2 py-1'>
                <option value="">Sélectionnez une ligue</option>
                {Object.keys(badgesData).map((league) => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
            </div>
            {selectedLeague && (
              <div>
                <label htmlFor="team" className='block mt-2'>Équipe :</label>
                <select id="team" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className='border rounded px-2 py-1'>
                  <option value="">Sélectionnez une équipe</option>
                  {Object.keys(badgesData[selectedLeague].teams).map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            )}
            {selectedTeam && (
              <div>
                <label className='block mt-2'>Badges :</label>
                {availableBadges.map((badge) => (
                  <div key={badge}>
                    <label>
                      <input
                        type="checkbox"
                        value={badge}
                        checked={selectedBadges.includes(badge)}
                        onChange={() => handleBadgeChange(badge)}
                      />
                      {badge} (1.00 €)
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div className='mt-2'>
              <label className='block'>Flocage :</label>
              <input
                type="checkbox"
                id="flocage"
                checked={isFlocage}
                onChange={(e) => setIsFlocage(e.target.checked)}
                className='mr-2'
              />
              <label htmlFor="flocage">Ajouter un flocage</label>
            </div>
            {isFlocage && (
              <div>
                <div className='mt-2'>
                  <label htmlFor="flocageName" className='block'>Nom :</label>
                  <input
                    type="text"
                    id="flocageName"
                    value={flocageName}
                    onChange={(e) => setFlocageName(e.target.value)}
                    className='border rounded px-2 py-1 w-full'
                  />
                </div>
                <div className='mt-2'>
                  <label htmlFor="flocageNumber" className='block'>Numéro :</label>
                  <input
                    type="number"
                    id="flocageNumber"
                    value={flocageNumber}
                    onChange={(e) => setFlocageNumber(e.target.value)}
                    className='border rounded px-2 py-1 w-full'
                  />
                </div>
              </div>
            )}
            <button type="submit" className='mt-4 bg-blue-800 text-white px-4 py-2 rounded'>
              Ajouter au panier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
