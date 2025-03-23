
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container max-w-screen-md mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to CodeCatalyst</h1>
        <p className="text-center text-muted-foreground mb-8">
          Sign in to your account or create a new one to get started
        </p>
        <AuthForm />
      </div>
    </Layout>
  );
};

export default Login;
