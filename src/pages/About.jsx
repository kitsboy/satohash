import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-8 leading-tight">
          We built Satohash because <br />
          <span className="text-indigo-600">trust shouldn't require trust.</span>
        </h1>

        <div className="prose prose-lg prose-slate mt-12 mb-20 text-slate-600 leading-relaxed">
          <p>
            In a digital world overflowing with deepfakes and manipulated data, knowing{' '}
            <em>when</em> something existed and that it hasn't been altered is the bedrock of truth.
          </p>
          <p>
            Traditional notaries are slow, expensive, and centralized. Blockchain technology offers
            a better way, but it's often too complex for everyday use.
          </p>
          <p>
            <strong>Satohash bridges this gap.</strong> We use the Bitcoin blockchain—the most
            secure computing network in history—to anchor your documents. But we do it in a way that
            respects your privacy completely.
          </p>
          <h3>Our Philosophy</h3>
          <ul>
            <li>
              <strong>Client-Side Only:</strong> We never see your files. Hashing happens on your
              device.
            </li>
            <li>
              <strong>Open Protocols:</strong> We use OpenTimestamps, an open standard. You aren't
              locked into our platform.
            </li>
            <li>
              <strong>Radical Simplicty:</strong> Advanced cryptography should feel like magic, not
              math.
            </li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-16">
          <div>
            <h3 className="text-2xl font-bold font-display mb-4">The Team</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Cam&background=random" alt="Cam" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Cam</p>
                <p className="text-sm text-slate-500">Founder & Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Satoshi&background=random"
                  alt="Satoshi"
                />
              </div>
              <div>
                <p className="font-bold text-slate-900">Satoshi (Inspiration)</p>
                <p className="text-sm text-slate-500">The Architect</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display mb-4">Join Us</h3>
            <p className="text-slate-600 mb-6">
              We are open source. Inspect our code, contribute features, or fork us.
            </p>
            <a
              href="#"
              className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
            >
              View on GitHub &rarr;
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
