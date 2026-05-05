import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/Button'

export default function CryptoNotice() {
  const navigate = useNavigate()

  return (
    <div className="page min-h-screen bg-[var(--bg-primary)] pt-[140px] pb-20">
      <div className="layout-container">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="small" onClick={() => navigate(-1)} className="flex items-center gap-1.5">
            <ArrowLeft size={18} /> Back
          </Button>
          <Link
            to="/trust"
            className="text-[11px] font-black tracking-[0.25em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--accent-active)]"
          >
            ← Back to Trust Center
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="document-paper relative mx-auto overflow-hidden rounded-3xl bg-white p-12 shadow-2xl"
        >
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
          <h1 className="mb-4 text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
            Crypto Compliance Notice
          </h1>
          <p className="mb-16 text-xs font-bold tracking-widest text-slate-400 uppercase">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="space-y-12 leading-relaxed font-medium text-slate-600">
            <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-indigo-900">
                <ShieldCheck size={24} /> What This Proves
              </h2>
              <ul className="list-disc space-y-3 pl-6 font-bold text-indigo-950/70">
                <li>
                  <strong>Integrity:</strong> Mathematical proof that the document has not changed
                  by even a single bit since the timestamp was created.
                </li>
                <li>
                  <strong>Existence:</strong> Proof that the document existed in its current form at
                  or before a certain date/time (the block time).
                </li>
                <li>
                  <strong>Immutable Record:</strong> The proof is stored on the Bitcoin blockchain,
                  the world&apos;s most secure and decentralized public ledger.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                The Technology: OpenTimestamps
              </h2>
              <p>
                Satohash utilizes the OpenTimestamps (OTS) protocol. OTS works by creating a Merkle
                tree of many document hashes and anchoring the root of that tree in a Bitcoin
                transaction. This allows for virtually free timestamping while maintaining the full
                security of the Bitcoin network.
              </p>
            </section>

            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                Legal Admissibility
              </h2>
              <p>
                Many jurisdictions now recognize electronic signatures and cryptographic timestamps
                as valid legal evidence (e.g., eIDAS in Europe, ESIGN and UETA in the USA). However,
                the specific weight given to a blockchain timestamp in a court of law depends on
                local procedural rules and the nature of the dispute.
              </p>
            </section>

            <section className="rounded-2xl bg-slate-900 p-8 text-white">
              <h2 className="mb-4 text-xl font-black">Crucial Reminder</h2>
              <p className="leading-relaxed font-bold text-slate-300">
                The .ots proof file is useless without the original document. You must keep the
                original file exactly as it was when timestamped. Changing anything—even a single
                space or metadata property—will result in a verification failure.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
