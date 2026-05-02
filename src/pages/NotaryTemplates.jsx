import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import {
  Heart, Home, Stethoscope, Shield, Briefcase, Lightbulb,
  DollarSign, ScrollText, UserCheck, Building2, Handshake, Car,
  Search, ArrowLeft, Download, Printer, Vault, Zap, ChevronRight,
  FileText, CheckCircle, Circle, ExternalLink, Lock
} from 'lucide-react'

// ─── TEMPLATES DATA ────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'prenuptial-agreement',
    title: 'Prenuptial Agreement',
    category: 'Family Law',
    badge: 'Legal-Grade',
    icon: Heart,
    description: 'Define asset ownership, debt liability, and spousal rights before marriage with a legally-structured notarized prenuptial agreement.',
    fields: [
      { id: 'party1_name', label: 'Party One Full Name', type: 'text' },
      { id: 'party1_dob', label: 'Party One Date of Birth', type: 'text' },
      { id: 'party1_address', label: 'Party One Address', type: 'text' },
      { id: 'party2_name', label: 'Party Two Full Name', type: 'text' },
      { id: 'party2_dob', label: 'Party Two Date of Birth', type: 'text' },
      { id: 'party2_address', label: 'Party Two Address', type: 'text' },
      { id: 'marriage_date', label: 'Intended Marriage Date', type: 'text' },
      { id: 'marriage_location', label: 'Intended Marriage Location', type: 'text' },
      { id: 'party1_assets', label: 'Party One Premarital Assets', type: 'textarea' },
      { id: 'party2_assets', label: 'Party Two Premarital Assets', type: 'textarea' },
      { id: 'party1_debts', label: 'Party One Existing Debts', type: 'textarea' },
      { id: 'party2_debts', label: 'Party Two Existing Debts', type: 'textarea' },
      { id: 'property_division', label: 'Property Division Terms', type: 'textarea' },
      { id: 'spousal_support', label: 'Spousal Support Terms', type: 'textarea' },
      { id: 'governing_law', label: 'Governing State / Jurisdiction', type: 'text' },
      { id: 'execution_date', label: 'Agreement Execution Date', type: 'text' },
    ],
    demoData: {
      party1_name: 'Jonathan Alexander Mercer',
      party1_dob: 'March 14, 1988',
      party1_address: '412 Lakeview Terrace, Austin, TX 78701',
      party2_name: 'Sophia Renée Delacroix',
      party2_dob: 'July 22, 1991',
      party2_address: '88 Rosewood Lane, Austin, TX 78702',
      marriage_date: 'September 12, 2025',
      marriage_location: 'Travis County, Texas',
      party1_assets: 'Real property at 412 Lakeview Terrace valued at $620,000; brokerage account #4421 with Fidelity containing $185,000; vintage automobile collection valued at $95,000.',
      party2_assets: 'Intellectual property portfolio including US Patent #10,482,291; savings account at Chase Bank containing $42,000; fine art collection valued at $60,000.',
      party1_debts: 'Student loan balance of $28,000 with Navient. No other outstanding obligations.',
      party2_debts: 'No existing debt obligations at time of execution.',
      property_division: 'All premarital assets listed herein shall remain the separate property of the originating party. Assets acquired jointly during the marriage shall be divided equally (50/50) upon dissolution.',
      spousal_support: 'In the event of dissolution, neither party shall seek spousal support if the marriage lasted fewer than five (5) years. For marriages exceeding five years, support shall be negotiated in good faith.',
      governing_law: 'State of Texas',
      execution_date: 'August 1, 2025',
    },
  },
  {
    id: 'real-estate-title-deed',
    title: 'Real Estate Title Deed',
    category: 'Property',
    badge: 'Popular',
    icon: Home,
    description: 'Transfer real property ownership with a complete, notarized title deed including legal description, consideration, and covenant terms.',
    fields: [
      { id: 'grantor_name', label: 'Grantor (Seller) Full Name', type: 'text' },
      { id: 'grantor_address', label: 'Grantor Address', type: 'text' },
      { id: 'grantee_name', label: 'Grantee (Buyer) Full Name', type: 'text' },
      { id: 'grantee_address', label: 'Grantee Address', type: 'text' },
      { id: 'consideration', label: 'Purchase Consideration (Amount)', type: 'text' },
      { id: 'property_address', label: 'Property Street Address', type: 'text' },
      { id: 'legal_description', label: 'Legal Description of Property', type: 'textarea' },
      { id: 'parcel_number', label: 'Assessor Parcel Number (APN)', type: 'text' },
      { id: 'deed_type', label: 'Deed Type', type: 'text' },
      { id: 'encumbrances', label: 'Known Encumbrances / Liens', type: 'textarea' },
      { id: 'county', label: 'County of Recording', type: 'text' },
      { id: 'state', label: 'State', type: 'text' },
      { id: 'transfer_date', label: 'Date of Transfer', type: 'text' },
    ],
    demoData: {
      grantor_name: 'Robert H. Whitfield',
      grantor_address: '9 Orchard Hill Road, Portland, OR 97201',
      grantee_name: 'Amara & David Okonkwo',
      grantee_address: '2204 NE Glisan Street, Portland, OR 97212',
      consideration: 'Eight Hundred and Forty-Five Thousand Dollars ($845,000.00)',
      property_address: '9 Orchard Hill Road, Portland, OR 97201',
      legal_description: 'Lot 14, Block 3, ORCHARD HILL SUBDIVISION, as platted and recorded in Book 72 of Plats, Page 18, Records of Multnomah County, Oregon. Subject to easements of record.',
      parcel_number: '1N1E26BB-01400',
      deed_type: 'Warranty Deed',
      encumbrances: 'Subject to a utility easement of 10 feet along the northern boundary per instrument #2018-044821. No other liens or encumbrances.',
      county: 'Multnomah County',
      state: 'Oregon',
      transfer_date: 'October 3, 2025',
    },
  },
  {
    id: 'living-will-advance-directive',
    title: 'Living Will & Advance Directive',
    category: 'Medical',
    badge: 'Legal-Grade',
    icon: Stethoscope,
    description: 'Declare your end-of-life medical wishes, appoint a healthcare proxy, and specify treatment preferences with a legally-binding advance directive.',
    fields: [
      { id: 'principal_name', label: 'Principal (Your) Full Name', type: 'text' },
      { id: 'principal_dob', label: 'Date of Birth', type: 'text' },
      { id: 'principal_address', label: 'Primary Address', type: 'text' },
      { id: 'agent_name', label: 'Healthcare Agent Full Name', type: 'text' },
      { id: 'agent_relationship', label: 'Agent Relationship to Principal', type: 'text' },
      { id: 'agent_phone', label: 'Agent Phone Number', type: 'text' },
      { id: 'alternate_agent', label: 'Alternate Agent Full Name', type: 'text' },
      { id: 'life_sustaining', label: 'Life-Sustaining Treatment Wishes', type: 'textarea' },
      { id: 'artificial_nutrition', label: 'Artificial Nutrition & Hydration Wishes', type: 'textarea' },
      { id: 'pain_management', label: 'Pain Management & Comfort Care', type: 'textarea' },
      { id: 'organ_donation', label: 'Organ Donation Wishes', type: 'textarea' },
      { id: 'additional_wishes', label: 'Additional Instructions', type: 'textarea' },
      { id: 'execution_date', label: 'Date Executed', type: 'text' },
      { id: 'state', label: 'State of Execution', type: 'text' },
    ],
    demoData: {
      principal_name: 'Margaret Louise Fairbanks',
      principal_dob: 'November 8, 1952',
      principal_address: '33 Birchwood Court, Madison, WI 53703',
      agent_name: 'Thomas Edward Fairbanks',
      agent_relationship: 'Spouse',
      agent_phone: '(608) 555-0142',
      alternate_agent: 'Dr. Carol Anne Fairbanks, Daughter',
      life_sustaining: 'I direct that life-sustaining treatment be withheld or withdrawn if I am in a terminal condition, persistent vegetative state, or end-stage condition where such treatment would only prolong the dying process without offering meaningful recovery.',
      artificial_nutrition: 'If I am unable to recognize or interact with those I love, I do not wish to receive artificial nutrition or hydration beyond comfort measures as determined by my attending physician.',
      pain_management: 'I direct that all reasonable measures be taken to alleviate pain and ensure comfort, including palliative sedation if necessary, even if such measures may hasten my death.',
      organ_donation: 'I wish to donate any and all organs and tissues that can benefit others upon my death. I specifically authorize donation for transplantation, research, and medical education.',
      additional_wishes: 'I wish to spend my final days at home if medically feasible. I request that spiritual counseling from the First Presbyterian Church of Madison be made available.',
      execution_date: 'July 15, 2025',
      state: 'Wisconsin',
    },
  },
  {
    id: 'mutual-nda',
    title: 'Mutual NDA',
    category: 'Corporate',
    badge: 'Popular',
    icon: Shield,
    description: 'Protect confidential information exchanged between two parties with a comprehensive mutual non-disclosure agreement covering trade secrets and proprietary data.',
    fields: [
      { id: 'party1_name', label: 'First Party (Company / Individual)', type: 'text' },
      { id: 'party1_address', label: 'First Party Address', type: 'text' },
      { id: 'party1_rep', label: 'First Party Representative Name & Title', type: 'text' },
      { id: 'party2_name', label: 'Second Party (Company / Individual)', type: 'text' },
      { id: 'party2_address', label: 'Second Party Address', type: 'text' },
      { id: 'party2_rep', label: 'Second Party Representative Name & Title', type: 'text' },
      { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea' },
      { id: 'confidential_info', label: 'Definition of Confidential Information', type: 'textarea' },
      { id: 'exclusions', label: 'Exclusions from Confidentiality', type: 'textarea' },
      { id: 'term_years', label: 'Agreement Term (Years)', type: 'text' },
      { id: 'governing_law', label: 'Governing Law / Jurisdiction', type: 'text' },
      { id: 'effective_date', label: 'Effective Date', type: 'text' },
    ],
    demoData: {
      party1_name: 'Nexus Ventures LLC',
      party1_address: '500 Silicon Blvd, Suite 1200, San Francisco, CA 94107',
      party1_rep: 'Daniel Cho, Chief Executive Officer',
      party2_name: 'Archon Technologies Inc.',
      party2_address: '1800 Innovation Drive, Austin, TX 78758',
      party2_rep: 'Priya Sharma, Chief Technology Officer',
      purpose: 'The parties intend to explore a potential business partnership and/or acquisition involving proprietary software platforms, source code, financial projections, customer data, and go-to-market strategies.',
      confidential_info: 'All information disclosed by either party that is marked "Confidential," or that a reasonable person would consider confidential given the nature of the information and circumstances of disclosure, including but not limited to: source code, algorithms, business plans, financial data, customer lists, pricing, and technical specifications.',
      exclusions: 'Information that is or becomes publicly available through no breach of this Agreement; information independently developed without use of Confidential Information; information received from a third party without restriction; information required to be disclosed by law or court order.',
      term_years: '3 years from the Effective Date',
      governing_law: 'State of California, County of San Francisco',
      effective_date: 'August 15, 2025',
    },
  },
  {
    id: 'freelance-service-contract',
    title: 'Freelance Service Contract',
    category: 'Commercial',
    badge: 'Popular',
    icon: Briefcase,
    description: 'Formalize freelance engagements with clear scope of work, payment terms, IP ownership, and termination clauses to protect both client and contractor.',
    fields: [
      { id: 'client_name', label: 'Client Full Name / Company', type: 'text' },
      { id: 'client_address', label: 'Client Address', type: 'text' },
      { id: 'freelancer_name', label: 'Freelancer / Contractor Full Name', type: 'text' },
      { id: 'freelancer_address', label: 'Freelancer Address', type: 'text' },
      { id: 'project_name', label: 'Project Name', type: 'text' },
      { id: 'scope', label: 'Scope of Work', type: 'textarea' },
      { id: 'deliverables', label: 'Deliverables', type: 'textarea' },
      { id: 'start_date', label: 'Start Date', type: 'text' },
      { id: 'end_date', label: 'End Date / Deadline', type: 'text' },
      { id: 'rate', label: 'Rate & Payment Structure', type: 'text' },
      { id: 'payment_schedule', label: 'Payment Schedule', type: 'textarea' },
      { id: 'ip_ownership', label: 'Intellectual Property Ownership', type: 'textarea' },
      { id: 'revisions', label: 'Revision Policy', type: 'text' },
      { id: 'termination', label: 'Termination Clause', type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'effective_date', label: 'Contract Effective Date', type: 'text' },
    ],
    demoData: {
      client_name: 'Meridian Media Group, LLC',
      client_address: '1 World Trade Center, Floor 42, New York, NY 10007',
      freelancer_name: 'Kenji Watanabe',
      freelancer_address: '18 Fulton Market, Brooklyn, NY 11201',
      project_name: 'Brand Identity System & Website Redesign',
      scope: 'Freelancer shall design a complete brand identity system including logo suite, typography system, color palette, and brand guidelines document. Freelancer shall also design and develop a 12-page responsive website using Webflow.',
      deliverables: '(1) Logo suite in SVG/PNG/EPS; (2) Brand guidelines PDF; (3) Webflow CMS website with all pages live; (4) Asset export package; (5) 30-day post-launch support.',
      start_date: 'September 1, 2025',
      end_date: 'November 30, 2025',
      rate: '$12,500 flat fee (plus approved expenses)',
      payment_schedule: '33% ($4,166.67) due upon signing; 33% due upon brand identity approval; 34% ($4,166.66) due upon website launch.',
      ip_ownership: 'Upon receipt of final payment, all work product, including source files, shall become the exclusive property of the Client. Freelancer retains the right to display work in their portfolio.',
      revisions: 'Up to 3 rounds of revisions per phase. Additional revisions billed at $150/hour.',
      termination: 'Either party may terminate with 14 days written notice. Client shall pay for all work completed to the termination date. Freelancer shall deliver all work product upon final payment.',
      governing_law: 'State of New York',
      effective_date: 'September 1, 2025',
    },
  },
  {
    id: 'ip-assignment-agreement',
    title: 'IP Assignment Agreement',
    category: 'Corporate',
    badge: 'Legal-Grade',
    icon: Lightbulb,
    description: 'Transfer all rights, title, and interest in intellectual property from an assignor to assignee, covering patents, copyrights, trademarks, and trade secrets.',
    fields: [
      { id: 'assignor_name', label: 'Assignor (Transferring Party)', type: 'text' },
      { id: 'assignor_address', label: 'Assignor Address', type: 'text' },
      { id: 'assignee_name', label: 'Assignee (Receiving Party)', type: 'text' },
      { id: 'assignee_address', label: 'Assignee Address', type: 'text' },
      { id: 'ip_description', label: 'Description of IP Being Assigned', type: 'textarea' },
      { id: 'ip_type', label: 'Type of IP (Patent, Copyright, Trademark, etc.)', type: 'text' },
      { id: 'registration_numbers', label: 'Registration / Application Numbers (if any)', type: 'textarea' },
      { id: 'consideration', label: 'Consideration Paid', type: 'text' },
      { id: 'representations', label: 'Assignor Representations & Warranties', type: 'textarea' },
      { id: 'further_assurances', label: 'Further Assurances Clause', type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'effective_date', label: 'Effective Date', type: 'text' },
    ],
    demoData: {
      assignor_name: 'Dr. Elena Vasquez',
      assignor_address: '244 Quantum Lane, Cambridge, MA 02139',
      assignee_name: 'Helix Bio Systems, Inc.',
      assignee_address: '100 Pharma Park Drive, Lexington, MA 02421',
      ip_description: 'All intellectual property related to "Adaptive Protein Folding Prediction Algorithm" including all associated source code, documentation, training datasets, model weights, and any improvements or derivatives thereof.',
      ip_type: 'Software Copyright, Trade Secret, Provisional Patent Application',
      registration_numbers: 'US Provisional Patent Application No. 63/412,889 (filed September 2024); Copyright Registration TXu-002-441-228.',
      consideration: 'Two Hundred Fifty Thousand Dollars ($250,000.00) plus 1.5% royalty on net revenue derived from the assigned IP.',
      representations: 'Assignor represents and warrants that: (i) they are the sole inventor and owner of the IP; (ii) the IP does not infringe any third-party rights; (iii) no liens or encumbrances exist on the IP; (iv) no prior assignment or license conflicts with this Agreement.',
      further_assurances: 'Assignor agrees to execute all documents reasonably requested by Assignee to record, perfect, or enforce Assignee\'s rights in the IP, including USPTO assignment recordation filings.',
      governing_law: 'Commonwealth of Massachusetts',
      effective_date: 'October 1, 2025',
    },
  },
  {
    id: 'personal-loan-agreement',
    title: 'Personal Loan Agreement',
    category: 'Financial',
    badge: 'Popular',
    icon: DollarSign,
    description: 'Document a personal loan with principal amount, interest rate, repayment schedule, and default provisions to protect both lender and borrower.',
    fields: [
      { id: 'lender_name', label: 'Lender Full Name', type: 'text' },
      { id: 'lender_address', label: 'Lender Address', type: 'text' },
      { id: 'borrower_name', label: 'Borrower Full Name', type: 'text' },
      { id: 'borrower_address', label: 'Borrower Address', type: 'text' },
      { id: 'principal', label: 'Loan Principal Amount', type: 'text' },
      { id: 'interest_rate', label: 'Annual Interest Rate', type: 'text' },
      { id: 'loan_date', label: 'Loan Disbursement Date', type: 'text' },
      { id: 'due_date', label: 'Final Repayment Due Date', type: 'text' },
      { id: 'payment_schedule', label: 'Payment Schedule & Amount', type: 'textarea' },
      { id: 'purpose', label: 'Purpose of Loan', type: 'text' },
      { id: 'collateral', label: 'Collateral (if any)', type: 'textarea' },
      { id: 'default_terms', label: 'Default & Acceleration Clause', type: 'textarea' },
      { id: 'governing_law', label: 'Governing State', type: 'text' },
      { id: 'execution_date', label: 'Date of Execution', type: 'text' },
    ],
    demoData: {
      lender_name: 'Gerald Monroe Patterson',
      lender_address: '7721 Oak Harbor Drive, Charleston, SC 29401',
      borrower_name: 'Isabella Christine Novak',
      borrower_address: '330 Meeting Street, Apt 4B, Charleston, SC 29403',
      principal: 'Twenty-Five Thousand Dollars ($25,000.00)',
      interest_rate: '5.5% per annum (simple interest)',
      loan_date: 'October 15, 2025',
      due_date: 'October 15, 2028',
      payment_schedule: 'Borrower shall make 36 equal monthly installments of $754.85, due on the 15th of each month beginning November 15, 2025, with final payment on October 15, 2028.',
      purpose: 'Home renovation and improvement of primary residence.',
      collateral: 'This loan is unsecured. No collateral pledged.',
      default_terms: 'If Borrower fails to make any payment within 15 days of its due date, the entire outstanding principal and accrued interest shall become immediately due and payable at Lender\'s option. A late fee of $50 shall apply to each payment more than 5 days overdue.',
      governing_law: 'South Carolina',
      execution_date: 'October 15, 2025',
    },
  },
  {
    id: 'last-will-testament',
    title: 'Last Will & Testament',
    category: 'Estate',
    badge: 'Legal-Grade',
    icon: ScrollText,
    description: 'Establish a legally-binding last will declaring the distribution of your estate, appointment of executor, and guardianship of minor children.',
    fields: [
      { id: 'testator_name', label: 'Testator (Your) Full Name', type: 'text' },
      { id: 'testator_dob', label: 'Date of Birth', type: 'text' },
      { id: 'testator_address', label: 'Place of Residence', type: 'text' },
      { id: 'executor_name', label: 'Executor Full Name', type: 'text' },
      { id: 'executor_address', label: 'Executor Address', type: 'text' },
      { id: 'alternate_executor', label: 'Alternate Executor Full Name', type: 'text' },
      { id: 'guardian_name', label: 'Guardian of Minor Children (if applicable)', type: 'text' },
      { id: 'specific_bequests', label: 'Specific Bequests', type: 'textarea' },
      { id: 'residuary_estate', label: 'Residuary Estate Distribution', type: 'textarea' },
      { id: 'debts_expenses', label: 'Payment of Debts & Expenses', type: 'textarea' },
      { id: 'special_instructions', label: 'Funeral & Burial Instructions', type: 'textarea' },
      { id: 'witnesses', label: 'Witness Names & Addresses', type: 'textarea' },
      { id: 'execution_date', label: 'Date of Execution', type: 'text' },
      { id: 'state', label: 'State of Execution', type: 'text' },
    ],
    demoData: {
      testator_name: 'William Robert Ashford III',
      testator_dob: 'June 5, 1960',
      testator_address: '1200 Magnolia Boulevard, Savannah, GA 31401',
      executor_name: 'Catherine Marie Ashford',
      executor_address: '1200 Magnolia Boulevard, Savannah, GA 31401',
      alternate_executor: 'James Edward Ashford, Son',
      guardian_name: 'Not applicable — no minor children.',
      specific_bequests: '(1) To my son James E. Ashford: the 1967 Ford Mustang Fastback and my complete collection of first-edition novels. (2) To my daughter Laura M. Ashford: the pearl necklace and earring set that belonged to my mother. (3) To the Savannah Art Institute: $50,000 for scholarship endowment.',
      residuary_estate: 'All remaining estate assets, including real property, financial accounts, investments, and personal property not specifically bequeathed, shall be distributed equally between my children James Edward Ashford and Laura Marie Ashford.',
      debts_expenses: 'I direct my Executor to pay all lawful debts, funeral expenses, and costs of estate administration from the residuary estate prior to distribution.',
      special_instructions: 'I wish to be cremated. A memorial service shall be held at First Baptist Church, Savannah. I request my ashes be scattered at Tybee Island, Georgia. No elaborate funeral proceedings.',
      witnesses: 'Witness 1: Patricia Holm, 44 Bay Street, Savannah, GA 31401. Witness 2: Marcus Webb, 710 Drayton Street, Savannah, GA 31401.',
      execution_date: 'August 20, 2025',
      state: 'Georgia',
    },
  },
  {
    id: 'employment-offer-letter',
    title: 'Employment Offer Letter',
    category: 'HR',
    badge: 'New',
    icon: UserCheck,
    description: 'Issue a formal employment offer with position details, compensation, start date, benefits summary, and at-will employment notice.',
    fields: [
      { id: 'company_name', label: 'Company Name', type: 'text' },
      { id: 'company_address', label: 'Company Address', type: 'text' },
      { id: 'hr_signatory', label: 'HR Signatory Name & Title', type: 'text' },
      { id: 'candidate_name', label: 'Candidate Full Name', type: 'text' },
      { id: 'candidate_address', label: 'Candidate Address', type: 'text' },
      { id: 'position_title', label: 'Position Title', type: 'text' },
      { id: 'department', label: 'Department', type: 'text' },
      { id: 'reports_to', label: 'Reports To', type: 'text' },
      { id: 'start_date', label: 'Start Date', type: 'text' },
      { id: 'base_salary', label: 'Base Salary', type: 'text' },
      { id: 'bonus', label: 'Bonus / Equity / Commission', type: 'textarea' },
      { id: 'benefits', label: 'Benefits Summary', type: 'textarea' },
      { id: 'employment_type', label: 'Employment Type (Full-Time / Part-Time)', type: 'text' },
      { id: 'work_location', label: 'Work Location / Remote Policy', type: 'text' },
      { id: 'conditions', label: 'Conditions of Employment', type: 'textarea' },
      { id: 'offer_expiry', label: 'Offer Expiry Date', type: 'text' },
      { id: 'letter_date', label: 'Letter Date', type: 'text' },
    ],
    demoData: {
      company_name: 'Axiom Software Labs, Inc.',
      company_address: '888 Technology Square, Cambridge, MA 02139',
      hr_signatory: 'Rachel Kim, VP of People Operations',
      candidate_name: 'Aiden James Patel',
      candidate_address: '56 Elm Street, Boston, MA 02116',
      position_title: 'Senior Software Engineer',
      department: 'Platform Engineering',
      reports_to: 'Marcus Lee, Director of Engineering',
      start_date: 'November 3, 2025',
      base_salary: '$165,000 per year, paid bi-weekly',
      bonus: 'Annual performance bonus target of 15% of base salary ($24,750), subject to individual and company performance. Equity grant of 12,000 RSUs vesting over 4 years (25% cliff at year 1, then monthly).',
      benefits: 'Medical, dental, and vision insurance (100% premium covered for employee, 80% for dependents). 401(k) with 4% company match. Unlimited PTO. $2,500 annual learning & development stipend. Home office equipment budget of $1,500.',
      employment_type: 'Full-Time, Exempt',
      work_location: 'Hybrid — minimum 2 days/week in Cambridge office. Flexible remote otherwise.',
      conditions: 'This offer is contingent upon: (1) successful completion of background check; (2) execution of Employee Confidentiality and IP Assignment Agreement; (3) verification of legal authorization to work in the United States.',
      offer_expiry: 'October 10, 2025',
      letter_date: 'October 1, 2025',
    },
  },
  {
    id: 'commercial-lease-agreement',
    title: 'Commercial Lease Agreement',
    category: 'Property',
    badge: 'Legal-Grade',
    icon: Building2,
    description: 'Structure a commercial property lease with base rent, CAM charges, tenant improvements, permitted use, and renewal options.',
    fields: [
      { id: 'landlord_name', label: 'Landlord / Lessor Name', type: 'text' },
      { id: 'landlord_address', label: 'Landlord Address', type: 'text' },
      { id: 'tenant_name', label: 'Tenant / Lessee Name', type: 'text' },
      { id: 'tenant_address', label: 'Tenant Address (for notices)', type: 'text' },
      { id: 'premises', label: 'Leased Premises Description', type: 'textarea' },
      { id: 'square_footage', label: 'Rentable Square Footage', type: 'text' },
      { id: 'lease_term', label: 'Lease Term', type: 'text' },
      { id: 'commencement_date', label: 'Commencement Date', type: 'text' },
      { id: 'expiration_date', label: 'Expiration Date', type: 'text' },
      { id: 'base_rent', label: 'Monthly Base Rent', type: 'text' },
      { id: 'rent_escalation', label: 'Rent Escalation Schedule', type: 'textarea' },
      { id: 'security_deposit', label: 'Security Deposit', type: 'text' },
      { id: 'permitted_use', label: 'Permitted Use', type: 'text' },
      { id: 'cam_charges', label: 'CAM / Operating Expenses', type: 'textarea' },
      { id: 'renewal_option', label: 'Renewal Option', type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'execution_date', label: 'Lease Execution Date', type: 'text' },
    ],
    demoData: {
      landlord_name: 'Pacific Gateway Properties, LLC',
      landlord_address: '101 California Street, Suite 2800, San Francisco, CA 94111',
      tenant_name: 'Blue Horizon Roasters, Inc.',
      tenant_address: '2240 Market Street, San Francisco, CA 94114',
      premises: 'Suite 101 located at 2240 Market Street, San Francisco, California 94114, comprising approximately 1,850 rentable square feet on the ground floor, as outlined in Exhibit A attached hereto.',
      square_footage: '1,850 rentable square feet',
      lease_term: '5 years',
      commencement_date: 'January 1, 2026',
      expiration_date: 'December 31, 2030',
      base_rent: '$7,400.00 per month ($4.00/sq ft)',
      rent_escalation: 'Base rent shall increase by 3% annually on each anniversary of the Commencement Date. Year 2: $7,622/mo; Year 3: $7,851/mo; Year 4: $8,087/mo; Year 5: $8,329/mo.',
      security_deposit: '$22,200.00 (three months\' base rent)',
      permitted_use: 'Specialty coffee roasting, retail coffee sales, and related café operations.',
      cam_charges: 'Tenant shall pay its pro-rata share (estimated at 12% of building) of operating expenses including maintenance, insurance, property taxes, and common area utilities. Current CAM estimate: $850/month.',
      renewal_option: 'Tenant shall have one (1) option to renew for an additional 5-year term at 95% of Fair Market Rent, exercisable by written notice no later than 180 days prior to expiration.',
      governing_law: 'State of California',
      execution_date: 'November 15, 2025',
    },
  },
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    category: 'Corporate',
    badge: 'Legal-Grade',
    icon: Handshake,
    description: 'Formalize a business partnership with capital contributions, profit sharing, management responsibilities, dissolution procedures, and partner obligations.',
    fields: [
      { id: 'partnership_name', label: 'Partnership Name', type: 'text' },
      { id: 'principal_office', label: 'Principal Place of Business', type: 'text' },
      { id: 'partner1_name', label: 'Partner One Full Name', type: 'text' },
      { id: 'partner1_address', label: 'Partner One Address', type: 'text' },
      { id: 'partner1_contribution', label: 'Partner One Capital Contribution', type: 'textarea' },
      { id: 'partner1_share', label: 'Partner One Ownership / Profit Share', type: 'text' },
      { id: 'partner2_name', label: 'Partner Two Full Name', type: 'text' },
      { id: 'partner2_address', label: 'Partner Two Address', type: 'text' },
      { id: 'partner2_contribution', label: 'Partner Two Capital Contribution', type: 'textarea' },
      { id: 'partner2_share', label: 'Partner Two Ownership / Profit Share', type: 'text' },
      { id: 'business_purpose', label: 'Business Purpose', type: 'textarea' },
      { id: 'management', label: 'Management & Decision Making', type: 'textarea' },
      { id: 'distributions', label: 'Distributions & Profit Allocation', type: 'textarea' },
      { id: 'dissolution', label: 'Dissolution Procedure', type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'effective_date', label: 'Effective Date', type: 'text' },
    ],
    demoData: {
      partnership_name: 'Ashwood & Mercer Consulting Partners',
      principal_office: '800 Congress Avenue, Suite 600, Austin, TX 78701',
      partner1_name: 'Victor L. Ashwood',
      partner1_address: '412 Barton Springs Road, Austin, TX 78704',
      partner1_contribution: 'Cash contribution of $150,000; assignment of existing client contracts valued at $85,000; office equipment valued at $22,000. Total: $257,000.',
      partner1_share: '55% ownership interest; 55% profit/loss allocation',
      partner2_name: 'Nina A. Mercer',
      partner2_address: '2100 South Lamar Blvd, Austin, TX 78704',
      partner2_contribution: 'Cash contribution of $100,000; proprietary consulting methodology and associated IP valued at $110,000. Total: $210,000.',
      partner2_share: '45% ownership interest; 45% profit/loss allocation',
      business_purpose: 'To provide management consulting, strategic advisory, and organizational transformation services to mid-market companies in the technology, energy, and healthcare sectors.',
      management: 'Major decisions (contracts exceeding $50,000, new partner admission, dissolution) require unanimous consent. Routine operational decisions may be made by either Partner acting alone in their designated area of responsibility.',
      distributions: 'Net profits shall be distributed quarterly in proportion to ownership interest after maintaining a minimum operating reserve of $75,000. Distributions shall be made within 30 days of quarter-end.',
      dissolution: 'The Partnership may be dissolved by unanimous written consent, death/incapacity of a partner (if no successor elected within 90 days), or court order. Upon dissolution, assets shall be liquidated, liabilities satisfied, and remaining proceeds distributed per ownership interest.',
      governing_law: 'State of Texas',
      effective_date: 'January 1, 2026',
    },
  },
  {
    id: 'vehicle-sale-agreement',
    title: 'Vehicle Sale Agreement',
    category: 'Commercial',
    badge: 'New',
    icon: Car,
    description: 'Document a private vehicle sale with full vehicle details, purchase price, as-is disclosure, odometer certification, and title transfer terms.',
    fields: [
      { id: 'seller_name', label: 'Seller Full Name', type: 'text' },
      { id: 'seller_address', label: 'Seller Address', type: 'text' },
      { id: 'seller_id', label: 'Seller Driver\'s License / ID Number', type: 'text' },
      { id: 'buyer_name', label: 'Buyer Full Name', type: 'text' },
      { id: 'buyer_address', label: 'Buyer Address', type: 'text' },
      { id: 'buyer_id', label: 'Buyer Driver\'s License / ID Number', type: 'text' },
      { id: 'vehicle_year', label: 'Vehicle Year', type: 'text' },
      { id: 'vehicle_make', label: 'Vehicle Make', type: 'text' },
      { id: 'vehicle_model', label: 'Vehicle Model', type: 'text' },
      { id: 'vehicle_color', label: 'Vehicle Color', type: 'text' },
      { id: 'vin', label: 'Vehicle Identification Number (VIN)', type: 'text' },
      { id: 'license_plate', label: 'License Plate Number & State', type: 'text' },
      { id: 'odometer', label: 'Odometer Reading at Sale', type: 'text' },
      { id: 'purchase_price', label: 'Purchase Price', type: 'text' },
      { id: 'payment_method', label: 'Payment Method', type: 'text' },
      { id: 'as_is', label: 'As-Is Disclosure / Condition Notes', type: 'textarea' },
      { id: 'sale_date', label: 'Date of Sale', type: 'text' },
      { id: 'state', label: 'State of Sale', type: 'text' },
    ],
    demoData: {
      seller_name: 'Harold James Kowalski',
      seller_address: '503 Elmhurst Circle, Denver, CO 80203',
      seller_id: 'CO DL #K4421-0039-2',
      buyer_name: 'Fatima Zara Osei',
      buyer_address: '1101 York Street, Denver, CO 80206',
      buyer_id: 'CO DL #O8813-4421-1',
      vehicle_year: '2019',
      vehicle_make: 'Toyota',
      vehicle_model: 'Tacoma TRD Off-Road',
      vehicle_color: 'Cement Gray',
      vin: '3TMCZ5AN3KM248841',
      license_plate: 'ABC-4421 (Colorado)',
      odometer: '67,412 miles',
      purchase_price: 'Thirty-Two Thousand Dollars ($32,000.00)',
      payment_method: 'Cashier\'s Check, Check #001224, issued by Wells Fargo Bank',
      as_is: 'Vehicle is sold AS-IS, WHERE-IS, with no warranty of any kind, express or implied. Buyer has inspected the vehicle and accepts its condition. Known items: minor scratch on rear bumper; driver-side armrest shows wear.',
      sale_date: 'October 25, 2025',
      state: 'Colorado',
    },
  },
]

