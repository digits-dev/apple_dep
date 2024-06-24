import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const LoginPage = () => {
    const { errors } = usePage().props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        Inertia.post('login-save', 
                { 
                    email, 
                    password 
                }, 
                {
                onError: (errors) => {
                    if (errors.email) {
                        setEmail('');
                    }
                    if (errors.password) {
                        setPassword('');
                    }
                },
                onFinish: () => setLoading(false)
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <div>{errors.email}</div>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <div>{errors.password}</div>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage