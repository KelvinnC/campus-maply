import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm(){
    const { register, handleSubmit, reset } = useForm();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessage('');
        setIsSuccess(false);

        const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
        const payload = isRegisterMode 
            ? { email: data.username, password: data.password, name: data.name }
            : { email: data.username, password: data.password };

        try {
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                setMessage(isRegisterMode ? 'Registration successful! Logging you in...' : 'Successful login');
                
                localStorage.setItem('user', JSON.stringify(result.user));
                
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setIsSuccess(false);
                setMessage(result.message || (isRegisterMode ? 'Registration failed' : 'Login failed'));
            }
        } catch (error) {
            console.error(`${isRegisterMode ? 'Registration' : 'Login'} error:`, error);
            setIsSuccess(false);
            setMessage('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setMessage('');
        setIsSuccess(false);
        reset();
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
            <label>{isRegisterMode ? 'Register' : 'Log in'}</label>
            
            {message && (
                <div className={`login-message ${isSuccess ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {isRegisterMode && (
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    {...register("name", { required: isRegisterMode })}
                    disabled={isLoading}
                />
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
                {isLoading 
                    ? (isRegisterMode ? 'Registering...' : 'Logging in...') 
                    : (isRegisterMode ? 'Register' : 'Login')
                }
            </button>

            <button type="button" onClick={toggleMode} className="toggle-mode-btn" disabled={isLoading}>
                {isRegisterMode ? 'Already have an account? Log in' : "Don't have an account? Register"}
            </button>
                
        </form>
    )
}
