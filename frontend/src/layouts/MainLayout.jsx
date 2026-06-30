// layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
function MainLayout() {
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