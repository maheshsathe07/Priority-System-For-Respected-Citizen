import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthCardProps {
  isLogin: boolean;
  onToggle: () => void;
}

export default function AuthCard({ isLogin, onToggle }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin ? 'Access RTO services with ease' : 'Register for RTO services'}
          </p>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm onRegisterSuccess={onToggle} />}

        <div className="mt-6 text-center">
          <button
            onClick={onToggle}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}