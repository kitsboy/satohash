import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="page bg-slate-50 min-h-screen pt-[120px] pb-20">
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
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-slate-400 font-bold mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">1. Zero-Knowledge Principle</h2>
                            <p>Satohash is designed with privacy as the core architecture. We operate on a direct-to-blockchain principle where your sensitive documents never leave your device. Only SHA-256 cryptographic hashes—which are mathematically impossible to reverse—are used for the timestamping process.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">2. Data We Process</h2>
                            <p>The only data transmitted to our processing layer includes: (a) Cryptographic hashes of your documents; (b) Transaction metadata required for the Bitcoin network; and (c) Minimal authentication data if you choose to create a cloud-synced account. We do not collect names, addresses, or document content by default.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">3. Local-First Storage</h2>
                            <p>By default, Satohash stores your contract drafts and proof files in your browser's local storage or indexedDB. This data is not accessible to us. If you clear your browser data without downloading your .ots proof files, they may be permanently lost.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">4. Third-Party Integration</h2>
                            <p>To provide blockchain anchoring, we interact with:
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li><strong>OpenTimestamps:</strong> For Merkle tree aggregation and calendar services.</li>
                                    <li><strong>Bitcoin Nodes:</strong> For permanent anchoring.</li>
                                    <li><strong>Mempool.space:</strong> For live network fee data.</li>
                                </ul>
                                These decentralized protocols are essential for the immutable nature of your proofs.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">5. Data Security</h2>
                            <p>We use industry-standard HTTPS/TLS for all communication. Since we do not hold your private keys or document contents, we cannot "leak" your private data even in the event of a server compromise—a fundamental benefit of our cryptographic architecture.</p>
                        </section>
                    </div>
                </Card>
            </div>
        </div>
    );
}
