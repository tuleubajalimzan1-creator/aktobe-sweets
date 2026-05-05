import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONSTRUCTOR_OPTIONS } from '../../constants/mockData'
import useCartStore from '../../store/useCartStore'

const STEPS = ['Основа', 'Начинка', 'Размер', 'Форма', 'Оформление', 'Надпись', 'Допы']

export default function ConstructorPage() {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState({
    base: CONSTRUCTOR_OPTIONS.bases[0],
    filling: CONSTRUCTOR_OPTIONS.fillings[0],
    size: CONSTRUCTOR_OPTIONS.sizes[0],
    shape: CONSTRUCTOR_OPTIONS.shapes[0],
    decoration: CONSTRUCTOR_OPTIONS.decorations[0],
    inscription: '',
    extras: [],
  })

  const totalPrice =
    choices.base.price +
    choices.filling.price +
    choices.size.price +
    choices.shape.price +
    choices.decoration.price +
    choices.extras.reduce((s, e) => s + e.price, 0)

  const toggleExtra = (extra) => {
    const exists = choices.extras.find((e) => e.id === extra.id)
    setChoices({
      ...choices,
      extras: exists
        ? choices.extras.filter((e) => e.id !== extra.id)
        : [...choices.extras, extra],
    })
  }

  const handleAddToCart = () => {
    addItem({
      id: `custom-${Date.now()}`,
      name: `Торт на заказ (${choices.size.label})`,
      price: totalPrice,
      quantity: 1,
      isCustom: true,
      details: choices,
    })
    navigate('/cart')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Конструктор торта ✨</h1>
        <p className="text-gray-400 text-sm mt-1">Собери свой идеальный торт</p>
      </div>

      {/* Прогресс */}
      <div className="flex gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition ${
              i <= step ? 'bg-pink-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Шаг {step + 1} из {STEPS.length}: <span className="font-semibold text-gray-700">{STEPS[step]}</span>
      </p>

      {/* Шаги */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

        {step === 0 && (
          <OptionGroup
            title="Выберите основу"
            options={CONSTRUCTOR_OPTIONS.bases}
            selected={choices.base}
            onSelect={(v) => setChoices({ ...choices, base: v })}
          />
        )}
        {step === 1 && (
          <OptionGroup
            title="Выберите начинку"
            options={CONSTRUCTOR_OPTIONS.fillings}
            selected={choices.filling}
            onSelect={(v) => setChoices({ ...choices, filling: v })}
          />
        )}
        {step === 2 && (
          <OptionGroup
            title="Выберите размер"
            options={CONSTRUCTOR_OPTIONS.sizes}
            selected={choices.size}
            onSelect={(v) => setChoices({ ...choices, size: v })}
          />
        )}
        {step === 3 && (
          <OptionGroup
            title="Выберите форму"
            options={CONSTRUCTOR_OPTIONS.shapes}
            selected={choices.shape}
            onSelect={(v) => setChoices({ ...choices, shape: v })}
          />
        )}
        {step === 4 && (
          <OptionGroup
            title="Выберите оформление"
            options={CONSTRUCTOR_OPTIONS.decorations}
            selected={choices.decoration}
            onSelect={(v) => setChoices({ ...choices, decoration: v })}
          />
        )}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 text-lg">Надпись на торте</h2>
            <input
              value={choices.inscription}
              onChange={(e) => setChoices({ ...choices, inscription: e.target.value })}
              placeholder="Например: С днём рождения, Азиз! 🎉"
              maxLength={50}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
            />
            <p className="text-xs text-gray-400">{choices.inscription.length}/50 символов</p>
            <p className="text-xs text-gray-400 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
              Если надпись не нужна — просто оставьте поле пустым
            </p>
          </div>
        )}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700 text-lg">Дополнительные элементы</h2>
            <div className="grid grid-cols-2 gap-3">
              {CONSTRUCTOR_OPTIONS.extras.map((extra) => {
                const isSelected = choices.extras.find((e) => e.id === extra.id)
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <p className="font-medium text-gray-800 text-sm">{extra.label}</p>
                    <p className="text-xs text-pink-500 mt-1">
                      {extra.price === 0 ? 'Бесплатно' : `+${extra.price.toLocaleString()} ₸`}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Итоговая цена */}
      <div className="bg-pink-50 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-gray-600 font-medium">Итоговая цена:</span>
        <span className="text-2xl font-bold text-pink-500">{totalPrice.toLocaleString()} ₸</span>
      </div>

      {/* Навигация */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition"
          >
            ← Назад
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl font-semibold transition"
          >
            Далее →
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl font-semibold transition"
          >
            Добавить в корзину 🛒
          </button>
        )}
      </div>
    </div>
  )
}

function OptionGroup({ title, options, selected, onSelect }) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-700 text-lg">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={`p-4 rounded-xl border-2 text-left transition ${
              selected.id === opt.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <p className="font-medium text-gray-800 text-sm">{opt.label}</p>
            <p className="text-xs text-pink-500 mt-1">
              {opt.price === 0 ? 'Включено' : `+${opt.price.toLocaleString()} ₸`}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
