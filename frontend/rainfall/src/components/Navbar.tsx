interface Props {
    toggleMenu: () => void;
}

export default function Navbar({ toggleMenu }: Props) {

    return (
        <header className="h-14 bg-white dark:bg-gray-900 shadow flex items-center justify-between px-4">
            {/* ☰ 漢堡按鈕 */}
            <button
                onClick={toggleMenu}
                className="text-2xl text-gray-700 dark:text-gray-200 focus:outline-none transition"
            >
                ☰
            </button>
            <h1 className="text-lg font-semibold text-black dark:text-white">氣象資料系統</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">製作者：HungTing</div>
        </header>
    );
}
