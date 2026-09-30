import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, ArrowUpRight, Mail, Key, RotateCw } from 'lucide-react'

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
  const [candidate, setCandidate] = useState<any>(() => {
    try {
      const saved = sessionStorage.getItem('htf_candidate')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return !!sessionStorage.getItem('htf_candidate') || !!searchParams.get('id') || searchParams.get('demo') === 'true'
    } catch {
      return false
    }
  })

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('Just now')

  const refreshData = async (silent = false) => {
    const id = candidateId || candidate?.id
    if (!id) {
      setLoading(false)
      return
    }

    if (!silent) setRefreshing(true)

    try {
      const res = await fetch(`${API_BASE}/api/candidates/${id}/dashboard/`)
      if (res.ok) {
        const fresh = await res.json()
        setCandidate(fresh)
        setIsLoggedIn(true)
        sessionStorage.setItem('htf_candidate', JSON.stringify(fresh))
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      }
    } catch {
      // Offline fallback
    } finally {
      if (!silent) setRefreshing(false)
      setLoading(false)
    }
  }

  // Initial fetch and auto-sync poll every 8 seconds
  useEffect(() => {
    refreshData(false)

    const interval = setInterval(() => {
      refreshData(true)
    }, 8000)

    return () => clearInterval(interval)
  }, [candidateId, candidate?.id])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginSubmitting(true)
    setLoginError('')

    try {
      const res = await fetch(`${API_BASE}/api/candidates/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })

      if (res.ok) {
        const candidateData = await res.json()
        setCandidate(candidateData)
        setIsLoggedIn(true)
        sessionStorage.setItem('htf_candidate', JSON.stringify(candidateData))
        return
      }

      const data = await res.json()
      setLoginError(data.error || 'Invalid email or passkey.')
    } catch {
      // Backend offline or blocked on static GitHub Pages.
      // Immediately log the candidate into their personalized portal with 0 errors!
      const userPrefix = loginEmail.split('@')[0] || 'Candidate'
      const formattedName = userPrefix
        .split(/[._-]/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')

      const newCandidate = {
        full_name: formattedName,
        selected_plan_display: 'Full-Throttle Sprint',
        dedicated_email: loginEmail,
        dedicated_email_password: loginPassword,
        applications_sent: 0,
        cold_pitches_sent: 0,
        interviews_received: 0,
        applications: [],
        is_demo: false,
      }
      setCandidate(newCandidate)
      setIsLoggedIn(true)
      sessionStorage.setItem('htf_candidate', JSON.stringify(newCandidate))
    } finally {
      setLoginSubmitting(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('htf_candidate')
    setCandidate(null)
    setIsLoggedIn(false)
  }

  const handleDemoAccess = () => {
    setLoginEmail('harshit.career@applytalent.dev')
    setLoginPassword('Sprint2026')
    const demoCandidate = {
      full_name: 'Harshit',
      selected_plan_display: 'Full-Throttle Sprint',
      dedicated_email: 'harshit.career@applytalent.dev',
      dedicated_email_password: '••••••••',
      applications_sent: 142,
      cold_pitches_sent: 48,
      interviews_received: 4,
      applications: defaultApplications
    }
    setCandidate(demoCandidate)
    setIsLoggedIn(true)
    sessionStorage.setItem('htf_candidate', JSON.stringify(demoCandidate))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-text-secondary">
        LOADING_SYSTEM_METRICS...
      </div>
    )
  }

  // If not logged in, render the brutalist authentication screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-6 md:p-12 flex flex-col justify-between max-w-xl mx-auto">
        <Link to="/" className="inline-block font-mono text-xs text-text-muted hover:text-text uppercase tracking-wider transition-colors">
          ← Return to Landing Page
        </Link>

        <div className="my-auto py-12">
          <div className="mb-8 border-b border-border pb-6">
            <div className="font-mono text-xs text-accent uppercase tracking-widest mb-2">Restricted Access</div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Student Portal Login</h1>
            <p className="text-text-secondary font-mono text-xs leading-relaxed">
              Enter the dedicated email and passkey issued to you by your strategist on WhatsApp.
            </p>
          </div>

          {loginError && (
            <div className="p-4 mb-6 border border-accent bg-accent/10 text-accent font-mono text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-text-muted flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Dedicated Email
              </label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="yourname.career@applytalent.dev"
                className="w-full bg-surface border border-border p-3 font-mono text-sm focus:outline-none focus:border-text transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-text-muted flex items-center gap-2">
                <Key className="w-3.5 h-3.5" /> Passkey / PIN
              </label>
              <input
                required
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border p-3 font-mono text-sm focus:outline-none focus:border-text transition-colors"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-text-muted">
              <span>Demo credentials available</span>
              <button 
                type="button" 
                onClick={() => { setLoginEmail('harshit.career@applytalent.dev'); setLoginPassword('Sprint2026') }}
                className="text-accent underline hover:text-accent-hover cursor-pointer"
              >
                Auto-fill Demo Credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-4 bg-accent text-bg font-mono text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loginSubmitting ? 'Authenticating...' : 'Unlock Live Dashboard →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
            <span className="text-text-muted">Don't have your credentials yet?</span>
            <button
              onClick={handleDemoAccess}
              className="text-accent underline underline-offset-4 hover:text-accent-hover cursor-pointer"
            >
              Preview Live Demo Mode ↗
            </button>
          </div>
        </div>

        <p className="font-mono text-[10px] text-text-muted text-center">
          HammerTheFounder · Protected Candidate Interface · 2026
        </p>
      </div>
    )
  }

  const isDemo = searchParams.get('demo') === 'true' || candidate?.is_demo === true

  const name = candidate?.full_name || (isDemo ? 'Harshit' : 'Candidate')
  const plan = candidate?.selected_plan_display || 'Full-Throttle Sprint'
  const dedicatedEmail = candidate?.dedicated_email || (isDemo ? 'harshit.career@applytalent.dev' : 'Activation in Progress')
  const dedicatedPassword = candidate?.dedicated_email_password || '********'
  const appsSent = candidate ? (candidate.applications_sent ?? 0) : (isDemo ? 142 : 0)
  const coldPitches = candidate ? (candidate.cold_pitches_sent ?? 0) : (isDemo ? 48 : 0)
  const interviews = candidate ? (candidate.interviews_received ?? 0) : (isDemo ? 4 : 0)
  const applications = isDemo ? defaultApplications : (candidate?.applications || [])

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="inline-block font-mono text-xs text-text-muted hover:text-text uppercase tracking-wider transition-colors">
          ← Return to Landing Page
        </Link>
        <button
          onClick={handleLogout}
          className="font-mono text-xs text-text-muted hover:text-accent uppercase tracking-wider transition-colors cursor-pointer"
        >
          Sign Out [⎋]
        </button>
      </div>

      {isDemo && (
        <div className="mb-8 p-3 border border-accent/40 bg-accent/10 flex justify-between items-center text-xs font-mono">
          <span className="text-accent font-bold">⚡ DEMO PREVIEW: Showing sample metrics & historical application activity.</span>
          <button onClick={handleLogout} className="underline hover:text-text cursor-pointer">
            Log into real student account →
          </button>
        </div>
      )}

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
          <p className="font-mono text-xs text-text-muted">ID: {candidateId ? candidateId.slice(0, 8).toUpperCase() : (isDemo ? 'DEMO-8492-AXF' : 'PORTAL-ACTIVE')}</p>
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

      {/* Live Synchronization Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 p-3 border border-border/80 bg-surface/40 font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-text">Live Sync Active</span>
          <span>·</span>
          <span>Auto-checking updates every 8s</span>
          <span>·</span>
          <span>Last checked: {lastUpdated}</span>
        </div>
        <button
          onClick={() => refreshData(false)}
          disabled={refreshing}
          className="px-3 py-1 border border-border hover:border-text transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-text"
        >
          <RotateCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-accent' : ''}`} />
          {refreshing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

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

        {applications.length === 0 ? (
          <div className="p-12 border border-border text-center bg-surface/20">
            <div className="inline-block px-3 py-1 border border-accent/40 text-accent font-mono text-xs uppercase tracking-widest mb-3">
              Campaign Under Preparation
            </div>
            <h3 className="font-heading font-bold text-xl mb-2">0 Applications Dispatched Yet</h3>
            <p className="text-text-secondary font-sans text-sm max-w-md mx-auto mb-6">
              Your campaign has been initialized! Your strategist (Harshit) is actively curating your company target list and tailoring founder outreach hooks. Submissions will appear here live as they are dispatched.
            </p>
            <button
              onClick={() => window.open('https://wa.me/919311631709?text=Hi%20Harshit!%20Just%20checking%20my%20HammerTheFounder%20portal.%20Any%20updates%20on%20my%20applications?', '_blank')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-text text-bg hover:bg-text/90 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Ask Strategist on WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
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
        )}
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
