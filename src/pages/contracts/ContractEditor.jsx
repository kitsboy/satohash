import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import { getTemplate } from '../../templates';

export default function ContractEditor() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId, templateType } = useParams();
    const location = useLocation();
    const [contract, setContract] = useState({
        id: '',
        name: '',
        content: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    const [isSaving, setIsSaving] = useState(false);
    const [placeholders, setPlaceholders] = useState([]);

    useEffect(() => {
        if (contractId) {
            // Load existing contract
            const savedContracts = localStorage.getItem('satohash_contracts');
            if (savedContracts) {
                const contracts = JSON.parse(savedContracts);
                const existingContract = contracts.find(c => c.id === contractId);
                if (existingContract) {
                    setContract(existingContract);
                }
            }
        } else if (templateType) {
            // Load template for new contract
            const template = getTemplate(templateType);
            if (template) {
                setContract({
                    ...contract,
                    id: `contract_${Date.now()}`,
                    name: template.name,
                    content: template.content,
                    templateType
                });
            }
        }
    }, [contractId, templateType]);

    useEffect(() => {
        // Detect placeholders like [DATE], [PARTY_A], etc.
        const regex = /\[(.*?)\]/g;
        const matches = [...contract.content.matchAll(regex)];
        const uniquePlaceholders = [...new Set(matches.map(m => m[1]))];
        setPlaceholders(uniquePlaceholders);
    }, [contract.content]);

    const handlePlaceholderChange = (placeholder, value) => {
        const newContent = contract.content.replaceAll(`[${placeholder}]`, value);
        setContract({ ...contract, content: newContent });
    };

    const handleSave = () => {
        setIsSaving(true);

        // Update timestamp
        const updatedContract = {
            ...contract,
            updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        const savedContracts = localStorage.getItem('satohash_contracts');
        let contracts = savedContracts ? JSON.parse(savedContracts) : [];

        const existingIndex = contracts.findIndex(c => c.id === updatedContract.id);
        if (existingIndex >= 0) {
            contracts[existingIndex] = updatedContract;
        } else {
            contracts.push(updatedContract);
        }

        localStorage.setItem('satohash_contracts', JSON.stringify(contracts));

        setTimeout(() => {
            setIsSaving(false);
            navigate(`/contracts/${updatedContract.id}`);
        }, 500);
    };

    return (
        <div className="page" style={{ background: '#f9fafb' }}>
            <div className="container" style={{ paddingTop: '20px' }}>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => navigate('/contracts')}
                        style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            color: '#4b5563',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '14px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ArrowLeft size={16} />
                        {t('common.back')}
                    </button>
                </div>

                <div className="page-header" style={{ marginBottom: '32px' }}>
                    <h1 className="page-title" style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>
                        {contractId ? t('contractEditor.title') : t('contractEditor.newTitle')}
                    </h1>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    <div className="form-group" style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                        <label className="form-label" htmlFor="contractName" style={{ fontWeight: '700', color: '#374151' }}>
                            {t('contractEditor.contractName')}
                        </label>
                        <input
                            type="text"
                            id="contractName"
                            className="form-input"
                            value={contract.name}
                            onChange={(e) => setContract({ ...contract, name: e.target.value })}
                            placeholder={t('contractEditor.namePlaceholder')}
                            style={{
                                borderRadius: '10px',
                                border: '1px solid #d1d5db',
                                padding: '12px 16px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="contractContent" style={{ fontWeight: '700', paddingLeft: '4px', marginBottom: '8px', display: 'block' }}>
                            {t('contractEditor.content')}
                        </label>
                        <div className="premium-document-container" style={{ minHeight: '600px', cursor: 'text' }}>
                            <textarea
                                id="contractContent"
                                value={contract.content}
                                onChange={(e) => setContract({ ...contract, content: e.target.value })}
                                rows={25}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    resize: 'none',
                                    outline: 'none',
                                    padding: 0,
                                    position: 'relative',
                                    zIndex: 2
                                }}
                                className="legal-typography"
                            />
                        </div>
                    </div>

                    {/* Placeholder Quick Fill Sidebar - Only show if placeholders exist */}
                    {placeholders.length > 0 && (
                        <div style={{
                            background: 'white',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                                <Sparkles size={18} />
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Smart Quick Fill</h3>
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                                Detected {placeholders.length} placeholders in your document. Fill them here to update the text instantly.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                {placeholders.map((p) => (
                                    <div key={p} className="form-group" style={{ margin: 0 }}>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                            {p.replace('_', ' ')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Enter ${p}...`}
                                            onChange={(e) => handlePlaceholderChange(p, e.target.value)}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                background: '#f9fafb'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px',
                                background: 'rgba(59, 130, 246, 0.05)',
                                borderRadius: '12px',
                                border: '1px solid rgba(59, 130, 246, 0.1)'
                            }}>
                                <AlertCircle size={14} color="#3b82f6" />
                                <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: '500' }}>
                                    All occurrences of matching tags will be replaced.
                                </span>
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '16px',
                        padding: '24px 0'
                    }}>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            loading={isSaving}
                            style={{
                                flex: 2,
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)'
                            }}
                        >
                            <Save size={20} />
                            {t('contractEditor.save')}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/contracts')}
                            style={{ flex: 1, borderRadius: '14px' }}
                        >
                            {t('contractEditor.cancel')}
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </div >
    );
}
