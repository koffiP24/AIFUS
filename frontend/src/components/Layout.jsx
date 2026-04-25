import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav, { isMobileBottomNavHidden } from './MobileBottomNav';
import PwaInstallPrompt from './PwaInstallPrompt';
import { buildPaymentReturnPath } from '../utils/paymentSession';

const Layout = () => {
  const location = useLocation();
  const shouldShowMobileBottomNav = !isMobileBottomNavHidden(location.pathname);
  const searchParams = new URLSearchParams(location.search);
  const provider = (searchParams.get('provider') || '').toLowerCase();
  const orderReference = searchParams.get('orderReference');

  if (
    provider === 'cinetpay' &&
    orderReference &&
    location.pathname !== '/payment-return'
  ) {
    const redirectTo = buildPaymentReturnPath({
      provider,
      orderReference,
      paymentReference: searchParams.get('paymentReference'),
    });

    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%)]"></div>
      <div className="pointer-events-none absolute inset-x-0 top-32 h-[22rem] bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.09),_transparent_60%)]"></div>
      <Navbar />
      <main className="relative w-full flex-grow px-3 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer reserveMobileBottomSpace={shouldShowMobileBottomNav} />
      <PwaInstallPrompt />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
