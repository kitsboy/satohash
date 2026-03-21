import { motion } from 'framer-motion';
import { 
  Check, 
  Zap, 
  Building2, 
  Bitcoin,
  Infinity,
  Shield,
  Clock,
  Globe,
  ArrowRight
} from 'lucide-react';

const TIERS = [
  {
    name: 'Free',
    description: 'Perfect for testing and small projects',
    price: { sats: 0, display: 'Free' },
    icon: Zap,
    color: 'blue',
    features: [
      { text: '100 timestamps / day', included: true },
      { text: 'Free verification', included: true },
      { text: 'Bitcoin block height API', included: true },
      { text: 'Community support', included: true },
      { text: 'Standard calendar servers', included: true },
      { text: 'Webhook notifications', included: false },
      { text: 'Priority confirmation', included: false },
      { text: 'Custom calendar', included: false },
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    description: 'For production applications',
    price: { sats: 50, display: '50 sats', per: 'per timestamp' },
    icon: Bitcoin,
    color: 'orange',
    features: [
      { text: '10,000 timestamps / day', included: true },
      { text: 'Free verification', included: true },
      { text: 'Bitcoin block height API', included: true },
      { text: 'Email support', included: true },
      { text: 'Premium calendar servers', included: true },
      { text: 'Webhook notifications', included: true },
      { text: 'Priority confirmation', included: true },
      { text: 'Custom calendar', included: false },
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for scale',
    price: { sats: null, display: 'Custom', per: 'contact us' },
    icon: Building2,
    color: 'purple',
    features: [
      { text: 'Unlimited timestamps', included: true },
      { text: 'Free verification', included: true },
      { text: 'Bitcoin block height API', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Private calendar cluster', included: true },
      { text: 'Webhook + WebSocket', included: true },
      { text: 'Guaranteed confirmation', included: true },
      { text: 'Custom integration', included: true },
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const PAYMENT_INFO = [
  {
    icon: Bitcoin,
    title: 'Lightning Payments',
    description: 'Pay instantly with Bitcoin Lightning. No credit cards. No KYC. Just sats.'
  },
  {
    icon: Clock,
    title: 'Pay Per Use',
    description: 'Only pay for what you use. No monthly subscriptions or hidden fees.'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Lightning payments preserve your privacy. We don\'t store payment data.'
  }
];

export default function PricingTiers() {
  const getColorClasses = (color, isPopular) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        button: 'bg-blue-500 hover:bg-blue-600'
      },
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        button: 'bg-orange-500 hover:bg-orange-600'
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        button: 'bg-purple-500 hover:bg-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {TIERS.map((tier, idx) => {
          const Icon = tier.icon;
          const colors = getColorClasses(tier.color, tier.popular);
          
          return (
            <div
              key={tier.name}
              className={`relative rounded-2xl border ${tier.popular ? colors.border : 'border-gray-700'} 
                ${tier.popular ? 'bg-gray-800/80' : 'bg-gray-800/50'} overflow-hidden
                ${tier.popular ? 'scale-105 shadow-2xl shadow-orange-500/20' : ''}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${tier.price.sats === 0 ? 'text-green-400' : colors.text}`}>
                      {tier.price.display}
                    </span>
                    {tier.price.per && (
                      <span className="text-gray-500 text-sm">{tier.price.per}</span>
                    )}
                  </div>
                  {tier.price.sats > 0 && (
                    <p className="text-xs text-gray-500 mt-1">~${(tier.price.sats * 0.0007).toFixed(3)} USD at current rates</p>
                  )}
                </div>

                {/* CTA Button */}
                <button className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${colors.button} mb-6`}>
                  {tier.cta}
                </button>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                      ) : (
                        <span className="w-5 h-5 flex-shrink-0 text-gray-600">—</span>
                      )}
                      <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Info */}
      <div className="grid md:grid-cols-3 gap-6">
        {PAYMENT_INFO.map((info, idx) => {
          const Icon = info.icon;
          return (
            <div key={idx} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="font-semibold mb-2">{info.title}</h4>
              <p className="text-sm text-gray-400">{info.description}</p>
            </div>
          );
        })}
      </div>

      {/* Rate Limits Detail */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-400" />
          Rate Limits & Fair Use
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3 text-gray-300">Request Limits</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Free tier</span>
                <span className="text-white">100 requests / day</span>
              </li>
              <li className="flex justify-between">
                <span>Pro tier</span>
                <span className="text-white">10,000 requests / day</span>
              </li>
              <li className="flex justify-between">
                <span>Enterprise</span>
                <span className="text-white"><Infinity className="w-4 h-4 inline" /> Unlimited</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-gray-300">Burst Limits</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Free tier</span>
                <span className="text-white">10 requests / minute</span>
              </li>
              <li className="flex justify-between">
                <span>Pro tier</span>
                <span className="text-white">100 requests / minute</span>
              </li>
              <li className="flex justify-between">
                <span>Enterprise</span>
                <span className="text-white">Custom limits</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-500">
            Rate limits reset daily at 00:00 UTC. Need higher limits? 
            <a href="#" className="text-orange-400 hover:text-orange-300 ml-1">
              Contact our team
            </a>.
          </p>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold mb-3">Building something big?</h3>
        <p className="text-gray-400 mb-6">
          Get dedicated infrastructure, custom integrations, and dedicated support.
        </p>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors">
          <Building2 className="w-5 h-5" />
          Talk to Sales
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
