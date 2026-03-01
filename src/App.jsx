import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Links from './pages/Links'; // eager — critical first render
import Portal from './pages/Portal'; // eager — auth-critical

const Home            = lazy(() => import('./pages/Home'));
const Menu            = lazy(() => import('./pages/Menu'));
const Clinic          = lazy(() => import('./pages/Clinic'));
const About           = lazy(() => import('./pages/About'));
const Blog            = lazy(() => import('./pages/Blog'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const Recipes         = lazy(() => import('./pages/Recipes'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#1a110d] text-[#f4ebd0] text-sm tracking-widest uppercase opacity-60">
        Loading...
    </div>
);

const WithLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <Sidebar />
        <main className="flex-grow pt-16">
            <Suspense fallback={<PageLoader />}>
                {children}
            </Suspense>
        </main>
        <Footer />
    </div>
);

function App() {
    return (
        <Router>
            <ErrorBoundary>
                <Routes>
                    <Route path="/"       element={<Links />} />
                    <Route path="/home"   element={<WithLayout><Home /></WithLayout>} />
                    <Route path="/menu"   element={<WithLayout><Menu /></WithLayout>} />
                    <Route path="/clinic" element={<WithLayout><Clinic /></WithLayout>} />
                    <Route path="/about"  element={<WithLayout><About /></WithLayout>} />
                    <Route path="/blog"      element={<WithLayout><Blog /></WithLayout>} />
                    <Route path="/portal"   element={<Portal />} />
                    <Route path="/dashboard" element={<WithLayout><ProtectedRoute><MemberDashboard /></ProtectedRoute></WithLayout>} />
                    <Route path="/recipes"   element={<WithLayout><ProtectedRoute requireMember={true}><Recipes /></ProtectedRoute></WithLayout>} />
                </Routes>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
