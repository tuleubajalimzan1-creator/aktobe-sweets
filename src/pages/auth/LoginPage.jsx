import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

const DEMO_ACCOUNTS = [
  { name: 'Алия', email: 'user@demo.kz', password: '123456', role: 'user', id: 1 },
  { name: 'Кондитерская', email: 'venue@demo.kz', password: '123456', role: 'venue', id: 2 },
  { name: 'Администратор', email: 'admin@demo.kz', password: '123456', role: 'admin', id: 3 },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const account = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password)
    if (!account) { setError('Неверный email или пароль'); return }
    login(account)
    navigate('/')
  }

  const quickLogin = (account) => { login(account); navigate('/') }

  const inputStyle = (name) => ({
    width: '100%',
    border: `1.5px solid ${focusedField === name ? '#ec4899' : '#ede9e6'}`,
    borderRadius: 14,
    padding: '13px 16px',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1c1917',
    backgroundColor: '#faf8f6',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  })

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', backgroundColor: '#faf8f4' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo mark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>
            🎂
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#1c1917', margin: '0 0 4px' }}>
            Вход в аккаунт
          </h1>
          <p style={{ fontSize: 13, color: '#a8a29e', margin: 0 }}>Актобе Свитс</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: 24, border: '1px solid #f0ede8', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a8a29e', marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="example@mail.kz"
                required
                style={inputStyle('email')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#a8a29e', marginBottom: 6, fontWeight: 500 }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••"
                required
                style={inputStyle('password')}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: 10, margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{ width: '100%', backgroundColor: '#1c1917', color: '#fff', fontWeight: 600, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 15, marginTop: 4 }}
            >
              Войти
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#a8a29e', marginTop: 20, marginBottom: 0 }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 500 }}>
              Зарегистрироваться
            </Link>
          </p>

          {/* Quick login */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f5f4f2' }}>
            <p style={{ fontSize: 11, color: '#c4bfbb', textAlign: 'center', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Быстрый вход (демо)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.role}
                  onClick={() => quickLogin(a)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: 12,
                    border: '1px solid #ede9e6',
                    backgroundColor: '#faf8f6',
                    cursor: 'pointer',
                    fontSize: 11,
                    color: '#78716c',
                    fontWeight: 500,
                    textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbcfe8'; e.currentTarget.style.color = '#ec4899'; e.currentTarget.style.backgroundColor = '#fdf2f8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ede9e6'; e.currentTarget.style.color = '#78716c'; e.currentTarget.style.backgroundColor = '#faf8f6' }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>
                    {a.role === 'user' ? '👤' : a.role === 'venue' ? '🏪' : '🔑'}
                  </div>
                  {a.role === 'user' ? 'Покупатель' : a.role === 'venue' ? 'Кондитер' : 'Админ'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
