import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    RiDashboardLine, RiExchangeDollarLine, RiPieChartLine,
    RiWalletLine, RiFileChartLine, RiLogoutBoxLine
} from 'react-icons/ri';

const links = [
    { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { to: '/transactions', icon: RiExchangeDollarLine, label: 'Transactions' },
    { to: '/categories', icon: RiPieChartLine, label: 'Categories' },
    { to: '/budget', icon: RiWalletLine, label: 'Budget' },
    { to: '/reports', icon: RiFileChartLine, label: 'Reports' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="w-64 h-screen bg-surface-2 border-r border-surface-3 flex flex-col fixed left-0 top-0">
            <div className="px-6 py-5 border-b border-surface-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-lg">₹</div>
                    <div>
                        <p className="font-bold text-text-main text-sm leading-tight">Money Manager</p>
                        <p className="text-text-muted text-xs">Personal Finance</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 py-4 border-t border-surface-3">
                <div className="flex items-center gap-3 px-4 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-main truncate">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-400">
                    <RiLogoutBoxLine size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
