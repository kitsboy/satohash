import { Github, Twitter, MessageSquare, Heart, ShieldCheck, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 p-2">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 tracking-tighter">
                Satohash
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed font-medium mb-8">
              Immutable proof for a digital world. Anchoring trust to the Bitcoin blockchain without
              compromising privacy.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: 'https://github.com/satohash' },
                { Icon: Twitter, href: 'https://twitter.com/satohash' },
                { Icon: MessageSquare, href: 'https://discord.gg/satohash' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, color: '#f97316', borderColor: '#f97316' }}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 shadow-sm transition-all"
                >
                  <social.Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-12">
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">
                Protocol
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li>
                  <a
                    href="/#protocol-deep-dive"
                    className="hover:text-orange-500 transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <Link to="/verify" className="hover:text-orange-500 transition-colors">
                    Verifier
                  </Link>
                </li>
                <li>
                  <Link to="/trust" className="hover:text-orange-500 transition-colors">
                    Trust Center
                  </Link>
                </li>
                <li>
                  <a
                    href="https://opentimestamps.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500 transition-colors flex items-center gap-1.5"
                  >
                    Developer API <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li>
                  <Link to="/trust" className="hover:text-orange-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-orange-500 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/protocol-stats" className="hover:text-orange-500 transition-colors">
                    Network Status
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:careers@satohash.io"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">
                Legal
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500 mb-8">
                <li>
                  <Link to="/legal/privacy" className="hover:text-orange-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="hover:text-orange-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/crypto-notice"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Compliance
                  </Link>
                </li>
              </ul>
              <div className="p-4 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
                  Satohash provides mathematical proof of existence via the Bitcoin blockchain. This
                  is not a legal service. For binding legal advice, consult a qualified professional
                  in your jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm font-bold">
          <p>© {currentYear} Satohash. Open Source & Immutable.</p>
          <div className="flex items-center gap-2 group">
            Built with{' '}
            <Heart
              size={16}
              className="text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform"
            />{' '}
            for <span className="text-slate-900">The Decentralized Web</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
