import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Library,
    Search,
    Heart,
    Scale,
    Building,
    User,
    Briefcase,
    ShieldCheck,
    Globe,
    ChevronRight
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const categories = [
    { id: 'all', name: 'All Templates', icon: Library },
    { id: 'personal', name: 'Personal & Family', icon: Heart },
    { id: 'business', name: 'Business & Corp', icon: Briefcase },
    { id: 'legal', name: 'Legal & Judiciary', icon: Scale },
    { id: 'property', name: 'Real Estate', icon: Building }
];

const templates = [
    {
        id: 'prenup',
        title: 'Prenuptial Agreement',
        category: 'personal',
        description: 'Protect assets and clarify financial expectations before marriage.',
        jurisdiction: 'Global / Multi-state',
        difficulty: 'Advanced',
        icon: Heart,
        color: '#ec4899'
    },
    {
        id: 'property',
        title: 'Property Transfer',
        category: 'property',
        description: 'Documentation for private property sales and ownership transfers.',
        jurisdiction: 'US / EU Compliant',
        difficulty: 'Legal',
        icon: Building,
        color: '#3b82f6'
    },
    {
        id: 'poa',
        title: 'Power of Attorney',
        category: 'legal',
        description: 'Grant legal authority to a trusted individual for decision making.',
        jurisdiction: 'ESIGN Compliant',
        difficulty: 'Standard',
        icon: Scale,
        color: '#f59e0b'
    },
    {
        id: 'nda',
        title: 'NDA (Non-Disclosure)',
        category: 'business',
        description: 'Secure confidential business information during negotiations.',
        jurisdiction: 'Global Standard',
        difficulty: 'Universal',
        icon: ShieldCheck,
        color: '#10b981'
    }
];

export default function TemplateLibrary() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = templates.filter(temp => {
        const matchesCategory = activeCategory === 'all' || temp.category === activeCategory;
        const matchesSearch = temp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            temp.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="page" style={{ background: 'var(--color-surface)', paddingTop: '40px' }}>
            <div className="container">
                <div className="page-header" style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <h1 style={{ fontWeight: '950', fontSize: 'clamp(32px, 8vw, 56px)', letterSpacing: '-0.05em', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
                        Legal Template Library
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '20px', maxWidth: '700px', margin: '0 auto', fontWeight: '600' }}>
                        Professionally drafted cryptographic agreements for every jurisdiction.
                    </p>
                </div>

                {/* Search & Categories */}
                <div style={{ marginBottom: '48px' }}>
                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 32px' }}>
                        <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                        <input
                            type="text"
                            placeholder="Search legal templates (e.g. NDA, Property)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '18px 24px 18px 56px',
                                borderRadius: '100px',
                                border: '2px solid #e2e8f0',
                                fontSize: '16px',
                                fontWeight: '600',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 24px',
                                        borderRadius: '100px',
                                        border: '2px solid',
                                        borderColor: isActive ? 'var(--color-primary)' : 'transparent',
                                        background: isActive ? 'var(--color-primary)' : 'white',
                                        color: isActive ? 'white' : '#475569',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isActive ? '0 8px 20px rgba(99, 102, 241, 0.2)' : '0 2px 10px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <Icon size={18} />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Template Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px', marginBottom: '100px' }}>
                    {filteredTemplates.map((template) => (
                        <Card key={template.id} style={{
                            padding: '32px',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            transition: 'all 0.3s ease'
                        }} className="card-interactive">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: template.color + '15',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: template.color
                                }}>
                                    <template.icon size={32} />
                                </div>
                                <div style={{
                                    padding: '6px 14px',
                                    background: '#f1f5f9',
                                    borderRadius: '100px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: '#475569',
                                    textTransform: 'uppercase'
                                }}>
                                    {template.difficulty}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '22px', fontWeight: '950', color: '#000000', marginBottom: '8px' }}>{template.title}</h3>
                                <p style={{ fontSize: '15px', color: '#000000', lineHeight: '1.6', margin: 0, fontWeight: '850' }}>{template.description}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                                <Globe size={16} color="#64748b" />
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Jurisdiction: {template.jurisdiction}</span>
                            </div>

                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => navigate(`/contracts/new/${template.id}`)}
                                style={{ height: '52px' }}
                            >
                                Use Template <ChevronRight size={18} />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
