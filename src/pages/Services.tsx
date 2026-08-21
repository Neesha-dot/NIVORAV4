import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import ProcessSection from '../components/ProcessSection'
import { useSiteSettings } from '../hooks/useSiteSettings'
import residentialCover from '../assets/services/residential-interiors-cover.jpg'
import commercialCover from '../assets/services/commercial-interiors-cover.jpg'
import hospitalityCover from '../assets/services/hospitality-interiors-cover.jpg'
import architectureCover from '../assets/services/architecture-space-planning-cover.jpg'
import visualizationCover from '../assets/services/2d-3d-visualization-cover.jpg'
import developerCover from '../assets/services/developer-solutions-cover.jpg'
import renovationCover from '../assets/services/renovation-makeovers-cover.jpg'

const FALLBACK_SERVICE_CARDS = [
  {
    num: '01',
    title: 'Residential Interiors',
    desc: 'Designing elegant homes and living spaces that blend comfort, functionality, and timeless beauty.',
    img: residentialCover,
  },
  {
    num: '02',
    title: 'Commercial Interiors',
    desc: 'Creating productive offices, clinics, retail stores, and professional workspaces.',
    img: commercialCover,
  },
  {
    num: '03',
    title: 'Hospitality Interiors',
    desc: 'Crafting memorable guest experiences through hotels, cafés, restaurants, and hospitality environments.',
    img: hospitalityCover,
  },
  {
    num: '04',
    title: 'Architecture & Space Planning',
    desc: 'Planning layouts, elevations, facades, and architectural concepts for optimized spaces.',
    img: architectureCover,
  },
  {
    num: '05',
    title: '2D & 3D Visualization',
    desc: 'Concept drawings, renders and visual development before execution begins.',
    img: visualizationCover,
  },
  {
    num: '06',
    title: 'Developer Solutions',
    desc: 'Sample flats, amenities and curated experiences that enhance property value.',
    img: developerCover,
  },
  {
    num: '07',
    title: 'Renovation & Makeovers',
    desc: 'Transform existing spaces through upgrades, modernization and thoughtful redesign.',
    img: renovationCover,
  },
]

const SERVICE_DETAILS = [
  {
    num: '01',
    eyebrow: '01 — RESIDENTIAL INTERIORS',
    title: 'Residential Interiors',
    intro: 'Designing Homes That Feel Like You',
    desc: 'Your home should be more than just a place to live—it should reflect your personality, lifestyle, and aspirations. Whether you’re moving into a new apartment, building your dream villa, renovating an existing home, or creating a weekend retreat, we design spaces that are functional, timeless, and uniquely yours.',
    expertise: ['Apartments & Flats', 'Villas & Bungalows', 'Luxury Residences', 'Modular Kitchens', 'Bedrooms & Living Spaces', 'Custom Storage Solutions'],
    img: residentialCover,
  },
  {
    num: '02',
    eyebrow: '02 — COMMERCIAL INTERIORS',
    title: 'Commercial Interiors',
    intro: 'Spaces Designed for Productivity & Impact',
    desc: 'A well-designed workspace inspires creativity, improves efficiency, and leaves a lasting impression on clients and visitors. From corporate offices and co-working spaces to retail stores, clinics, and fitness studios, we create environments that balance functionality, comfort, and brand identity.',
    expertise: ['Corporate Offices', 'Co-working Spaces', 'Retail Stores', 'Clinics & Healthcare Facilities', 'Fitness Studios & Gyms', 'Reception & Waiting Areas'],
    img: commercialCover,
  },
  {
    num: '03',
    eyebrow: '03 — HOSPITALITY INTERIORS',
    title: 'Hospitality Interiors',
    intro: 'Creating Experiences Through Design',
    desc: 'In hospitality, every detail contributes to the guest experience. We design inviting and memorable environments that combine aesthetics, comfort, and functionality, ensuring every visitor feels welcomed and inspired.',
    expertise: ['Cafés & Restaurants', 'Hotels & Resorts', 'Lounges & Clubhouses', 'Spas & Wellness Centres', 'Banquet & Event Spaces', 'Guest Experience Design'],
    img: hospitalityCover,
  },
  {
    num: '04',
    eyebrow: '04 — ARCHITECTURE & SPACE PLANNING',
    title: 'Architecture & Space Planning',
    intro: 'Building Strong Foundations for Exceptional Spaces',
    desc: 'Great design begins with thoughtful planning. Our architectural and space planning services focus on creating efficient layouts, striking elevations, and well-balanced spaces that maximize both aesthetics and functionality.',
    expertise: ['Architectural Planning', 'Floor Plans & Layouts', 'Elevation Design', 'Facade Design', 'Space Optimization', 'Design Development'],
    img: architectureCover,
  },
  {
    num: '05',
    eyebrow: '05 — INTERIOR DESIGN & 3D VISUALIZATION',
    title: 'Interior Design & 3D Visualization',
    intro: 'Bringing Ideas to Life Before Execution',
    desc: 'Visualize your future space with confidence through detailed drawings and realistic 3D renderings. Our design process helps you explore layouts, materials, finishes, and design concepts before construction begins.',
    expertise: ['Space Planning', 'Concept Development', '2D Drawings', '3D Visualizations', 'Material Selection', 'Design Presentations'],
    img: visualizationCover,
  },
  {
    num: '06',
    eyebrow: '06 — DEVELOPER & BUILDER SOLUTIONS',
    title: 'Developer & Builder Solutions',
    intro: 'Enhancing Properties to Maximize Market Appeal',
    desc: 'We collaborate with developers and builders to create thoughtfully designed spaces that elevate property value and attract potential buyers. From show apartments to common amenities, every space is crafted to leave a lasting impression.',
    expertise: ['Sample Flats', 'Sales Offices', 'Clubhouses', 'Entrance Lobbies', 'Amenity Spaces', 'Common Area Design'],
    img: developerCover,
  },
  {
    num: '07',
    eyebrow: '07 — RENOVATION & MAKEOVERS',
    title: 'Renovation & Makeovers',
    intro: 'Transforming Existing Spaces with Purpose',
    desc: 'Whether you’re updating a home, refreshing a workplace, or modernizing an outdated interior, our renovation services breathe new life into existing spaces while preserving what matters most.',
    expertise: ['Home Renovations', 'Office Refurbishments', 'Kitchen Upgrades', 'Space Reconfiguration', 'Interior Refreshes', 'Styling & Décor Enhancements'],
    img: renovationCover,
  },
]

