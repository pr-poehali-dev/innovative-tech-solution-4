import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

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

const topics = [
  'Введение и базовые принципы',
  'Пошаговая методика на практике',
  'Разбор частых ошибок',
  'Готовые шаблоны и чек-листы',
  'Продвинутые техники',
  'Полезные ресурсы и материалы',
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
                        <p className="text-base md:text-lg leading-relaxed">
                          Практическое руководство, которое помогает разобраться в теме с нуля и
                          применить знания сразу. Структурировано, по делу и без воды — всё, что нужно,
                          в одном PDF-документе.
                        </p>
                      )}

                      {card.id === 'topics' && (
                        <ul className="flex flex-col gap-3">
                          {topics.map((t) => (
                            <li key={t} className="flex items-start gap-3">
                              <Icon name="Check" size={20} className="text-[#FF4D00] mt-0.5 shrink-0" />
                              <span className="text-base md:text-lg">{t}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {card.id === 'pay' && (
                        <div className="flex flex-col gap-5">
                          <div className="flex items-end gap-2">
                            <span className="text-4xl md:text-5xl font-bold text-white">990 ₽</span>
                            <span className="text-neutral-500 mb-1">единоразово</span>
                          </div>
                          <p className="text-base md:text-lg">
                            После оплаты вы сразу получите доступ к методичке в PDF — её можно скачать
                            и читать на любом устройстве.
                          </p>
                          <Button
                            size="lg"
                            className="bg-[#FF4D00] text-black hover:bg-[#FF4D00]/90 font-semibold rounded-2xl"
                          >
                            <Icon name="Lock" size={18} className="mr-2" />
                            Оплатить и получить доступ
                          </Button>
                        </div>
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
