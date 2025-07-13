import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import Navbar from '../components/Navbar';

export default function MainLayout() {
    const [menuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        if (window.innerWidth < 768) {
            setMenuOpen(false);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar toggleMenu={toggleMenu} />

            <div className="flex flex-1 overflow-hidden">
                {menuOpen && <SideMenu />}

                {/* 主內容區域 */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 dark:text-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
