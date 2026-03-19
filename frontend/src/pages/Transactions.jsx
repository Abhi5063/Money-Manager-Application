import { useEffect, useState, useCallback } from 'react';
import { transactionAPI, categoryAPI } from '../api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine, RiFilterLine } from 'react-icons/ri';

function TransactionModal({ open, onClose, onSave, categories, editData }) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (editData) {
            setValue('amount', editData.amount);
            setValue('type', editData.type);
            setValue('categoryId', editData.categoryId);
            setValue('description', editData.description);
            setValue('date', editData.date);
        } else {
            reset({ type: 'EXPENSE', date: new Date().toISOString().split('T')[0] });
        }
    }, [editData, open]);

    if (!open) return null;

    const onSubmit = async (data) => {
        await onSave({ ...data, amount: parseFloat(data.amount), categoryId: parseInt(data.categoryId) });
        reset();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main">
                    <RiCloseLine size={20} />
                </button>
                <h2 className="text-xl font-bold text-text-main mb-5">{editData ? 'Edit' : 'Add'} Transaction</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
                            <select {...register('type', { required: true })} className="input">
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Amount (₹)</label>
                            <input {...register('amount', { required: true, min: 0.01 })} type="number" step="0.01" placeholder="0.00" className="input" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Category</label>
                        <select {...register('categoryId', { required: true })} className="input">
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Date</label>
                        <input {...register('date', { required: true })} type="date" className="input" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                        <input {...register('description')} placeholder="Optional note" className="input" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                            {isSubmitting ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [filters, setFilters] = useState({ from: '', to: '', categoryId: '' });
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = useCallback(async () => {
        const params = {};
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        const [txRes, catRes] = await Promise.all([transactionAPI.getAll(params), categoryAPI.getAll()]);
        setTransactions(txRes.data);
        setCategories(catRes.data);
        setLoading(false);
    }, [filters]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async (data) => {
        try {
            if (editData) {
                await transactionAPI.update(editData.id, data);
                toast.success('Transaction updated');
            } else {
                await transactionAPI.create(data);
                toast.success('Transaction added');
            }
            setModalOpen(false);
            setEditData(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save transaction');
        }
    };

    const handleDelete = async (id) => {
        try {
            await transactionAPI.delete(id);
            toast.success('Transaction deleted');
            setDeleteId(null);
            fetchData();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Transactions</h1>
                    <p className="text-text-muted text-sm mt-1">{transactions.length} records</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={() => { setEditData(null); setModalOpen(true); }}>
                    <RiAddLine size={18} /> Add Transaction
                </button>
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-4 items-end">
                <div className="flex items-center gap-2 text-text-muted text-sm font-medium"><RiFilterLine /> Filters</div>
                <div>
                    <label className="block text-xs text-text-muted mb-1">From Date</label>
                    <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} className="input !py-2 !text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-text-muted mb-1">To Date</label>
                    <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} className="input !py-2 !text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-text-muted mb-1">Category</label>
                    <select value={filters.categoryId} onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))} className="input !py-2 !text-sm">
                        <option value="">All categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <button onClick={() => setFilters({ from: '', to: '', categoryId: '' })} className="btn-secondary !py-2 !text-sm">Clear</button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden !p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-3">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-3">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-text-muted">Loading…</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-text-muted">No transactions found. Add your first one!</td></tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-surface-3/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span>{tx.categoryIcon}</span>
                                            <span className="text-sm font-medium text-text-main">{tx.categoryName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-muted">{tx.description || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}>{tx.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold">
                                        <span className={tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}>
                                            {tx.type === 'INCOME' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditData(tx); setModalOpen(true); }}
                                                className="p-2 rounded-lg text-text-muted hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                                                <RiEditLine size={16} />
                                            </button>
                                            <button onClick={() => setDeleteId(tx.id)}
                                                className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                <RiDeleteBinLine size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }}
                onSave={handleSave} categories={categories} editData={editData} />

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card w-full max-w-sm text-center">
                        <div className="text-4xl mb-3">🗑️</div>
                        <h3 className="text-lg font-bold text-text-main mb-2">Delete Transaction?</h3>
                        <p className="text-text-muted text-sm mb-5">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
