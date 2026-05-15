import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PRODUCTS, CHEFS, REVIEWS, GALLERY } from '../../constants/mockData'
import useCartStore from '../../store/useCartStore'

const W = { maxWidth: 1280, margin: '0 auto', padding: '0 40px' }
const C = {
  cream: '#fdf8f3', chocolate: '#2c1810',
  pink: '#e8698a', gold: '#c9a96e', muted: '#8c7b6e',
  border: 'rgba(232,213,188,0.6)',
}
const MARQUEE_ITEMS = ['Торты', 'Эклеры', 'Макаруны', 'Капкейки', 'Трюфели', 'Тарты', 'Круассаны', 'Чизкейки', 'Мадленки', 'Канеле']

/* ── Helpers ───────────────────────────────────────── */

function FadeIn({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function Stars({ rating }) {
  return (
    <span style={{ color: C.gold, fontSize: 12, letterSpacing: 1 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  )
}

function Badge({ type }) {
  if (!type) return null
  const map = {
    hit: { bg: '#fce8ed', color: '#e8698a', label: '♥ ХИТ' },
    new: { bg: '#dcfce7', color: '#16a34a', label: '✦ НОВИНКА' },
    top: { bg: '#fef9c3', color: '#a16207', label: '★ ТОП' },
  }
  const s = map[type]
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, backgroundColor: s.bg, color: s.color, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 99 }}>
      {s.label}
    </div>
  )
}

function StatCounter({ value, suffix = '', label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800
        const start = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1)
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.6 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: 700, color: '#fdf8f3', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ color: 'rgba(232,213,188,0.6)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8 }}>{label}</div>
    </div>
  )
}

