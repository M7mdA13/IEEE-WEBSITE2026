import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import CommitteesSection from '../components/dashboard/CommitteesSection'
import EventsSection from '../components/dashboard/EventsSection'
import MembersSection from '../components/dashboard/MembersSection'
import PartnersSection from '../components/dashboard/PartnersSection'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import SettingsSection from '../components/dashboard/SettingsSection'

function Dashboard({ toggleTheme, theme }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar 
          toggleTheme={toggleTheme} 
          theme={theme} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="committees" element={<CommitteesSection />} />
            <Route path="events" element={<EventsSection />} />
            <Route path="members" element={<MembersSection />} />
            <Route path="partners" element={<PartnersSection />} />
            <Route path="analytics" element={<AnalyticsSection />} />
            <Route path="settings" element={<SettingsSection />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
