import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import api from '../../api/index'
import '../../styles/AnalyticsSection.css'

const CATEGORY_COLORS = ['#00629b', '#78be20', '#ffb500', '#e0338f', '#00b5e2', '#7c3aed', '#db2777']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label || payload[0].name}</p>
        <p className="custom-tooltip-value">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

function AnalyticsSection() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ excom: 0, events: 0, committees: 0, partners: 0 })
  const [attendanceData, setAttendanceData] = useState([])
  const [committeeData, setCommitteeData] = useState([])
  const [eventsByMonth, setEventsByMonth] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [excomRes, eventsRes, committeesRes, partnersRes] = await Promise.all([
          api.get('/admin/excom'),
          api.get('/admin/events'),
          api.get('/admin/committees'),
          api.get('/admin/partners'),
        ])

        const excom = excomRes.data.data
        const events = eventsRes.data.data
        const committees = committeesRes.data.data
        const partners = partnersRes.data.data

        setStats({
          excom: excom.length,
          events: events.length,
          committees: committees.length,
          partners: partners.length,
        })

        // Top 6 events by attendance
        const topEvents = events
          .filter(e => e.attendanceCount > 0)
          .sort((a, b) => b.attendanceCount - a.attendanceCount)
          .slice(0, 6)
          .map(e => ({ event: e.title.length > 14 ? e.title.slice(0, 14) + '…' : e.title, attendance: e.attendanceCount }))
        setAttendanceData(topEvents)

        // Committees by category
        const catMap = {}
        committees.forEach(c => {
          catMap[c.category] = (catMap[c.category] || 0) + 1
        })
        setCommitteeData(
          Object.entries(catMap).map(([name, value], i) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
          }))
        )

        // Events per month (last 6 months)
        const now = new Date()
        const months = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          months.push({
            month: d.toLocaleString('en', { month: 'short' }),
            year: d.getFullYear(),
            monthNum: d.getMonth(),
            count: 0,
          })
        }
        events.forEach(e => {
          if (!e.date) return
          const d = new Date(e.date)
          const m = months.find(mo => mo.year === d.getFullYear() && mo.monthNum === d.getMonth())
          if (m) m.count++
        })
        setEventsByMonth(months.map(m => ({ month: m.month, events: m.count })))
      } catch {
        // keep defaults
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const summaryCards = [
    { label: 'Branch Members', value: '100+', icon: 'fa-users', color: '#00629b' },
    { label: 'Committees', value: stats.committees, icon: 'fa-layer-group', color: '#7c3aed' },
    { label: 'Events', value: stats.events, icon: 'fa-calendar-alt', color: '#78be20' },
    { label: 'ExCom Members', value: stats.excom, icon: 'fa-id-badge', color: '#ffb500' },
    { label: 'Partners', value: stats.partners, icon: 'fa-handshake', color: '#00b5e2' },
  ]

  return (
    <section className="content-section active">
      <div className="section-header">
        <h1>Analytics Overview</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Live data from the IEEE MUST database.</p>
      </div>

      {/* Summary stats */}
      <div className="stats-cards" style={{ marginBottom: '30px' }}>
        {summaryCards.map(c => (
          <div key={c.label} className="card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div className="card-icon" style={{ background: c.color + '20', color: c.color }}>
              <i className={`fas ${c.icon}`}></i>
            </div>
            <div className="card-info">
              <h3>{c.label}</h3>
              <h2>{loading ? '…' : c.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">

        {/* Events per month */}
        <div className="analytics-card">
          <h3><i className="fas fa-chart-line" style={{ color: 'var(--primary-color)' }}></i> Events per Month <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(last 6 months)</span></h3>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <AreaChart data={eventsByMonth}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-light)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-light)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="events" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorEvents)" strokeWidth={3} animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top events by attendance */}
        <div className="analytics-card">
          <h3><i className="fas fa-chart-bar" style={{ color: 'var(--secondary-color)' }}></i> Top Events by Attendance</h3>
          <div className="chart-wrapper">
            {attendanceData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="event" stroke="var(--text-light)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-light)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'var(--sidebar-active)', opacity: 0.4 }} content={<CustomTooltip />} />
                  <Bar dataKey="attendance" fill="var(--secondary-color)" radius={[6, 6, 0, 0]} barSize={35} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                {loading ? 'Loading…' : 'No events with attendance data yet.'}
              </div>
            )}
          </div>
        </div>

        {/* Committees by category */}
        <div className="analytics-card">
          <h3><i className="fas fa-chart-pie" style={{ color: '#ffb500' }}></i> Committees by Category</h3>
          <div className="chart-wrapper">
            {committeeData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={committeeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {committeeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                {loading ? 'Loading…' : 'No committees yet.'}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

export default AnalyticsSection
