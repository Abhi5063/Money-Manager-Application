import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Valid email required').required('Email is required'),
    password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            toast.success('Account created! Welcome 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500 text-white text-2xl font-bold mb-4">₹</div>
                    <h1 className="text-3xl font-bold text-text-main">Create Account</h1>
                    <p className="text-text-muted mt-2">Start managing your finances today</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                            <input {...register('name')} placeholder="John Doe" className="input" />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                            <input {...register('email')} type="email" placeholder="you@example.com" className="input" />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
                            <input {...register('password')} type="password" placeholder="Min. 6 characters" className="input" />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
                            {isSubmitting ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-center text-text-muted text-sm mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
