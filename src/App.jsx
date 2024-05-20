import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Accueil from "./pages/Accueil";
import Nouveaute from "./pages/Nouveaute";
import Produit from "./pages/Produit";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardUser from "./pages/DashboardUser";
import axios from 'axios';

function App() {

  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(response.data.role);
        } catch (error) {
          console.error('Erreur lors de la récupération du rôle :', error);
        }
      }
    };
    fetchRole();
  }, []);


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Accueil />} />
            <Route path="/nouveaute" element={<Nouveaute />} />
            <Route path="/produit" element={<Produit />} />
            <Route path="/connexion" element={<Connexion />} />
            {role === 'admin' ? (
              <Route path="/dashboard" element={<DashboardAdmin />} />
            ) : (
              <Route path="/dashboard" element={<DashboardUser />} />
            )}
            <Route path="/inscription" element={<Inscription />} />
          </Route>
        </Routes >
      </BrowserRouter >
    </>
  );
}

export default App;
