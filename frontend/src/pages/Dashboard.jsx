import { useEffect, useState } from 'react';
import { dashboardAPI } from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

function SummaryCard({ label, amount, colorClass, icon }) {
    return (
        <div className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-text-muted text-sm">{label}</p>
                <p className="text-2xl font-bold text-text-main">
                    ₹{Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.get()
            .then(res => setData(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-text-muted">Loading dashboard…</div>
    );

    const monthlyChartData = data?.monthlyData?.map(d => ({
        name: MONTH_NAMES[d.month],
        Income: Number(d.income),
        Expense: Number(d.expense),
    })) || [];

    const pieData = data?.categoryData?.map(c => ({
        name: c.category, value: Number(c.amount)
    })).filter(d => d.value > 0) || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>
                <p className="text-text-muted text-sm mt-1">Your financial overview</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    label="Total Income"
                    amount={data?.totalIncome}
                    colorClass="bg-emerald-500/10 text-emerald-400"
                    icon="↑"
                />
                <SummaryCard
                    label="Total Expense"
                    amount={data?.totalExpense}
                    colorClass="bg-red-500/10 text-red-400"
                    icon="↓"
                />
                <SummaryCard
                    label="Net Balance"
                    amount={data?.balance}
                    colorClass="bg-primary-500/10 text-primary-400"
                    icon="💰"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-lg font-semibold text-text-main mb-4">Income vs Expense (6 months)</h2>
                    {monthlyChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={monthlyChartData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                                <Tooltip
                                    contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 12 }}
                                    labelStyle={{ color: '#f4f4f5', fontWeight: 600 }}
                                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, undefined]}
                                />
                                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-text-muted text-sm text-center py-12">No data yet. Add some transactions!</p>}
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-text-main mb-4">Expenses by Category (This Month)</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false} fontSize={11}>
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 12 }}
                                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, undefined]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-text-muted text-sm text-center py-12">No expense data for this month</p>}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-text-main mb-4">Recent Transactions</h2>
                {data?.recentTransactions?.length > 0 ? (
                    <div className="space-y-3">
                        {data.recentTransactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-3 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{tx.categoryIcon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-text-main">{tx.categoryName}</p>
                                        <p className="text-xs text-text-muted">{tx.description || '—'} · {tx.date}</p>
                                    </div>
                                </div>
                                <span className={tx.type === 'INCOME' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                                    {tx.type === 'INCOME' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-text-muted text-sm">No recent transactions.</p>}
            </div>
        </div>
    );
}
