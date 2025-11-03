import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm(){
    const { register, handleSubmit } = useForm();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessage('');
        setIsSuccess(false);

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.username,
                    password: data.password
                })
            });

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                setMessage('Successful login');
                
                localStorage.setItem('user', JSON.stringify(result.user));
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setIsSuccess(false);
                setMessage(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsSuccess(false);
            setMessage('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
            <label>Log in</label>
            
            {message && (
                <div className={`login-message ${isSuccess ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
                    
            <input 
                type="text" 
                name="username" 
                placeholder="Email" 
                {...register("username", { required: true })}
                disabled={isLoading}
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                {...register("password", { required: true })}
                disabled={isLoading}
            />
                    
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
                
        </form>
    )
}
