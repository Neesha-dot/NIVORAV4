import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'

/* ─── Animation helpers ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

/* ─── Shared label style — matches About / Services pages ── */
const LABEL: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 300,
  fontSize: 10,
  letterSpacing: '0.44em',
  textTransform: 'uppercase',
  color: '#a18661',
}

const steps = [
  'We review your enquiry and match you with the right design approach.',
  'Shweta will personally reach out to schedule a free 30-minute consultation.',
  'We begin understanding your space, lifestyle, and vision.',
  'You receive a tailored design brief and next steps — at no cost.',
]

export default function ThankYou() {
  /* Timing: checkmark(0) → label(0.2) → h1-line1(0.5) → h1-line2(0.7)
             → desc(0.85) → box(1.05) → steps(1.2, 1.3, 1.4, 1.5) → btns(1.65) */
  return (
    <div className="bg-[#f5f2ed] min-h-screen pt-20 flex items-center">
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">

        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-10 flex justify-center"
        >
          <div className="w-24 h-24 border border-[#a18661]/50 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-[#a18661]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Label */}
        <motion.p {...fadeIn(0.2)} style={LABEL} className="mb-6">
          Enquiry Received
        </motion.p>

        {/* Heading — two lines staggered */}
        <div className="mb-6">
          <motion.span
            {...fadeUp(0.5)}
            className="block"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              color: '#21291a',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            Success! Your Vision
          </motion.span>
          <motion.span
            {...fadeUp(0.7)}
            className="block italic"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              color: '#a18661',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            Is in Good Hands.
          </motion.span>
        </div>

        {/* Description */}
        <motion.p
          {...fadeIn(0.85)}
          className="font-light leading-relaxed max-w-md mx-auto mb-10"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 14, color: '#5c5c5c' }}
        >
          Thank you for reaching out to NIVORA. We've received your enquiry and will be in touch within 24 hours to schedule your free consultation.
        </motion.p>

        {/* What Happens Next box */}
        <motion.div
          {...fadeUp(1.05)}
          className="mb-10 text-left rounded-sm"
          style={{
            background: '#ffffff',
            border: '1px solid #e0d9ce',
            boxShadow: '0 4px 24px rgba(33,41,26,0.06)',
            padding: 'clamp(1.5rem, 4vw, 2rem)',
          }}
        >
          <p style={{ ...LABEL, marginBottom: 20 }}>What Happens Next</p>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <motion.li
                key={i}
                {...fadeIn(1.2 + i * 0.1)}
                className="flex items-start gap-4 text-sm font-light"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 14, color: '#2c2c2c', lineHeight: 1.7 }}
              >
                <span
                  className="shrink-0"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#a18661', fontSize: 14, fontWeight: 400 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {step}
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Buttons */}
        <motion.div {...fadeIn(1.65)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#21291a] hover:text-[#f5f2ed]"
            style={{
              border: '1px solid #21291a',
              color: '#21291a',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            Back to Home
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#8a7050]"
            style={{
              background: '#a18661',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            Explore Our Work <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* WhatsApp nudge */}
        <motion.div {...fadeIn(1.8)} className="mt-12">
          <a
            href="https://wa.me/917276687805?text=Hi%20Shweta%2C%20I%20just%20submitted%20an%20enquiry%20on%20your%20website%20and%20would%20love%20to%20chat."
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light transition-colors duration-300 hover:text-[#a18661]"
            style={{ color: '#9c9c9c', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Prefer to chat right now? Message us on WhatsApp →
          </a>
        </motion.div>

      </div>
    </div>
  )
}
