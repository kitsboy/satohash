export const prenupTemplate = {
    name: 'Prenuptial Agreement',
    description: 'A prenuptial agreement template for couples planning to marry',
    content: `PRENUPTIAL AGREEMENT

This Prenuptial Agreement ("Agreement") is entered into on [DATE] by and between:

Party A: [PARTY_A_NAME]
Party B: [PARTY_B_NAME]

WHEREAS, the parties contemplate legal marriage under the laws of [JURISDICTION];

WHEREAS, the parties wish to define their respective rights and obligations regarding property and financial matters;

NOW, THEREFORE, in consideration of the mutual promises contained herein, the parties agree as follows:

1. FULL DISCLOSURE
Each party has made a full and complete disclosure to the other of their respective assets, liabilities, and income.

2. SEPARATE PROPERTY
All property owned by either party prior to the marriage shall remain the separate property of that party.

3. MARITAL PROPERTY
Property acquired during the marriage shall be [MARITAL_PROPERTY_TERMS].

4. DEBTS AND LIABILITIES
Each party shall be responsible for their own debts incurred prior to the marriage.

5. SPOUSAL SUPPORT
In the event of separation or divorce, [SPOUSAL_SUPPORT_TERMS].

6. MODIFICATION
This Agreement may only be modified by a written document signed by both parties.

7. GOVERNING LAW
This Agreement shall be governed by the laws of [JURISDICTION].


___________________________          ___________________________
[PARTY_A_NAME]                      [PARTY_B_NAME]
Date: ______________                Date: ______________


DISCLAIMER: This template is provided for informational purposes only. Satohash does not provide legal advice. You should consult with a qualified attorney in your jurisdiction before entering into any prenuptial agreement.`
};

export const propertyTemplate = {
    name: 'Property Transfer Document',
    description: 'A property transfer or real estate document template',
    content: `PROPERTY TRANSFER AGREEMENT

This Property Transfer Agreement ("Agreement") is entered into on [DATE] by and between:

Transferor: [TRANSFEROR_NAME]
Address: [TRANSFEROR_ADDRESS]

Transferee: [TRANSFEREE_NAME]
Address: [TRANSFEREE_ADDRESS]

PROPERTY DESCRIPTION:
The property subject to this transfer is described as follows:
[PROPERTY_DESCRIPTION]
Legal Description: [LEGAL_DESCRIPTION]

TERMS OF TRANSFER:

1. PURCHASE PRICE
The agreed-upon purchase price for the property is: [PURCHASE_PRICE]

2. PAYMENT TERMS
Payment shall be made as follows: [PAYMENT_TERMS]

3. TITLE
The Transferor warrants that they hold clear title to the property and have the right to transfer ownership.

4. CONDITION OF PROPERTY
The property is transferred in its current "as-is" condition.

5. CLOSING DATE
The transfer shall be completed on or before: [CLOSING_DATE]

6. POSSESSION
Possession of the property shall be delivered to the Transferee on: [POSSESSION_DATE]


___________________________          ___________________________
[TRANSFEROR_NAME]                   [TRANSFEREE_NAME]
Date: ______________                Date: ______________


DISCLAIMER: This template is provided for informational purposes only. Real estate transactions are complex and vary by jurisdiction. Consult with a qualified real estate attorney and ensure proper recording with local authorities.`
};

