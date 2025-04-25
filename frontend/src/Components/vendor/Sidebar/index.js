import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiShoppingCartLine, RiMessage2Line, RiUserLine, RiUserAddLine } from 'react-icons/ri';
import { FaArrowLeftLong } from "react-icons/fa6";


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (keyCode !== 27) return; // Check if Escape key is pressed
      setSidebarOpen(false);
    };

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]); // Depend on sidebarOpen to update event listener when state changes

  useEffect(() => {
    // Update local storage
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());

    // Update body class based on sidebarExpanded
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link to="/">
          <img
            src='https://res.cloudinary.com/dq7vggsop/image/upload/v1711532480/jfqcm2s1ekxloucjk72p.png'
            alt="Logo"
            style={{ maxWidth: '120px', maxHeight: '100px', marginLeft: '40px' }}  // Adjust the dimensions here
          />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="text-gray border rounded-full p-1 hover:bg-gray-200 focus:outline-none block lg:hidden"
        >
          <FaArrowLeftLong className="text-lg" />
        </button>
      </div>
      {/* SIDEBAR HEADER */}
      <div className="text-white text-center">
        <h4 className="text-xl font-bold tracking-wide">
          Karnataka <span className="text-success">Agribusiness</span>
        </h4>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* Menu Group */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* Menu Item Dashboard */}
              <Link
                onClick={() => setSidebarOpen(!sidebarOpen)}
                to="/dashboard"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/' ||
                  pathname.includes('dashboard')) &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <RiDashboardLine className="text-xl" />
                Dashboard
              </Link>

              {/* Menu Item Products */}
              <Link
                onClick={() => setSidebarOpen(!sidebarOpen)}
                to="/products"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('products') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <RiShoppingCartLine className="text-xl" />
                Products
              </Link>


              {/* Menu Item Enquiries */}
              <Link
                onClick={() => setSidebarOpen(!sidebarOpen)}
                to="/enquiries"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('enquiries') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <RiUserLine className="text-xl" />
                Buyer Enquiries
              </Link>

              {/* Menu Item Lead Managers */}
              <Link
                onClick={() => setSidebarOpen(!sidebarOpen)}
                to="/lead-managers"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('lead-managers') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <RiUserAddLine className="text-xl" />
                Lead Managers
              </Link>

              {/* Menu Item General Enquiries */}
              <Link
                onClick={() => setSidebarOpen(!sidebarOpen)}
                to="/general/enquiry"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/general/enquiry') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                <RiMessage2Line className="text-xl" />
                General Enquiries
              </Link>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
