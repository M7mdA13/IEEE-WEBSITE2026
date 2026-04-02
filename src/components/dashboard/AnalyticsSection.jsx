import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, 
  PieChart, Pie, Cell, Legend
} from 'recharts'
import '../../styles/AnalyticsSection.css'

const memberData = [
  { month: 'Jan', members: 120 },
  { month: 'Feb', members: 145 },
  { month: 'Mar', members: 160 },
  { month: 'Apr', members: 190 },
  { month: 'May', members: 210 },
  { month: 'Jun', members: 250 },
]

const attendanceData = [
  { event: 'Arduino', attendance: 45 },
  { event: 'Soft Skills', attendance: 30 },
  { event: 'AI Workshop', attendance: 65 },
  { event: 'Web Dev', attendance: 55 },
  { event: 'Networking', attendance: 40 },
]

const departmentData = [
  { name: 'CIS', value: 40, color: '#00629b' },
  { name: 'RAS', value: 25, color: '#78be20' },
  { name: 'PES', value: 20, color: '#ffb500' },
  { name: 'WIE', value: 15, color: '#e0338f' },
  { name: 'EMBS', value: 10, color: '#00b5e2' }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label || payload[0].name}</p>
        <p className="custom-tooltip-value">
          {`${payload[0].value} ${payload[0].name === 'members' ? 'Members' : payload[0].name === 'attendance' ? 'Attendees' : ''}`}
        </p>
      </div>
    );
  }
  return null;
};

function AnalyticsSection() {
  return (
    <section className="content-section active">
      <div className="section-header">
        <h1>Analytics Overview</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Tracking Student Branch performance and engagement.</p>
      </div>
      
      <div className="analytics-grid">
        
        {/* Member Growth Area Chart */}
        <div className="analytics-card">
          <h3><i className="fas fa-chart-line" style={{ color: 'var(--primary-color)' }}></i> Member Growth</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <AreaChart data={memberData}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-light)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-light)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="members" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorMembers)" strokeWidth={3} animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Attendance Bar Chart */}
        <div className="analytics-card">
          <h3><i className="fas fa-chart-bar" style={{ color: 'var(--secondary-color)' }}></i> Participation Levels</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="event" stroke="var(--text-light)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-light)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'var(--sidebar-active)', opacity: 0.4}} content={<CustomTooltip />} />
                <Bar dataKey="attendance" fill="var(--secondary-color)" radius={[6, 6, 0, 0]} barSize={35} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chapter Distribution Pie Chart */}
        <div className="analytics-card">
          <h3><i className="fas fa-chart-pie" style={{ color: '#ffb500' }}></i> Chapter Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AnalyticsSection
