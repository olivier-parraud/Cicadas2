// layouts/MainLayout.jsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function MainLayout() {
    const { pathname } = useLocation();

    // Replacer le scroll en haut de page à chaque changement d'URL / redirection
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname]);

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;