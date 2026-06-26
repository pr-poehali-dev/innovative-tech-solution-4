import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CREATE_PAYMENT_URL = 'https://functions.poehali.dev/abcfa9a0-6be9-4357-bc64-540dea1ecbac'

interface CardData {
  id: string
  icon: string
  title: string
  subtitle: string
}

const cards: CardData[] = [
  {
    id: 'about',
    icon: 'BookOpen',
    title: 'О методичке',
    subtitle: 'Что это и зачем',
  },
  {
    id: 'topics',
    icon: 'ListChecks',
    title: 'Список тем',
    subtitle: 'Что внутри',
  },
  {
    id: 'pay',
    icon: 'CreditCard',
    title: 'Оплата и доступ',
    subtitle: 'Получить методичку',
  },
]

function PayBlock() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (!email.includes('@')) {
      setError('Введите корректный email')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(CREATE_PAYMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Ошибка создания платежа. Попробуйте ещё раз.')
      }
    } catch {
      setError('Ошибка сети. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-2">
        <span className="text-4xl md:text-5xl font-bold text-white">500 ₽</span>
        <span className="text-neutral-500 mb-1">единоразово</span>
      </div>
      <p className="text-base md:text-lg">
        После оплаты вы сразу получите доступ к методичке в PDF — её можно скачать
        и читать на любом устройстве.
      </p>
      <div className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Ваш email для получения доступа"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-neutral-500 rounded-2xl h-12"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button
          size="lg"
          className="bg-[#FF4D00] text-black hover:bg-[#FF4D00]/90 font-semibold rounded-2xl"
          onClick={handlePay}
          disabled={loading}
        >
          <Icon name={loading ? 'Loader2' : 'Lock'} size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Создаём платёж...' : 'Оплатить и получить доступ'}
        </Button>
      </div>
    </div>
  )
}

const topics: { section?: string; items: string[] }[] = [
  { items: ['Капитал и где он формируется'] },
  {
    section: 'Акции',
    items: [
      'Что такое акции',
      'Что такое дивиденды и почему их не стоит сравнивать с процентами по вкладу',
    ],
  },
  {
    section: 'Облигации',
    items: [
      'Что такое облигация?',
      'Как считать доходность облигации?',
      'Что такое НКД?',
      'Что такое оферта облигации?',
      'Что такое амортизация облигации?',
      'Рейтинг облигаций',
    ],
  },
  { items: ['Что такое фонды (ПИФы)?'] },
  {
    section: 'Основы',
    items: [
      'С чего начать в инвестициях',
      'Где взять деньги для инвестиций? Неочевидные способы.',
      'Брокер и как его выбрать',
    ],
  },
  {
    section: 'Инвестиционные понятия',
    items: [
      'Что такое ребалансировка?',
      'Что такое реинвестирование?',
      'Что такое диверсификация?',
      'Мультипликаторы',
      'Что такое СЧА или стоимость чистых активов?',
      'Сальдирование убытков',
      'Что такое Льгота Долгосрочного Владения?',
    ],
  },
  {
    section: 'Психология принятия решений',
    items: [
      'Риск-профиль как часть вашей психологии',
      'FOMO или эмоции в инвестициях',
      'Нужно ли часто заходить в приложение брокера?',
      '8 самых распространённых стратегий инвестирования',
      'Продавать на пике или держать. Матрица принятия решений',
    ],
  },
  {
    section: 'Какие ещё есть активы на рынке',
    items: [
      'Что такое дисконтная облигация?',
      'Что такое валютные облигации?',
      'Что такое фьючерс?',
      'Что такое Цифровые финансовые активы (ЦФА)?',
      'Что такое ЗПИФ недвижимости?',
    ],
  },
  {
    section: 'Экономические плюшки',
    items: [
      '6 видов налогового вычета',
      'Кому хорошо от крепкого рубля, а кому от слабого?',
      'Почему сложный процент считается 8 чудом света?',
    ],
  },
]

export default function OfferCards() {
  const [open, setOpen] = useState<string | null>(null)

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id))

  return (
    <section className="relative min-h-screen w-full snap-start flex flex-col justify-center items-center p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-14"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
          Методичка
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl mt-4 max-w-xl mx-auto">
          Нажмите на любую карточку, чтобы узнать больше
        </p>
      </motion.div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {cards.map((card, index) => {
          const isOpen = open === card.id
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-[#FF4D00]/50 transition-colors"
            >
              <button
                onClick={() => toggle(card.id)}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF4D00]/15 text-[#FF4D00] shrink-0">
                  <Icon name={card.icon} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">{card.title}</h3>
                  <p className="text-neutral-500 text-sm md:text-base">{card.subtitle}</p>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <Icon name="ChevronDown" size={24} className="text-neutral-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-6 pt-1 text-neutral-300">
                      {card.id === 'about' && (
                        <div className="flex flex-col gap-4 text-base md:text-lg leading-relaxed">
                          <p>
                            Материал является методичкой с разжеванными пояснениями обо всех основных
                            инструментах фондового рынка: начиная банально от брокера и заканчивая тем,
                            как сальдировать убытки, даже если вы вообще не в курсе, что это такое.
                          </p>
                          <p>
                            За время инвестирования и ведения блога набралась невероятная куча
                            материалов, которая, хоть и лежит в открытом доступе, но самостоятельно
                            придётся долгое время собирать по крупицам.
                          </p>
                          <p>🦥 Поздравляю с приобретением данной выжимки в удобном PDF формате.</p>
                        </div>
                      )}

                      {card.id === 'topics' && (
                        <div className="flex flex-col gap-5">
                          {topics.map((group, gi) => (
                            <div key={gi}>
                              {group.section && (
                                <p className="text-[#FF4D00] font-semibold text-sm uppercase tracking-wider mb-2">
                                  {group.section}
                                </p>
                              )}
                              <ul className="flex flex-col gap-2">
                                {group.items.map((t) => (
                                  <li key={t} className="flex items-start gap-3">
                                    <Icon name="Check" size={18} className="text-[#FF4D00] mt-0.5 shrink-0" />
                                    <span className="text-base">{t}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {card.id === 'pay' && (
                        <PayBlock />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}