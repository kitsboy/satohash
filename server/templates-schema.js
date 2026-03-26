/**
 * @typedef {Object} ProofTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Array<string>} fields
 */

export const PROOF_TEMPLATES = {
    NDA: {
        id: 'nda',
        name: 'Non-Disclosure Agreement',
        description: 'Secure proof of confidentiality for intellectual property discussions.',
        fields: ['Party A', 'Party B', 'Purpose', 'Term (Years)'],
    },
    INVOICE: {
        id: 'invoice',
        name: 'Cryptographic Invoice',
        description: 'Tamper-proof financial proof for tax and audit compliance.',
        fields: ['Vendor Name', 'Total Amount', 'Currency', 'Invoice ID'],
    },
    IP_ASSIGNMENT: {
        id: 'ip-assignment',
        name: 'IP Assignment',
        description: 'Proof of authorship and transfer for source code/digital assets.',
        fields: ['Assignor', 'Assignee', 'Project URL', 'Contribution Date'],
    }
};

export const getTemplateById = (id) => PROOF_TEMPLATES[id.toUpperCase()];
