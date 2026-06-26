import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import Layout from '@/components/landing/Layout'

const GET_PDF_URL = 'https://functions.poehali.dev/78d6435c-1564-47f4-9a85-1a7dca88a933'

export default function Success() {
  const [searchParams] = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const invId = searchParams.get('InvId')
  const email = searchParams.get('Email') || ''

  useEffect(() => {
    if (!email) {
      setLoading(false)
      return
    }
    const tryFetch = async (attempts = 5) => {
      for (let i = 0; i < attempts; i++) {
        try {
          const res = await fetch(GET_PDF_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          if (res.ok) {
            const data = await res.json()
            if (data.pdf_url) {
              setPdfUrl(data.pdf_url)
              setLoading(false)
              return
            }
          }
        } catch (_e) {
          // retry on network error
        }
        await new Promise((r) => setTimeout(r, 2000))
      }
      setError('Не удалось найти доступ. Напишите нам — мы пришлём вручную.')
      setLoading(false)
    }
    tryFetch()
  }, [email, invId])

  return (
    <Layout>
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg text-center flex flex-col items-center gap-6"
        >
          {loading ? (
            <>
              <div className="w-16 h-16 rounded-full bg-[#FF4D00]/15 flex items-center justify-center">
                <Icon name="Loader2" size={32} className="text-[#FF4D00] animate-spin" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Получаем доступ...</h1>
              <p className="text-neutral-400 text-lg">Это займёт несколько секунд</p>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 rounded-full bg-yellow-500/15 flex items-center justify-center">
                <Icon name="AlertCircle" size={32} className="text-yellow-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Оплата прошла!</h1>
              <p className="text-neutral-400 text-lg">{error}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#FF4D00]/15 flex items-center justify-center">
                <Icon name="CheckCircle2" size={32} className="text-[#FF4D00]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Оплата прошла! 🦥</h1>
              <p className="text-neutral-400 text-lg">
                Методичка готова. Нажми кнопку ниже, чтобы открыть PDF.
              </p>
              {pdfUrl && (
                <Button
                  size="lg"
                  className="bg-[#FF4D00] text-black hover:bg-[#FF4D00]/90 font-semibold rounded-2xl px-8"
                  onClick={() => window.open(pdfUrl, '_blank')}
                >
                  <Icon name="FileDown" size={20} className="mr-2" />
                  Открыть методичку
                </Button>
              )}
              <p className="text-neutral-600 text-sm">
                Ссылка также привязана к вашему email: {email}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}