import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tooltip from '../components/ui/Tooltip'
import { getVerifyUrl } from '../config/constants'
import usePageMetaOnboarding from '../hooks/usePageMetaOnboarding'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import {
  Heart,
  Home,
  Stethoscope,
  Shield,
  Briefcase,
  Lightbulb,
  DollarSign,
  ScrollText,
  UserCheck,
  Building2,
  Handshake,
  Car,
  Search,
  ArrowLeft,
  Download,
  Printer,
  Vault,
  Zap,
  ChevronRight,
  FileText,
  CheckCircle,
  Circle,
  ExternalLink,
  Lock,
  Mail,
  Eye,
  X,
  Link2,
  Moon,
  Sun,
  Camera,
  ShoppingBag,
  Crown,
  BarChart3,
  AlertTriangle,
  History,
  ChevronDown,
  RotateCcw,
  Fingerprint,
  Globe,
  Scale,
  FileCheck
} from 'lucide-react'

// ─── TEMPLATES DATA ────────────────────────────────────────────────────────────

export const TEMPLATES = [
  {
    id: 'prenuptial-agreement',
    title: 'Prenuptial Agreement',
    category: 'Family Law',
    badge: 'Legal-Grade',
    icon: Heart,
    description:
      'Define asset ownership, debt liability, and spousal rights before marriage with a legally-structured notarized prenuptial agreement.',
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
      { id: 'execution_date', label: 'Agreement Execution Date', type: 'text' }
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
      party1_assets:
        'Real property at 412 Lakeview Terrace valued at $620,000; brokerage account #4421 with Fidelity containing $185,000; vintage automobile collection valued at $95,000.',
      party2_assets:
        'Intellectual property portfolio including US Patent #10,482,291; savings account at Chase Bank containing $42,000; fine art collection valued at $60,000.',
      party1_debts:
        'Student loan balance of $28,000 with Navient. No other outstanding obligations.',
      party2_debts: 'No existing debt obligations at time of execution.',
      property_division:
        'All premarital assets listed herein shall remain the separate property of the originating party. Assets acquired jointly during the marriage shall be divided equally (50/50) upon dissolution.',
      spousal_support:
        'In the event of dissolution, neither party shall seek spousal support if the marriage lasted fewer than five (5) years. For marriages exceeding five years, support shall be negotiated in good faith.',
      governing_law: 'State of Texas',
      execution_date: 'August 1, 2025'
    }
  },
  {
    id: 'real-estate-title-deed',
    title: 'Real Estate Title Deed',
    category: 'Property',
    badge: 'Popular',
    icon: Home,
    description:
      'Transfer real property ownership with a complete, notarized title deed including legal description, consideration, and covenant terms.',
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
      { id: 'transfer_date', label: 'Date of Transfer', type: 'text' }
    ],
    demoData: {
      grantor_name: 'Robert H. Whitfield',
      grantor_address: '9 Orchard Hill Road, Portland, OR 97201',
      grantee_name: 'Amara & David Okonkwo',
      grantee_address: '2204 NE Glisan Street, Portland, OR 97212',
      consideration: 'Eight Hundred and Forty-Five Thousand Dollars ($845,000.00)',
      property_address: '9 Orchard Hill Road, Portland, OR 97201',
      legal_description:
        'Lot 14, Block 3, ORCHARD HILL SUBDIVISION, as platted and recorded in Book 72 of Plats, Page 18, Records of Multnomah County, Oregon. Subject to easements of record.',
      parcel_number: '1N1E26BB-01400',
      deed_type: 'Warranty Deed',
      encumbrances:
        'Subject to a utility easement of 10 feet along the northern boundary per instrument #2018-044821. No other liens or encumbrances.',
      county: 'Multnomah County',
      state: 'Oregon',
      transfer_date: 'October 3, 2025'
    }
  },
  {
    id: 'living-will-advance-directive',
    title: 'Living Will & Advance Directive',
    category: 'Medical',
    badge: 'Legal-Grade',
    icon: Stethoscope,
    description:
      'Declare your end-of-life medical wishes, appoint a healthcare proxy, and specify treatment preferences with a legally-binding advance directive.',
    fields: [
      { id: 'principal_name', label: 'Principal (Your) Full Name', type: 'text' },
      { id: 'principal_dob', label: 'Date of Birth', type: 'text' },
      { id: 'principal_address', label: 'Primary Address', type: 'text' },
      { id: 'agent_name', label: 'Healthcare Agent Full Name', type: 'text' },
      { id: 'agent_relationship', label: 'Agent Relationship to Principal', type: 'text' },
      { id: 'agent_phone', label: 'Agent Phone Number', type: 'text' },
      { id: 'alternate_agent', label: 'Alternate Agent Full Name', type: 'text' },
      { id: 'life_sustaining', label: 'Life-Sustaining Treatment Wishes', type: 'textarea' },
      {
        id: 'artificial_nutrition',
        label: 'Artificial Nutrition & Hydration Wishes',
        type: 'textarea'
      },
      { id: 'pain_management', label: 'Pain Management & Comfort Care', type: 'textarea' },
      { id: 'organ_donation', label: 'Organ Donation Wishes', type: 'textarea' },
      { id: 'additional_wishes', label: 'Additional Instructions', type: 'textarea' },
      { id: 'execution_date', label: 'Date Executed', type: 'text' },
      { id: 'state', label: 'State of Execution', type: 'text' }
    ],
    demoData: {
      principal_name: 'Margaret Louise Fairbanks',
      principal_dob: 'November 8, 1952',
      principal_address: '33 Birchwood Court, Madison, WI 53703',
      agent_name: 'Thomas Edward Fairbanks',
      agent_relationship: 'Spouse',
      agent_phone: '(608) 555-0142',
      alternate_agent: 'Dr. Carol Anne Fairbanks, Daughter',
      life_sustaining:
        'I direct that life-sustaining treatment be withheld or withdrawn if I am in a terminal condition, persistent vegetative state, or end-stage condition where such treatment would only prolong the dying process without offering meaningful recovery.',
      artificial_nutrition:
        'If I am unable to recognize or interact with those I love, I do not wish to receive artificial nutrition or hydration beyond comfort measures as determined by my attending physician.',
      pain_management:
        'I direct that all reasonable measures be taken to alleviate pain and ensure comfort, including palliative sedation if necessary, even if such measures may hasten my death.',
      organ_donation:
        'I wish to donate any and all organs and tissues that can benefit others upon my death. I specifically authorize donation for transplantation, research, and medical education.',
      additional_wishes:
        'I wish to spend my final days at home if medically feasible. I request that spiritual counseling from the First Presbyterian Church of Madison be made available.',
      execution_date: 'July 15, 2025',
      state: 'Wisconsin'
    }
  },
  {
    id: 'mutual-nda',
    title: 'Mutual NDA',
    category: 'Corporate',
    badge: 'Popular',
    icon: Shield,
    description:
      'Protect confidential information exchanged between two parties with a comprehensive mutual non-disclosure agreement covering trade secrets and proprietary data.',
    fields: [
      { id: 'party1_name', label: 'First Party (Company / Individual)', type: 'text' },
      { id: 'party1_address', label: 'First Party Address', type: 'text' },
      { id: 'party1_rep', label: 'First Party Representative Name & Title', type: 'text' },
      { id: 'party2_name', label: 'Second Party (Company / Individual)', type: 'text' },
      { id: 'party2_address', label: 'Second Party Address', type: 'text' },
      { id: 'party2_rep', label: 'Second Party Representative Name & Title', type: 'text' },
      { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea' },
      {
        id: 'confidential_info',
        label: 'Definition of Confidential Information',
        type: 'textarea'
      },
      { id: 'exclusions', label: 'Exclusions from Confidentiality', type: 'textarea' },
      { id: 'term_years', label: 'Agreement Term (Years)', type: 'text' },
      { id: 'governing_law', label: 'Governing Law / Jurisdiction', type: 'text' },
      { id: 'effective_date', label: 'Effective Date', type: 'text' }
    ],
    demoData: {
      party1_name: 'Nexus Ventures LLC',
      party1_address: '500 Silicon Blvd, Suite 1200, San Francisco, CA 94107',
      party1_rep: 'Daniel Cho, Chief Executive Officer',
      party2_name: 'Archon Technologies Inc.',
      party2_address: '1800 Innovation Drive, Austin, TX 78758',
      party2_rep: 'Priya Sharma, Chief Technology Officer',
      purpose:
        'The parties intend to explore a potential business partnership and/or acquisition involving proprietary software platforms, source code, financial projections, customer data, and go-to-market strategies.',
      confidential_info:
        'All information disclosed by either party that is marked "Confidential," or that a reasonable person would consider confidential given the nature of the information and circumstances of disclosure, including but not limited to: source code, algorithms, business plans, financial data, customer lists, pricing, and technical specifications.',
      exclusions:
        'Information that is or becomes publicly available through no breach of this Agreement; information independently developed without use of Confidential Information; information received from a third party without restriction; information required to be disclosed by law or court order.',
      term_years: '3 years from the Effective Date',
      governing_law: 'State of California, County of San Francisco',
      effective_date: 'August 15, 2025'
    }
  },
  {
    id: 'freelance-service-contract',
    title: 'Freelance Service Contract',
    category: 'Commercial',
    badge: 'Popular',
    icon: Briefcase,
    description:
      'Formalize freelance engagements with clear scope of work, payment terms, IP ownership, and termination clauses to protect both client and contractor.',
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
      { id: 'effective_date', label: 'Contract Effective Date', type: 'text' }
    ],
    demoData: {
      client_name: 'Meridian Media Group, LLC',
      client_address: '1 World Trade Center, Floor 42, New York, NY 10007',
      freelancer_name: 'Kenji Watanabe',
      freelancer_address: '18 Fulton Market, Brooklyn, NY 11201',
      project_name: 'Brand Identity System & Website Redesign',
      scope:
        'Freelancer shall design a complete brand identity system including logo suite, typography system, color palette, and brand guidelines document. Freelancer shall also design and develop a 12-page responsive website using Webflow.',
      deliverables:
        '(1) Logo suite in SVG/PNG/EPS; (2) Brand guidelines PDF; (3) Webflow CMS website with all pages live; (4) Asset export package; (5) 30-day post-launch support.',
      start_date: 'September 1, 2025',
      end_date: 'November 30, 2025',
      rate: '$12,500 flat fee (plus approved expenses)',
      payment_schedule:
        '33% ($4,166.67) due upon signing; 33% due upon brand identity approval; 34% ($4,166.66) due upon website launch.',
      ip_ownership:
        'Upon receipt of final payment, all work product, including source files, shall become the exclusive property of the Client. Freelancer retains the right to display work in their portfolio.',
      revisions: 'Up to 3 rounds of revisions per phase. Additional revisions billed at $150/hour.',
      termination:
        'Either party may terminate with 14 days written notice. Client shall pay for all work completed to the termination date. Freelancer shall deliver all work product upon final payment.',
      governing_law: 'State of New York',
      effective_date: 'September 1, 2025'
    }
  },
  {
    id: 'ip-assignment-agreement',
    title: 'IP Assignment Agreement',
    category: 'Corporate',
    badge: 'Legal-Grade',
    icon: Lightbulb,
    description:
      'Transfer all rights, title, and interest in intellectual property from an assignor to assignee, covering patents, copyrights, trademarks, and trade secrets.',
    fields: [
      { id: 'assignor_name', label: 'Assignor (Transferring Party)', type: 'text' },
      { id: 'assignor_address', label: 'Assignor Address', type: 'text' },
      { id: 'assignee_name', label: 'Assignee (Receiving Party)', type: 'text' },
      { id: 'assignee_address', label: 'Assignee Address', type: 'text' },
      { id: 'ip_description', label: 'Description of IP Being Assigned', type: 'textarea' },
      { id: 'ip_type', label: 'Type of IP (Patent, Copyright, Trademark, etc.)', type: 'text' },
      {
        id: 'registration_numbers',
        label: 'Registration / Application Numbers (if any)',
        type: 'textarea'
      },
      { id: 'consideration', label: 'Consideration Paid', type: 'text' },
      { id: 'representations', label: 'Assignor Representations & Warranties', type: 'textarea' },
      { id: 'further_assurances', label: 'Further Assurances Clause', type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'effective_date', label: 'Effective Date', type: 'text' }
    ],
    demoData: {
      assignor_name: 'Dr. Elena Vasquez',
      assignor_address: '244 Quantum Lane, Cambridge, MA 02139',
      assignee_name: 'Helix Bio Systems, Inc.',
      assignee_address: '100 Pharma Park Drive, Lexington, MA 02421',
      ip_description:
        'All intellectual property related to "Adaptive Protein Folding Prediction Algorithm" including all associated source code, documentation, training datasets, model weights, and any improvements or derivatives thereof.',
      ip_type: 'Software Copyright, Trade Secret, Provisional Patent Application',
      registration_numbers:
        'US Provisional Patent Application No. 63/412,889 (filed September 2024); Copyright Registration TXu-002-441-228.',
      consideration:
        'Two Hundred Fifty Thousand Dollars ($250,000.00) plus 1.5% royalty on net revenue derived from the assigned IP.',
      representations:
        'Assignor represents and warrants that: (i) they are the sole inventor and owner of the IP; (ii) the IP does not infringe any third-party rights; (iii) no liens or encumbrances exist on the IP; (iv) no prior assignment or license conflicts with this Agreement.',
      further_assurances:
        "Assignor agrees to execute all documents reasonably requested by Assignee to record, perfect, or enforce Assignee's rights in the IP, including USPTO assignment recordation filings.",
      governing_law: 'Commonwealth of Massachusetts',
      effective_date: 'October 1, 2025'
    }
  },
  {
    id: 'personal-loan-agreement',
    title: 'Personal Loan Agreement',
    category: 'Financial',
    badge: 'Popular',
    icon: DollarSign,
    description:
      'Document a personal loan with principal amount, interest rate, repayment schedule, and default provisions to protect both lender and borrower.',
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
      { id: 'execution_date', label: 'Date of Execution', type: 'text' }
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
      payment_schedule:
        'Borrower shall make 36 equal monthly installments of $754.85, due on the 15th of each month beginning November 15, 2025, with final payment on October 15, 2028.',
      purpose: 'Home renovation and improvement of primary residence.',
      collateral: 'This loan is unsecured. No collateral pledged.',
      default_terms:
        "If Borrower fails to make any payment within 15 days of its due date, the entire outstanding principal and accrued interest shall become immediately due and payable at Lender's option. A late fee of $50 shall apply to each payment more than 5 days overdue.",
      governing_law: 'South Carolina',
      execution_date: 'October 15, 2025'
    }
  },
  {
    id: 'last-will-testament',
    title: 'Last Will & Testament',
    category: 'Estate',
    badge: 'Legal-Grade',
    icon: ScrollText,
    description:
      'Establish a legally-binding last will declaring the distribution of your estate, appointment of executor, and guardianship of minor children.',
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
      { id: 'state', label: 'State of Execution', type: 'text' }
    ],
    demoData: {
      testator_name: 'William Robert Ashford III',
      testator_dob: 'June 5, 1960',
      testator_address: '1200 Magnolia Boulevard, Savannah, GA 31401',
      executor_name: 'Catherine Marie Ashford',
      executor_address: '1200 Magnolia Boulevard, Savannah, GA 31401',
      alternate_executor: 'James Edward Ashford, Son',
      guardian_name: 'Not applicable — no minor children.',
      specific_bequests:
        '(1) To my son James E. Ashford: the 1967 Ford Mustang Fastback and my complete collection of first-edition novels. (2) To my daughter Laura M. Ashford: the pearl necklace and earring set that belonged to my mother. (3) To the Savannah Art Institute: $50,000 for scholarship endowment.',
      residuary_estate:
        'All remaining estate assets, including real property, financial accounts, investments, and personal property not specifically bequeathed, shall be distributed equally between my children James Edward Ashford and Laura Marie Ashford.',
      debts_expenses:
        'I direct my Executor to pay all lawful debts, funeral expenses, and costs of estate administration from the residuary estate prior to distribution.',
      special_instructions:
        'I wish to be cremated. A memorial service shall be held at First Baptist Church, Savannah. I request my ashes be scattered at Tybee Island, Georgia. No elaborate funeral proceedings.',
      witnesses:
        'Witness 1: Patricia Holm, 44 Bay Street, Savannah, GA 31401. Witness 2: Marcus Webb, 710 Drayton Street, Savannah, GA 31401.',
      execution_date: 'August 20, 2025',
      state: 'Georgia'
    }
  },
  {
    id: 'employment-offer-letter',
    title: 'Employment Offer Letter',
    category: 'HR',
    badge: 'New',
    icon: UserCheck,
    description:
      'Issue a formal employment offer with position details, compensation, start date, benefits summary, and at-will employment notice.',
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
      { id: 'letter_date', label: 'Letter Date', type: 'text' }
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
      bonus:
        'Annual performance bonus target of 15% of base salary ($24,750), subject to individual and company performance. Equity grant of 12,000 RSUs vesting over 4 years (25% cliff at year 1, then monthly).',
      benefits:
        'Medical, dental, and vision insurance (100% premium covered for employee, 80% for dependents). 401(k) with 4% company match. Unlimited PTO. $2,500 annual learning & development stipend. Home office equipment budget of $1,500.',
      employment_type: 'Full-Time, Exempt',
      work_location: 'Hybrid — minimum 2 days/week in Cambridge office. Flexible remote otherwise.',
      conditions:
        'This offer is contingent upon: (1) successful completion of background check; (2) execution of Employee Confidentiality and IP Assignment Agreement; (3) verification of legal authorization to work in the United States.',
      offer_expiry: 'October 10, 2025',
      letter_date: 'October 1, 2025'
    }
  },
  {
    id: 'commercial-lease-agreement',
    title: 'Commercial Lease Agreement',
    category: 'Property',
    badge: 'Legal-Grade',
    icon: Building2,
    description:
      'Structure a commercial property lease with base rent, CAM charges, tenant improvements, permitted use, and renewal options.',
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
      { id: 'execution_date', label: 'Lease Execution Date', type: 'text' }
    ],
    demoData: {
      landlord_name: 'Pacific Gateway Properties, LLC',
      landlord_address: '101 California Street, Suite 2800, San Francisco, CA 94111',
      tenant_name: 'Blue Horizon Roasters, Inc.',
      tenant_address: '2240 Market Street, San Francisco, CA 94114',
      premises:
        'Suite 101 located at 2240 Market Street, San Francisco, California 94114, comprising approximately 1,850 rentable square feet on the ground floor, as outlined in Exhibit A attached hereto.',
      square_footage: '1,850 rentable square feet',
      lease_term: '5 years',
      commencement_date: 'January 1, 2026',
      expiration_date: 'December 31, 2030',
      base_rent: '$7,400.00 per month ($4.00/sq ft)',
      rent_escalation:
        'Base rent shall increase by 3% annually on each anniversary of the Commencement Date. Year 2: $7,622/mo; Year 3: $7,851/mo; Year 4: $8,087/mo; Year 5: $8,329/mo.',
      security_deposit: "$22,200.00 (three months' base rent)",
      permitted_use: 'Specialty coffee roasting, retail coffee sales, and related café operations.',
      cam_charges:
        'Tenant shall pay its pro-rata share (estimated at 12% of building) of operating expenses including maintenance, insurance, property taxes, and common area utilities. Current CAM estimate: $850/month.',
      renewal_option:
        'Tenant shall have one (1) option to renew for an additional 5-year term at 95% of Fair Market Rent, exercisable by written notice no later than 180 days prior to expiration.',
      governing_law: 'State of California',
      execution_date: 'November 15, 2025'
    }
  },
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    category: 'Corporate',
    badge: 'Legal-Grade',
    icon: Handshake,
    description:
      'Formalize a business partnership with capital contributions, profit sharing, management responsibilities, dissolution procedures, and partner obligations.',
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
      { id: 'effective_date', label: 'Effective Date', type: 'text' }
    ],
    demoData: {
      partnership_name: 'Ashwood & Mercer Consulting Partners',
      principal_office: '800 Congress Avenue, Suite 600, Austin, TX 78701',
      partner1_name: 'Victor L. Ashwood',
      partner1_address: '412 Barton Springs Road, Austin, TX 78704',
      partner1_contribution:
        'Cash contribution of $150,000; assignment of existing client contracts valued at $85,000; office equipment valued at $22,000. Total: $257,000.',
      partner1_share: '55% ownership interest; 55% profit/loss allocation',
      partner2_name: 'Nina A. Mercer',
      partner2_address: '2100 South Lamar Blvd, Austin, TX 78704',
      partner2_contribution:
        'Cash contribution of $100,000; proprietary consulting methodology and associated IP valued at $110,000. Total: $210,000.',
      partner2_share: '45% ownership interest; 45% profit/loss allocation',
      business_purpose:
        'To provide management consulting, strategic advisory, and organizational transformation services to mid-market companies in the technology, energy, and healthcare sectors.',
      management:
        'Major decisions (contracts exceeding $50,000, new partner admission, dissolution) require unanimous consent. Routine operational decisions may be made by either Partner acting alone in their designated area of responsibility.',
      distributions:
        'Net profits shall be distributed quarterly in proportion to ownership interest after maintaining a minimum operating reserve of $75,000. Distributions shall be made within 30 days of quarter-end.',
      dissolution:
        'The Partnership may be dissolved by unanimous written consent, death/incapacity of a partner (if no successor elected within 90 days), or court order. Upon dissolution, assets shall be liquidated, liabilities satisfied, and remaining proceeds distributed per ownership interest.',
      governing_law: 'State of Texas',
      effective_date: 'January 1, 2026'
    }
  },
  {
    id: 'vehicle-sale-agreement',
    title: 'Vehicle Sale Agreement',
    category: 'Commercial',
    badge: 'New',
    icon: Car,
    description:
      'Document a private vehicle sale with full vehicle details, purchase price, as-is disclosure, odometer certification, and title transfer terms.',
    fields: [
      { id: 'seller_name', label: 'Seller Full Name', type: 'text' },
      { id: 'seller_address', label: 'Seller Address', type: 'text' },
      { id: 'seller_id', label: "Seller Driver's License / ID Number", type: 'text' },
      { id: 'buyer_name', label: 'Buyer Full Name', type: 'text' },
      { id: 'buyer_address', label: 'Buyer Address', type: 'text' },
      { id: 'buyer_id', label: "Buyer Driver's License / ID Number", type: 'text' },
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
      { id: 'state', label: 'State of Sale', type: 'text' }
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
      payment_method: "Cashier's Check, Check #001224, issued by Wells Fargo Bank",
      as_is:
        'Vehicle is sold AS-IS, WHERE-IS, with no warranty of any kind, express or implied. Buyer has inspected the vehicle and accepts its condition. Known items: minor scratch on rear bumper; driver-side armrest shows wear.',
      sale_date: 'October 25, 2025',
      state: 'Colorado'
    }
  },
  // ── NEW TEMPLATES ──────────────────────────────────────────────────────────────
  {
    id: 'residential-lease-agreement',
    title: 'Lease Agreement',
    category: 'Property',
    badge: 'Popular',
    icon: Home,
    description:
      'A comprehensive residential lease capturing tenant and landlord details, monthly rent, security deposit, lease term, and house rules.',
    fields: [
      { id: 'landlord_name', label: 'Landlord Full Name', type: 'text' },
      { id: 'landlord_address', label: 'Landlord Address', type: 'text' },
      { id: 'tenant_name', label: 'Tenant(s) Full Name(s)', type: 'text' },
      { id: 'tenant_address', label: 'Tenant Current Address', type: 'text' },
      { id: 'property_address', label: 'Rental Property Address', type: 'text' },
      { id: 'lease_start', label: 'Lease Start Date', type: 'text' },
      { id: 'lease_end', label: 'Lease End Date', type: 'text' },
      { id: 'monthly_rent', label: 'Monthly Rent Amount', type: 'text' },
      { id: 'due_date', label: 'Rent Due Date (day of month)', type: 'text' },
      { id: 'security_deposit', label: 'Security Deposit Amount', type: 'text' },
      { id: 'late_fee', label: 'Late Fee Policy', type: 'text' },
      { id: 'utilities', label: 'Utilities Responsibility', type: 'textarea' },
      { id: 'pets', label: 'Pet Policy', type: 'text' },
      { id: 'smoking', label: 'Smoking Policy', type: 'text' },
      { id: 'house_rules', label: 'House Rules & Restrictions', type: 'textarea' },
      { id: 'termination', label: 'Early Termination Clause', type: 'textarea' },
      { id: 'governing_law', label: 'Governing State / Jurisdiction', type: 'text' }
    ],
    demoData: {
      landlord_name: 'Patricia Ann Holloway',
      landlord_address: '55 Magnolia Drive, Raleigh, NC 27601',
      tenant_name: 'Marcus T. Williams & Renee C. Williams',
      tenant_address: '210 Oak Park Lane, Durham, NC 27703',
      property_address: '14 Birchwood Court, Raleigh, NC 27604',
      lease_start: 'January 1, 2026',
      lease_end: 'December 31, 2026',
      monthly_rent: 'Two Thousand One Hundred Dollars ($2,100.00)',
      due_date: '1st of each month',
      security_deposit: 'Four Thousand Two Hundred Dollars ($4,200.00)',
      late_fee: '$75 if rent is received after the 5th of the month.',
      utilities:
        'Tenant is responsible for electricity, gas, internet, and cable. Landlord covers water, sewer, and trash removal.',
      pets: 'One pet allowed with a non-refundable pet fee of $300. No pets over 50 lbs.',
      smoking: 'No smoking permitted inside the property or within 25 feet of any entrance.',
      house_rules:
        'No subletting without written landlord consent. Quiet hours 10 PM – 8 AM. Tenant must maintain yard in neat condition. No alterations to the property without written approval.',
      termination:
        'Tenant may terminate with 60 days written notice and payment of a 2-month early termination fee. Landlord may terminate with 30 days written notice for material breach of lease.',
      governing_law: 'State of North Carolina'
    }
  },
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    category: 'HR',
    badge: 'Legal-Grade',
    icon: Briefcase,
    description:
      'A full employment agreement covering position title, salary, duties, IP assignment, non-compete obligations, and termination provisions.',
    fields: [
      { id: 'employer_name', label: 'Employer / Company Name', type: 'text' },
      { id: 'employer_address', label: 'Employer Address', type: 'text' },
      { id: 'employee_name', label: 'Employee Full Name', type: 'text' },
      { id: 'employee_address', label: 'Employee Address', type: 'text' },
      { id: 'position', label: 'Position Title', type: 'text' },
      { id: 'department', label: 'Department', type: 'text' },
      { id: 'start_date', label: 'Employment Start Date', type: 'text' },
      { id: 'salary', label: 'Annual Base Salary', type: 'text' },
      { id: 'pay_frequency', label: 'Pay Frequency', type: 'text' },
      { id: 'duties', label: 'Key Duties & Responsibilities', type: 'textarea' },
      { id: 'hours', label: 'Working Hours / Schedule', type: 'text' },
      { id: 'benefits', label: 'Benefits Package', type: 'textarea' },
      { id: 'ip_assignment', label: 'Intellectual Property Assignment', type: 'textarea' },
      { id: 'non_compete', label: 'Non-Compete / Non-Solicitation Terms', type: 'textarea' },
      { id: 'termination', label: 'Termination & Notice Period', type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'effective_date', label: 'Contract Effective Date', type: 'text' }
    ],
    demoData: {
      employer_name: 'Crestwood Digital Solutions, Inc.',
      employer_address: '4400 Westlake Avenue, Seattle, WA 98109',
      employee_name: 'Devon R. Hargrove',
      employee_address: '811 Eastlake Ave E, Seattle, WA 98102',
      position: 'Lead Product Designer',
      department: 'Product & Design',
      start_date: 'February 3, 2026',
      salary: '$148,000 per year',
      pay_frequency: 'Bi-weekly (26 pay periods per year)',
      duties:
        'Lead end-to-end product design for mobile and web platforms; manage a team of 3 junior designers; partner with engineering and product management; own the design system; present design decisions to executive stakeholders.',
      hours: 'Full-time, Monday–Friday, 9 AM – 5 PM PST. Flexible with core hours 10 AM – 3 PM.',
      benefits:
        'Comprehensive medical, dental, and vision (100% premium covered). 401(k) with 5% match. 20 days PTO + 10 federal holidays. 12 weeks parental leave. $3,000 annual professional development budget.',
      ip_assignment:
        'All work product, inventions, designs, and developments created by Employee in the course of employment are the exclusive property of the Employer. Employee hereby assigns all rights, title, and interest in such work product to the Employer.',
      non_compete:
        'For 12 months following termination, Employee shall not solicit Employer clients or employees, nor engage in substantially similar work for a direct competitor within the Pacific Northwest region.',
      termination:
        'Either party may terminate this agreement with 30 days written notice. Employer may terminate immediately for cause. Upon termination, Employee must return all company property within 5 business days.',
      governing_law: 'State of Washington',
      effective_date: 'February 3, 2026'
    }
  },
  {
    id: 'photography-release',
    title: 'Photography Release',
    category: 'Commercial',
    badge: 'Popular',
    icon: Camera,
    description:
      'A model and property release authorizing commercial use of photographs and video for advertising, editorial, and digital media purposes.',
    fields: [
      { id: 'photographer_name', label: 'Photographer / Rights Holder Name', type: 'text' },
      { id: 'photographer_address', label: 'Photographer Address', type: 'text' },
      { id: 'model_name', label: 'Model / Subject Full Name', type: 'text' },
      { id: 'model_address', label: 'Model Address', type: 'text' },
      { id: 'guardian_name', label: 'Parent / Guardian Name (if minor)', type: 'text' },
      { id: 'shoot_date', label: 'Date(s) of Photo Shoot', type: 'text' },
      { id: 'shoot_location', label: 'Location of Shoot', type: 'text' },
      { id: 'description', label: 'Description of Images / Content', type: 'textarea' },
      { id: 'permitted_uses', label: 'Permitted Uses', type: 'textarea' },
      { id: 'territory', label: 'Territory (Geographic Scope)', type: 'text' },
      { id: 'duration', label: 'Duration of License', type: 'text' },
      { id: 'compensation', label: 'Compensation to Model', type: 'text' },
      { id: 'exclusions', label: 'Prohibited Uses / Exclusions', type: 'textarea' },
      { id: 'governing_law', label: 'Governing State', type: 'text' },
      { id: 'execution_date', label: 'Release Execution Date', type: 'text' }
    ],
    demoData: {
      photographer_name: 'Lena Vasari Photography, LLC',
      photographer_address: '2801 N. Milwaukee Avenue, Chicago, IL 60618',
      model_name: 'Tobias Grant Ellison',
      model_address: '433 W Armitage Avenue, Chicago, IL 60614',
      guardian_name: 'N/A — Model is 28 years of age.',
      shoot_date: 'November 8, 2025',
      shoot_location: 'Studio 4, 2801 N. Milwaukee Avenue, Chicago, IL 60618',
      description:
        'Portrait and lifestyle photography session for brand campaign. Approximately 150 digital images and 2 short video clips (under 30 seconds each) depicting subject in casual urban settings.',
      permitted_uses:
        'Commercial advertising (print, digital, out-of-home); social media marketing; website imagery; product packaging; editorial publication; corporate presentations; stock licensing.',
      territory: 'Worldwide, including all digital and online platforms.',
      duration: 'Perpetual, irrevocable license.',
      compensation:
        '$500 flat fee paid upon execution of this release. Model acknowledges receipt of full compensation.',
      exclusions:
        'Images shall not be used in pornographic, defamatory, or political content, or in any manner that would be reasonably considered offensive or harmful to the Model.',
      governing_law: 'State of Illinois',
      execution_date: 'November 8, 2025'
    }
  },
  {
    id: 'bill-of-sale-general',
    title: 'Bill of Sale — General',
    category: 'Commercial',
    badge: 'Popular',
    icon: ShoppingBag,
    description:
      'A general-purpose bill of sale for transferring ownership of goods with full item description, purchase price, warranties, and as-is disclosure.',
    fields: [
      { id: 'seller_name', label: 'Seller Full Name', type: 'text' },
      { id: 'seller_address', label: 'Seller Address', type: 'text' },
      { id: 'buyer_name', label: 'Buyer Full Name', type: 'text' },
      { id: 'buyer_address', label: 'Buyer Address', type: 'text' },
      { id: 'item_description', label: 'Item(s) Description', type: 'textarea' },
      { id: 'quantity', label: 'Quantity / Unit Count', type: 'text' },
      { id: 'serial_numbers', label: 'Serial / Model Numbers (if applicable)', type: 'text' },
      { id: 'condition', label: 'Condition of Item(s)', type: 'text' },
      { id: 'purchase_price', label: 'Purchase Price', type: 'text' },
      { id: 'payment_method', label: 'Payment Method', type: 'text' },
      { id: 'warranties', label: 'Warranties (or As-Is Disclosure)', type: 'textarea' },
      { id: 'delivery', label: 'Delivery / Transfer Terms', type: 'textarea' },
      { id: 'governing_law', label: 'Governing State', type: 'text' },
      { id: 'sale_date', label: 'Date of Sale', type: 'text' }
    ],
    demoData: {
      seller_name: 'Nathaniel J. Forsythe',
      seller_address: '822 Ridgewood Lane, Nashville, TN 37205',
      buyer_name: 'Amelia C. Rhodes',
      buyer_address: '115 5th Avenue South, Nashville, TN 37203',
      item_description:
        'Complete professional video production kit including: (1) Sony FX3 Full-Frame Cinema Camera Body; (1) Sony FE 24–70mm f/2.8 GM II Lens; (1) DJI RS 3 Pro Gimbal; (2) V-Mount Battery Packs; (1) SmallRig Camera Cage; all original accessories and carry cases.',
      quantity: '6 individual items (see description)',
      serial_numbers:
        'FX3 Body: S/N 4421-8832-XX; Lens: S/N 2891-0044-YY; Gimbal: S/N DJI-RS3P-00441',
      condition: 'Excellent — used professionally for 18 months. No damage or functional defects.',
      purchase_price: 'Seven Thousand Five Hundred Dollars ($7,500.00)',
      payment_method: 'Bank wire transfer, confirmed prior to delivery.',
      warranties:
        'Item is sold AS-IS with no express warranty from Seller. Seller warrants that they are the lawful owner with full right to sell, and that the item is free of liens or encumbrances.',
      delivery:
        'Buyer shall take physical possession of all items on the date of this agreement. Risk of loss transfers to Buyer upon physical handover.',
      governing_law: 'State of Tennessee',
      sale_date: 'December 1, 2025'
    }
  },
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney',
    category: 'Estate',
    badge: 'Legal-Grade',
    icon: Crown,
    description:
      'Grant a trusted agent the legal authority to act on your behalf for financial, legal, or medical matters with a durable power of attorney.',
    fields: [
      { id: 'principal_name', label: 'Principal (Grantor) Full Name', type: 'text' },
      { id: 'principal_dob', label: 'Principal Date of Birth', type: 'text' },
      { id: 'principal_address', label: 'Principal Address', type: 'text' },
      { id: 'agent_name', label: 'Agent (Attorney-in-Fact) Full Name', type: 'text' },
      { id: 'agent_address', label: 'Agent Address', type: 'text' },
      { id: 'alternate_agent', label: 'Successor Agent Full Name', type: 'text' },
      { id: 'poa_type', label: 'Type of POA (Durable / Springing / Limited)', type: 'text' },
      { id: 'scope', label: 'Scope of Authority Granted', type: 'textarea' },
      { id: 'financial_powers', label: 'Financial Powers', type: 'textarea' },
      { id: 'real_estate_powers', label: 'Real Estate Powers', type: 'textarea' },
      { id: 'healthcare_powers', label: 'Healthcare Powers (if included)', type: 'textarea' },
      { id: 'limitations', label: 'Limitations on Authority', type: 'textarea' },
      { id: 'effective_date', label: 'Effective Date / Trigger Conditions', type: 'text' },
      { id: 'expiration', label: 'Expiration Date (or "Until Revoked")', type: 'text' },
      { id: 'governing_law', label: 'Governing State', type: 'text' },
      { id: 'execution_date', label: 'Date of Execution', type: 'text' }
    ],
    demoData: {
      principal_name: 'Eleanor Grace Pemberton',
      principal_dob: 'April 3, 1945',
      principal_address: '1 Harborview Court, Newport, RI 02840',
      agent_name: 'Charles Douglas Pemberton',
      agent_address: '78 Bellevue Avenue, Newport, RI 02840',
      alternate_agent: 'Susan M. Aldrich, CPA',
      poa_type: 'Durable General Power of Attorney',
      scope:
        'Agent is granted broad authority to manage all financial, legal, and property matters on behalf of Principal, effective immediately upon execution and remaining in force notwithstanding any subsequent incapacity of Principal.',
      financial_powers:
        'Authority to manage bank accounts; execute investment transactions; file tax returns; pay bills and debts; collect income and benefits; execute contracts; operate business interests.',
      real_estate_powers:
        'Authority to purchase, sell, lease, mortgage, or refinance real property; execute deeds; manage rental properties; resolve property tax assessments.',
      healthcare_powers:
        'Not included in this instrument. A separate Healthcare Power of Attorney has been executed.',
      limitations:
        'Agent may not make gifts from Principal assets exceeding $5,000 per recipient per year without written court approval. Agent may not change beneficiary designations on life insurance or retirement accounts.',
      effective_date: 'Effective immediately upon execution.',
      expiration: 'Until revoked in writing by Principal.',
      governing_law: 'State of Rhode Island',
      execution_date: 'September 30, 2025'
    }
  },
  {
    id: 'service-level-agreement',
    title: 'Service Level Agreement',
    category: 'Corporate',
    badge: 'Legal-Grade',
    icon: BarChart3,
    description:
      'Define measurable service standards between a provider and client including uptime guarantees, response times, penalties, and escalation procedures.',
    fields: [
      { id: 'provider_name', label: 'Service Provider Name', type: 'text' },
      { id: 'provider_address', label: 'Service Provider Address', type: 'text' },
      { id: 'client_name', label: 'Client Name', type: 'text' },
      { id: 'client_address', label: 'Client Address', type: 'text' },
      { id: 'service_description', label: 'Service(s) Covered', type: 'textarea' },
      { id: 'service_hours', label: 'Service Hours / Availability Window', type: 'text' },
      { id: 'uptime_sla', label: 'Uptime / Availability Guarantee', type: 'text' },
      { id: 'response_times', label: 'Incident Response Time Targets', type: 'textarea' },
      { id: 'resolution_times', label: 'Resolution Time Targets by Severity', type: 'textarea' },
      { id: 'penalties', label: 'Service Credit / Penalty Structure', type: 'textarea' },
      { id: 'exclusions', label: 'Exclusions from SLA (Force Majeure, etc.)', type: 'textarea' },
      { id: 'reporting', label: 'Reporting & Measurement Methodology', type: 'textarea' },
      { id: 'escalation', label: 'Escalation Path & Contact Details', type: 'textarea' },
      { id: 'review_period', label: 'SLA Review Period', type: 'text' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'effective_date', label: 'SLA Effective Date', type: 'text' }
    ],
    demoData: {
      provider_name: 'Apex Cloud Infrastructure, Inc.',
      provider_address: '900 Corporate Blvd, Suite 500, Atlanta, GA 30328',
      client_name: 'Greenfield Logistics Group, LLC',
      client_address: '3300 Peachtree Road NE, Atlanta, GA 30326',
      service_description:
        'Managed cloud hosting services including: dedicated virtual servers (4 vCPU / 16 GB RAM), managed PostgreSQL database cluster, CDN services, automated daily backups, DDoS mitigation, and 24/7 infrastructure monitoring.',
      service_hours: '24 hours per day, 7 days per week, 365 days per year.',
      uptime_sla: '99.95% monthly uptime (maximum 21.9 minutes downtime per month).',
      response_times:
        'P1 (Critical — full service outage): 15-minute response. P2 (High — major degradation): 1-hour response. P3 (Medium — partial impact): 4-hour response. P4 (Low — minor issue): 1-business-day response.',
      resolution_times:
        'P1: 4-hour resolution target. P2: 8-hour resolution target. P3: 3-business-day resolution target. P4: 10-business-day resolution target.',
      penalties:
        'Uptime below 99.95%: 5% monthly service credit. Uptime below 99.5%: 10% service credit. Uptime below 99.0%: 25% service credit. Credits capped at 50% of monthly fee.',
      exclusions:
        'SLA excludes downtime caused by: scheduled maintenance (with 48-hour notice); Client-side infrastructure failures; force majeure events; third-party DNS or ISP failures; Client actions or configurations.',
      reporting:
        'Provider shall deliver a monthly SLA report by the 5th of each month, detailing uptime, incidents, and credits owed. Measurement is based on external synthetic monitoring from 3 global checkpoints.',
      escalation:
        'Tier 1: support@apexcloud.io (24/7). Tier 2: oncall@apexcloud.io. Tier 3: VP Engineering — direct line provided in Schedule A.',
      review_period: 'SLA shall be reviewed annually or upon material change in services.',
      governing_law: 'State of Georgia',
      effective_date: 'January 1, 2026'
    }
  },
  {
    id: 'loan-agreement',
    title: 'Loan Agreement',
    category: 'Financial',
    badge: 'Legal-Grade',
    icon: DollarSign,
    description:
      'A formal loan agreement with principal amount, interest rate, repayment schedule, default provisions, and security arrangements between two parties.',
    fields: [
      { id: 'lender_name', label: 'Lender Full Name / Entity', type: 'text' },
      { id: 'lender_address', label: 'Lender Address', type: 'text' },
      { id: 'borrower_name', label: 'Borrower Full Name / Entity', type: 'text' },
      { id: 'borrower_address', label: 'Borrower Address', type: 'text' },
      { id: 'loan_amount', label: 'Loan Principal Amount', type: 'text' },
      { id: 'interest_rate', label: 'Annual Interest Rate', type: 'text' },
      { id: 'interest_type', label: 'Interest Type (Simple / Compound)', type: 'text' },
      { id: 'disbursement_date', label: 'Disbursement Date', type: 'text' },
      { id: 'maturity_date', label: 'Maturity / Final Due Date', type: 'text' },
      { id: 'repayment_schedule', label: 'Repayment Schedule', type: 'textarea' },
      { id: 'prepayment', label: 'Prepayment Terms', type: 'text' },
      { id: 'security', label: 'Security / Collateral', type: 'textarea' },
      { id: 'default_events', label: 'Events of Default', type: 'textarea' },
      { id: 'remedies', label: "Lender's Remedies Upon Default", type: 'textarea' },
      { id: 'governing_law', label: 'Governing Law', type: 'text' },
      { id: 'execution_date', label: 'Date of Execution', type: 'text' }
    ],
    demoData: {
      lender_name: 'Vanguard Capital Partners, LLC',
      lender_address: '1200 K Street NW, Suite 700, Washington, DC 20005',
      borrower_name: 'Horizon Wellness Spa, LLC',
      borrower_address: '4814 Massachusetts Avenue NW, Washington, DC 20016',
      loan_amount: 'Three Hundred Fifty Thousand Dollars ($350,000.00)',
      interest_rate: '8.25% per annum',
      interest_type: 'Simple interest, calculated on outstanding principal balance.',
      disbursement_date: 'January 15, 2026',
      maturity_date: 'January 15, 2031 (5-year term)',
      repayment_schedule:
        'Sixty (60) equal monthly installments of $7,151.93, due on the 15th of each month commencing February 15, 2026. Final balloon payment of any remaining balance due January 15, 2031.',
      prepayment:
        'Borrower may prepay all or any portion of the outstanding principal without penalty after the 12-month anniversary of the disbursement date.',
      security:
        "Loan is secured by a first priority security interest in all of Borrower's business equipment, accounts receivable, and furniture/fixtures as described in the UCC-1 Financing Statement filed contemporaneously herewith.",
      default_events:
        'Events of Default include: (i) failure to make any payment within 10 days of due date; (ii) insolvency or bankruptcy filing; (iii) material misrepresentation in loan application; (iv) dissolution of Borrower entity.',
      remedies:
        'Upon default, Lender may: (i) declare all outstanding principal and accrued interest immediately due; (ii) exercise rights under the security agreement; (iii) pursue all available legal remedies. Lender shall provide 5 days written cure notice for payment defaults.',
      governing_law: 'District of Columbia',
      execution_date: 'January 15, 2026'
    }
  },
  {
    id: 'cease-and-desist',
    title: 'Cease and Desist Letter',
    category: 'Corporate',
    badge: 'New',
    icon: AlertTriangle,
    description:
      'A formal legal demand letter requiring the recipient to immediately stop infringing activity, with legal basis, evidence, and consequences of non-compliance.',
    fields: [
      { id: 'sender_name', label: 'Sender Full Name / Company', type: 'text' },
      { id: 'sender_address', label: 'Sender Address', type: 'text' },
      { id: 'sender_counsel', label: "Sender's Legal Counsel (if any)", type: 'text' },
      { id: 'recipient_name', label: 'Recipient Full Name / Company', type: 'text' },
      { id: 'recipient_address', label: 'Recipient Address', type: 'text' },
      { id: 'violation_type', label: 'Type of Infringing / Harmful Activity', type: 'text' },
      { id: 'violation_description', label: 'Detailed Description of Violation', type: 'textarea' },
      { id: 'legal_basis', label: 'Legal Basis for Demand', type: 'textarea' },
      { id: 'evidence', label: 'Evidence / Documentation of Violation', type: 'textarea' },
      { id: 'demands', label: 'Specific Demands (Actions Required)', type: 'textarea' },
      { id: 'deadline', label: 'Compliance Deadline', type: 'text' },
      { id: 'consequences', label: 'Consequences of Non-Compliance', type: 'textarea' },
      { id: 'reservation_of_rights', label: 'Reservation of Rights', type: 'textarea' },
      { id: 'contact', label: 'Contact for Compliance Confirmation', type: 'text' },
      { id: 'letter_date', label: 'Date of Letter', type: 'text' }
    ],
    demoData: {
      sender_name: 'Meridian Software Corp.',
      sender_address: '500 Technology Square, Cambridge, MA 02139',
      sender_counsel: 'Pierce & Aldridge LLP, 100 High Street, Boston, MA 02110',
      recipient_name: 'Nova Digital Solutions, Inc.',
      recipient_address: '1250 Broadway, Suite 3600, New York, NY 10001',
      violation_type: 'Copyright Infringement / Unauthorized Use of Proprietary Software',
      violation_description:
        'It has come to our attention that Nova Digital Solutions, Inc. has incorporated substantial portions of our proprietary codebase — specifically the "MeridianSync" data synchronization module (registered US Copyright Reg. TXu-003-114-782) — into your commercial product "NovaBridge v2.1" without authorization, license, or compensation.',
      legal_basis:
        'This demand is made pursuant to the United States Copyright Act, 17 U.S.C. § 101 et seq., the Computer Fraud and Abuse Act, and applicable state trade secret laws. Meridian Software Corp. holds registered copyright in the infringed material and has never granted any license to Recipient.',
      evidence:
        'A side-by-side code comparison analysis prepared by our technical experts demonstrates greater than 60% similarity between the MeridianSync module and sections of NovaBridge v2.1. Screen captures, version history data, and the expert report are on file and available upon request.',
      demands:
        '(1) Immediately cease all distribution, sale, and deployment of NovaBridge v2.1 or any version containing the infringing code. (2) Destroy or remove all copies of the infringing material from all systems. (3) Provide written certification of compliance signed by an authorized officer. (4) Account for all revenues derived from products containing the infringement.',
      deadline: 'Ten (10) business days from the date of this letter (by December 19, 2025).',
      consequences:
        "Failure to comply within the stated deadline will result in immediate commencement of civil litigation seeking injunctive relief, statutory damages up to $150,000 per infringed work, actual damages, disgorgement of profits, and attorneys' fees as permitted by law. We will also report the infringement to relevant industry bodies.",
      reservation_of_rights:
        'This letter is not a waiver of any rights or remedies, all of which are expressly reserved. Nothing herein shall be construed as an admission of any fact or limitation of our legal position.',
      contact: 'legal@meridiansoftware.com / (617) 555-0188',
      letter_date: 'December 5, 2025'
    }
  },
  // ── GOVERNMENT & TRAVEL (manifest specialSections) ────────────────────────────
  {
    id: 'passport-attestation',
    title: 'Passport & ID Attestation',
    category: 'Government & Travel',
    badge: 'Government-Grade',
    icon: Fingerprint,
    description:
      'Fingerprint passport or national ID metadata for MotoPass, cross-border programs, and distressed-asset trade — document never leaves the device.',
    fields: [
      { id: 'holder_name', label: 'Full Legal Name', type: 'text' },
      { id: 'holder_dob', label: 'Date of Birth', type: 'text' },
      { id: 'nationality', label: 'Nationality', type: 'text' },
      { id: 'document_type', label: 'Document Type', type: 'text' },
      { id: 'document_number', label: 'Passport / ID Number', type: 'text' },
      { id: 'issuing_authority', label: 'Issuing Authority', type: 'text' },
      { id: 'issue_date', label: 'Issue Date', type: 'text' },
      { id: 'expiry_date', label: 'Expiry Date', type: 'text' },
      { id: 'program_name', label: 'Program / Agency Purpose', type: 'text' },
      { id: 'jurisdiction', label: 'Jurisdiction', type: 'text' },
      { id: 'linked_asset', label: 'Linked Asset or Entitlement', type: 'textarea' },
      { id: 'witness_name', label: 'Witness Name (optional)', type: 'text' },
      { id: 'witness_capacity', label: 'Witness Capacity', type: 'text' },
      { id: 'attestation_date', label: 'Attestation Date', type: 'text' }
    ],
    demoData: {
      holder_name: 'Amina Elise Okonkwo',
      holder_dob: '12 April 1990',
      nationality: 'Nigerian',
      document_type: 'Passport',
      document_number: 'A01234567 (demo — do not use real IDs)',
      issuing_authority: 'Nigeria Immigration Service',
      issue_date: '15 March 2022',
      expiry_date: '14 March 2032',
      program_name: 'MotoPass cross-border mobility attestation',
      jurisdiction: 'Federal Republic of Nigeria / receiving state TBD',
      linked_asset: 'Distressed-asset listing ref. MP-DA-4421 (metadata hash only).',
      witness_name: 'Optional — leave blank for self-attestation',
      witness_capacity: 'N/A',
      attestation_date: '18 July 2026'
    }
  },
  {
    id: 'national-id-attestation',
    title: 'National ID Attestation',
    category: 'Government & Travel',
    badge: 'Government-Grade',
    icon: Shield,
    description:
      'Hash national ID metadata for border programs without uploading biometrics or full identity documents.',
    fields: [
      { id: 'holder_name', label: 'Full Legal Name', type: 'text' },
      { id: 'holder_dob', label: 'Date of Birth', type: 'text' },
      { id: 'nationality', label: 'Nationality / Citizenship', type: 'text' },
      { id: 'id_type', label: 'ID Document Type', type: 'text' },
      { id: 'id_number', label: 'National ID Number', type: 'text' },
      { id: 'issuing_authority', label: 'Issuing Authority', type: 'text' },
      { id: 'issue_date', label: 'Issue Date', type: 'text' },
      { id: 'expiry_date', label: 'Expiry Date (if any)', type: 'text' },
      { id: 'program_name', label: 'Program / Agency', type: 'text' },
      { id: 'purpose', label: 'Purpose of Attestation', type: 'textarea' },
      { id: 'attestation_date', label: 'Attestation Date', type: 'text' }
    ],
    demoData: {
      holder_name: 'Carlos Miguel Rivera',
      holder_dob: '3 September 1985',
      nationality: 'Mexican',
      id_type: 'INE / National Voter ID (demo)',
      id_number: 'DEMO-INE-884421 (not a real ID)',
      issuing_authority: 'Instituto Nacional Electoral',
      issue_date: '10 January 2021',
      expiry_date: '10 January 2031',
      program_name: 'Border mobility / eligibility check',
      purpose:
        'Prove existence of ID metadata at attestation time without uploading biometrics or full document scans.',
      attestation_date: '18 July 2026'
    }
  },
  {
    id: 'diplomatic-note',
    title: 'Diplomatic Note',
    category: 'Government & Travel',
    badge: 'Government-Grade',
    icon: Globe,
    description:
      'Timestamp diplomatic correspondence and official notes with independent Bitcoin-anchored proof.',
    fields: [
      { id: 'note_reference', label: 'Note / Reference Number', type: 'text' },
      { id: 'sending_mission', label: 'Sending Mission / Ministry', type: 'text' },
      { id: 'receiving_mission', label: 'Receiving Mission / Ministry', type: 'text' },
      { id: 'note_type', label: 'Note Type', type: 'text' },
      { id: 'subject', label: 'Subject Line', type: 'text' },
      { id: 'summary', label: 'Summary of Contents', type: 'textarea' },
      { id: 'classification', label: 'Classification / Handling', type: 'text' },
      { id: 'signatory', label: 'Signatory Name & Title', type: 'text' },
      { id: 'place', label: 'Place of Issuance', type: 'text' },
      { id: 'note_date', label: 'Date of Note', type: 'text' }
    ],
    demoData: {
      note_reference: 'NV-2026-0142 (demo)',
      sending_mission: 'Embassy of the Republic of Exemplia',
      receiving_mission: 'Ministry of Foreign Affairs, Host State',
      note_type: 'Note Verbale',
      subject: 'Request for courtesy facilitation — cultural exchange delegation',
      summary:
        'The Embassy presents its compliments and requests facilitation for a six-person cultural delegation arriving 1–8 August 2026. No classified annexes. Demo text only.',
      classification: 'Unclassified / For official use',
      signatory: 'H.E. Liora V. Santos, Ambassador',
      place: 'Capital City',
      note_date: '18 July 2026'
    }
  },
  {
    id: 'beneficial-ownership',
    title: 'Beneficial Ownership Declaration',
    category: 'Government & Travel',
    badge: 'Compliance',
    icon: Scale,
    description:
      'Anchor ultimate beneficial owner (UBO) declarations for AML and cross-border asset programs.',
    fields: [
      { id: 'entity_name', label: 'Legal Entity Name', type: 'text' },
      { id: 'entity_type', label: 'Entity Type', type: 'text' },
      { id: 'registration_number', label: 'Registration / Company Number', type: 'text' },
      { id: 'jurisdiction', label: 'Jurisdiction of Incorporation', type: 'text' },
      { id: 'registered_address', label: 'Registered Address', type: 'text' },
      { id: 'ubo_name', label: 'Ultimate Beneficial Owner Name', type: 'text' },
      { id: 'ubo_nationality', label: 'UBO Nationality', type: 'text' },
      { id: 'ownership_pct', label: 'Ownership Percentage', type: 'text' },
      { id: 'control_description', label: 'Nature of Control', type: 'textarea' },
      { id: 'pep_status', label: 'PEP Status', type: 'text' },
      { id: 'declaring_officer', label: 'Declaring Officer Name & Title', type: 'text' },
      { id: 'declaration_date', label: 'Declaration Date', type: 'text' }
    ],
    demoData: {
      entity_name: 'Harborline Holdings Ltd. (demo)',
      entity_type: 'Private limited company',
      registration_number: 'HC-442198 (demo)',
      jurisdiction: 'Republic of Exemplia',
      registered_address: '14 Commerce Quay, Capital City',
      ubo_name: 'Nadia R. Ellison',
      ubo_nationality: 'Canadian',
      ownership_pct: '62% voting shares',
      control_description:
        'Direct ownership of ordinary shares conferring majority voting rights. No nominee arrangements in this demo record.',
      pep_status: 'Not a politically exposed person (self-declared demo)',
      declaring_officer: 'James K. Okoye, Company Secretary',
      declaration_date: '18 July 2026'
    }
  },
  {
    id: 'apostille-companion',
    title: 'Apostille Companion Hash',
    category: 'Government & Travel',
    badge: 'Legal-Grade',
    icon: FileCheck,
    description:
      'Pair Hague apostille workflows with an independent SHA-256 fingerprint of the underlying public document.',
    fields: [
      { id: 'document_title', label: 'Underlying Document Title', type: 'text' },
      { id: 'document_type', label: 'Document Type', type: 'text' },
      { id: 'issuing_authority', label: 'Issuing Authority of Document', type: 'text' },
      { id: 'document_date', label: 'Document Date', type: 'text' },
      { id: 'apostille_country', label: 'Apostille Country (Hague)', type: 'text' },
      { id: 'apostille_number', label: 'Apostille Number (if issued)', type: 'text' },
      { id: 'competent_authority', label: 'Competent Authority', type: 'text' },
      { id: 'hash_purpose', label: 'Purpose of Companion Hash', type: 'textarea' },
      { id: 'requestor_name', label: 'Requestor Name', type: 'text' },
      { id: 'companion_date', label: 'Companion Record Date', type: 'text' }
    ],
    demoData: {
      document_title: 'Certificate of Good Standing — Harborline Holdings Ltd. (demo)',
      document_type: 'Corporate public document',
      issuing_authority: 'Companies Registry, Republic of Exemplia',
      document_date: '1 June 2026',
      apostille_country: 'Republic of Exemplia (Hague Convention party — demo)',
      apostille_number: 'AP-2026-8891 (if already issued; else pending)',
      competent_authority: 'Ministry of Foreign Affairs — Apostille Unit',
      hash_purpose:
        'Independent SHA-256 fingerprint of the public document bytes prior to or alongside apostille, for cross-border verification without relying solely on paper seals.',
      requestor_name: 'Counsel for Harborline Holdings Ltd.',
      companion_date: '18 July 2026'
    }
  }
]

