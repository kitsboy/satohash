import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, FileLock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import LiveNetworkDashboard from '../components/LiveNetworkDashboard';
import GlobalActivity from '../components/GlobalActivity';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-8 rounded-3xl glass-card hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
    >
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
);

export default function Landing() {
    return (
        <div className="min-h-screen pt-24 overflow-hidden">

            {/* Hero Section */}
            <section className="relative px-6 pb-20 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">

                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-indigo-200/30 via-purple-200/30 to-rose-200/30 rounded-full blur-3xl -z-10 animate-pulse-slow" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-indigo-100/50 backdrop-blur-sm text-indigo-600 font-medium text-sm mb-8 shadow-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    v2.0 Now Live: Enhanced Privacy Protocol
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-8 leading-tight max-w-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Immutable Truth for the <br />
                    <span className="text-gradient">Digital Age.</span>
                </motion.h1>

                <motion.p
                    className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Secure your documents, ideas, and contracts on the Bitcoin blockchain forever.
                    Zero-knowledge proof means your data never leaves your device.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Link to="/welcome">
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 flex items-center gap-2 group">
                            Start Notarizing <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                    <Link to="/verify">
                        <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold text-lg hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors shadow-sm flex items-center gap-2">
                            <ShieldCheck size={20} /> Verify Proof
                        </button>
                    </Link>
                </motion.div>

                {/* Demo Live Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-20 w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl relative group cursor-pointer"
                >
                    <LiveNetworkDashboard />

                    {/* Hover Overlay Title */}
                    <div className="absolute top-8 left-8 text-left z-20">
                        <span className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-2 block">Network Status</span>
                        <h3 className="text-white text-xl font-black uppercase tracking-tighter">Live Protocol Nodes</h3>
                    </div>

                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
            </section>

            {/* Activity Feed Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black font-display tracking-tight text-slate-900 mb-6 uppercase">Real-time Protocol Activity</h2>
                        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                            Watch as documents are cryptographically anchored to the blockchain across the globe.
                            The Satohash network is processing decentralized trust every second.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">99.99% Uptime Guarantee</h4>
                                    <p className="text-sm text-slate-500">Decentralized calendar nodes ensure your proofs are always processed.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Live Bitcoin Connection</h4>
                                    <p className="text-sm text-slate-500">Real-time monitoring of mempool and block confirmations.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <GlobalActivity />
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-12 border-y border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-400 font-medium mb-8 text-sm uppercase tracking-widest">Trusted by builders at</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simulated Logos */}
                        <span className="text-xl font-bold font-display">Stripe</span>
                        <span className="text-xl font-bold font-display">Vercel</span>
                        <span className="text-xl font-bold font-display">Opentimestamps</span>
                        <span className="text-xl font-bold font-display">Blockstream</span>
                        <span className="text-xl font-bold font-display">Paradigm</span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={FileLock}
                        title="Cryptographic Hash"
                        description="We generate a SHA-256 fingerprint of your file locally. Your actual data never leaves your browser, ensuring total privacy."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Clock}
                        title="Bitcoin Timestamp"
                        description="Your file's fingerprint is anchored into the Bitcoin blockchain using the OpenTimestamps protocol, proving existence at a specific time."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={CheckCircle2}
                        title="Independent Verification"
                        description="Anyone can verify your proof using the standalone .ots file, without relying on our servers or third-party validators."
                        delay={0.3}
                    />
                </div>
            </section>

        </div>
    );
}
