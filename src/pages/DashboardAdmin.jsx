import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'user', password: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', images: [{ image_url: '' }] });
  const [imageURLs, setImageURLs] = useState(['']);
  const [selectedTable, setSelectedTable] = useState('users');
  const [isAdded, setIsAdded] = useState(false);
  const [addUser, setAddUser] = useState('false');
  const [isProductAdded, setIsProductAdded] = useState(false);
  const [addProduct, setAddProduct] = useState('false');
  const [editUser, setEditUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const handleUpdateProduct = async (id) => {
    try {
      await axios.put(`http://localhost:3001/produit/${id}`, editedProduct);
      fetchProducts();
      setEditProduct(null);
      toast.success('Produit mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      toast.error('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
    }
  };


  const handleImageChange = (index, value) => {
    const newImages = [...newProduct.images];
    newImages[index] = value;
    setNewProduct({ ...newProduct, images: newImages });

    const newImageURLs = [...imageURLs];
    newImageURLs[index] = value;
    setImageURLs(newImageURLs);
  };

  const handleUpdateUser = (id) => {
    fetch(`http://localhost:3001/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedUser)
    })
      .then(response => {
        if (response.ok) {
          console.log('Utilisateur mis à jour avec succès !');
          setEditUser(null);
        } else {
          throw new Error('Échec de la mise à jour de l\'utilisateur');
        }
      })
      .catch(error => console.error(error));
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error('Erreur lors de la récupération des utilisateurs. Veuillez réessayer.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/produit');
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      toast.error('Erreur lors de la récupération des produits. Veuillez réessayer.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/users', newUser);
      fetchUsers();
      setNewUser({ username: '', email: '', role: 'user', password: '' });
      toast.success('Utilisateur ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      toast.error('Erreur lors de l\'ajout de l\'utilisateur. Veuillez réessayer.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(newProduct))
    try {
      const response = await fetch('http://localhost:3001/produit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: '', price: '', images: [] });
        setImageURLs(['']);
        toast.success('Produit ajouté avec succès !');
      } else {
        throw new Error('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast.error('Erreur lors de l\'ajout du produit. Veuillez réessayer.');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      fetchUsers();
      toast.success('Utilisateur supprimé avec succès !')
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur. Veuillez réessayer.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/produit/${productId}`);
      fetchProducts();
      toast.success('Produit supprimé avec succès !')
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      toast.error('Erreur lors de la suppression du produit. Veuillez réessayer.');
    }
  };

  const handleRemoveImageField = (index) => {
    const newImages = newProduct.images.filter((_, i) => i !== index);
    const newImageURLs = imageURLs.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, images: newImages });
    setImageURLs(newImageURLs);
  };

  const handleAddImageField = () => {
    setImageURLs([...imageURLs, '']);
  };

  const handleButtonClick = () => {
    setIsAdded(!isAdded);
    setAddUser(isAdded ? 'false' : 'true');
  };

  const handleButtonProductClick = () => {
    setIsProductAdded(!isProductAdded);
    setAddProduct(isProductAdded ? 'false' : 'true');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="flex justify-center space-x-4 mt-8 mb-4">
        <button onClick={() => setSelectedTable('users')} className={`px-4 py-2 ${selectedTable === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Utilisateurs</button>
        <button onClick={() => setSelectedTable('products')} className={`px-4 py-2 ${selectedTable === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Produits</button>
      </div>

      {selectedTable === 'users' && (
        <section>
          <div className='flex justify-center items-center gap-4'>
            <h2 className='text-center text-xl my-6 underline'>Gestion des utilisateurs</h2>
            <button
              onClick={handleButtonClick}
              className="px-4 py-2"
            >
              {isAdded ? <IoRemoveCircle className='text-red-600 text-xl' /> : <IoAddCircle className='text-green-600 text-xl' />}
            </button>
          </div>
          {addUser === 'true' && (
            <form onSubmit={handleAddUser} className="max-w-sm mx-auto mb-4">
              <div className="mb-5">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Nom d'utilisateur"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Mot de passe"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
              </div>
              <div className="mb-5">
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Rôle</label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <button
                type="submit"
                className="text-white mb flex mx-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Ajouter un utilisateur
              </button>
            </form>
          )}
          <div className="relative overflow-x-auto mx-12 shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                <tr>
                  <th scope="col" className="px-6 py-3">Nom d'utilisateur</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Rôle</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id} className="bg-white border-b  hover:bg-gray-50 ">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {editUser && editUser.id === user.id ? (
                        <input
                          type="text"
                          value={editedUser.username}
                          onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                        />
                      ) : (
                        user.username
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editUser && editUser.id === user.id ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editUser && editUser.id === user.id ? (
                        <select
                          value={editedUser.role}
                          onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editUser && editUser.id === user.id ? (
                        <input
                          type="password"
                          value={editedUser.password}
                          onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                        />
                      ) : (
                        user.password
                      )}
                      {editUser && editUser.id === user.id ? (
                        <button onClick={() => handleUpdateUser(user.id)} className="ml-4 text-green-600 hover:text-green-900">
                          Valider
                        </button>
                      ) : (
                        <>
                          <button onClick={() => {
                            setEditUser(user);
                            setEditedUser(user);
                          }} className="text-indigo-600 hover:text-indigo-900">
                            Modifier
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 ml-2">
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="px-4 py-2 mx-1 bg-gray-200 text-gray-700"
                >
                  Précédent
                </button>
              )}
              {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === Math.ceil(users.length / usersPerPage) ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-4 py-2 mx-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === currentPage - 3 && currentPage > 4) ||
                  (page === currentPage + 3 && currentPage < Math.ceil(users.length / usersPerPage) - 3)
                ) {
                  return (
                    <span key={page} className="px-4 py-2 mx-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              {currentPage < Math.ceil(users.length / usersPerPage) && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="px-4 py-2 mx-1 bg-gray-200 text-gray-700"
                >
                  Suivant
                </button>
              )}
            </div>
          </div>

        </section>
      )}

      {selectedTable === 'products' && (
        <section>
          <div className='flex justify-center items-center gap-4'>
            <h2 className='text-center text-xl my-6 underline'>Gestion des produits</h2>
            <button
              onClick={handleButtonProductClick}
              className="px-4 py-2"
            >
              {isProductAdded ? <IoRemoveCircle className='text-red-600 text-xl' /> : <IoAddCircle className='text-green-600 text-xl' />}
            </button>
          </div>
          {addProduct === 'true' && (
            <form onSubmit={handleAddProduct} className="max-w-sm mx-auto mb-4">
              <div className="mb-5">
                <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900">Nom du produit</label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Nom du produit"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="productDescription" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                <textarea
                  id="productDescription"
                  placeholder="Description du produit"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="productPrice" className="block mb-2 text-sm font-medium text-gray-900">Prix</label>
                <input
                  type="number"
                  id="productPrice"
                  placeholder="Prix"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              {imageURLs.map((imageURL, index) => (
                <div key={index} className="mb-5">
                  <label htmlFor={`productImageUrl${index}`} className="block mb-2 text-sm font-medium text-gray-900">URL de l'image {index + 1}</label>
                  <input
                    type="text"
                    id={`productImageUrl${index}`}
                    placeholder="URL de l'image"
                    value={imageURL}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageField(index)}
                      className="text-red-600 hover:underline mt-2"
                    >
                      Supprimer l'image
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageField}
                className="text-blue-600 hover:underline mb-4"
              >
                Ajouter une autre image
              </button>
              <div className="mb-5">
                <label htmlFor="productNew" className="block mb-2 text-sm font-medium text-gray-900">Nouveau produit</label>
                <input
                  type="checkbox"
                  id="productNew"
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                />
              </div>
              <button
                type="submit"
                className="text-white flex mx-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Ajouter un produit
              </button>
            </form>
          )}
          <div className="relative overflow-x-auto mx-12 shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                <tr>
                  <th scope="col" className="px-6 py-3">Nom</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Prix</th>
                  <th scope="col" className="px-6 py-3">Image</th>
                  <th scope="col" className="px-6 py-3">Nouveau</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">{product.price}</td>
                    <td className="px-6 py-4 flex">
                      {product.images.map((image, index) => (
                        <img key={index} src={image.url} alt={`Image ${index + 1}`} className="h-12 w-12 object-cover mr-2" />
                      ))}
                    </td>
                    <td className="px-6 py-4">{product.isNew ? 'Oui' : 'Non'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDeleteProduct(product.id)} className="font-medium text-red-600  hover:underline">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="px-4 py-2 mx-1 bg-gray-200 text-gray-700"
                >
                  Précédent
                </button>
              )}
              {Array.from({ length: Math.ceil(products.length / usersPerPage) }, (_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === Math.ceil(products.length / usersPerPage) ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-4 py-2 mx-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === currentPage - 3 && currentPage > 4) ||
                  (page === currentPage + 3 && currentPage < Math.ceil(products.length / usersPerPage) - 3)
                ) {
                  return (
                    <span key={page} className="px-4 py-2 mx-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              {currentPage < Math.ceil(products.length / usersPerPage) && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="px-4 py-2 mx-1 bg-gray-200 text-gray-700"
                >
                  Suivant
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
