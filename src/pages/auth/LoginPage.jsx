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
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    )
    if (!account) {
      setError('Неверный email или пароль')
      return
    }
    login(account)
    navigate('/')
  }

  const quickLogin = (account) => {
    login(account)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎂</div>
          <h1 className="text-2xl font-bold text-gray-800">Вход в аккаунт</h1>
          <p className="text-gray-400 text-sm mt-1">Актобе Свитс</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.kz"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Войти
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-pink-500 hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>

        {/* Быстрый вход для демо */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 text-center mb-3">Быстрый вход (демо)</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.role}
                onClick={() => quickLogin(a)}
                className="text-xs border border-gray-200 rounded-xl py-2 px-3 hover:bg-pink-50 hover:border-pink-200 transition text-gray-600"
              >
                {a.role === 'user' ? '👤 Покупатель' : a.role === 'venue' ? '🏪 Заведение' : '🔑 Админ'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
