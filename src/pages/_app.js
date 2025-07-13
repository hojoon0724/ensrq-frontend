import '@/styles/globals.css';
import Navbar from './components/00-nav/nav';
import Footer from './components/99-footer/footer';

export default function App({ Component, pageProps }) {
  return (
    <div className="h-screen overflow-y-auto">
      {/* Fixed navbar at top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      {/* Main content area */}
      <div className="min-h-[calc(100vh-120px)]">
        <Component {...pageProps} className="text-gray-900" />
      </div>
      
      {/* Fixed footer at bottom */}
      <div className="sticky bottom-0 z-50">
        <Footer />
      </div>
    </div>
  );
}
