import React, { useState } from 'react';
import AuthCard from '../components/auth/AuthCard';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthCard
      isLogin={isLogin}
      onToggle={() => setIsLogin(!isLogin)}
    />
  );
}