import { useState, useEffect, useRef } from 'react'
import { X, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitEnquiry } from '../lib/api'

const LOCATIONS = ['Ambernath', 'Kalyan', 'Pune', 'Mumbai', 'Other']

interface Props {
  splashDone: boolean
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

// Direction: 1 = forward (step 1→2), -1 = back (step 2→1)
let slideDir = 1

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function ConsultationPopup({ splashDone }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<Status>('idle')

  // Step 1
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Step 2
  const [spaceType, setSpaceType] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [requirements, setRequirements] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState('')

  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Trigger: 4 s after splashDone ──
  useEffect(() => {
    if (!splashDone) return
    if (sessionStorage.getItem('popupShown')) return
    const t = setTimeout(() => setIsOpen(true), 4000)
    return () => clearTimeout(t)
  }, [splashDone])

  // ── Auto-close 3 s after success ──
  useEffect(() => {
    if (status === 'success') {
      autoCloseRef.current = setTimeout(close, 3000)
    }
    return () => { if (autoCloseRef.current) clearTimeout(autoCloseRef.current) }
  }, [status])

  const close = () => {
    sessionStorage.setItem('popupShown', 'true')
    setIsOpen(false)
  }

  // ── Step 1 validation ──
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!fullName.trim() || fullName.trim().length < 2)
      e.fullName = 'Please enter your full name (min 2 characters).'
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10)
      e.phone = 'Please enter a valid 10-digit phone number.'
    if (!email.trim() || !EMAIL_RE.test(email.trim()))
      e.email = 'Please enter a valid email address.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validateStep1()) return
    slideDir = 1
    setStep(2)
    setErrors({})
  }

  const handleBack = () => {
    slideDir = -1
    setStep(1)
    setErrors({})
  }

  // ── Step 2 submission ──
  const handleSubmit = async () => {
    const e: Record<string, string> = {}
    if (!budget) e.budget = 'Please select an estimated budget.'
    if (!location) e.location = 'Please select your project location.'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setStatus('submitting')
    setErrorMsg('')
    const payload = {
      fullName: fullName.trim(),
      phone: `+91 ${phone.trim()}`,
      email: email.trim(),
      spaceType,
      location,
      projectType: '',
      budget,
      referral: '',
      requirements,
      source: 'Popup Form',
    }
    console.log('[Popup] Submitting form data:', payload)
    try {
      await submitEnquiry(payload)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (!isOpen) return null

  const firstName = fullName.trim().split(' ')[0] || 'there'

  return (
    <>
      <style>{`
        .cpopup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: cpopup-fade-in 0.3s ease;
        }
        @keyframes cpopup-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cpopup-card {
          background: #f5f0e8;
          border-radius: 4px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35), 0 4px 20px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 460px;
          padding: 40px 36px 36px;
          position: relative;
          animation: cpopup-slide-up 0.35s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
        }
        @keyframes cpopup-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cpopup-close {
          position: absolute;
          top: 14px; right: 14px;
          background: none; border: none; cursor: pointer;
          color: #5a5a5a; padding: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s ease;
        }
        .cpopup-close:hover { color: #21291a; }
        .cpopup-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #a18661; text-align: center; margin: 0 0 10px;
        }
        .cpopup-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 400; font-size: clamp(1.3rem, 4vw, 1.7rem);
          color: #21291a; text-align: center;
          margin: 0 0 24px; line-height: 1.25;
        }

        /* ── Form inputs ── */
        .cpf-label {
          display: block;
          font-family: 'Jost', sans-serif; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #888; font-weight: 400; margin-bottom: 6px;
        }
        .cpf-field-wrap { position: relative; margin-bottom: 18px; }
        .cpf-field-wrap::after {
          content: '';
          position: absolute; bottom: 0; left: 50%;
          width: 0; height: 1.5px;
          background: #a18661;
          transition: width 0.25s ease, left 0.25s ease;
        }
        .cpf-field-wrap:focus-within::after { left: 0; width: 100%; }
        .cpf-input {
          border: none; border-bottom: 1px solid rgba(161,134,97,0.35);
          background: transparent; padding: 7px 0;
          font-family: 'Jost', sans-serif; font-size: 14px;
          color: #21291a; width: 100%; outline: none;
        }
        .cpf-input::placeholder { color: #aaa; }
        .cpf-textarea {
          border: 1px solid rgba(161,134,97,0.35);
          border-radius: 6px; background: transparent;
          padding: 10px 12px; font-family: 'Jost', sans-serif;
          font-size: 14px; color: #21291a; width: 100%;
          min-height: 72px; outline: none; resize: none;
          transition: border-color 0.25s ease;
          box-sizing: border-box;
        }
        .cpf-textarea:focus { border-color: #a18661; }
        .cpf-textarea::placeholder { color: #aaa; }
        .cpf-phone-row {
          display: flex; align-items: center;
          border-bottom: 1px solid rgba(161,134,97,0.35);
          position: relative;
        }
        .cpf-phone-prefix {
          font-family: 'Jost', sans-serif; font-size: 14px;
          color: #21291a; padding: 7px 8px 7px 0; white-space: nowrap;
          user-select: none; pointer-events: none;
        }
        .cpf-phone-input {
          border: none; background: transparent; padding: 7px 0;
          font-family: 'Jost', sans-serif; font-size: 14px;
          color: #21291a; flex: 1; outline: none;
        }
        .cpf-phone-input::placeholder { color: #aaa; }

        /* ── Chip pills ── */
        .cpf-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
        .cpf-chip {
          font-family: 'Jost', sans-serif; font-size: 12px;
          color: #6b6258; background: rgba(255,255,255,0.7);
          border: 1px solid rgba(161,134,97,0.35); border-radius: 999px;
          padding: 7px 16px; cursor: pointer;
          transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
        }
        .cpf-chip:hover { border-color: #a18661; color: #21291a; }
        .cpf-chip.selected {
          background: #a18661; border-color: #a18661; color: #fff;
        }

        /* ── Primary button ── */
        .cpopup-btn {
          width: 100%; background: #a18661; color: #f5f0e8;
          border: none; padding: 14px 24px;
          font-family: 'Montserrat', sans-serif; font-weight: 600;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          transition: background 0.25s ease, transform 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .cpopup-btn:hover:not(:disabled) { background: #8d7250; transform: translateY(-1px); }
        .cpopup-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .cpopup-btn-outline {
          width: 100%; background: transparent; color: #21291a;
          border: 1px solid rgba(33,41,26,0.35); padding: 13px 24px;
          font-family: 'Montserrat', sans-serif; font-weight: 600;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          transition: border-color 0.2s ease, background 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .cpopup-btn-outline:hover { border-color: #21291a; background: rgba(33,41,26,0.05); }

        /* ── Select dropdown ── */
        .cpf-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23AAAAAA' stroke-width='1.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 2px center;
          padding-right: 20px;
        }

        /* ── Error text ── */
        .cpf-error { font-family: 'Jost',sans-serif; font-size: 11px; color: #b85a4a; margin-top: 4px; margin-bottom: 2px; }

        /* ── Progress ── */
        .cpf-progress {
          font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.06em;
          color: rgba(33,41,26,0.4); text-align: center; margin-top: 12px;
        }

        /* ── Back link ── */
        .cpf-back {
          font-family: 'Jost', sans-serif; font-size: 12px; color: #a18661;
          background: none; border: none; cursor: pointer; padding: 0;
          display: inline-flex; align-items: center; gap: 4px;
          margin-bottom: 16px; transition: color 0.2s ease;
          text-decoration: none;
        }
        .cpf-back:hover { color: #6f5c3e; }

        /* ── Spin animation ── */
        .cpf-spin { animation: cpfSpin 0.9s linear infinite; }
        @keyframes cpfSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .cpopup-overlay { padding: 16px; }
          .cpopup-card { padding: 32px 24px 28px; }
        }
      `}</style>

      <div
        className="cpopup-overlay"
        onClick={e => { if (e.target === e.currentTarget) close() }}
      >
        <div className="cpopup-card">
          <button className="cpopup-close" onClick={close} aria-label="Close">
            <X size={18} />
          </button>

          {/* ── Fixed header ── */}
          <p className="cpopup-sub">Get a Free 30-Min Design Consultation</p>
          <h2 className="cpopup-heading">Planning your dream home?</h2>

          {/* ── Content area ── */}
          <AnimatePresence mode="wait" custom={slideDir}>
            {status === 'success' ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ textAlign: 'center', padding: '8px 0 4px' }}
              >
                <CheckCircle
                  size={44}
                  style={{ color: '#a18661', margin: '0 auto 16px', display: 'block' }}
                  strokeWidth={1.5}
                />
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: '1.25rem', color: '#21291a', margin: '0 0 8px' }}>
                  Thank you, {firstName}!
                </p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 14, color: '#6b6258', margin: '0 0 24px', lineHeight: 1.6 }}>
                  We'll reach out to you within 24 hours.
                </p>
                <button className="cpopup-btn-outline" onClick={close}>
                  Close
                </button>
              </motion.div>
            ) : step === 1 ? (
              /* ── Step 1 ── */
              <motion.div
                key="step1"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Full Name */}
                <div className="cpf-field-wrap">
                  <label className="cpf-label">Full Name <span style={{ color: '#a18661' }}>*</span></label>
                  <input
                    className="cpf-input"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setErrors(v => ({ ...v, fullName: '' })) }}
                    autoComplete="name"
                  />
                  {errors.fullName && <p className="cpf-error">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 18 }}>
                  <label className="cpf-label">Phone Number <span style={{ color: '#a18661' }}>*</span></label>
                  <div className="cpf-field-wrap" style={{ marginBottom: 0 }}>
                    <div className="cpf-phone-row">
                      <span className="cpf-phone-prefix">+91</span>
                      <input
                        className="cpf-phone-input"
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        maxLength={10}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setPhone(v)
                          setErrors(ev => ({ ...ev, phone: '' }))
                        }}
                        autoComplete="tel"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  {errors.phone && <p className="cpf-error">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="cpf-field-wrap">
                  <label className="cpf-label">Email Address <span style={{ color: '#a18661' }}>*</span></label>
                  <input
                    className="cpf-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })) }}
                    autoComplete="email"
                  />
                  {errors.email && <p className="cpf-error">{errors.email}</p>}
                </div>

                <button className="cpopup-btn" onClick={handleNext}>
                  Next <ArrowRight size={13} />
                </button>
                <p className="cpf-progress">Step 1 of 2</p>
              </motion.div>
            ) : (
              /* ── Step 2 ── */
              <motion.div
                key="step2"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <button className="cpf-back" onClick={handleBack}>
                  ← Back
                </button>

                {/* Type of Space — dropdown matching Contact page */}
                <div style={{ marginBottom: 18 }}>
                  <label className="cpf-label">Type of Space</label>
                  <div className="cpf-field-wrap" style={{ marginBottom: 0 }}>
                    <select
                      className="cpf-input cpf-select"
                      value={spaceType}
                      onChange={e => setSpaceType(e.target.value)}
                      style={{ color: spaceType === '' ? '#aaa' : '#21291a', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select a space type</option>
                      {['Residential', 'Commercial', 'Office', 'Retail', 'Villa/Bungalow', 'Other'].map(opt => (
                        <option key={opt} value={opt} style={{ color: '#21291a' }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Estimated Budget — dropdown */}
                <div style={{ marginBottom: 18 }}>
                  <label className="cpf-label">
                    Estimated Budget <span style={{ color: '#a18661' }}>*</span>
                  </label>
                  <div className="cpf-field-wrap" style={{ marginBottom: 0 }}>
                    <select
                      className="cpf-input cpf-select"
                      value={budget}
                      onChange={e => { setBudget(e.target.value); setErrors(v => ({ ...v, budget: '' })) }}
                      style={{ color: budget === '' ? '#aaa' : '#21291a', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select a budget range</option>
                      {['₹10 Lakhs', '₹20 Lakhs', '₹30 Lakhs', '₹30 Lakhs+'].map(opt => (
                        <option key={opt} value={opt} style={{ color: '#21291a' }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  {errors.budget && <p className="cpf-error">{errors.budget}</p>}
                </div>

                {/* Location pills */}
                <div style={{ marginBottom: 18 }}>
                  <label className="cpf-label">
                    Project Location <span style={{ color: '#a18661' }}>*</span>
                  </label>
                  <div className="cpf-chips">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        type="button"
                        className={`cpf-chip${location === loc ? ' selected' : ''}`}
                        onClick={() => {
                          setLocation(l => l === loc ? '' : loc)
                          setErrors(e => ({ ...e, location: '' }))
                        }}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                  {errors.location && <p className="cpf-error">{errors.location}</p>}
                </div>

                {/* Brief Requirements */}
                <div style={{ marginBottom: 20 }}>
                  <label className="cpf-label">Brief Requirements</label>
                  <textarea
                    className="cpf-textarea"
                    placeholder="Tell us about your project, style preferences, timeline..."
                    value={requirements}
                    onChange={e => setRequirements(e.target.value)}
                  />
                </div>

                <button
                  className="cpopup-btn"
                  onClick={handleSubmit}
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <><Loader2 size={13} className="cpf-spin" /> Sending...</>
                  ) : (
                    <>Book My Free Consultation <ArrowRight size={13} /></>
                  )}
                </button>

                {status === 'error' && (
                  <p className="cpf-error" style={{ textAlign: 'center', marginTop: 10 }}>
                    {errorMsg}
                  </p>
                )}

                <p className="cpf-progress">Step 2 of 2</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
