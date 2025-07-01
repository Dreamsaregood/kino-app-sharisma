import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      width: '100%', 
      background: '#181a1b', 
      color: '#fff' 
    }}>
      <Header />
      <div style={{ 
        display: 'flex',
        flex: 1,
        paddingTop: '80px'
      }}>
        <Sidebar />
        <main style={{ 
          flexGrow: 1,
          padding: '2rem',
          minHeight: '100%'
        }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
} 