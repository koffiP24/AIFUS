import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

const Layout = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%)]"></div>
      <div className="pointer-events-none absolute inset-x-0 top-32 h-[22rem] bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.09),_transparent_60%)]"></div>
      <Navbar />
      <main className="relative w-full flex-grow px-3 pb-[calc(env(safe-area-inset-bottom)+7rem)] pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
