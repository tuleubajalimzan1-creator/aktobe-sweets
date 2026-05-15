import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../../constants/mockData'

const W = { maxWidth: 1280, margin: '0 auto', padding: '0 40px' }

const C = {
  cream: '#fdf8f3',
  chocolate: '#2c1810',
  pink: '#e8698a',
  pinkLight: '#fce8ed',
  gold: '#c9a96e',
  muted: '#8c7b6e',
  border: 'rgba(232,213,188,0.6)',
}

function FadeIn({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3)

  return (
    <div style={{ backgroundColor: C.cream }} className="main-content">

      {/* ── HERO ── */}
      <section style={{ backgroundColor: C.cream, position: 'relative', overflow: 'hidden' }}>

        {/* Ambient orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '5%', width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,138,0.18) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', right: '2%', width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.16) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', top: '35%', left: '42%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,213,188,0.28) 0%, transparent 65%)' }} />
        </div>

        <div className="hero-grid" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px 1fr', alignItems: 'center', minHeight: '90vh', position: 'relative', zIndex: 1 }}>

          {/* Left photos */}
          <div className="hero-photos" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14, paddingRight: 36, paddingTop: 40 }}>
            <motion.div
              style={{ position: 'relative', flexShrink: 0 }}
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
            >
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=85"
                alt="Торт"
                style={{ width: 172, height: 266, objectFit: 'cover', borderRadius: 24, boxShadow: '0 28px 72px rgba(44,24,16,0.2), 0 4px 16px rgba(44,24,16,0.08)', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 14, left: 12, right: 12, background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: 12, padding: '7px 13px', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 2px 12px rgba(44,24,16,0.1)' }}>
                <span style={{ fontSize: 14 }}>⭐</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.chocolate, letterSpacing: '0.02em' }}>4.9 · Популярное</span>
              </div>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 80 }}>
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.9 }}
                src="https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=85"
                alt="Наполеон"
                style={{ width: 132, height: 162, objectFit: 'cover', borderRadius: 20, boxShadow: '0 18px 52px rgba(44,24,16,0.16)', display: 'block' }}
              />
              <motion.img
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.6, ease: 'easeInOut', delay: 1.6 }}
                src="https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&q=85"
                alt="Эклеры"
                style={{ width: 132, height: 122, objectFit: 'cover', borderRadius: 20, boxShadow: '0 14px 44px rgba(44,24,16,0.14)', display: 'block' }}
              />
            </div>
          </div>

          {/* Center text */}
          <div className="hero-center" style={{ textAlign: 'center', padding: '72px 0', zIndex: 2 }}>

            {/* Live badge */}
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(232,213,188,0.8)', borderRadius: 99, padding: '8px 18px 8px 12px', marginBottom: 30, boxShadow: '0 4px 24px rgba(44,24,16,0.09)' }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.25)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: C.chocolate, letterSpacing: '0.04em' }}>Актобе · Доставка 60 мин</span>
            </motion.div>

            <motion.h1
              className="hero-h1"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.chocolate, lineHeight: 1.02, fontWeight: 700, marginBottom: 22, fontSize: 'clamp(3.2rem, 5.5vw, 6rem)' }}
            >
              Торты<br />
              <em style={{ background: 'linear-gradient(135deg, #e8698a 0%, #c94a6a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'normal' }}>с душой</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22 }}
              style={{ color: C.muted, fontSize: 15, maxWidth: 310, margin: '0 auto 38px', lineHeight: 1.8, fontWeight: 300 }}
            >
              Десерты от лучших кондитеров Актобе. Готовые изделия или созданные специально для вас.
            </motion.p>

            <motion.div
              className="hero-btns"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.34 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.22 }}>
                <Link to="/catalog" style={{ display: 'block', backgroundColor: C.chocolate, color: C.cream, fontWeight: 600, padding: '14px 36px', borderRadius: 99, textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', boxShadow: '0 10px 28px rgba(44,24,16,0.28)' }}>
                  СМОТРЕТЬ КАТАЛОГ
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.22 }}>
                <Link to="/constructor" style={{ display: 'block', border: '1.5px solid rgba(44,24,16,0.2)', color: C.chocolate, fontWeight: 500, padding: '14px 36px', borderRadius: 99, textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em', backgroundColor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                  СОБРАТЬ ТОРТ ✨
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile hero image */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.42 }}
              className="mob-hero-img"
              style={{ position: 'relative', display: 'none', marginTop: 38 }}
            >
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85"
                alt="Торт"
                style={{ width: '100%', height: 268, objectFit: 'cover', borderRadius: 24, boxShadow: '0 24px 64px rgba(44,24,16,0.18)', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: 11, padding: '7px 13px', fontSize: 11, fontWeight: 600, color: C.chocolate }}>
                ⭐ 4.9 · Популярное
              </div>
            </motion.div>
          </div>

          {/* Right photos */}
          <div className="hero-photos" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 14, paddingLeft: 36, paddingTop: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: -80 }}>
              <motion.img
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5.8, ease: 'easeInOut', delay: 0.5 }}
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=85"
                alt="Чизкейк"
                style={{ width: 132, height: 154, objectFit: 'cover', borderRadius: 20, boxShadow: '0 18px 52px rgba(44,24,16,0.15)', display: 'block' }}
              />
              <motion.img
                animate={{ y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: 4.9, ease: 'easeInOut', delay: 1.3 }}
                src="https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=85"
                alt="Макаруны"
                style={{ width: 132, height: 134, objectFit: 'cover', borderRadius: 20, boxShadow: '0 14px 44px rgba(44,24,16,0.13)', display: 'block' }}
              />
            </div>
            <motion.div
              style={{ position: 'relative', flexShrink: 0 }}
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 7.2, ease: 'easeInOut', delay: 0.25 }}
            >
              <img
                src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=85"
                alt="Торт 2"
                style={{ width: 172, height: 288, objectFit: 'cover', borderRadius: 24, boxShadow: '0 32px 80px rgba(44,24,16,0.2)', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: 14, right: 12, background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRadius: 12, padding: '7px 13px', fontSize: 11, fontWeight: 600, color: C.chocolate, boxShadow: '0 2px 12px rgba(44,24,16,0.1)' }}>
                🎂 На заказ
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
          className="desk-nav"
          style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, color: C.muted, fontSize: 9, letterSpacing: '0.38em' }}
        >
          <div style={{ width: 1, height: 30, background: `linear-gradient(to bottom, transparent, ${C.muted}60)` }} />
          ЛИСТАТЬ
        </motion.div>
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
                <motion.div
                  whileHover={{ y: -7, scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
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

      {/* ── ПОПУЛЯРНОЕ ── */}
      <section className="sec-pad" style={{ backgroundColor: C.cream, padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 42, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Топ недели</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Популярное</h2>
            </div>
            <Link to="/catalog" style={{ color: C.muted, textDecoration: 'none', fontSize: 13, letterSpacing: '0.04em' }}>Все товары →</Link>
          </FadeIn>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {featured.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── БАННЕР КОНСТРУКТОРА ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn>
            <div className="cta-banner" style={{ background: 'linear-gradient(135deg, #2c1810 0%, #3d2215 55%, #52291a 100%)', borderRadius: 28, padding: '60px 76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 36, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 78% 45%, rgba(232,105,138,0.2) 0%, transparent 52%), radial-gradient(ellipse at 18% 85%, rgba(201,169,110,0.14) 0%, transparent 48%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: C.gold, letterSpacing: '0.36em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 15 }}>Эксклюзив</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 2.5vw, 2.7rem)', fontWeight: 700, color: '#fdf8f3', marginBottom: 14, lineHeight: 1.1 }}>
                  Твой торт — твои правила
                </h2>
                <p style={{ color: 'rgba(253,248,243,0.52)', maxWidth: 380, lineHeight: 1.8, fontSize: 14, fontWeight: 300 }}>
                  Выбери основу, начинку, форму и оформление. Кондитеры Актобе предложат цену.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.22 }}
                style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
              >
                <Link to="/constructor" style={{ display: 'block', backgroundColor: '#fdf8f3', color: C.chocolate, fontWeight: 700, padding: '17px 44px', borderRadius: 99, textDecoration: 'none', fontSize: 12, letterSpacing: '0.09em', whiteSpace: 'nowrap', boxShadow: '0 10px 32px rgba(0,0,0,0.28)' }}>
                  ОТКРЫТЬ КОНСТРУКТОР ✨
                </Link>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ПАРТНЁРЫ ── */}
      <section className="sec-pad" style={{ backgroundColor: C.cream, padding: '68px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 46 }}>
            <p style={{ color: C.gold, letterSpacing: '0.32em', textTransform: 'uppercase', fontSize: 10, fontWeight: 600, marginBottom: 12 }}>Нам доверяют</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: C.chocolate }}>Партнёры Актобе</h2>
          </FadeIn>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {PARTNERS.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="partner-card" style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '32px', display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 2px 12px rgba(44,24,16,0.05)' }}>
                    <div style={{ width: 58, height: 58, borderRadius: 17, background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 20px rgba(44,24,16,0.16)' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#fff' }}>{p.short}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: C.chocolate, marginBottom: 5 }}>{p.name}</h3>
                      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.65, fontWeight: 300, marginBottom: 7 }}>{p.desc}</p>
                      <p style={{ color: C.gold, fontSize: 9.5, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 600 }}>{p.tag}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРЕИМУЩЕСТВА ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', borderTop: `1px solid ${C.border}`, padding: '54px 0' }}>
        <div className="page-w grid-benefits" style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.09} style={{ textAlign: 'center', padding: '20px' }}>
              <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.22 }}>
                <div style={{ width: 54, height: 54, borderRadius: 17, background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: 22, boxShadow: '0 4px 16px rgba(44,24,16,0.08)' }}>{b.icon}</div>
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