// ─── CATEGORY CONFIG ────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Family Law', 'Property', 'Medical', 'Corporate', 'Financial', 'Estate', 'HR', 'Commercial']

const CATEGORY_COLORS = {
  'Family Law': { bg: 'rgba(244,114,182,0.15)', text: '#f472b6', border: 'rgba(244,114,182,0.3)' },
  'Property': { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
  'Medical': { bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.3)' },
  'Corporate': { bg: 'rgba(129,140,248,0.12)', text: '#818cf8', border: 'rgba(129,140,248,0.3)' },
  'Financial': { bg: 'rgba(240,180,41,0.12)', text: '#F0B429', border: 'rgba(240,180,41,0.3)' },
  'Estate': { bg: 'rgba(251,146,60,0.12)', text: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  'HR': { bg: 'rgba(163,230,53,0.12)', text: '#a3e635', border: 'rgba(163,230,53,0.3)' },
  'Commercial': { bg: 'rgba(232,121,249,0.12)', text: '#e879f9', border: 'rgba(232,121,249,0.3)' },
}

const BADGE_STYLES = {
  'Popular': 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  'Legal-Grade': 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
  'New': 'bg-sky-400/20 text-sky-300 border border-sky-400/30',
}

// ─── PDF GENERATION ─────────────────────────────────────────────────────────────

const generatePDF = (template, data) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210, pageH = 297, margin = 20, contentW = pageW - margin * 2
  doc.setFillColor(253, 251, 247)
  doc.rect(0, 0, pageW, pageH, 'F')
  doc.setFillColor(240, 180, 41)
  doc.rect(0, 0, pageW, 4, 'F')
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('SATOHASH', pageW - margin, 20, { align: 'right' })
  doc.text('Sovereign Notary Protocol', pageW - margin, 25, { align: 'right' })
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(22)
  doc.text(template.title.toUpperCase(), margin, 35)
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text(`Bitcoin-Anchored • Satohash • ${new Date().toLocaleDateString()}`, margin, 42)
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.5)
  doc.line(margin, 46, pageW - margin, 46)
  let y = 56
  template.fields.forEach(field => {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(7); doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'bold')
    doc.text(field.label.toUpperCase(), margin, y); y += 5
    doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(data[field.id] || '—', contentW)
    doc.text(lines, margin, y); y += lines.length * 5 + 8
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2)
    doc.line(margin, y - 4, pageW - margin, y - 4)
  })
  doc.setFontSize(7); doc.setTextColor(148, 163, 184)
  doc.text('Generated via Satohash', margin, pageH - 10)
  doc.text('satohash.com', pageW - margin, pageH - 10, { align: 'right' })
  doc.save(`Satohash_${template.id}_${Date.now()}.pdf`)
}