/* Floating image: outer handles hover, inner handles float */
function FloatImg({ src, alt, w, h, rotate, hoverRotate, hoverScale = 1.05, floatAmp, floatDuration, floatDelay, glass, style = {} }) {
  return (
    <motion.div
      initial={{ rotate }}
      whileHover={{ scale: hoverScale, rotate: hoverRotate, zIndex: 20 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', ...style }}
    >
      <motion.div
        animate={{ y: [0, -floatAmp, 0] }}
        transition={{ repeat: Infinity, duration: floatDuration, ease: 'easeInOut', delay: floatDelay }}
      >
        <img src={src} alt={alt} style={{ width: w, height: h, objectFit: 'cover', borderRadius: 22, display: 'block', boxShadow: '0 24px 70px rgba(44,24,16,0.2), 0 4px 16px rgba(44,24,16,0.09)' }} />
        {glass && (
          <div style={{ ...glass.style, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: 12, padding: '7px 13px', fontSize: 11, fontWeight: 600, color: C.chocolate, boxShadow: '0 2px 12px rgba(44,24,16,0.1)', whiteSpace: 'nowrap' }}>
            {glass.label}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function HScrollArrows({ scrollRef }) {
  const scroll = (d) => scrollRef.current?.scrollBy({ left: d * 320, behavior: 'smooth' })
  return (
    <>
      {[-1, 1].map((d) => (
        <button
          key={d}
          onClick={() => scroll(d)}
          className="desk-nav"
          style={{ position: 'absolute', [d === -1 ? 'left' : 'right']: -20, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fff', border: `1px solid ${C.border}`, boxShadow: '0 4px 16px rgba(44,24,16,0.1)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: C.chocolate }}
        >
          {d === -1 ? '←' : '→'}
        </button>
      ))}
    </>
  )
}

/* ── Product Card ─────────────────────────────────── */
function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }
  return (
    <motion.div
      whileHover={{ y: -9 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', border: `1px solid ${C.border}`, boxShadow: '0 2px 14px rgba(44,24,16,0.06)', flexShrink: 0 }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <Badge type={product.badge} />
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            src={product.image} alt={product.name}
            style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
          />
        </div>
      </Link>
      <div style={{ padding: '16px 18px 18px' }}>
        <p style={{ color: C.muted, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>{product.venue}</p>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: C.chocolate, fontSize: 18, lineHeight: 1.2, marginBottom: 8 }}>{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 10.5, color: C.muted }}>{product.rating} ({product.reviews})</span>
          {product.weight && (
            <span style={{ marginLeft: 'auto', fontSize: 10.5, color: C.muted, backgroundColor: C.cream, padding: '2px 8px', borderRadius: 99 }}>
              {product.weight}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ color: C.pink, fontWeight: 700, fontSize: 18 }}>{product.price.toLocaleString()} ₸</span>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            style={{ backgroundColor: added ? '#dcfce7' : C.chocolate, color: added ? '#16a34a' : '#fdf8f3', border: 'none', borderRadius: 99, padding: '8px 16px', fontSize: 10.5, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', whiteSpace: 'nowrap', transition: 'background-color 0.3s, color 0.3s' }}
          >
            {added ? '✓ Добавлено' : 'В корзину'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Chef Card ────────────────────────────────────── */
function ChefCard({ chef }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ backgroundColor: '#fff', borderRadius: 22, border: `1px solid ${C.border}`, padding: '28px 24px', textAlign: 'center', minWidth: 220, flexShrink: 0, boxShadow: '0 2px 12px rgba(44,24,16,0.05)' }}
    >
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: chef.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(44,24,16,0.16)' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#fff' }}>{chef.initials}</span>
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: C.chocolate, marginBottom: 4 }}>{chef.name}</h3>
      <p style={{ color: C.muted, fontSize: 11.5, marginBottom: 14 }}>{chef.specialty}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.chocolate }}>{chef.orders}</div>
          <div style={{ fontSize: 9.5, color: C.muted, letterSpacing: '0.08em' }}>заказов</div>
        </div>
        <div style={{ width: 1, backgroundColor: C.border }} />
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.chocolate }}>⭐ {chef.rating}</div>
          <div style={{ fontSize: 9.5, color: C.muted, letterSpacing: '0.08em' }}>рейтинг</div>
        </div>
        <div style={{ width: 1, backgroundColor: C.border }} />
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.chocolate }}>{chef.years}</div>
          <div style={{ fontSize: 9.5, color: C.muted, letterSpacing: '0.08em' }}>лет</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Review Card ──────────────────────────────────── */
function ReviewCard({ review }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ backgroundColor: '#fff', borderRadius: 22, border: `1px solid ${C.border}`, padding: '28px', boxShadow: '0 2px 12px rgba(44,24,16,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Stars rating={review.rating} />
        <span style={{ fontSize: 11, color: C.muted }}>{review.date}</span>
      </div>
      <p style={{ color: '#4a3728', fontSize: 13.5, lineHeight: 1.78, fontWeight: 300, marginBottom: 20, fontStyle: 'italic' }}>
        «{review.text}»
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: review.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: review.textColor }}>{review.initials}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.chocolate }}>{review.name}</span>
        </div>
        <span style={{ fontSize: 10, color: C.muted, backgroundColor: C.cream, padding: '3px 10px', borderRadius: 99, letterSpacing: '0.04em' }}>
          {review.product}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Gallery Item ─────────────────────────────────── */
