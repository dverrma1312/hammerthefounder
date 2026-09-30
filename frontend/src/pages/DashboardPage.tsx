import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Mail, Key } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const defaultApplications = [
  { id: 1, company: 'Stripe', role: 'Frontend Engineer', type: 'Normal', date: '2026-09-28', status: 'Interview Scheduled 🎉' },
  { id: 2, company: 'Linear', role: 'Product Engineer', type: 'Cold', date: '2026-09-27', status: 'Applied' },
  { id: 3, company: 'Vercel', role: 'Full Stack Dev', type: 'Normal', date: '2026-09-25', status: 'Under Review' },
  { id: 4, company: 'Ramp', role: 'Frontend Engineer', type: 'Cold', date: '2026-09-24', status: 'Interview Scheduled 🎉' },
]

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [candidate, setCandidate] = useState<any>(null)

  useEffect(() => {
    if (!candidateId) {
      setLoading(false)
      return
    }

    fetch(`${API_BASE}/api/candidates/${candidateId}/dashboard/`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setCandidate(data)
      })
      .catch(() => {
        // Fallback to demo mode
      })
      .finally(() => {
        setLoading(false)
      })
  }, [candidateId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-text-secondary">
        LOADING_SYSTEM_METRICS...
      </div>
    )
  }

  const name = candidate?.full_name || 'Harshit'
  const plan = candidate?.selected_plan_display || 'Full-Throttle Sprint'
  const dedicatedEmail = candidate?.dedicated_email || 'harshit.career@applytalent.dev'
  const dedicatedPassword = candidate?.dedicated_email_password || '********'
  const appsSent = candidate ? candidate.applications_sent : 142
  const coldPitches = candidate ? candidate.cold_pitches_sent : 48
  const interviews = candidate ? candidate.interviews_received : 4
  const applications = candidate?.applications && candidate.applications.length > 0
    ? candidate.applications
    : defaultApplications

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <Link to="/" className="inline-block font-mono text-xs text-text-muted hover:text-text mb-6 uppercase tracking-wider transition-colors">
        ← Return to Landing Page
      </Link>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-border pb-8">
        <div>
          <div className="font-mono text-xs text-accent uppercase tracking-widest mb-2">Live Candidate Monitor</div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">Student Portal</h1>
          <p className="text-text-secondary font-mono text-sm">Welcome back, {name}.</p>
        </div>
        <div className="mt-6 md:mt-0 text-left md:text-right">
          <div className="inline-block px-3 py-1 border border-accent text-accent font-mono text-xs mb-2 uppercase">
            PLAN: {plan}
          </div>
          <p className="font-mono text-xs text-text-muted">ID: {candidateId ? candidateId.slice(0, 8).toUpperCase() : 'DEMO-8492-AXF'}</p>
        </div>
      </header>

      {/* Dedicated Email Credentials Box */}
      <section className="mb-12 p-6 border border-border-strong bg-surface-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-widest mb-2">
            <Mail className="w-4 h-4" /> Dedicated Career Inbox Assigned
          </div>
          <div className="font-heading font-bold text-lg text-text">
            {dedicatedEmail}
          </div>
          <div className="font-mono text-xs text-text-muted mt-1 flex items-center gap-2">
            <Key className="w-3 h-3" /> Passkey: {dedicatedPassword}
          </div>
        </div>
        <div className="font-mono text-xs text-text-muted max-w-xs text-left md:text-right">
          All applications & founder correspondence route through this dedicated address.
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: 'APPLICATIONS SENT', value: appsSent },
          { label: 'FOUNDER COLD PITCHES', value: coldPitches },
          { label: 'INTERVIEW CALLS WON', value: interviews }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 border border-border bg-surface/50"
          >
            <h3 className="font-mono text-xs text-text-secondary mb-4 uppercase tracking-wider">{stat.label}</h3>
            <p className="text-5xl md:text-6xl font-heading font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-heading font-bold mb-8">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="pb-4 font-normal">COMPANY</th>
                <th className="pb-4 font-normal">ROLE</th>
                <th className="pb-4 font-normal">TYPE</th>
                <th className="pb-4 font-normal">DATE</th>
                <th className="pb-4 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app: any, idx: number) => {
                const compName = app.company_name || app.company
                const roleName = app.role_applied || app.role
                const appType = app.application_type === 'cold' || app.type === 'Cold' ? 'Cold' : 'Normal'
                const appDate = app.applied_date || app.date
                const appStatus = app.status_display || app.status

                const isInterview = typeof appStatus === 'string' && (appStatus.toLowerCase().includes('interview') || appStatus.toLowerCase().includes('offer'))
                const isRejected = typeof appStatus === 'string' && appStatus.toLowerCase().includes('reject')

                return (
                  <tr key={app.id || idx} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                    <td className="py-4 font-bold">{compName}</td>
                    <td className="py-4 text-text-secondary">{roleName}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs border ${appType === 'Cold' ? 'border-accent text-accent' : 'border-border text-text-secondary'}`}>
                        {appType}
                      </span>
                    </td>
                    <td className="py-4 text-text-muted">{appDate}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {isInterview && <CheckCircle2 className="w-4 h-4 text-success" />}
                        {!isInterview && !isRejected && <Clock className="w-4 h-4 text-warning" />}
                        {isRejected && <XCircle className="w-4 h-4 text-text-muted" />}
                        <span className={isInterview ? 'text-success font-bold' : 'text-text-secondary'}>
                          {appStatus}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="p-8 border border-border bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-heading font-bold text-xl mb-2">Need an update?</h3>
            <p className="text-text-secondary font-sans text-sm">Your strategist is available on WhatsApp.</p>
          </div>
          <button 
            onClick={() => window.open('https://wa.me/919311631709?text=Hi%20Harshit!%20Checking%20in%20from%20my%20HammerTheFounder%20student%20dashboard.', '_blank')}
            className="px-6 py-3 bg-text text-bg hover:bg-text/90 font-mono text-sm uppercase tracking-wider flex items-center gap-2 transition-colors w-full md:w-auto justify-center cursor-pointer"
          >
            Message Strategist <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