// ─── TEMPLATE CARD ───────────────────────────────────────────────────────────────

function TemplateCard({ template, onOpen }) {
  const Icon = template.icon
  const catColor = CATEGORY_COLORS[template.category] || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="surface-card rounded-2xl border overflow-hidden cursor-pointer group flex flex-col"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      onClick={() => onOpen(template)}
    >
      <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: catColor.bg, border: `1px solid ${catColor.border}` }}
          >
            <Icon size={18} style={{ color: catColor.text }} />
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${BADGE_STYLES[template.badge]}`}>
            {template.badge}
          </span>
        </div>

        {/* Category */}
        <span
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: catColor.text }}
        >
          {template.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>
          {template.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
          {template.description}
        </p>
      </div>

      {/* CTA */}
      <div
        className="px-5 md:px-6 py-3 flex items-center justify-between border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
      >
        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          {template.fields.length} fields
        </span>
        <span
          className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
          style={{ color: 'var(--accent-gold)' }}
        >
          Open Template <ChevronRight size={14} />
        </span>
      </div>
    </motion.div>
  )
}

// ─── LIST VIEW ───────────────────────────────────────────────────────────────────

function TemplateList({ onSelect }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchesCat = category === 'All' || t.category === category
      const matchesSearch = !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [search, category])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} style={{ color: 'var(--accent-gold)' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-gold)' }}>
              Sovereign Notary
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Notary Templates
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Professional legal documents anchored to the Bitcoin blockchain. Fill, sign, and immortalise your agreements.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150"
                  style={{
                    background: active ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                    color: active ? '#0f172a' : 'var(--text-secondary)',
                    border: active ? '1px solid var(--accent-gold)' : '1px solid var(--border)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>No templates match your search.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(t => (
                <TemplateCard key={t.id} template={t} onOpen={onSelect} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── EDITOR VIEW ────────────────────────────────────────────────────────────────

function TemplateEditor({ template, onBack }) {
  const [data, setData] = useState({ ...template.demoData })

  const completedFields = template.fields.filter(f => data[f.id]?.trim?.())
  const progress = Math.round((completedFields.length / template.fields.length) * 100)

  const handleAnchor = () => {
    toast.success('⚡ Document anchored to Bitcoin!', {
      description: `Tx hash pending confirmation on the Satohash protocol.`,
    })
  }

  const handleVault = () => {
    toast.success('🔒 Saved to your Vault', {
      description: `${template.title} is securely stored.`,
    })
  }

  const handlePDF = () => {
    try {
      generatePDF(template, data)
      toast.success('📄 PDF downloaded!')
    } catch {
      toast.error('PDF generation failed. Please try again.')
    }
  }

  const catColor = CATEGORY_COLORS[template.category] || {}

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 min-h-[44px] px-3 -ml-3 rounded-xl transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-semibold">Back to Templates</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── Document panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex-1 w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#fdfbf7' }}
          >
            {/* Gold-teal accent bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #F0B429 0%, #0d9488 100%)' }} />

            <div className="p-5 md:p-12">
              {/* Watermark logo top-right */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
                    {template.title.toUpperCase()}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}
                    >
                      {template.category}
                    </span>
                    <span className="text-xs" style={{ color: '#94a3b8' }}>
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end" style={{ opacity: 0.45, filter: 'grayscale(100%)' }}>
                  <img src="/logo.png" alt="Satohash" className="h-7 w-auto mb-0.5" onError={e => { e.target.style.display = 'none' }} />
                  <span className="text-[10px] font-black tracking-[0.3em]" style={{ color: '#0f172a' }}>SATOHASH</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'linear-gradient(90deg, #F0B429 0%, transparent 100%)', marginBottom: '2.5rem' }} />

              {/* Fields */}
              <div className="flex flex-col gap-6">
                {template.fields.map((field, idx) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-[10px] font-black tracking-[0.18em] uppercase mb-1.5"
                      style={{ color: '#64748b' }}
                    >
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        value={data[field.id] || ''}
                        onChange={e => setData(d => ({ ...d, [field.id]: e.target.value }))}
                        rows={3}
                        className="w-full resize-y outline-none bg-transparent px-0 py-1 text-sm leading-relaxed transition-colors"
                        style={{
                          color: '#0f172a',
                          borderBottom: '1.5px solid #e2e8f0',
                          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                          borderRadius: 0,
                        }}
                        onFocus={e => e.target.style.borderBottomColor = '#eab308'}
                        onBlur={e => e.target.style.borderBottomColor = '#e2e8f0'}
                      />
                    ) : (
                      <input
                        id={field.id}
                        type="text"
                        value={data[field.id] || ''}
                        onChange={e => setData(d => ({ ...d, [field.id]: e.target.value }))}
                        className="w-full outline-none bg-transparent px-0 py-1 text-sm transition-colors"
                        style={{
                          color: '#0f172a',
                          borderBottom: '1.5px solid #e2e8f0',
                          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                          borderRadius: 0,
                        }}
                        onFocus={e => e.target.style.borderBottomColor = '#eab308'}
                        onBlur={e => e.target.style.borderBottomColor = '#e2e8f0'}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Document footer */}
              <div className="mt-14 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>Generated via</p>
                  <p className="text-sm font-black" style={{ color: '#0f172a' }}>Satohash — Sovereign Notary Protocol</p>
                  <p className="text-[10px]" style={{ color: '#94a3b8' }}>satohash.com</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: '#94a3b8' }}>Bitcoin-Anchored Document</p>
                  <div className="w-24 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f1f5f9' }}>
                    <span className="text-[9px] font-bold" style={{ color: '#94a3b8' }}>HASH PENDING</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="w-full lg:w-72 xl:w-80 flex flex-col gap-4"
          >
            {/* Anchor to Bitcoin */}
            <button
              onClick={handleAnchor}
              className="w-full rounded-xl py-3.5 px-5 font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #F0B429 0%, #d97706 100%)',
                color: '#0f172a',
                boxShadow: '0 0 20px rgba(240,180,41,0.25)',
              }}
            >
              <Zap size={16} />
              Anchor to Bitcoin
            </button>

            {/* Progress card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Fields Complete</span>
                <span className="text-sm font-black" style={{ color: 'var(--accent-gold)' }}>{progress}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #F0B429, #0d9488)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                {completedFields.length} of {template.fields.length} fields filled
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handlePDF}
                className="w-full rounded-xl py-3 px-4 text-sm font-semibold flex items-center gap-2.5 transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Download size={15} style={{ color: 'var(--accent-gold)' }} />
                Download PDF
              </button>

              <button
                onClick={() => window.print()}
                className="w-full rounded-xl py-3 px-4 text-sm font-semibold flex items-center gap-2.5 transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Printer size={15} style={{ color: 'var(--accent-teal)' }} />
                Print Document
              </button>

              <button
                onClick={handleVault}
                className="w-full rounded-xl py-3 px-4 text-sm font-semibold flex items-center gap-2.5 transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-success)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Vault size={15} style={{ color: 'var(--accent-success)' }} />
                Save to Vault
              </button>
            </div>

            {/* Zero-knowledge info card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(240,180,41,0.05)',
                border: '1px solid rgba(240,180,41,0.2)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock size={13} style={{ color: 'var(--accent-gold)' }} />
                <span className="text-xs font-black tracking-wide uppercase" style={{ color: 'var(--accent-gold)' }}>
                  Zero-Knowledge
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                Your document contents never leave your device. Only a cryptographic hash is anchored to Bitcoin — provable without exposure.
              </p>
              <a
                href="/trust"
                className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--accent-gold)' }}
              >
                Learn how it works <ExternalLink size={11} />
              </a>
            </div>

            {/* Field completion checklist (collapsed) */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Checklist
              </p>
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                {template.fields.map(field => {
                  const filled = !!data[field.id]?.trim?.()
                  return (
                    <div key={field.id} className="flex items-center gap-2">
                      {filled
                        ? <CheckCircle size={12} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                        : <Circle size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      }
                      <span
                        className="text-[11px] leading-tight"
                        style={{ color: filled ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                      >
                        {field.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────────

export default function NotaryTemplates() {
  const [selected, setSelected] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {selected ? (
        <motion.div
          key="editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TemplateEditor template={selected} onBack={() => setSelected(null)} />
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TemplateList onSelect={setSelected} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
