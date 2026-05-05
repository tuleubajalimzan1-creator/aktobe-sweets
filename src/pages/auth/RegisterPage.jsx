import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ ...form, role: 'user', id: Date.now() })
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎂</div>
          <h1 className="text-2xl font-bold text-gray-800">Регистрация</h1>
          <p className="text-gray-400 text-sm mt-1">Актобе Свитс</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@mail.kz"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Минимум 6 символов"
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-pink-500 hover:underline font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
