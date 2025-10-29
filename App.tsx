
import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DemoRequestPage } from './pages/DemoRequestPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { MainApp } from './pages/MainApp';

export type Route = 'landing' | 'login' | 'demo' | 'thank-you' | 'app';

const App: React.FC = () => {
    const [route, setRoute] = useState<Route>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleNavigate = (newRoute: Route) => {
        setRoute(newRoute);
    };
    
    // Simulate login success
    const handleLogin = () => {
        setIsAuthenticated(true);
        setRoute('app');
    };

    const renderContent = () => {
        if (isAuthenticated) {
            return <MainApp />;
        }

        switch (route) {
            case 'landing':
                return <LandingPage onNavigate={handleNavigate} />;
            case 'login':
                return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLogin} initialMode="login" />;
            case 'demo':
                return <DemoRequestPage onNavigate={handleNavigate} />;
            case 'thank-you':
                return <ThankYouPage onNavigate={handleNavigate} />;
            case 'app': // If not authenticated, redirect to login
                return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLogin} initialMode="signup" />;
            default:
                return <LandingPage onNavigate={handleNavigate} />;
        }
    };

    return <>{renderContent()}</>;
};

export default App;
