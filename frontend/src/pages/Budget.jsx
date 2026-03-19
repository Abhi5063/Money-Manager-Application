import { useEffect, useState } from 'react';
import { budgetAPI, categoryAPI } from '../api';
import toast from 'react-hot-toast';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';

function BudgetModal({ open, onClose, onSave, categories }) {
    const [categoryId, setCategoryId] = useState('');
    const [limitAmount, setLimitAmount] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [saving, setSaving] = useState(false);

    if (!open) return null;

    const handleSave = async () => {
        if (!categoryId || !limitAmount) return toast.error('Fill all fields');
        setSaving(true);
        await onSave({ categoryId: parseInt(categoryId), limitAmount: parseFloat(limitAmount), month, year });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main"><RiCloseLine size={20} /></button>
                <h2 className="text-xl font-bold text-text-main mb-5">Set Budget</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Category (Expense)</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input">
                            <option value="">Select category</option>
                            {categories.filter(c => c.type === 'EXPENSE').map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Monthly Limit (₹)</label>
                        <input type="number" value={limitAmount} onChange={e => setLimitAmount(e.target.value)} placeholder="5000" className="input" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Month</label>
                            <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="input">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('en', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Year</label>
                            <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="input" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Set Budget'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Budget() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchData = () => {
        Promise.all([
            budgetAPI.getAll({ month: selectedMonth, year: selectedYear }),
            categoryAPI.getAll()
        ]).then(([bRes, cRes]) => {
            setBudgets(bRes.data);
            setCategories(cRes.data);
            setLoading(false);
        });
    };

    useEffect(() => { fetchData(); }, [selectedMonth, selectedYear]);

    const handleSave = async (data) => {
        try {
            await budgetAPI.create(data);
            toast.success('Budget set!');
            setModalOpen(false);
            fetchData();
        } catch { toast.error('Failed to set budget'); }
    };

    const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Budget Tracker</h1>
                    <p className="text-text-muted text-sm mt-1">Set and track monthly spending limits</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <RiAddLine size={18} /> Set Budget
                </button>
            </div>

            {/* Month Selector */}
            <div className="card flex gap-4 items-center">
                <div>
                    <label className="block text-xs text-text-muted mb-1">Month</label>
                    <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))} className="input !py-2 !text-sm">
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('en', { month: 'long' })}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-text-muted mb-1">Year</label>
                    <input type="number" value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="input !py-2 !text-sm w-28" />
                </div>
            </div>

            {loading ? <p className="text-text-muted">Loading…</p> : budgets.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="text-text-main font-medium">No budgets set for {MONTH_NAMES[selectedMonth]} {selectedYear}</p>
                    <p className="text-text-muted text-sm mt-1">Set spending limits to track your expenses</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgets.map(b => {
                        const pct = Math.min(100, (Number(b.spent) / Number(b.limitAmount)) * 100);
                        const isOver = pct >= 100;
                        const isWarning = pct >= 80;
                        return (
                            <div key={b.id} className="card">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{b.categoryIcon}</span>
                                        <span className="font-semibold text-text-main">{b.categoryName}</span>
                                    </div>
                                    <span className={`text-sm font-bold ${isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {pct.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="w-full bg-surface-3 rounded-full h-2.5 mb-3">
                                    <div className={`h-2.5 rounded-full transition-all duration-700 ${isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex justify-between text-xs text-text-muted">
                                    <span>Spent: <span className="text-text-main font-medium">₹{Number(b.spent).toLocaleString('en-IN')}</span></span>
                                    <span>Limit: <span className="text-text-main font-medium">₹{Number(b.limitAmount).toLocaleString('en-IN')}</span></span>
                                </div>
                                {isOver && <p className="text-red-400 text-xs mt-2 font-medium">⚠️ Budget exceeded by ₹{(Number(b.spent) - Number(b.limitAmount)).toLocaleString('en-IN')}</p>}
                            </div>
                        );
                    })}
                </div>
            )}

            <BudgetModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} categories={categories} />
        </div>
    );
}
