import React from 'react'
import { Link, Outlet } from "react-router-dom";
import SearchBar from './components/SearchBar';

export default function Layout() {
    return (
        <>
            <SearchBar />
            <nav className='flex justify-center items-center'>
                <ul className='flex my-4 text-xl'>
                    <li className='border py-2 px-4'>
                        <Link to="/">Accueil</Link>
                    </li>
                    <li className='border-y border-r py-2 px-4'>
                        <Link to="/nouveaute">Nouveauté</Link>
                    </li>
                    <li className='border-y border-r py-2 px-4'>
                        <Link to="/produit">Produit</Link>
                    </li>
                    <li className='border-y border-r py-2 px-4'>
                        <Link to="/produit">Joueur</Link>
                    </li>
                    <li className='border-y border-r py-2 px-4'>
                        <Link to="/produit">Rétro</Link>
                    </li>
                    <li className='border-y border-r py-2 px-4'>
                        <Link to="/produit">Enfant</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
}