const STAGGER = [100, 200, 300, 400]

interface ServiceCardData { num: string; title: string; desc: string; img: string }

function ServiceCard({ card, index, onCardClick }: { card: ServiceCardData; index: number; onCardClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const delay = STAGGER[index] ?? index * 100

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.96)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div
        onClick={onCardClick}
        className="svc-card-pm"
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 18,
          height: 'var(--card-h)',
          cursor: 'pointer',
        }}
      >
        {/* Skeleton shimmer while image loads */}
        {!imgLoaded && (
          <div className="svc-skeleton" style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 18,
            background: 'linear-gradient(90deg, #e8e2d9 0%, #f0ebe4 40%, #e8e2d9 80%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonPulse 1.4s ease infinite',
            zIndex: 1,
          }} />
        )}

        {/* Background image */}
        <img
          src={card.img}
          alt={card.title}
          className="svc-img-pm"
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)',
            transform: 'scale(1)',
            zIndex: 2,
          }}
          loading="lazy"
        />

        {/* Base gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,14,8,0.15) 0%, rgba(8,14,8,0.48) 50%, rgba(6,10,6,0.88) 100%)',
          zIndex: 3,
          transition: 'background 0.45s ease',
          borderRadius: 18,
        }} className="svc-base-overlay-pm" />

        {/* Hover overlay */}
        <div className="svc-hover-overlay-pm" style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5,10,5,0.32)',
          opacity: 0,
          transition: 'opacity 0.45s ease',
          zIndex: 4,
          borderRadius: 18,
        }} />

        {/* Gold accent line */}
        <div className="svc-accent-pm" style={{
          position: 'absolute',
          bottom: 0,
          left: 18,
          right: 18,
          height: 2,
          background: 'linear-gradient(90deg, #C9A96E, #e8d5a3 50%, #C9A96E)',
          borderRadius: '0 0 18px 18px',
          width: 0,
          transition: 'width 0.55s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 10,
        }} />

        {/* Service number */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 22,
          zIndex: 8,
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: '0.95rem',
          letterSpacing: '0.08em',
          color: 'rgba(201,169,110,0.85)',
          lineHeight: 1,
        }}>{card.num}</div>

        {/* Bottom content */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.6rem 1.5rem 1.5rem',
          zIndex: 9,
        }}>
          {/* Title */}
          <h3
            className="svc-title-pm"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)',
              color: '#f5f0e8',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: '0.65rem',
              letterSpacing: '0.01em',
              transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}
          >{card.title}</h3>

          {/* Description */}
          <p
            className="svc-desc-pm"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: 12,
              color: 'rgba(245,240,232,0.78)',
              lineHeight: 1.65,
              margin: 0,
              opacity: 0,
              transform: 'translateY(12px)',
              transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}
          >{card.desc}</p>
        </div>
      </div>
    </div>
  )
}