// ─── CATEGORY CONFIG ────────────────────────────────────────────────────────────

const CATEGORIES = [
  'All',
  'Family Law',
  'Property',
  'Medical',
  'Corporate',
  'Financial',
  'Estate',
  'HR',
  'Commercial',
  'Government & Travel'
]

const CATEGORY_COLORS = {
  'Family Law': { bg: 'rgba(244,114,182,0.15)', text: '#f472b6', border: 'rgba(244,114,182,0.3)' },
  Property: { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
  Medical: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.3)' },
  Corporate: { bg: 'rgba(129,140,248,0.12)', text: '#818cf8', border: 'rgba(129,140,248,0.3)' },
  Financial: { bg: 'rgba(240,180,41,0.12)', text: '#F0B429', border: 'rgba(240,180,41,0.3)' },
  Estate: { bg: 'rgba(251,146,60,0.12)', text: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  HR: { bg: 'rgba(163,230,53,0.12)', text: '#a3e635', border: 'rgba(163,230,53,0.3)' },
  Commercial: { bg: 'rgba(232,121,249,0.12)', text: '#e879f9', border: 'rgba(232,121,249,0.3)' },
  'Government & Travel': {
    bg: 'rgba(56,189,248,0.12)',
    text: '#38bdf8',
    border: 'rgba(56,189,248,0.3)'
  }
}

const BADGE_STYLES = {
  Popular: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  'Legal-Grade': 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
  New: 'bg-sky-400/20 text-sky-300 border border-sky-400/30',
  'Government-Grade': 'bg-sky-400/20 text-sky-300 border border-sky-400/30',
  Compliance: 'bg-violet-400/20 text-violet-300 border border-violet-400/30'
}

// ─── PDF GENERATION ─────────────────────────────────────────────────────────────

const BITCOIN_ORANGE = '#F7931A'
const LOGO_ORANGE_OPACITY = 0.62
const ORANGE_LOGO_STYLE = {
  opacity: LOGO_ORANGE_OPACITY,
  filter: 'sepia(1) saturate(5) hue-rotate(5deg) brightness(1.05)'
}

const generatePDF = async (template, data) => {
  const verifyUrl = getVerifyUrl()
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210,
    pageH = 297,
    margin = 20,
    contentW = pageW - margin * 2

  // ── Helper: load image as base64 (optional bitcoin-orange tint) ───────────
  const loadImg = (src, { tint, tintOpacity = LOGO_ORANGE_OPACITY } = {}) =>
    new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        if (tint) {
          ctx.globalAlpha = tintOpacity
          ctx.fillStyle = tint
          ctx.globalCompositeOperation = 'source-atop'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = 'source-over'
        }
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          w: img.naturalWidth,
          h: img.naturalHeight
        })
      }
      img.onerror = () => resolve(null)
      img.src = src
    })

  // ── Pre-load logo & QR ────────────────────────────────────────────────────
  const [satohashImg, qrDataUrl] = await Promise.all([
    loadImg('/logo.png', { tint: BITCOIN_ORANGE }),
    QRCode.toDataURL(verifyUrl, { width: 200, margin: 1, errorCorrectionLevel: 'M' })
  ])

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — Document content
  // ═══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(253, 251, 247)
  doc.rect(0, 0, pageW, pageH, 'F')

  // Gold-teal top bar
  doc.setFillColor(240, 180, 41)
  doc.rect(0, 0, pageW / 2, 4, 'F')
  doc.setFillColor(13, 148, 136)
  doc.rect(pageW / 2, 0, pageW / 2, 4, 'F')

  // ── Logo — top left only (faded bitcoin orange) ───────────────────────────
  const logoH = 10
  if (satohashImg) {
    const aspect = satohashImg.w / satohashImg.h
    const logoW = logoH * aspect
    doc.addImage(satohashImg.dataUrl, 'PNG', margin, 10, logoW, logoH)
  } else {
    doc.setFontSize(8)
    doc.setTextColor(247, 147, 26)
    doc.setFont('helvetica', 'bold')
    doc.text('SATOHASH', margin, 16)
  }

  // ── Document title ─────────────────────────────────────────────────────────
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(template.title.toUpperCase(), margin, 32)
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${template.category} • Bitcoin-Anchored • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    margin,
    38
  )
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.5)
  doc.line(margin, 42, pageW - margin, 42)

  // ── Fields ─────────────────────────────────────────────────────────────────
  let y = 52
  template.fields.forEach((field) => {
    if (y > 262) {
      doc.addPage()
      doc.setFillColor(253, 251, 247)
      doc.rect(0, 0, pageW, pageH, 'F')
      y = 20
    }
    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'bold')
    doc.text(field.label.toUpperCase(), margin, y)
    y += 5
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(data[field.id] || '—', contentW)
    doc.text(lines, margin, y)
    y += lines.length * 5 + 8
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.2)
    doc.line(margin, y - 4, pageW - margin, y - 4)
  })

  // ── Page 1 footer ──────────────────────────────────────────────────────────
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.text('Generated via Satohash — Sovereign Notary Protocol', margin, pageH - 10)
  doc.text(`Verify: ${verifyUrl}`, pageW - margin, pageH - 10, { align: 'right' })

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — Certificate of Authenticity
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage()
  doc.setFillColor(253, 251, 247)
  doc.rect(0, 0, pageW, pageH, 'F')

  // ── Blue header bar ────────────────────────────────────────────────────────
  const headerH = 28
  doc.setFillColor(30, 58, 138) // deep blue
  doc.rect(0, 0, pageW, headerH, 'F')

  // Header text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICATE OF AUTHENTICITY', margin, 11)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('SATOHASH NOTARY PROTOCOL', margin, 17)
  doc.setFontSize(6)
  doc.setTextColor(147, 197, 253) // light blue
  doc.text('Bitcoin-Anchored • Cryptographically Verified • Tamper-Evident', margin, 23)

  // ── Certificate body ───────────────────────────────────────────────────────
  let cy = headerH + 14

  // "This certifies that…" intro
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  const introParagraph =
    `This Certificate of Authenticity confirms that the document titled "${template.title}" has been ` +
    `processed through the Satohash Sovereign Notary Protocol. The cryptographic hash of this document ` +
    `has been immutably anchored to the Bitcoin blockchain, providing irrefutable proof of existence ` +
    `and integrity at the time of notarization.`
  const introLines = doc.splitTextToSize(introParagraph, contentW)
  doc.text(introLines, margin, cy)
  cy += introLines.length * 5 + 8

  // Gold divider
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.6)
  doc.line(margin, cy, pageW - margin, cy)
  cy += 10

  // ── Metadata rows ──────────────────────────────────────────────────────────
  const metaItems = [
    { label: 'DOCUMENT TITLE', value: template.title },
    { label: 'TEMPLATE CATEGORY', value: template.category },
    { label: 'BADGE / TIER', value: template.badge },
    {
      label: 'DATE OF NOTARIZATION',
      value: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    { label: 'TOTAL FIELDS', value: `${template.fields.length} fields` },
    { label: 'DOCUMENT HASH (SHA-256)', value: '[Computed client-side — hash pending anchor]' },
    { label: 'BITCOIN BLOCK HEIGHT', value: '[Pending — OTS upgrade in progress]' },
    { label: 'NOTARY PROTOCOL', value: 'Satohash v1 — OpenTimestamps (OTS) / Bitcoin' },
    { label: 'VERIFY URL', value: verifyUrl }
  ]

  const colW = contentW / 2 - 4
  metaItems.forEach((item, idx) => {
    const col = idx % 2
    const cx = margin + col * (colW + 8)
    if (col === 0 && idx > 0) cy += 0
    if (col === 0) {
      // New row
      doc.setFillColor(248, 250, 252)
      doc.rect(margin, cy - 4, contentW, 14, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.15)
      doc.rect(margin, cy - 4, contentW, 14, 'S')
    }
    doc.setFontSize(6.5)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'bold')
    doc.text(item.label, cx + 2, cy + 1)
    doc.setFontSize(8.5)
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'normal')
    const valLines = doc.splitTextToSize(item.value, colW - 4)
    doc.text(valLines[0], cx + 2, cy + 7)
    if (col === 1 || idx === metaItems.length - 1) cy += 14
  })

  cy += 6

  // ── QR Code + Seal row ─────────────────────────────────────────────────────
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)

  // QR Code box (left side)
  const qrBoxSize = 48
  const qrX = margin
  doc.setFillColor(255, 255, 255)
  doc.rect(qrX, cy, qrBoxSize, qrBoxSize + 10, 'F')
  doc.rect(qrX, cy, qrBoxSize, qrBoxSize + 10, 'S')
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', qrX + 4, cy + 4, qrBoxSize - 8, qrBoxSize - 8)
    doc.link(qrX, cy, qrBoxSize, qrBoxSize, { url: verifyUrl })
  }
  doc.setFontSize(6)
  doc.setTextColor(30, 58, 138)
  doc.setFont('helvetica', 'bold')
  doc.text('SCAN TO VERIFY', qrX + qrBoxSize / 2, cy + qrBoxSize + 6, { align: 'center' })

  // Official Seal box (right side)
  const sealX = pageW - margin - 64
  doc.setFillColor(255, 255, 255)
  doc.rect(sealX, cy, 64, qrBoxSize + 10, 'F')
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.5)
  doc.rect(sealX, cy, 64, qrBoxSize + 10, 'S')
  // Inner seal decoration
  doc.setDrawColor(240, 180, 41)
  doc.setLineWidth(0.25)
  doc.rect(sealX + 3, cy + 3, 58, qrBoxSize + 4, 'S')
  doc.setFontSize(7)
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.text('OFFICIAL SEAL', sealX + 32, cy + 13, { align: 'center' })
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('SATOHASH', sealX + 32, cy + 20, { align: 'center' })
  doc.text('SOVEREIGN NOTARY', sealX + 32, cy + 26, { align: 'center' })
  doc.text('PROTOCOL', sealX + 32, cy + 32, { align: 'center' })
  // Satohash logo in seal
  if (satohashImg) {
    const sLogoH = 8
    const sAspect = satohashImg.w / satohashImg.h
    const sLogoW = sLogoH * sAspect
    doc.addImage(satohashImg.dataUrl, 'PNG', sealX + 32 - sLogoW / 2, cy + 36, sLogoW, sLogoH)
  }
  doc.setFontSize(6)
  doc.setTextColor(148, 163, 184)
  doc.text(new Date().getFullYear().toString(), sealX + 32, cy + 52, { align: 'center' })

  cy += qrBoxSize + 16

  // ── Legal disclaimer ───────────────────────────────────────────────────────
  doc.setFillColor(239, 246, 255)
  doc.rect(margin, cy, contentW, 22, 'F')
  doc.setDrawColor(147, 197, 253)
  doc.setLineWidth(0.2)
  doc.rect(margin, cy, contentW, 22, 'S')
  doc.setFontSize(6.5)
  doc.setTextColor(30, 58, 138)
  doc.setFont('helvetica', 'bold')
  doc.text('LEGAL NOTICE', margin + 3, cy + 6)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 64, 175)
  const disclaimer =
    'This certificate is generated by the Satohash Sovereign Notary Protocol. The Bitcoin-anchored ' +
    'timestamp provides cryptographic proof of document existence at the time of notarization. ' +
    'This certificate does not constitute legal advice. Consult qualified legal counsel for binding agreements.'
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentW - 6)
  doc.text(disclaimerLines, margin + 3, cy + 12)
  cy += 26

  // ── Page 2 footer ──────────────────────────────────────────────────────────
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.text('Satohash — Sovereign Notary Protocol', margin, pageH - 10)
  doc.text(`Verify this document at: ${verifyUrl}`, pageW - margin, pageH - 10, { align: 'right' })
  // Gold footer bar
  doc.setFillColor(240, 180, 41)
  doc.rect(0, pageH - 4, pageW / 2, 4, 'F')
  doc.setFillColor(13, 148, 136)
  doc.rect(pageW / 2, pageH - 4, pageW / 2, 4, 'F')

  doc.save(`Satohash_${template.id}_${Date.now()}.pdf`)
}

