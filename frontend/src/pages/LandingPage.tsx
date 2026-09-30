import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, X, ChevronDown, Upload, FileText, Loader2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const PLAN_MAP: Record<string, string> = {
  'Normal Apply': 'normal',
  'Cold Apply': 'cold',
  'Full-Throttle': 'both',
  'Talk to Us': 'budget',
}

const plans = [
  {
    name: "Normal Apply",
    target: "Best for wide coverage",
    features: ["ATS & Career Portal submissions", "Dedicated inbox + live tracker"],
    popular: false
  },
  {
    name: "Cold Apply",
    target: "Best for bypassing gatekeepers",
    features: ["Direct founder/CXO pitches", "Custom outreach with portfolio hooks"],
    popular: false
  },
  {
    name: "Full-Throttle Sprint",
    target: "Maximum momentum",
    features: ["Both Normal + Cold combined", "Priority WhatsApp alerts"],
    popular: true
  }
]

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0]
      if (f.type !== 'application/pdf') {
        setSubmitError('Only PDF files are accepted.')
        return
      }
      if (f.size > 10 * 1024 * 1024) {
        setSubmitError('Resume must be under 10MB.')
        return
      }
      setSubmitError('')
      setFile(f)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    const form = e.currentTarget
    const data = new FormData()

    data.append('full_name', (form.elements.namedItem('full_name') as HTMLInputElement).value)
    data.append('whatsapp_number', (form.elements.namedItem('whatsapp_number') as HTMLInputElement).value)
    data.append('email', (form.elements.namedItem('email') as HTMLInputElement).value)
    data.append('target_role', (form.elements.namedItem('target_role') as HTMLInputElement).value)
    data.append('experience_years', (form.elements.namedItem('experience') as HTMLSelectElement).value === 'Fresher' ? '0' : (form.elements.namedItem('experience') as HTMLSelectElement).value.split('-')[0])
    data.append('expected_ctc', (form.elements.namedItem('expected_ctc') as HTMLInputElement).value)
    data.append('current_location', (form.elements.namedItem('current_location') as HTMLInputElement).value)
    data.append('linkedin_url', (form.elements.namedItem('linkedin_url') as HTMLInputElement).value || '')
    data.append('github_url', (form.elements.namedItem('github_url') as HTMLInputElement).value || '')

    const selectedPlan = (form.elements.namedItem('plan') as RadioNodeList).value
    data.append('selected_plan', PLAN_MAP[selectedPlan] || 'both')

    if (file) {
      data.append('resume', file)
    }

    try {
      const res = await fetch(`${API_BASE}/api/candidates/register/`, {
        method: 'POST',
        body: data,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(Object.values(err).flat().join(', ') || 'Registration failed.')
      }

      const result = await res.json()

      // Secure redirect: backend validates token and issues 302 to WhatsApp
      // The WhatsApp number NEVER touches this frontend
      window.location.href = `${API_BASE}/api/candidates/whatsapp-redirect/${result.token}/`
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-heading font-bold text-xl tracking-tight">HTF</div>
          <div className="hidden md:flex items-center gap-8 font-mono text-sm">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-text-secondary transition-colors">How It Works</button>
            <button onClick={() => scrollTo('plans')} className="hover:text-text-secondary transition-colors">Plans</button>
            <button onClick={() => scrollTo('trust')} className="hover:text-text-secondary transition-colors">Why Trust Us</button>
            <button onClick={() => scrollTo('faq')} className="hover:text-text-secondary transition-colors">FAQ</button>
          </div>
          <button onClick={() => scrollTo('apply')} className="px-4 py-2 border border-text text-sm font-mono hover:bg-text hover:text-bg transition-colors">
            Start Applying
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-20 max-w-7xl mx-auto">
        <div className="max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold leading-[0.9] mb-8"
          >
            Stop Applying.<br />
            <span className="text-text-secondary">Start Getting Hired.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-12 font-sans"
          >
            We apply to hundreds of jobs & pitch startup founders for you. You just show up to interviews.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <button onClick={() => scrollTo('apply')} className="px-8 py-4 bg-accent text-bg hover:bg-accent-hover font-mono uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-colors">
              Launch Your Campaign <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="px-8 py-4 border border-border hover:border-text font-mono uppercase tracking-wider text-sm flex items-center justify-center transition-colors">
              See How It Works
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs text-text-muted uppercase tracking-widest border-t border-border pt-8"
          >
            <span>0 Upfront Cost</span>
            <span>·</span>
            <span>1-on-1 WhatsApp Support</span>
            <span>·</span>
            <span>Live Tracking Dashboard</span>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-8 border border-border-strong bg-surface-2 opacity-50 grayscale">
            <h2 className="font-heading font-bold text-3xl mb-8 line-through text-text-secondary">The Old Way</h2>
            <ul className="space-y-6 font-mono text-sm">
              <li className="flex items-start gap-4"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span>Spending 4 hours/day filling Workday forms</span></li>
              <li className="flex items-start gap-4"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span>Getting ghosted by 95% of ATS filters</span></li>
              <li className="flex items-start gap-4"><X className="w-5 h-5 shrink-0 mt-0.5" /> <span>Burnout and impostor syndrome</span></li>
            </ul>
          </div>
          <div className="p-8 border border-accent bg-surface">
            <h2 className="font-heading font-bold text-3xl mb-8 text-accent">The HTF Way</h2>
            <ul className="space-y-6 font-mono text-sm">
              <li className="flex items-start gap-4"><Check className="w-5 h-5 text-accent shrink-0 mt-0.5" /> <span>One 2-minute intake form</span></li>
              <li className="flex items-start gap-4"><Check className="w-5 h-5 text-accent shrink-0 mt-0.5" /> <span>Direct pitches to founders bypassing HR</span></li>
              <li className="flex items-start gap-4"><Check className="w-5 h-5 text-accent shrink-0 mt-0.5" /> <span>Wake up to interview invites on WhatsApp</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-24 text-center">The Process</h2>
          <div className="space-y-0">
            {[
              { num: "01", title: "Share Your Profile", desc: "Upload resume, specify target roles, expected CTC (2 mins)." },
              { num: "02", title: "Connect on WhatsApp", desc: "Your personal strategist reviews your profile & aligns your campaign." },
              { num: "03", title: "Campaign Begins", desc: "We submit applications & pitch founders directly." },
              { num: "04", title: "Track & Interview", desc: "Watch your dashboard live, get instant WhatsApp alerts for interviews." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-8 py-12 border-b border-border group">
                <div className="text-8xl md:text-[160px] font-heading font-bold leading-none text-text-muted group-hover:text-text transition-colors duration-500">
                  {step.num}
                </div>
                <div className="md:ml-12">
                  <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">{step.title}</h3>
                  <p className="text-text-secondary font-mono text-sm max-w-md leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-16 text-center">Choose Your Momentum</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {plans.map((plan, i) => (
              <div key={i} className={`p-8 border flex flex-col ${plan.popular ? 'border-accent bg-surface-2' : 'border-border'}`}>
                {plan.popular && <div className="text-accent font-mono text-xs mb-4 uppercase tracking-wider">Most Popular</div>}
                <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                <p className="text-text-muted font-mono text-xs mb-8 uppercase">{plan.target}</p>
                <ul className="space-y-4 font-mono text-sm mb-12 flex-grow">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-text-secondary">
                      <span className="text-text mt-0.5">-</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollTo('apply')} className={`w-full py-3 text-center font-mono text-sm uppercase tracking-wider transition-colors border ${plan.popular ? 'bg-accent text-bg border-accent hover:bg-accent-hover' : 'border-border hover:border-text'}`}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
          
          <div className="p-8 border border-border-strong bg-surface flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-heading font-bold mb-2">"I Can't Afford It Right Now" 🤝</h3>
              <p className="text-text-secondary font-sans text-sm">Lack of funds shouldn't kill your career. Let's talk — we'll work something out.</p>
            </div>
            <button onClick={() => scrollTo('apply')} className="px-6 py-3 border border-border hover:border-text font-mono text-sm uppercase tracking-wider whitespace-nowrap transition-colors">
              Talk to Us
            </button>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="py-32 px-6 border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <blockquote className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-24 max-w-4xl">
            "I'm a student just like you. I've spent sleepless nights getting ghosted by 300+ ATS filters. We built this because hiring is broken."
          </blockquote>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border pt-16">
            <div>
              <div className="font-mono text-4xl mb-4">📅</div>
              <h4 className="font-heading font-bold text-xl mb-4">Day 1 — Sept 30, 2026</h4>
              <p className="text-text-secondary font-sans text-sm leading-relaxed">We just launched. No fake reviews, no inflated numbers. Just pure hustle.</p>
            </div>
            <div>
              <div className="font-mono text-4xl mb-4">🚫</div>
              <h4 className="font-heading font-bold text-xl mb-4">Zero Upfront Payment</h4>
              <p className="text-text-secondary font-sans text-sm leading-relaxed">You never pay on this site. We talk first on WhatsApp, you decide if it makes sense.</p>
            </div>
            <div>
              <div className="font-mono text-4xl mb-4">🤝</div>
              <h4 className="font-heading font-bold text-xl mb-4">1-on-1 Human</h4>
              <p className="text-text-secondary font-sans text-sm leading-relaxed">You talk to me personally before anything starts. No bots, no automated BS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-16">System Queries</h2>
          <div className="space-y-4">
            {[
              { q: "Why WhatsApp instead of paying here?", a: "We want to review your profile first. If we can't help you, we won't take your money. A quick text chat ensures we are aligned." },
              { q: "Do I own the email you create?", a: "Yes. We create a dedicated professional inbox for your campaign, and you get full access to it at any time." },
              { q: "What happens when an interview invite arrives?", a: "We immediately forward the details to you on WhatsApp and update your live dashboard. You just pick a time slot." },
              { q: "How long does it take to start seeing results?", a: "Campaigns launch within 48 hours of onboarding. Initial responses typically start trickling in by week 2." }
            ].map((faq, i) => (
              <div key={i} className="border border-border">
                <button 
                  className="w-full text-left p-6 flex justify-between items-center font-mono text-sm uppercase tracking-wide hover:bg-surface/50 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="p-6 pt-0 text-text-secondary font-sans text-sm leading-relaxed bg-surface/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="apply" className="py-32 px-6 border-t border-border bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Initialize Campaign</h2>
            <p className="text-text-secondary font-mono text-sm">Takes 2 minutes. We review and message you on WhatsApp.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {submitError && (
              <div className="p-4 border border-accent bg-accent/10 text-accent font-mono text-xs">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">Full Name *</label>
                <input required name="full_name" type="text" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">WhatsApp Number (with country code) *</label>
                <input required name="whatsapp_number" type="tel" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">Email *</label>
                <input required name="email" type="email" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">Target Role(s) *</label>
                <input required name="target_role" type="text" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="Frontend, Full Stack, SDE-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">Experience *</label>
                <select name="experience" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors text-text">
                  <option>Fresher</option>
                  <option>0-2 Years</option>
                  <option>2-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">Expected CTC *</label>
                <input required name="expected_ctc" type="text" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="8 LPA / $80k" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">Current Location *</label>
                <input required name="current_location" type="text" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="Bangalore / Remote / Delhi" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">LinkedIn URL</label>
                <input name="linkedin_url" type="url" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase text-text-muted">GitHub / Portfolio</label>
                <input name="github_url" type="url" className="w-full bg-bg border border-border p-3 font-sans text-sm focus:outline-none focus:border-text transition-colors" placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-mono text-xs uppercase text-text-muted">Select Plan *</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Normal Apply', 'Cold Apply', 'Full-Throttle', 'Talk to Us'].map(p => (
                  <label key={p} className="flex items-center gap-3 p-4 border border-border cursor-pointer hover:bg-surface-2 transition-colors">
                    <input type="radio" name="plan" value={p} defaultChecked={p === 'Full-Throttle'} className="accent-accent" />
                    <span className="font-mono text-xs uppercase">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-text-muted">Resume Upload (PDF, max 10MB) *</label>
              <div className="border border-dashed border-border p-8 flex flex-col items-center justify-center bg-bg relative hover:border-text transition-colors">
                <input required type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                {file ? (
                  <div className="flex items-center gap-3 text-sm font-mono text-accent">
                    <FileText className="w-5 h-5" />
                    {file.name}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-text-muted font-mono text-sm">
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Drag and drop or click to upload PDF</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-4 bg-accent text-bg font-mono text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Strategist...
                </>
              ) : (
                <>
                  Submit Profile & Connect on WhatsApp <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-bg text-center">
        <p className="font-mono text-xs text-text-muted mb-4">HammerTheFounder © 2026 · Built with sleepless nights and rage against broken hiring.</p>
        <div className="flex justify-center gap-6 font-mono text-xs text-text-muted underline">
          <a href="#" className="hover:text-text transition-colors">Privacy</a>
          <a href="#" className="hover:text-text transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  )
}
