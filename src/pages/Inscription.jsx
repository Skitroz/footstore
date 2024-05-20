import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Inscription() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/inscription', {
                username,
                password
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Il y a une erreur lors de l'inscription :", error);
        }
    };

    return (
        <section>
            <div className="flex flex-col items-center justify-center px-6 py-8">
                <div className="bg-blue-800 rounded-lg">
                    <h2 className="text-center my-3 text-2xl font-semibold text-white">
                        FootStore
                    </h2>
                    <div className="w-full bg-blue-600 shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Inscription
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Votre nom d'utilisateur"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Mot de passe</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[326px] p-2.5"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-800 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    style={{
                                        WebkitClipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
                                        clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
                                        padding: '4px 15px'
                                    }}
                                >
                                    Inscription
                                </button>
                                <p className="text-sm font-light text-white">
                                    Déjà un compte ? <Link to="/connexion" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Connectez-vous</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}