// ─── PREVIEW MODAL ───────────────────────────────────────────────────────────────

function PreviewModal({ template, data, onClose, onDownloadPDF, onEmail }) {
  const catColor = CATEGORY_COLORS[template.category] || {}

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        {/* Modal panel */}
        <motion.div
          key="preview-panel"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
          style={{ background: '#fdfbf7' }}
        >
          {/* Gold-teal accent bar */}
          <div
            style={{ height: 4, background: 'linear-gradient(90deg, #F0B429 0%, #0d9488 100%)' }}
          />

          {/* Modal toolbar */}
          <div
            className="flex items-center justify-between gap-3 px-6 py-4"
            style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}
          >
            <div className="flex items-center gap-2">
              <Eye size={15} style={{ color: '#64748b' }} />
              <span className="text-sm font-bold" style={{ color: '#0f172a' }}>
                Document Preview
              </span>
              <span
                className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  background: catColor.bg,
                  color: catColor.text,
                  border: `1px solid ${catColor.border}`
                }}
              >
                {template.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEmail}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-purple)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Mail size={13} style={{ color: 'var(--accent-purple)' }} />
                Email Package
              </button>
              <button
                onClick={onDownloadPDF}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #F0B429 0%, #d97706 100%)',
                  color: '#0f172a'
                }}
              >
                <Download size={13} />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9'
                  e.currentTarget.style.color = '#0f172a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#64748b'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Document body — read-only */}
          <div className="p-6 md:p-12">
            {/* Header: Satohash logo only */}
            <div className="mb-8 flex items-start gap-5">
              <div className="flex shrink-0 flex-col items-start">
                <img
                  src="/logo.png"
                  alt="Satohash"
                  className="h-8 w-auto"
                  style={ORANGE_LOGO_STYLE}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  className="text-2xl font-black tracking-tight md:text-3xl"
                  style={{ color: '#0f172a' }}
                >
                  {template.title.toUpperCase()}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold tracking-widest uppercase"
                    style={{
                      background: catColor.bg,
                      color: catColor.text,
                      border: `1px solid ${catColor.border}`
                    }}
                  >
                    {template.category}
                  </span>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Gold divider */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(90deg, #F0B429 0%, transparent 100%)',
                marginBottom: '2.5rem'
              }}
            />

            {/* Read-only fields */}
            <div className="flex flex-col gap-6">
              {template.fields.map((field) => (
                <div key={field.id}>
                  <p
                    className="mb-1 text-[10px] font-black tracking-[0.18em] uppercase"
                    style={{ color: '#64748b' }}
                  >
                    {field.label}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: data[field.id]?.trim() ? '#0f172a' : '#94a3b8',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: '0.5rem',
                      fontStyle: data[field.id]?.trim() ? 'normal' : 'italic'
                    }}
                  >
                    {data[field.id]?.trim() || '— not filled —'}
                  </p>
                </div>
              ))}
            </div>

            {/* Document footer */}
            <div
              className="mt-14 flex items-center justify-between gap-4 pt-6"
              style={{ borderTop: '1px solid #e2e8f0' }}
            >
              <div>
                <p
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: '#94a3b8' }}
                >
                  Generated via
                </p>
                <p className="text-sm font-black" style={{ color: '#0f172a' }}>
                  Satohash — Sovereign Notary Protocol
                </p>
                <p className="text-[10px]" style={{ color: '#94a3b8' }}>
                  {window.location.hostname}
                </p>
              </div>
              <div
                className="flex h-8 items-center justify-center rounded-lg px-3"
                style={{ background: '#f1f5f9' }}
              >
                <span className="text-[9px] font-bold" style={{ color: '#94a3b8' }}>
                  READ-ONLY PREVIEW
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
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
      className="surface-card group flex cursor-pointer flex-col overflow-hidden rounded-2xl border"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      onClick={() => onOpen(template)}
    >
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: catColor.bg, border: `1px solid ${catColor.border}` }}
          >
            <Icon size={18} style={{ color: catColor.text }} />
          </div>
          <span className="inline-flex items-center">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${BADGE_STYLES[template.badge]}`}
            >
              {template.badge}
            </span>
            {template.badge === 'Legal-Grade' && (
              <Tooltip
                title="Multi-Party"
                content="Contracts that require signatures from two or more independent parties before being considered valid and anchored to Bitcoin."
              />
            )}
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
        <h3 className="text-base leading-snug font-bold" style={{ color: 'var(--text-primary)' }}>
          {template.title}
        </h3>

        {/* Description */}
        <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {template.description}
        </p>
      </div>

      {/* CTA */}
      <div
        className="flex items-center justify-between border-t px-5 py-3 md:px-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
      >
        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          {template.fields.length} fields
        </span>
        <span
          className="flex items-center gap-1 text-sm font-bold transition-all group-hover:gap-2"
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
  const [searchParams] = useSearchParams()

  useEffect(() => {
    document.title = 'Notary Templates — Satohash'
  }, [])

  // Auto-select template from ?t= or ?type= URL param
  useEffect(() => {
    const tid = searchParams.get('t') || searchParams.get('type')
    if (tid) {
      const match = TEMPLATES.find((t) => t.id === tid)
      if (match) onSelect(match)
    }
  }, [searchParams, onSelect])

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesCat = category === 'All' || t.category === category
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [search, category])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={14} style={{ color: 'var(--accent-gold)' }} />
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              Sovereign Notary
            </span>
          </div>
          <h1
            className="mb-3 flex items-center text-3xl font-black md:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Notary Templates
            <Tooltip
              title="Notary Template"
              content="A pre-built legal document structure. Fill in the variables and the system generates a Bitcoin-anchored, multi-party signable agreement."
            />
          </h1>
          <p className="max-w-xl text-base" style={{ color: 'var(--text-muted)' }}>
            Professional legal documents anchored to the Bitcoin blockchain. Fill, sign, and
            immortalise your agreements.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search
              size={15}
              className="absolute top-1/2 left-3.5 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates…"
              className="w-full rounded-xl py-2.5 pr-4 pl-10 text-sm outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Category pills */}
          <div
            className="scrollbar-none flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150"
                  style={{
                    background: active ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                    color: active ? '#0f172a' : 'var(--text-secondary)',
                    border: active ? '1px solid var(--accent-gold)' : '1px solid var(--border)'
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
          <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>No templates match your search.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
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

const MAX_HISTORY_SNAPSHOTS = 5

export function TemplateEditor({ template, onBack, demoMode = false }) {
  const documentRef = useRef(null)
  const [data, setData] = useState(() => ({ ...template.demoData }))
  const [qrUrl, setQrUrl] = useState('')
  const [darkDoc, setDarkDoc] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!demoMode) return
    setData({ ...template.demoData })
    const timer = setTimeout(() => {
      documentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(timer)
  }, [template.id, demoMode, template.demoData])

  // ── Version History ────────────────────────────────────────────────────────
  const historyKey = demoMode
    ? `satohash_template_demo_${template.id}`
    : `satohash_template_history_${template.id}`
  const [snapshots, setSnapshots] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(historyKey) || '[]')
    } catch {
      return []
    }
  })
  const [historyOpen, setHistoryOpen] = useState(false)
  const debounceRef = useRef(null)

  // Debounce-save a snapshot whenever data changes
  const saveSnapshot = useCallback(
    (currentData) => {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setSnapshots((prev) => {
          const snap = { timestamp: Date.now(), data: { ...currentData } }
          const next = [snap, ...prev].slice(0, MAX_HISTORY_SNAPSHOTS)
          try {
            localStorage.setItem(historyKey, JSON.stringify(next))
          } catch {
            // storage quota — ignore
          }
          return next
        })
      }, 2000)
    },
    [historyKey]
  )

  // Trigger save on every data change (skip persisting demo sessions)
  useEffect(() => {
    if (demoMode) return undefined
    saveSnapshot(data)
    return () => clearTimeout(debounceRef.current)
  }, [data, saveSnapshot, demoMode])

  const restoreSnapshot = useCallback((snap) => {
    setData({ ...snap.data })
    toast.success('Restored snapshot from ' + new Date(snap.timestamp).toLocaleTimeString())
  }, [])

  // Dynamic SEO meta tags
  useEffect(() => {
    document.title = `${template.title} — Satohash Notary Templates`

    const setMeta = (selector, attrName, attrValue, content) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', 'name', 'description', template.description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', template.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', template.description)

    return () => {
      document.title = 'Satohash — Sovereign Notary Protocol'
      setMeta(
        'meta[name="description"]',
        'name',
        'description',
        'Satohash anchors any document to the Bitcoin blockchain in under 60 seconds. Immutable, independently verifiable proof of existence — free, private, no lawyers needed. Your file never leaves your device.'
      )
      setMeta(
        'meta[property="og:title"]',
        'property',
        'og:title',
        'Satohash — Stamp Any Document on Bitcoin. Forever.'
      )
      setMeta(
        'meta[property="og:description"]',
        'property',
        'og:description',
        'Drop a file. Get permanent, tamper-proof Bitcoin proof of existence in 60 seconds. Free. Private. No lawyers. Your document never leaves your device.'
      )
    }
  }, [template])

  useEffect(() => {
    const verifyUrl = getVerifyUrl()
    QRCode.toDataURL(verifyUrl, { width: 120, margin: 1, errorCorrectionLevel: 'M' })
      .then(setQrUrl)
      .catch(() => toast.error('Could not generate verification QR code.'))
  }, [])

  const completedFields = template.fields.filter((f) => data[f.id]?.trim?.())
  const progress = Math.round((completedFields.length / template.fields.length) * 100)

  const handleAnchor = () => {
    toast.success('⚡ Document anchored to Bitcoin!', {
      description: `Tx hash pending confirmation on the Satohash protocol.`
    })
  }

  const handleVault = () => {
    toast.success('🔒 Saved to your Vault', {
      description: `${template.title} is securely stored.`
    })
  }

  const handlePDF = async () => {
    try {
      await generatePDF(template, data)
      toast.success('📄 PDF downloaded!')
    } catch {
      toast.error('PDF generation failed. Please try again.')
    }
  }

  const handleEmail = () => {
    const subject = `Notarized Document: ${template.title}`
    const fieldLines = template.fields.map((f) => `${f.label}: ${data[f.id] || '—'}`).join('\n')
    const body =
      `${template.title}\n` +
      `Category: ${template.category}\n` +
      `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n` +
      `--- DOCUMENT FIELDS ---\n\n` +
      `${fieldLines}\n\n` +
      `--- VERIFICATION ---\n\n` +
      `This document has been notarized via the Satohash Sovereign Notary Protocol.\n` +
      `Verify at: ${getVerifyUrl()}\n`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleShareLink = async () => {
    const url = `${window.location.origin}/templates?t=${template.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Share link copied!', {
        description: 'Recipients can open this template directly.'
      })
    } catch {
      toast.error('Could not copy to clipboard.')
    }
  }

  const catColor = CATEGORY_COLORS[template.category] || {}

  const resetDemoData = () => {
    setData({ ...template.demoData })
    toast.success('Demo data restored')
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {showPreview && (
        <PreviewModal
          template={template}
          data={data}
          onClose={() => setShowPreview(false)}
          onDownloadPDF={handlePDF}
          onEmail={handleEmail}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {demoMode && (
          <div
            className="mb-6 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-gold) 35%, transparent)',
              background: 'color-mix(in srgb, var(--accent-gold) 8%, transparent)'
            }}
          >
            <div>
              <p
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color: 'var(--accent-gold)' }}
              >
                Demo Preview
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Pre-filled with sample data. Edit fields, export PDF, or sign in to anchor to
                Bitcoin.
              </p>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-[10px] font-bold tracking-wider uppercase transition-all hover:opacity-90"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-gold) 40%, transparent)',
                color: 'var(--accent-gold)'
              }}
            >
              <RotateCcw size={12} />
              Reset Demo Data
            </button>
          </div>
        )}

        {/* Back */}
        <button
          onClick={onBack}
          className="mb-8 -ml-3 flex min-h-[44px] items-center gap-2 rounded-xl px-3 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-semibold">
            {demoMode ? 'Back to Template Library' : 'Back to Templates'}
          </span>
        </button>

        <div
          className={`flex gap-6 lg:flex-row lg:items-start lg:gap-8 ${
            demoMode ? 'flex-col' : 'flex-col-reverse'
          }`}
        >
          {/* ── Document panel ── */}
          <motion.div
            ref={documentRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full flex-1 overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: darkDoc ? '#0f172a' : '#fdfbf7',
              transition: 'background 0.25s ease, color 0.25s ease'
            }}
          >
            {/* Gold-teal accent bar */}
            <div
              style={{ height: 4, background: 'linear-gradient(90deg, #F0B429 0%, #0d9488 100%)' }}
            />

            <div className="p-4 md:p-8 lg:p-12">
              {/* Header: Satohash logo (faded bitcoin orange) + title */}
              <div className="mb-8 flex items-start gap-5">
                <div className="flex shrink-0 flex-col items-start">
                  <img
                    src="/logo.png"
                    alt="Satohash"
                    className="h-8 w-auto"
                    style={ORANGE_LOGO_STYLE}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h1
                    className="text-2xl font-black tracking-tight md:text-3xl"
                    style={{ color: darkDoc ? '#f8fafc' : '#0f172a' }}
                  >
                    {template.title.toUpperCase()}
                  </h1>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-bold tracking-widest uppercase"
                      style={{
                        background: catColor.bg,
                        color: catColor.text,
                        border: `1px solid ${catColor.border}`
                      }}
                    >
                      {template.category}
                    </span>
                    <span className="text-xs" style={{ color: '#94a3b8' }}>
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, #F0B429 0%, transparent 100%)',
                  marginBottom: '2.5rem'
                }}
              />

              {/* Fields */}
              <div className="flex flex-col gap-6">
                {template.fields.map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="mb-1.5 block text-[10px] font-black tracking-[0.18em] uppercase"
                      style={{ color: darkDoc ? '#94a3b8' : '#64748b' }}
                    >
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        value={data[field.id] || ''}
                        onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value }))}
                        rows={3}
                        className="w-full resize-y bg-transparent px-0 py-1 text-sm leading-relaxed transition-colors outline-none"
                        style={{
                          color: darkDoc ? '#f8fafc' : '#0f172a',
                          borderBottom: `1.5px solid ${darkDoc ? '#334155' : '#e2e8f0'}`,
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          borderRadius: 0
                        }}
                        onFocus={(e) => (e.target.style.borderBottomColor = '#eab308')}
                        onBlur={(e) =>
                          (e.target.style.borderBottomColor = darkDoc ? '#334155' : '#e2e8f0')
                        }
                      />
                    ) : (
                      <input
                        id={field.id}
                        type="text"
                        value={data[field.id] || ''}
                        onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value }))}
                        className="w-full bg-transparent px-0 py-1 text-sm transition-colors outline-none"
                        style={{
                          color: darkDoc ? '#f8fafc' : '#0f172a',
                          borderBottom: `1.5px solid ${darkDoc ? '#334155' : '#e2e8f0'}`,
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          borderRadius: 0
                        }}
                        onFocus={(e) => (e.target.style.borderBottomColor = '#eab308')}
                        onBlur={(e) =>
                          (e.target.style.borderBottomColor = darkDoc ? '#334155' : '#e2e8f0')
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Document footer */}
              <div
                className="mt-14 flex items-end justify-between gap-4 pt-6"
                style={{ borderTop: `1px solid ${darkDoc ? '#1e293b' : '#e2e8f0'}` }}
              >
                <div>
                  <p
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: '#94a3b8' }}
                  >
                    Generated via
                  </p>
                  <p
                    className="text-sm font-black"
                    style={{ color: darkDoc ? '#f8fafc' : '#0f172a' }}
                  >
                    Satohash — Sovereign Notary Protocol
                  </p>
                  <p className="text-[10px]" style={{ color: '#94a3b8' }}>
                    {window.location.hostname}
                  </p>
                </div>

                {/* Centre: hash pending badge */}
                <div className="flex flex-col items-center gap-1">
                  <p
                    className="flex items-center text-[10px] tracking-widest uppercase"
                    style={{ color: '#94a3b8' }}
                  >
                    Bitcoin-Anchored Document
                    <Tooltip
                      title="Bitcoin Anchored"
                      content="This document's hash has been permanently written into the Bitcoin blockchain. It can never be altered or backdated."
                    />
                  </p>
                  <div
                    className="flex h-8 w-24 items-center justify-center rounded-lg"
                    style={{ background: '#f1f5f9' }}
                  >
                    <span className="text-[9px] font-bold" style={{ color: '#94a3b8' }}>
                      HASH PENDING
                    </span>
                  </div>
                </div>

                {/* Right: inline QR code → verify page */}
                <div className="flex flex-shrink-0 flex-col items-center gap-1">
                  {qrUrl ? (
                    <a
                      href={getVerifyUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open verification page"
                      className="rounded transition-opacity hover:opacity-100"
                      style={{ opacity: 0.85 }}
                    >
                      <img
                        src={qrUrl}
                        alt="Scan to verify at Satohash"
                        style={{ width: 56, height: 56 }}
                      />
                    </a>
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: '#f1f5f9',
                        borderRadius: 4
                      }}
                    />
                  )}
                  <span
                    className="text-[8px] font-bold tracking-widest uppercase"
                    style={{ color: '#94a3b8' }}
                  >
                    Scan to verify
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex w-full flex-col gap-4 lg:w-72 xl:w-80"
          >
            {/* Anchor to Bitcoin */}
            <button
              onClick={handleAnchor}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F0B429 0%, #d97706 100%)',
                color: '#0f172a',
                boxShadow: '0 0 20px rgba(240,180,41,0.25)'
              }}
            >
              <Zap size={16} />
              Anchor to Bitcoin
              <Tooltip
                title="Bitcoin Anchored"
                content="This document's hash has been permanently written into the Bitcoin blockchain. It can never be altered or backdated."
                className="ml-1"
              />
            </button>

            {/* Progress card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Fields Complete
                </span>
                <span className="text-sm font-black" style={{ color: 'var(--accent-gold)' }}>
                  {progress}%
                </span>
              </div>
              {/* Progress bar */}
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ background: 'var(--bg-primary)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #F0B429, #0d9488)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                {completedFields.length} of {template.fields.length} fields filled
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkDoc((v) => !v)}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
              style={{
                background: darkDoc ? 'rgba(248,250,252,0.08)' : 'var(--bg-secondary)',
                border: darkDoc ? '1px solid rgba(248,250,252,0.15)' : '1px solid var(--border)',
                color: darkDoc ? '#f8fafc' : 'var(--text-primary)'
              }}
            >
              {darkDoc ? (
                <Sun size={15} style={{ color: '#f0b429' }} />
              ) : (
                <Moon size={15} style={{ color: 'var(--text-muted)' }} />
              )}
              {darkDoc ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handlePDF}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Download size={15} style={{ color: 'var(--accent-gold)' }} />
                Download PDF
              </button>

              <button
                onClick={() => setShowPreview(true)}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-active)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Eye size={15} style={{ color: 'var(--accent-active)' }} />
                Preview
              </button>

              <button
                onClick={() => window.print()}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Printer size={15} style={{ color: 'var(--accent-teal)' }} />
                Print Document
              </button>

              <button
                onClick={handleVault}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-success)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Vault size={15} style={{ color: 'var(--accent-success)' }} />
                Save to Vault
              </button>

              <button
                onClick={handleEmail}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-purple)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Mail size={15} style={{ color: 'var(--accent-purple)' }} />
                Email Package
              </button>

              <button
                onClick={handleShareLink}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-active)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Link2 size={15} style={{ color: 'var(--accent-active)' }} />
                Copy Share Link
              </button>
            </div>

            {/* Zero-knowledge info card */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(240,180,41,0.05)',
                border: '1px solid rgba(240,180,41,0.2)'
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Lock size={13} style={{ color: 'var(--accent-gold)' }} />
                <span
                  className="text-xs font-black tracking-wide uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Zero-Knowledge
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Your document contents never leave your device. Only a cryptographic hash is
                anchored to Bitcoin — provable without exposure.
              </p>
              <a
                href="/trust"
                className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
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
              <p className="mb-3 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                Checklist
              </p>
              <div
                className="flex max-h-52 flex-col gap-1.5 overflow-y-auto pr-1"
                style={{ scrollbarWidth: 'thin' }}
              >
                {template.fields.map((field) => {
                  const filled = !!data[field.id]?.trim?.()
                  return (
                    <div key={field.id} className="flex items-center gap-2">
                      {filled ? (
                        <CheckCircle
                          size={12}
                          style={{ color: 'var(--accent-success)', flexShrink: 0 }}
                        />
                      ) : (
                        <Circle size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      )}
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

            {/* ── Version History ── */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              {/* Collapsible header */}
              <button
                onClick={() => setHistoryOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <div className="flex items-center gap-2">
                  <History size={13} style={{ color: 'var(--accent-active)' }} />
                  <span className="text-xs font-bold">Version History</span>
                  {snapshots.length > 0 && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-black"
                      style={{
                        background: 'color-mix(in srgb, var(--accent-active) 15%, transparent)',
                        color: 'var(--accent-active)'
                      }}
                    >
                      {snapshots.length}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={13}
                  style={{
                    transition: 'transform 0.2s',
                    transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {/* Snapshot list */}
              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="flex flex-col gap-1.5 border-t px-3 py-3"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {snapshots.length === 0 ? (
                        <p
                          className="py-2 text-center text-[10px]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          No snapshots yet — edits auto-save after 2 s.
                        </p>
                      ) : (
                        snapshots.map((snap, idx) => {
                          const d = new Date(snap.timestamp)
                          const label = d.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                          const time = d.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                          return (
                            <div
                              key={snap.timestamp}
                              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                              style={{
                                background:
                                  idx === 0
                                    ? 'color-mix(in srgb, var(--accent-active) 6%, transparent)'
                                    : 'var(--bg-primary)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <div className="min-w-0 flex-1">
                                <p
                                  className="text-[10px] font-bold"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {label} · {time}
                                </p>
                                {idx === 0 && (
                                  <p
                                    className="text-[9px]"
                                    style={{ color: 'var(--accent-active)' }}
                                  >
                                    Latest
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => restoreSnapshot(snap)}
                                className="flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all active:scale-95"
                                style={{
                                  background:
                                    'color-mix(in srgb, var(--accent-pending) 12%, transparent)',
                                  border:
                                    '1px solid color-mix(in srgb, var(--accent-pending) 25%, transparent)',
                                  color: 'var(--accent-pending)'
                                }}
                              >
                                <RotateCcw size={10} />
                                Restore
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────────

export default function NotaryTemplates() {
  usePageMetaOnboarding('notary-templates')
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
