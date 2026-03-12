import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function CryptoNotice() {
    const navigate = useNavigate();

    return (
        <div className="page bg-slate-50 min-h-screen pt-24 pb-20">
            <div className="container-narrow">
                <Button
                    variant="ghost"
                    size="small"
                    onClick={() => navigate(-1)}
                    className="mb-12"
                >
                    <ArrowLeft size={18} /> Back
                </Button>

                <Card variant="elevated" padding="large" className="prose prose-slate max-w-none">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Digital Evidence Notice</h1>
                    <p className="text-slate-400 font-bold mb-12">Understanding Cryptographic Anchoring</p>

                    <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
                        <section className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
                            <h2 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2">
                                <ShieldCheck size={24} /> What This Proves
                            </h2>
                            <ul className="list-disc pl-6 space-y-3 font-bold text-indigo-950/70">
                                <li><strong>Integrity:</strong> Mathematical proof that the document has not changed by even a single bit since the timestamp was created.</li>
                                <li><strong>Existence:</strong> Proof that the document existed in its current form at or before a certain date/time (the block time).</li>
                                <li><strong>Immutable Record:</strong> The proof is stored on the Bitcoin blockchain, the world's most secure and decentralized public ledger.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">The Technology: OpenTimestamps</h2>
                            <p>Satohash utilizes the OpenTimestamps (OTS) protocol. OTS works by creating a Merkle tree of many document hashes and anchoring the root of that tree in a Bitcoin transaction. This allows for virtually free timestamping while maintaining the full security of the Bitcoin network.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">Legal Admissibility</h2>
                            <p>Many jurisdictions now recognize electronic signatures and cryptographic timestamps as valid legal evidence (e.g., eIDAS in Europe, ESIGN and UETA in the USA). However, the specific weight given to a blockchain timestamp in a court of law depends on local procedural rules and the nature of the dispute.</p>
                        </section>

                        <section className="bg-slate-900 p-8 rounded-2xl text-white">
                            <h2 className="text-xl font-black mb-4">Crucial Reminder</h2>
                            <p className="text-slate-300 font-bold leading-relaxed">
                                The .ots proof file is useless without the original document. You must keep the original file exactly as it was when timestamped. Changing anything—even a single space or metadata property—will result in a verification failure.
                            </p>
                        </section>
                    </div>
                </Card>
            </div>
        </div>
    );
}
