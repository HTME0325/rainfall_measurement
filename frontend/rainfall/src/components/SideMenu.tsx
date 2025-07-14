import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const menuItems = [
    {
        label: '雨量查詢',
        children: [
            { label: '🌧️ 歷史雨量資料', path: '/home' },
            { label: '📈 雨量折線圖', path: '/trend' },
        ],
    },
];

export default function SideMenu() {
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="w-52 bg-white border-r dark:bg-gray-900 dark:border-gray-700 h-full flex flex-col px-4 py-6">
            <h2 className="text-lg font-bold mb-4 dark:text-gray-100">功能選單</h2>

            <nav className="flex-1 space-y-4">
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {item.label}
                        </h3>
                        <ul className="space-y-1 pl-2">
                            {item.children.map((child, i) => (
                                <li key={i}>
                                    <Link
                                        to={child.path}
                                        className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="pt-4 mt-auto">
                <button
                    onClick={toggleTheme}
                    className="w-full px-3 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                    切換為{theme === 'dark' ? '🌞 淺色' : '🌙 深色'}模式
                </button>
            </div>
        </aside>
    );
}