function ServiceDetailSection({
  service,
  index,
  image,
}: {
  service: typeof SERVICE_DETAILS[number]
  index: number
  image: string
}) {
  const imageOnLeft = index % 2 === 0

  return (
    <article className={`svc-detail ${index % 2 ? 'svc-detail-reverse' : ''}`}>
      <ServiceReveal
        className="svc-detail-image-reveal"
        direction={imageOnLeft ? 'left' : 'right'}
      >
        <div className="svc-detail-image-wrap">
          <img
            src={image}
            alt={service.title}
            className="svc-detail-image"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      </ServiceReveal>
      <ServiceReveal
        className="svc-detail-content-reveal"
        direction="up"
        delay={0.12}
      >
        <div className="svc-detail-content">
          <ServiceReveal delay={0}>
            <p className="svc-detail-eyebrow">{service.eyebrow}</p>
          </ServiceReveal>
          <ServiceReveal delay={0.06}>
            <h2>{service.title}</h2>
          </ServiceReveal>
          <ServiceReveal delay={0.12}>
            <h3>{service.intro}</h3>
          </ServiceReveal>
          <ServiceReveal delay={0.18}>
            <p className="svc-detail-description">{service.desc}</p>
          </ServiceReveal>
          <ServiceReveal delay={0.24}>
            <p className="svc-detail-expertise-label">Our Expertise</p>
          </ServiceReveal>
          <ul className="svc-detail-expertise">
            {service.expertise.map((item, itemIndex) => (
              <li key={item}>
                <ServiceReveal delay={0.3 + itemIndex * 0.06}>{item}</ServiceReveal>
              </li>
            ))}
          </ul>
        </div>
      </ServiceReveal>
    </article>
  )
}

function ServiceReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const desktopOffset =
    direction === 'left' ? { x: -36, y: 0 }
      : direction === 'right' ? { x: 36, y: 0 }
        : { x: 0, y: 24 }
  const initialOffset = isMobile ? { x: 0, y: 24 } : desktopOffset

  return (
    <motion.div
      ref={ref}
      className={`svc-reveal ${className}`}
      initial={{ opacity: 0, ...initialOffset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initialOffset }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Services() {
  const ctaRef = useRef<HTMLElement>(null)
  const { settings } = useSiteSettings()

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Merge DB service list with auto-generated num field; fall back to hardcoded
  const serviceCards = settings?.servicesList?.length
    ? settings.servicesList.map((s, i) => ({
        num: String(i + 1).padStart(2, '0'),
        title: s.title,
        desc: s.desc,
        img: s.img,
      }))
    : FALLBACK_SERVICE_CARDS

  const pageHeadline   = settings?.servicePageHero?.headline    || 'Our Services'
  const pageSubheading = settings?.servicePageHero?.subheadline || 'Complete interior design and architecture services — from first conversation to final reveal.'

  return (
    <div style={{ backgroundColor: '#f5f2ed', minHeight: '100vh' }}>
      <style>{`
        :root {
          --card-h: 460px;
          --svc-col-gap: 24px;
          --svc-row-gap: 28px;
        }
        @media (max-width: 1024px) {
          :root { --card-h: 380px; --svc-col-gap: 20px; --svc-row-gap: 24px; }
        }
        @media (max-width: 640px) {
          :root { --card-h: 300px; --svc-col-gap: 0px; --svc-row-gap: 20px; }
        }

        @keyframes skeletonPulse {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .svc-card-pm {
          box-shadow: 0 6px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          transition:
            box-shadow 0.5s cubic-bezier(0.16,1,0.3,1),
            transform 0.5s cubic-bezier(0.16,1,0.3,1) !important;
        }
        .svc-card-pm:hover {
          box-shadow: 0 20px 64px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.12) !important;
          transform: translateY(-10px) !important;
        }
        .svc-card-pm:hover .svc-img-pm {
          transform: scale(1.08) !important;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1) !important;
        }
        .svc-card-pm:hover .svc-hover-overlay-pm {
          opacity: 1 !important;
        }
        .svc-card-pm:hover .svc-title-pm {
          transform: translateY(-4px);
        }
        .svc-card-pm:hover .svc-desc-pm {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .svc-card-pm:hover .svc-accent-pm {
          width: calc(100% - 36px) !important;
        }

        .svc-grid-pm {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: var(--svc-col-gap);
          row-gap: var(--svc-row-gap);
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 640px) {
          .svc-grid-pm {
            grid-template-columns: 1fr !important;
          }
          .svc-desc-pm {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        }

        /* Residential service editorial layout — intentionally local to this page. */
        .svc-residential-detail {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: center;
          gap: clamp(2.5rem, 6vw, 7rem);
          padding: 2rem 0 3.5rem;
        }
        .svc-residential-detail .svc-residential-image-wrap {
          overflow: hidden;
          border-radius: 18px;
          box-shadow: 0 14px 40px rgba(20,18,14,0.12);
        }
        .svc-residential-detail .svc-residential-image {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1.08;
          object-fit: cover;
        }
        .svc-residential-detail .svc-residential-content {
          padding: 1rem 0;
        }
        .svc-residential-detail .svc-residential-eyebrow,
        .svc-residential-detail .svc-residential-label {
          color: #C9A96E;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.26em;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .svc-residential-detail .svc-residential-eyebrow {
          margin-bottom: 1.2rem;
        }
        .svc-residential-detail h2 {
          color: #1C2818;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.15rem, 4vw, 3.5rem);
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 1.35rem;
        }
        .svc-residential-detail h3 {
          color: #33452F;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.45rem, 2.4vw, 2.1rem);
          font-style: italic;
          font-weight: 400;
          line-height: 1.15;
          margin-bottom: 1.25rem;
        }
        .svc-residential-detail .svc-residential-description {
          color: rgba(28,40,24,0.62);
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.85;
          margin-bottom: 2rem;
          max-width: 520px;
        }
        .svc-residential-detail .svc-residential-label {
          margin-bottom: 1rem;
        }
        .svc-residential-detail .svc-residential-expertise {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .svc-residential-detail .svc-residential-expertise li {
          color: rgba(28,40,24,0.7);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.45;
          padding-left: 1rem;
          position: relative;
        }
        .svc-residential-detail .svc-residential-expertise li::before {
          background: #C9A96E;
          border-radius: 50%;
          content: '';
          height: 4px;
          left: 0;
          position: absolute;
          top: 0.55em;
          width: 4px;
        }
        @media (max-width: 640px) {
          .svc-residential-detail {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 2rem;
            padding: 0 0 2rem;
          }
          .svc-residential-detail .svc-residential-content {
            padding: 0 0.25rem;
          }
          .svc-residential-detail .svc-residential-image {
            aspect-ratio: 1.18 / 1;
          }
          .svc-commercial-detail {
            flex-direction: column-reverse;
          }
        }
        @media (max-width: 460px) {
          .svc-residential-detail .svc-residential-expertise {
            grid-template-columns: 1fr;
          }
        }
        .svc-readable-detail .svc-residential-description {
          font-size: 17px;
        }
        .svc-readable-detail .svc-residential-label {
          font-size: 12px;
        }
        .svc-readable-detail .svc-residential-expertise li {
          font-size: 17px;
        }

        /* Shared seven-section editorial layout. The grid row is sized by the
           content column; the image fills that row and crops with object-fit. */
        .svc-detail {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: stretch;
          gap: clamp(2.5rem, 6vw, 7rem);
          padding: 2rem 0 3.5rem;
        }
        .svc-detail > .svc-detail-image-reveal {
          grid-column: 1;
          grid-row: 1;
          min-width: 0;
        }
        .svc-detail > .svc-detail-content-reveal {
          grid-column: 2;
          grid-row: 1;
          min-width: 0;
        }
        .svc-detail-reverse > .svc-detail-image-reveal {
          grid-column: 2;
        }
        .svc-detail-reverse > .svc-detail-content-reveal {
          grid-column: 1;
        }
        .svc-detail-image-reveal,
        .svc-detail-content-reveal,
        .svc-detail-image-wrap,
        .svc-detail-content {
          height: 100%;
        }
        .svc-detail-image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          box-shadow: 0 14px 40px rgba(20,18,14,0.12);
          min-height: 0;
        }
        .svc-detail-image {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .svc-detail-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1rem 0;
        }
        .svc-detail-eyebrow,
        .svc-detail-expertise-label {
          color: #C9A96E;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.26em;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .svc-detail-eyebrow {
          margin-bottom: 1.2rem;
        }
        .svc-detail h2 {
          color: #1C2818;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.15rem, 4vw, 3.5rem);
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 1.35rem;
        }
        .svc-detail h3 {
          color: #33452F;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.45rem, 2.4vw, 2.1rem);
          font-style: italic;
          font-weight: 400;
          line-height: 1.15;
          margin-bottom: 1.25rem;
        }
        .svc-detail-description {
          color: rgba(28,40,24,0.62);
          font-family: 'Jost', sans-serif;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.85;
          margin-bottom: 2rem;
          max-width: 520px;
        }
        .svc-detail-expertise-label {
          font-size: 12px;
          margin-bottom: 1rem;
        }
        .svc-detail-expertise {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .svc-detail-expertise li {
          color: rgba(28,40,24,0.7);
          font-family: 'Jost', sans-serif;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.45;
          padding-left: 1rem;
          position: relative;
        }
        .svc-detail-expertise li::before {
          background: #C9A96E;
          border-radius: 50%;
          content: '';
          height: 5px;
          left: 0;
          position: absolute;
          top: 0.55em;
          width: 5px;
        }
        @media (max-width: 640px) {
          .svc-detail,
          .svc-detail-reverse {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 2rem;
            padding: 0 0 2rem;
          }
          .svc-detail > .svc-detail-image-reveal,
          .svc-detail > .svc-detail-content-reveal {
            order: initial;
            height: auto;
          }
          .svc-detail-image-wrap {
            position: relative;
            height: auto;
            aspect-ratio: 1.18 / 1;
          }
          .svc-detail-image {
            position: static;
            inset: auto;
            height: 100%;
            min-height: 0;
          }
          .svc-detail-content {
            height: auto;
            padding: 0 0.25rem;
          }
        }
        @media (max-width: 460px) {
          .svc-detail-expertise {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Page header */}
      <section style={{
        paddingTop: 96,
        paddingBottom: 48,
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        textAlign: 'center',
        maxWidth: 620,
        margin: '0 auto',
      }}>
        <FadeIn>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: '#9B7D4E',
            marginBottom: '0.9rem',
          }}>What We Offer</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
            color: '#1C2818',
            lineHeight: 1.06,
            marginBottom: '1rem',
            letterSpacing: '-0.01em',
          }}>{pageHeadline}</h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            color: 'rgba(28,40,24,0.48)',
            lineHeight: 1.85,
          }}>
            {pageSubheading}
          </p>
        </FadeIn>
      </section>

      {/* Gold divider */}
      <FadeIn>
        <div style={{
          width: 44,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
          margin: '0 auto 64px',
        }} />
      </FadeIn>

      {/* Cards */}
      <section style={{
        maxWidth: 1180,
        margin: '0 auto',
        padding: '0 2rem 80px',
      }}>
        <div className="svc-grid-pm">
          {serviceCards.map((card, i) => (
            <ServiceDetailSection
              key={card.num}
              service={SERVICE_DETAILS[i]}
              index={i}
              image={card.img || SERVICE_DETAILS[i].img}
            />
          ))}
        </div>
      </section>

      {/* Process */}
      <ProcessSection />

      {/* CTA */}
      <section
        ref={ctaRef}
        style={{
          backgroundColor: '#21291a',
          padding: '88px 1.5rem',
          textAlign: 'center',
        }}
      >
        <FadeIn>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: '#9B7D4E',
            marginBottom: '1rem',
          }}>Ready to Begin?</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#f5f0e8',
            fontStyle: 'italic',
            lineHeight: 1.15,
            marginBottom: '1.4rem',
          }}>Not sure where to start?</h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: 'rgba(245,240,232,0.42)',
            lineHeight: 1.85,
            maxWidth: 400,
            margin: '0 auto 2.75rem',
          }}>
            Book a free consultation and we'll guide you through the best approach for your project.
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#a18661',
              color: '#1C2818',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '18px 48px',
              textDecoration: 'none',
              borderRadius: 2,
              transition: 'background 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = '#ddb97a'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = '#a18661'
              el.style.transform = 'translateY(0)'
            }}
          >
            Book Free Consultation <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </FadeIn>
      </section>
    </div>
  )
}