function GalleryItem({ item, style = {} }) {
  return (
    <motion.div
      whileHover="hover"
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 18, cursor: 'pointer', backgroundColor: '#e8d5bc', ...style }}
    >
      <motion.img
        variants={{ hover: { scale: 1.08 } }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        src={item.src} alt={item.alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(44,24,16,0.5), rgba(232,105,138,0.35))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        <span style={{ fontSize: 26 }}>📷</span>
        <span style={{ color: '#fff', fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>СМОТРЕТЬ</span>
      </motion.div>
    </motion.div>
  )
}

/* ── Main Component ───────────────────────────────── */
export default function HomePage() {
  const featured = PRODUCTS.slice(0, 4)
  const { scrollY } = useScroll()
  const leftY  = useTransform(scrollY, [0, 700], [0, -55])
  const rightY = useTransform(scrollY, [0, 700], [0, -35])

  const chefsRef = useRef(null)

  return (
    <div style={{ backgroundColor: C.cream }} className="main-content">

      {/* ── HERO ── */}
      <section className="grain-hero" style={{ backgroundColor: C.cream, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-28%', left: '-2%', width: 850, height: 850, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,138,0.19) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: '-22%', right: '-8%', width: 750, height: 750, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', top: '20%', left: '35%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,213,188,0.3) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', top: '65%', left: '12%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,138,0.1) 0%, transparent 60%)' }} />
        </div>

        <div className="hero-grid" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px 1fr', alignItems: 'center', minHeight: '91vh', position: 'relative', zIndex: 1 }}>

          <motion.div className="hero-photos" style={{ y: leftY, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14, paddingRight: 36, paddingTop: 40 }}>
            <FloatImg src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=85" alt="Торт" w={172} h={270} rotate={-3} hoverRotate={-1} floatAmp={14} floatDuration={6.5} floatDelay={0} glass={{ label: '⭐ 4.9 · Популярное', style: { position: 'absolute', bottom: 14, left: 12, right: 12 } }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 88 }}>
              <FloatImg src="https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=85" alt="Наполеон" w={130} h={162} rotate={2} hoverRotate={4} hoverScale={1.07} floatAmp={10} floatDuration={5.2} floatDelay={0.9} />
              <FloatImg src="https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&q=85" alt="Эклеры" w={130} h={120} rotate={-1.5} hoverRotate={-3.5} hoverScale={1.07} floatAmp={8} floatDuration={4.6} floatDelay={1.7} />
            </div>
          </motion.div>

          <div className="hero-center" style={{ textAlign: 'center', padding: '72px 0', zIndex: 2 }}>
            <motion.div className="hero-badge" initial={{ opacity: 0, scale: 0.82, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(232,213,188,0.85)', borderRadius: 99, padding: '8px 18px 8px 12px', marginBottom: 28, boxShadow: '0 4px 24px rgba(44,24,16,0.1)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.25)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: C.chocolate, letterSpacing: '0.04em' }}>Актобе · Доставка 60 мин</span>
            </motion.div>

            <motion.h1 className="hero-h1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: "'Cormorant Garamond', serif", color: C.chocolate, lineHeight: 1.01, fontWeight: 700, marginBottom: 22, fontSize: 'clamp(3.2rem, 5.5vw, 6.2rem)' }}>
              Торты<br />
              <em style={{ background: 'linear-gradient(135deg, #e8698a 10%, #c94a6a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'normal' }}>с душой</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.78, delay: 0.22 }} style={{ color: C.muted, fontSize: 15, maxWidth: 308, margin: '0 auto 38px', lineHeight: 1.82, fontWeight: 300 }}>
              Десерты от лучших кондитеров Актобе. Готовые изделия или созданные специально для вас.
            </motion.p>

            <motion.div className="hero-btns" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.68, delay: 0.34 }} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.22 }}>
                <Link to="/catalog" style={{ display: 'block', backgroundColor: C.chocolate, color: C.cream, fontWeight: 600, padding: '14px 36px', borderRadius: 99, textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', boxShadow: '0 10px 30px rgba(44,24,16,0.3)' }}>СМОТРЕТЬ КАТАЛОГ</Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.22 }}>
                <Link to="/constructor" style={{ display: 'block', border: '1.5px solid rgba(44,24,16,0.2)', color: C.chocolate, fontWeight: 500, padding: '14px 36px', borderRadius: 99, textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', backgroundColor: 'rgba(255,255,255,0.74)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>СОБРАТЬ ТОРТ ✨</Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.65 }} style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 36, paddingTop: 30, borderTop: '1px solid rgba(44,24,16,0.07)' }}>
              {[['500+', 'Заказов'], ['4.9 ⭐', 'Рейтинг'], ['60 мин', 'Доставка']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.chocolate, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: '0.1em', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.42 }} className="mob-hero-img" style={{ position: 'relative', display: 'none', marginTop: 38 }}>
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85" alt="Торт" style={{ width: '100%', height: 268, objectFit: 'cover', borderRadius: 24, boxShadow: '0 24px 64px rgba(44,24,16,0.18)', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: 11, padding: '7px 13px', fontSize: 11, fontWeight: 600, color: C.chocolate }}>⭐ 4.9 · Популярное</div>
            </motion.div>
          </div>

          <motion.div className="hero-photos" style={{ y: rightY, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 14, paddingLeft: 36, paddingTop: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: -88 }}>
              <FloatImg src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=85" alt="Чизкейк" w={130} h={154} rotate={1.5} hoverRotate={3.5} hoverScale={1.07} floatAmp={12} floatDuration={5.8} floatDelay={0.5} />
              <FloatImg src="https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=85" alt="Макаруны" w={130} h={132} rotate={-2} hoverRotate={-4} hoverScale={1.07} floatAmp={9} floatDuration={4.9} floatDelay={1.3} />
            </div>
            <FloatImg src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=85" alt="Торт 2" w={172} h={292} rotate={3} hoverRotate={1} floatAmp={16} floatDuration={7.2} floatDelay={0.25} glass={{ label: '🎂 На заказ', style: { position: 'absolute', top: 14, right: 12 } }} />
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }} className="desk-nav" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, color: C.muted, fontSize: 9, letterSpacing: '0.4em' }}>
          <div style={{ width: 1, height: 30, background: `linear-gradient(to bottom, transparent, ${C.muted}55)` }} />
          ЛИСТАТЬ
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ backgroundColor: '#2c1810', padding: '14px 0', overflow: 'hidden', userSelect: 'none' }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 20px' }}>
              <span style={{ color: 'rgba(232,213,188,0.58)', fontSize: 10.5, letterSpacing: '0.36em', textTransform: 'uppercase', fontWeight: 500 }}>{item}</span>
              <span style={{ color: '#c9a96e', marginLeft: 20, fontSize: 5.5 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: '#2c1810', padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(232,105,138,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.1) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div className="page-w" style={W}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative' }}>
            {[
              { value: 500, suffix: '+', label: 'Заказов выполнено' },
              { value: 4, suffix: '.9 ⭐', label: 'Средний рейтинг' },
              { value: 20, suffix: '+', label: 'Кондитеров партнёров' },
              { value: 3, suffix: ' года', label: 'На рынке Актобе' },
            ].map((s) => (
              <FadeIn key={s.label}>
                <div style={{ borderLeft: '1px solid rgba(232,213,188,0.15)', paddingLeft: 28, paddingRight: 12 }}>
                  <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── КАТЕГОРИИ ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ marginBottom: 42 }}>
            <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Что вас интересует</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Наш ассортимент</h2>
          </FadeIn>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {CATEGORIES_DATA.map((c, i) => (
              <FadeIn key={c.label} delay={i * 0.08}>
                <motion.div whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                  <Link to={c.to} style={{ textDecoration: 'none', display: 'block', backgroundColor: C.cream, borderRadius: 22, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(44,24,16,0.05)' }}>
                    <div style={{ height: 106, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.gradient, fontSize: 44 }}>{c.icon}</div>
                    <div style={{ padding: '14px 18px 18px' }}>
                      <p style={{ fontWeight: 600, color: C.chocolate, fontSize: 14, marginBottom: 3 }}>{c.label}</p>
                      <p style={{ color: C.muted, fontSize: 12 }}>{c.sub}</p>
                    </div>
                  </Link>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОПУЛЯРНЫЕ ТОВАРЫ ── */}
      <section className="sec-pad" style={{ backgroundColor: C.cream, padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 42, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Топ недели</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Популярное</h2>
            </div>
            <Link to="/catalog" style={{ color: C.muted, textDecoration: 'none', fontSize: 13, letterSpacing: '0.04em' }}>Смотреть все товары →</Link>
          </FadeIn>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {featured.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.08}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── КАК ЭТО РАБОТАЕТ ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '72px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Просто и быстро</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Как это работает</h2>
          </FadeIn>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative' }}>
            {/* connecting line desktop */}
            <div className="desk-nav" style={{ position: 'absolute', top: 36, left: '16.6%', right: '16.6%', height: 1, background: `linear-gradient(to right, ${C.gold}30, ${C.gold}60, ${C.gold}30)` }} />
            {HOW_IT_WORKS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.12}>
                <div style={{ textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: step.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: `0 8px 28px ${step.shadow}`, position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: 28 }}>{step.icon}</span>
                  </div>
                  <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>ШАГ {String(i + 1).padStart(2, '0')}</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: C.chocolate, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── КОНДИТЕРЫ ── */}
      <section className="sec-pad" style={{ backgroundColor: C.cream, padding: '68px 0' }}>
        <div className="page-w" style={{ ...W, position: 'relative' }}>
          <FadeIn style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 42, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Наши мастера</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Кондитеры Актобе</h2>
            </div>
            <Link to="/catalog" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>Все кондитеры →</Link>
          </FadeIn>
          <div style={{ position: 'relative' }}>
            <div ref={chefsRef} style={{ display: 'flex', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 4, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {CHEFS.map((chef, i) => (
                <motion.div key={chef.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.55 }} style={{ scrollSnapAlign: 'start' }}>
                  <ChefCard chef={chef} />
                </motion.div>
              ))}
            </div>
            <HScrollArrows scrollRef={chefsRef} />
          </div>
        </div>
      </section>

      {/* ── ОТЗЫВЫ ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Говорят клиенты</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Отзывы</h2>
          </FadeIn>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {REVIEWS.map((review, i) => (
              <FadeIn key={review.id} delay={i * 0.1}>
                <ReviewCard review={review} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ГАЛЕРЕЯ ── */}
      <section className="sec-pad" style={{ backgroundColor: C.cream, padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 42, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Наши работы</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Галерея</h2>
            </div>
            <Link to="/catalog" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>Перейти в каталог →</Link>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '260px 200px', gap: 12 }}>
            <GalleryItem item={GALLERY[0]} style={{ gridRow: 'span 2' }} />
            <GalleryItem item={GALLERY[1]} />
            <GalleryItem item={GALLERY[2]} />
            <GalleryItem item={GALLERY[3]} style={{ gridColumn: 'span 2' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <GalleryItem item={GALLERY[4]} style={{ height: 200 }} />
            <GalleryItem item={GALLERY[5]} style={{ height: 200 }} />
          </div>
        </div>
      </section>

      {/* ── БАННЕР КОНСТРУКТОРА ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn>
            <div className="cta-banner" style={{ background: 'linear-gradient(135deg, #2c1810 0%, #3d2215 55%, #52291a 100%)', borderRadius: 28, padding: '60px 76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 36, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 76% 42%, rgba(232,105,138,0.22) 0%, transparent 50%), radial-gradient(ellipse at 16% 85%, rgba(201,169,110,0.15) 0%, transparent 46%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: C.gold, letterSpacing: '0.36em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 15 }}>Эксклюзив</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 2.5vw, 2.7rem)', fontWeight: 700, color: '#fdf8f3', marginBottom: 14, lineHeight: 1.1 }}>Твой торт — твои правила</h2>
                <p style={{ color: 'rgba(253,248,243,0.5)', maxWidth: 380, lineHeight: 1.8, fontSize: 14, fontWeight: 300 }}>Выбери основу, начинку, форму и оформление. Кондитеры Актобе предложат цену.</p>
              </div>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <Link to="/constructor" style={{ display: 'block', backgroundColor: '#fdf8f3', color: C.chocolate, fontWeight: 700, padding: '17px 44px', borderRadius: 99, textDecoration: 'none', fontSize: 12, letterSpacing: '0.09em', whiteSpace: 'nowrap', boxShadow: '0 10px 34px rgba(0,0,0,0.3)' }}>ОТКРЫТЬ КОНСТРУКТОР ✨</Link>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ПРЕИМУЩЕСТВА ── */}
      <section className="sec-pad" style={{ backgroundColor: C.cream, borderTop: `1px solid ${C.border}`, padding: '54px 0' }}>
        <div className="page-w grid-benefits" style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.09} style={{ textAlign: 'center', padding: '20px' }}>
              <motion.div whileHover={{ scale: 1.09, y: -2 }} transition={{ duration: 0.25 }}>
                <div style={{ width: 54, height: 54, borderRadius: 17, background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: 22, boxShadow: '0 4px 18px rgba(44,24,16,0.09)' }}>{b.icon}</div>
              </motion.div>
              <p style={{ fontWeight: 600, color: C.chocolate, fontSize: 13, letterSpacing: '0.03em', marginBottom: 5 }}>{b.label}</p>
              <p style={{ color: C.muted, fontSize: 12, fontWeight: 300 }}>{b.sub}</p>
            </FadeIn>
          ))}
        </div>
      </section>

    </div>
  )
}

/* ── Static data ──────────────────────────────────── */

const CATEGORIES_DATA = [
  { icon: '🎂', label: 'Торты',       sub: 'На заказ и готовые', to: '/catalog',     gradient: 'linear-gradient(135deg, #fce8ed, #f5d0de)' },
  { icon: '🥐', label: 'Выпечка',     sub: 'Пирожные, эклеры',  to: '/catalog',     gradient: 'linear-gradient(135deg, #fef3e2, #fce8c3)' },
  { icon: '✨', label: 'Конструктор', sub: 'Собери сам',         to: '/constructor', gradient: 'linear-gradient(135deg, #f0efff, #e2e0ff)' },
  { icon: '🎁', label: 'Подарки',     sub: 'Наборы и боксы',    to: '/catalog',     gradient: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
]

const HOW_IT_WORKS = [
  {
    icon: '🍰', title: 'Выбери десерт',
    desc: 'Листай каталог от лучших кондитеров Актобе или используй конструктор для индивидуального заказа.',
    gradient: 'linear-gradient(135deg, #fce8ed, #f5d0de)',
    shadow: 'rgba(232,105,138,0.25)',
  },
  {
    icon: '📋', title: 'Оформи заказ',
    desc: 'Укажи адрес, выбери время доставки. Удобная оплата через Kaspi или наличными курьеру.',
    gradient: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    shadow: 'rgba(201,169,110,0.25)',
  },
  {
    icon: '🚀', title: 'Получи доставку',
    desc: 'Курьер доставит заказ в течение 60 минут. Свежо, аккуратно, точно в срок.',
    gradient: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    shadow: 'rgba(74,222,128,0.25)',
  },
]

const BENEFITS = [
  { icon: '🚀', label: 'Быстрая доставка', sub: 'По всему Актобе',       bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  { icon: '👨‍🍳', label: 'Местные мастера',  sub: 'Проверенные кондитеры', bg: 'linear-gradient(135deg, #fce8ed, #f5d0de)' },
  { icon: '💳', label: 'Kaspi · Наличные', sub: 'Удобная оплата',         bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  { icon: '⭐', label: 'Гарантия качества', sub: 'Или вернём деньги',      bg: 'linear-gradient(135deg, #fef9c3, #fde68a)' },
]