export const powerOfAttorneyTemplate = {
    name: 'Power of Attorney',
    description: 'A power of attorney template for legal representation',
    content: `POWER OF ATTORNEY

Know All by These Presents that I, [PRINCIPAL_NAME], of [PRINCIPAL_ADDRESS] (the "Principal"), do hereby appoint [ATTORNEY_NAME], of [ATTORNEY_ADDRESS] (the "Attorney-in-Fact"), as my true and lawful attorney-in-fact.

SCOPE OF AUTHORITY:

The Attorney-in-Fact is granted authority to act on my behalf in the following matters:

1. FINANCIAL MATTERS
[X] Banking transactions
[X] Real estate transactions
[X] Tax matters
[X] Insurance matters
[_] Other financial matters: [SPECIFY]

2. LEGAL MATTERS
[_] Signing legal documents
[_] Representing in legal proceedings
[_] Other legal matters: [SPECIFY]

3. HEALTHCARE DECISIONS
[_] Medical treatment decisions
[_] Healthcare provider selection
[_] Medical records access

LIMITATIONS:
This Power of Attorney [DOES / DOES NOT] include the power to make gifts on my behalf.

EFFECTIVE DATE:
This Power of Attorney shall become effective: [EFFECTIVE_DATE]

TERMINATION:
This Power of Attorney shall remain in effect until: [TERMINATION_TERMS]

[_] This Power of Attorney shall remain in effect even if I become incapacitated (Durable Power of Attorney)


IN WITNESS WHEREOF, I have executed this Power of Attorney on [DATE].


___________________________
[PRINCIPAL_NAME], Principal
Date: ______________


ACCEPTANCE BY ATTORNEY-IN-FACT:

I, [ATTORNEY_NAME], hereby accept this appointment as Attorney-in-Fact for [PRINCIPAL_NAME].


___________________________
[ATTORNEY_NAME], Attorney-in-Fact
Date: ______________


DISCLAIMER: This template is for informational purposes only. Power of Attorney documents are governed by state law and requirements vary. Consult with a qualified attorney to ensure this document meets your jurisdiction's requirements and your specific needs.`
};

export const ndaTemplate = {
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'A confidentiality agreement to protect sensitive information',
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on [DATE] by and between:

DISCLOSING PARTY:
Name: [DISCLOSING_PARTY_NAME]
Address: [DISCLOSING_PARTY_ADDRESS]

RECEIVING PARTY:
Name: [RECEIVING_PARTY_NAME]
Address: [RECEIVING_PARTY_ADDRESS]

RECITALS

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to [BUSINESS_PURPOSE]; and

WHEREAS, the Receiving Party desires to receive disclosure of the Confidential Information for the purpose of [PURPOSE_OF_DISCLOSURE];

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any data or information that is proprietary to the Disclosing Party, including but not limited to:
- Trade secrets
- Business strategies and plans
- Financial information
- Customer lists and data
- Technical data and know-how
- Software and algorithms
- [ADDITIONAL_CONFIDENTIAL_CATEGORIES]

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
a) Hold and maintain the Confidential Information in strict confidence;
b) Not disclose the Confidential Information to any third parties without prior written consent;
c) Use the Confidential Information solely for the Purpose stated above;
d) Protect the Confidential Information using the same degree of care used to protect its own confidential information.

3. EXCEPTIONS
This Agreement does not apply to information that:
a) Is or becomes publicly available through no fault of the Receiving Party;
b) Was rightfully in the Receiving Party's possession prior to disclosure;
c) Is independently developed by the Receiving Party;
d) Is disclosed pursuant to court order or legal requirement.

4. TERM
This Agreement shall remain in effect for a period of [TERM_YEARS] years from the date first written above.

5. RETURN OF MATERIALS
Upon termination or request, the Receiving Party shall return or destroy all Confidential Information.

6. REMEDIES
The Receiving Party acknowledges that breach may cause irreparable harm and agrees that the Disclosing Party shall be entitled to seek equitable relief.

7. GOVERNING LAW
This Agreement shall be governed by the laws of [JURISDICTION].


IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


___________________________          ___________________________
[DISCLOSING_PARTY_NAME]             [RECEIVING_PARTY_NAME]
Date: ______________                Date: ______________


DISCLAIMER: This template is provided for informational purposes only and does not constitute legal advice. Consult with a qualified attorney to ensure this agreement meets your specific needs and complies with applicable laws.`
};

export const getTemplate = (type) => {
    const templates = {
        prenup: prenupTemplate,
        property: propertyTemplate,
        powerOfAttorney: powerOfAttorneyTemplate,
        nda: ndaTemplate
    };
    return templates[type] || null;
};
