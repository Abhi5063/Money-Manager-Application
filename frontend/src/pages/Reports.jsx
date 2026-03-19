import { useState } from 'react';
import { reportAPI } from '../api';
import toast from 'react-hot-toast';
import { RiDownloadLine, RiFileChartLine } from 'react-icons/ri';

export default function Reports() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);
            const params = {};
            if (from) params.from = from;
            if (to) params.to = to;

            const res = await reportAPI.exportCsv(params);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('CSV exported successfully!');
        } catch {
            toast.error('Failed to export report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Reports</h1>
                <p className="text-text-muted text-sm mt-1">Export your financial data</p>
            </div>

            <div className="card max-w-lg">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                        <RiFileChartLine size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text-main">Export Transactions</h2>
                        <p className="text-text-muted text-xs">Download your transactions as a CSV file</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">From Date <span className="text-xs">(optional)</span></label>
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">To Date <span className="text-xs">(optional)</span></label>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="input" />
                    </div>

                    <button onClick={handleExport} disabled={loading} className="btn-primary flex items-center gap-2">
                        <RiDownloadLine size={18} />
                        {loading ? 'Exporting…' : 'Export as CSV'}
                    </button>

                    <p className="text-text-muted text-xs">Leave date fields empty to export all transactions.</p>
                </div>
            </div>

            <div className="card max-w-lg">
                <h2 className="font-semibold text-text-main mb-3">📋 CSV Format</h2>
                <div className="bg-surface rounded-xl p-4 font-mono text-xs text-text-muted overflow-x-auto">
                    <p>ID, Date, Type, Category, Description, Amount</p>
                    <p>1, 2026-03-01, EXPENSE, Food & Dining, "Lunch", 250.00</p>
                    <p>2, 2026-03-02, INCOME, Salary, "March salary", 45000.00</p>
                </div>
            </div>
        </div>
    );
}
