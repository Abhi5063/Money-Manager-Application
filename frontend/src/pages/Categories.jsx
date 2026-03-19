import { useEffect, useState } from 'react';
import { categoryAPI } from '../api';
import toast from 'react-hot-toast';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine } from 'react-icons/ri';

const ICONS = ['🍔', '🏠', '🚗', '🎬', '🛍️', '🏥', '✈️', '💡', '📚', '💰', '💼', '📈', '🎮', '☕', '🐾', '💊'];

function CategoryModal({ open, onClose, onSave, edit }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [icon, setIcon] = useState('💰');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (edit) { setName(edit.name); setType(edit.type); setIcon(edit.icon || '💰'); }
        else { setName(''); setType('EXPENSE'); setIcon('💰'); }
    }, [edit, open]);

    if (!open) return null;

    const handleSave = async () => {
        if (!name.trim()) return toast.error('Name required');
        setSaving(true);
        await onSave({ name, type, icon });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main">
                    <RiCloseLine size={20} />
                </button>
                <h2 className="text-xl font-bold text-text-main mb-5">{edit ? 'Edit' : 'New'} Category</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" className="input" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="input">
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-2">Icon</label>
                        <div className="flex flex-wrap gap-2">
                            {ICONS.map(i => (
                                <button key={i} onClick={() => setIcon(i)}
                                    className={`text-xl p-2 rounded-lg transition-all ${icon === i ? 'bg-primary-500/30 ring-2 ring-primary-500' : 'bg-surface-3 hover:bg-surface'}`}>
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchCategories = () => {
        categoryAPI.getAll().then(r => { setCategories(r.data); setLoading(false); });
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSave = async (data) => {
        try {
            if (editData) { await categoryAPI.update(editData.id, data); toast.success('Category updated'); }
            else { await categoryAPI.create(data); toast.success('Category created'); }
            setModalOpen(false);
            setEditData(null);
            fetchCategories();
        } catch { toast.error('Failed to save category'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return;
        try {
            await categoryAPI.delete(id);
            toast.success('Deleted');
            fetchCategories();
        } catch { toast.error('Cannot delete — may have linked transactions'); }
    };

    const income = categories.filter(c => c.type === 'INCOME');
    const expense = categories.filter(c => c.type === 'EXPENSE');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Categories</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your income and expense categories</p>
                </div>
                <button onClick={() => { setEditData(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
                    <RiAddLine size={18} /> Add Category
                </button>
            </div>

            {['Income', 'Expense'].map(kind => {
                const list = kind === 'Income' ? income : expense;
                return (
                    <div key={kind} className="card">
                        <h2 className={`text-lg font-semibold mb-4 ${kind === 'Income' ? 'text-emerald-400' : 'text-red-400'}`}>{kind} Categories</h2>
                        {list.length === 0 ? <p className="text-text-muted text-sm">No {kind.toLowerCase()} categories</p> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {list.map(c => (
                                    <div key={c.id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{c.icon}</span>
                                            <span className="font-medium text-text-main text-sm">{c.name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditData(c); setModalOpen(true); }}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                                                <RiEditLine size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)}
                                                className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                <RiDeleteBinLine size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            <CategoryModal open={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }} onSave={handleSave} edit={editData} />
        </div>
    );
}