function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -9 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', border: `1px solid rgba(232,213,188,0.5)`, boxShadow: '0 2px 14px rgba(44,24,16,0.06)' }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ overflow: 'hidden' }}>
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: 218, objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div style={{ padding: '18px 20px 22px' }}>
          <p style={{ color: '#8c7b6e', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>{product.venue}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#2c1810', fontSize: 20, lineHeight: 1.2, marginBottom: 12 }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#e8698a', fontWeight: 700, fontSize: 18 }}>{product.price.toLocaleString()} ₸</span>
            <span style={{ color: '#c9a96e', fontSize: 12, fontWeight: 500 }}>⭐ {product.rating}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const CATEGORIES_DATA = [
  { icon: '🎂', label: 'Торты', sub: 'На заказ и готовые', to: '/catalog', gradient: 'linear-gradient(135deg, #fce8ed, #f5d0de)' },
  { icon: '🥐', label: 'Выпечка', sub: 'Пирожные, эклеры', to: '/catalog', gradient: 'linear-gradient(135deg, #fef3e2, #fce8c3)' },
  { icon: '✨', label: 'Конструктор', sub: 'Собери сам', to: '/constructor', gradient: 'linear-gradient(135deg, #f0efff, #e2e0ff)' },
  { icon: '🎁', label: 'Подарки', sub: 'Наборы и боксы', to: '/catalog', gradient: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
]

const PARTNERS = [
  { name: 'Лакомка', short: 'Л', gradient: 'linear-gradient(135deg, #e8698a, #c94a6a)', desc: 'Сеть кулинарных магазинов Актобе. Домашние десерты с 2005 года.', tag: 'Официальный партнёр' },
  { name: 'Samal Cakes', short: 'S', gradient: 'linear-gradient(135deg, #c9a96e, #9a7a4a)', desc: 'Авторские торты и капкейки. Индивидуальный подход к каждому заказу.', tag: 'Официальный партнёр' },
]

const BENEFITS = [
  { icon: '🚀', label: 'Быстрая доставка', sub: 'По всему Актобе', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  { icon: '👨‍🍳', label: 'Местные мастера', sub: 'Проверенные кондитеры', bg: 'linear-gradient(135deg, #fce8ed, #f5d0de)' },
  { icon: '💳', label: 'Kaspi · Наличные', sub: 'Удобная оплата', bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  { icon: '⭐', label: 'Гарантия качества', sub: 'Или вернём деньги', bg: 'linear-gradient(135deg, #fef9c3, #fde68a)' },
]
