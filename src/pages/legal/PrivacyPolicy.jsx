import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/Button'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="page min-h-screen bg-slate-50 pt-[120px] pb-20">
      <div className="container-narrow">
        <Button variant="ghost" size="small" onClick={() => navigate(-1)} className="mb-12">
          <ArrowLeft size={18} /> Back
        </Button>

        <div className="document-paper mx-auto">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
          <h1 className="mb-4 text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mb-16 text-xs font-bold tracking-widest text-slate-400 uppercase">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-12 leading-relaxed font-medium text-slate-600">
            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                1. Zero-Knowledge Principle
              </h2>
              <p>
                Satohash is designed with privacy as the core architecture. We operate on a
                direct-to-blockchain principle where your sensitive documents never leave your
                device. Only SHA-256 cryptographic hashes—which are mathematically impossible to
                reverse—are used for the timestamping process.
              </p>
            </section>

            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                2. Data We Process
              </h2>
              <p>
                The only data transmitted to our processing layer includes: (a) Cryptographic hashes
                of your documents; (b) Transaction metadata required for the Bitcoin network; and
                (c) Minimal authentication data if you choose to create a cloud-synced account. We
                do not collect names, addresses, or document content by default.
              </p>
            </section>

            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                3. Local-First Storage
              </h2>
              <p>
                By default, Satohash stores your contract drafts and proof files in your browser's
                local storage or indexedDB. This data is not accessible to us. If you clear your
                browser data without downloading your .ots proof files, they may be permanently
                lost.
              </p>
            </section>

            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                4. Third-Party Integration
              </h2>
              <p>
                To provide blockchain anchoring, we interact with:
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>
                    <strong>OpenTimestamps:</strong> For Merkle tree aggregation and calendar
                    services.
                  </li>
                  <li>
                    <strong>Bitcoin Nodes:</strong> For permanent anchoring.
                  </li>
                  <li>
                    <strong>Mempool.space:</strong> For live network fee data.
                  </li>
                </ul>
                These decentralized protocols are essential for the immutable nature of your proofs.
              </p>
            </section>

            <section>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-xl font-black text-slate-900">
                5. Data Security
              </h2>
              <p>
                We use industry-standard HTTPS/TLS for all communication. Since we do not hold your
                private keys or document contents, we cannot "leak" your private data even in the
                event of a server compromise—a fundamental benefit of our cryptographic
                architecture.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
