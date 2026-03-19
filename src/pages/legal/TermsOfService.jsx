import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/Button'
import Card from '../../components/Card'

export default function TermsOfService() {
  const navigate = useNavigate()

  return (
    <div className="page bg-slate-50 min-h-screen pt-[120px] pb-20">
      <div className="container-narrow">
        <Button variant="ghost" size="small" onClick={() => navigate(-1)} className="mb-12">
          <ArrowLeft size={18} /> Back
        </Button>

        <Card variant="elevated" padding="large" className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-400 font-bold mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Satohash, you agree to be bound by these Terms of Service. If
                you do not agree, you may not use the platform. Satohash provides a cryptographic
                timestamping protocol interface anchored to the Bitcoin blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
                2. Description of Service
              </h2>
              <p>
                Satohash facilitates the creation of mathematical proofs of existence for digital
                assets using OpenTimestamps (OTS). Our service allows users to generate SHA-256
                hashes of their documents locally and anchor these hashes to the Bitcoin blockchain.
                We do not store, upload, or process the original content of your documents.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
                3. No Legal Advice
              </h2>
              <p>
                Satohash is a technical tool, not a legal service. The availability of legal
                templates and cryptographic proofs does not constitute legal advice. The legal
                admissibility and enforceability of blockchain-based timestamps vary significantly
                by jurisdiction. Users are strongly encouraged to consult with qualified legal
                counsel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
                4. User Responsibilities
              </h2>
              <p>
                You are solely responsible for: (a) the content of the documents you timestamp; (b)
                maintaining the original document file (as the proof is useless without the
                bit-for-bit identical original); and (c) ensuring compliance with local laws
                regarding electronic signatures and digital evidence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
                5. Disclaimers and Limitation of Liability
              </h2>
              <p>
                The service is provided "AS IS" and "AS AVAILABLE." We do not guarantee that the
                Bitcoin network will remain operational indefinitely or that the OpenTimestamps
                calendar servers will always be accessible. Satohash shall not be liable for any
                loss of data, loss of profits, or legal disputes arising from the use of our
                protocol.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the
                platform after changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}
