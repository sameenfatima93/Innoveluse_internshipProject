import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAdmin } from '../context/AdminContext';

export default function Layout({ children, title }) {
  const { sidebarOpen } = useAdmin();
  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar />
      <Topbar title={title} />
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${
          sidebarOpen ? 'ml-60' : 'ml-16'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
