import { CheckIcon } from '@heroicons/react/24/outline'

interface PricingProps {
  id?: string;
  className?: string;
  billingPeriod: 'monthly' | 'yearly';
  setBillingPeriod: (period: 'monthly' | 'yearly') => void;
}

export default function Pricing({ id, className, billingPeriod, setBillingPeriod }: PricingProps) {
  return (
    <section id={id} className={`py-24 sm:py-32 ${className} bg-black`}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Precios simples y transparentes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Elige un plan accesible con las mejores funciones para involucrar a tu audiencia, crear lealtad y potenciar tus resultados.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex items-center bg-[#111111] rounded-full p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Anual
            </button>
          </div>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Basic Plan */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#111111] p-8 ring-1 ring-white/30 xl:p-10 hover:ring-white/40 transition duration-300">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">Básico</h3>
              <p className="mt-4 text-sm leading-6 text-gray-400">
                Lo esencial para comenzar con la planificación de contenido.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                <span className="text-sm font-semibold leading-6 text-gray-400">/{billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-400">
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  5 ideas de contenido
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  Hasta 1,000 suscriptores
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  Análisis básico
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  48h tiempo de respuesta
                </li>
              </ul>
            </div>
            <a
              href="/signup"
              className="mt-8 block w-full rounded-lg border border-green-500 bg-transparent px-3 py-3 text-center text-sm font-semibold text-green-500 hover:border-green-400 hover:text-green-400 transition-colors"
            >
              Comenzar
            </a>
          </div>

          {/* Professional Plan */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#0D1F17] p-8 ring-1 ring-white/30 xl:p-10 hover:ring-white/40 transition duration-300 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight text-white">Profesional</h3>
              <p className="mt-4 text-sm leading-6 text-gray-400">
                Un plan que crece con tu negocio en expansión.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-bold tracking-tight text-white">${billingPeriod === 'monthly' ? '29' : '24'}</span>
                <span className="text-sm font-semibold leading-6 text-gray-400">/{billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-400">
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  25 ideas de contenido
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  Hasta 10,000 suscriptores
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  Análisis avanzado
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  24h tiempo de respuesta
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-500" aria-hidden="true" />
                  Automatizaciones de marketing
                </li>
              </ul>
            </div>
            <a
              href="/signup"
              className="mt-8 block w-full rounded-lg bg-green-500 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-green-400 transition-colors"
            >
              Comenzar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 