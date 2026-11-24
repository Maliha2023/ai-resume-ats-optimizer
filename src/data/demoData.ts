import type { IndustryId } from '../types/ats.ts';

export interface IndustryDemoProfile {
  id: IndustryId;
  label: string;
  sampleRoleLabel: string;
  fileName: string;
  jobDescription: string;
  resume: string;
}

export const INDUSTRY_OPTIONS: Array<{ id: IndustryId; label: string }> = [
  { id: 'software-engineering', label: 'Software Engineering' },
  { id: 'digital-marketing', label: 'Digital Marketing' },
  { id: 'human-resources', label: 'Human Resources' },
  { id: 'finance-accounting', label: 'Finance & Accounting' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'custom', label: 'Custom Industry / Role...' },
];

export const INDUSTRY_DEMO_DATA: Record<IndustryId, IndustryDemoProfile> = {
  'software-engineering': {
    id: 'software-engineering',
    label: 'Software Engineering',
    sampleRoleLabel: 'Senior Frontend Developer',
    fileName: 'alex_chen_frontend_resume.txt',
    jobDescription: `Senior Frontend Developer — React, TypeScript & Design Systems
Location: Remote / Hybrid (Core Web Experience Team)

About the Role:
We are looking for a product-minded Senior Frontend Developer to architect fast, accessible web interfaces and evolve our multi-brand React design system. You will collaborate closely with Product Designers and Platform Engineers to deliver crisp, low-latency user experiences at scale.

Key Responsibilities:
- Architect and ship modular, type-safe UI features using React 19, TypeScript, Next.js (App Router), and Tailwind CSS.
- Build and maintain reusable, WCAG 2.1 AA compliant component primitives documented in Storybook with automated visual regression testing.
- Manage complex client/server state and caching strategies using TanStack Query and GraphQL / REST APIs.
- Optimize rendering performance and Core Web Vitals (LCP < 1.8s, INP < 100ms, CLS < 0.05) using code splitting and bundle profiling.
- Establish automated end-to-end testing coverage using Playwright and component tests with Vitest / React Testing Library in GitHub Actions CI.
- Mentor mid-level engineers through thorough code reviews, technical RFCs, and cross-functional stakeholder alignment.

Required Qualifications:
- 4+ years of production experience building modern web applications with React and TypeScript.
- Strong grounding in semantic HTML5, responsive CSS architecture, web accessibility (ARIA), and Lighthouse CI.
- Demonstrated technical leadership, clear written communication, and Agile sprint ownership.`,
    resume: `Alex Chen
Frontend Developer | React & TypeScript Specialist
Email: alex.chen.dev@example.com | Portfolio: alexchen.dev | GitHub: github.com/alexchen-ui

PROFESSIONAL SUMMARY
Frontend Developer with 4 years of experience crafting responsive SaaS dashboards, interactive design systems, and data-heavy web applications using React, TypeScript, and Tailwind CSS. Focused on clean UI architecture, accessibility, and delivering sub-second user interactions.

TECHNICAL SKILLS
- Languages & Core: TypeScript, JavaScript (ES2023), HTML5, CSS3, Sass
- Frameworks & UI: React, Vite, Tailwind CSS, Redux Toolkit, React Router
- Testing & Quality: Vitest, Jest, React Testing Library, ESLint, WCAG 2.1 Accessibility
- APIs & Workflow: REST APIs, Axios, Git, GitHub Actions, Figma, Agile/Scrum

PROFESSIONAL EXPERIENCE

Frontend Developer — MetricFlow Analytics (2023 – Present)
- Led the UI migration of a 45-view SaaS analytics dashboard from legacy JavaScript to React 18, TypeScript, and Tailwind CSS, cutting UI runtime bugs by 42%.
- Built an internal library of 35+ reusable accessible UI components paired with Figma design tokens, reducing feature handoff time by 30%.
- Optimized initial bundle size by 38% via Vite route-level code splitting and virtualized data tables handling 25,000+ rows smoothly.
- Wrote 240+ unit and integration tests with Vitest and React Testing Library, lifting frontend test coverage from 34% to 82%.

Junior Frontend Engineer — BrightDesk Cloud (2021 – 2023)
- Developed responsive customer portal interfaces and onboarding flows in React, Redux Toolkit, and REST APIs serving 60,000+ monthly active users.
- Improved keyboard navigation, focus management, and color contrast across billing flows to achieve full WCAG 2.1 AA compliance.

PROJECTS
- GridCraft UI (Open Source): Lightweight accessible React + TypeScript data grid with keyboard navigation and column resizing.

EDUCATION
B.S. in Computer Science — Pacific Metro University (2021)`,
  },

  'digital-marketing': {
    id: 'digital-marketing',
    label: 'Digital Marketing',
    sampleRoleLabel: 'Senior Digital Marketing Manager',
    fileName: 'maya_patel_marketing_resume.txt',
    jobDescription: `Senior Digital Marketing Manager — Demand Generation & Growth
Location: Hybrid / Remote (Growth Marketing Team)

About the Role:
We are seeking a data-driven Senior Digital Marketing Manager to scale multi-channel customer acquisition, optimize conversion funnels, and own pipeline attribution across our B2B SaaS product suite.

Key Responsibilities:
- Own paid acquisition budgets ($1.2M+ annually) across Google Ads (SEM), LinkedIn Ads, and Meta Ads with strict CAC and ROAS targets.
- Lead technical and content SEO strategy using SEMrush, Ahrefs, and Google Search Console to grow qualified organic signups.
- Architect lifecycle email nurture sequences, lead scoring, and multi-touch attribution inside HubSpot and Salesforce CRM.
- Design and execute high-velocity A/B testing and Conversion Rate Optimization (CRO) experiments on landing pages using VWO or Optimizely.
- Build executive marketing performance dashboards in Google Analytics 4 (GA4) and Looker Studio to present ROI insights to C-suite stakeholders.
- Manage external creative agencies and mentor 2 growth marketing specialists.

Required Qualifications:
- 5+ years in digital marketing or B2B demand generation with measurable pipeline impact.
- Hands-on mastery of GA4, HubSpot Marketing Hub, paid search/social optimization, and executive storytelling.
- Strong cross-functional collaboration with Sales, Product Marketing, and RevOps teams.`,
    resume: `Maya Patel
Digital Marketing Manager | Paid Media & SEO Strategist
Email: maya.patel.mktg@example.com | LinkedIn: linkedin.com/in/mayapatel-growth

PROFESSIONAL SUMMARY
Results-focused Digital Marketing Manager with 5 years of experience driving B2B and B2C customer acquisition through paid search, social media campaigns, SEO, and email marketing. Proven ability to lower cost-per-acquisition while scaling qualified inbound leads.

CORE COMPETENCIES
- Acquisition Channels: Google Ads, Meta Ads, LinkedIn Ads, SEO, Content Marketing, Email Campaigns
- Tools & Analytics: Google Analytics (GA4), Google Search Console, Mailchimp, SEMrush, Canva, Excel
- Campaign Operations: Copywriting, Landing Page Design, Funnel Analysis, Budget Pacing, Vendor Coordination

PROFESSIONAL EXPERIENCE

Digital Marketing Manager — CloudScale Software (2022 – Present)
- Managed $650K annual paid acquisition spend across Google Ads and LinkedIn Ads, increasing marketing-qualified leads (MQLs) by 48% year-over-year.
- Directed on-page SEO audits and editorial content calendars using SEMrush, growing organic blog traffic from 28,000 to 95,000 monthly visits in 14 months.
- Launched monthly customer newsletters and product launch drip campaigns in Mailchimp with a 31% average open rate and 4.6% CTR.
- Collaborated with sales managers to refine ad messaging and buyer personas, reducing cost-per-lead by 22%.

Digital Marketing Specialist — Bloom & Co. Retail (2020 – 2022)
- Executed paid social campaigns on Meta and Google Shopping, generating 3.8x ROAS during peak seasonal promotions.
- Built weekly campaign performance reports in Google Analytics and Excel tracking impressions, clicks, and conversion rates.
- Coordinated freelance copywriters and designers to ship 40+ campaign creatives on schedule.

EDUCATION
B.A. in Marketing & Communications — Westfield State University (2020)`,
  },

  'human-resources': {
    id: 'human-resources',
    label: 'Human Resources',
    sampleRoleLabel: 'Senior HR Business Partner',
    fileName: 'jordan_brooks_hr_resume.txt',
    jobDescription: `Senior Human Resources Business Partner (HRBP)
Location: Hybrid (People & Culture Team)

About the Role:
We are hiring a strategic Senior HR Business Partner to advise department leaders on organizational design, talent retention, total rewards, and employee relations across a 450-person distributed organization.

Key Responsibilities:
- Partner with VPs and Directors on workforce planning, succession planning, and performance calibration cycles.
- Administer and optimize HRIS workflows and people analytics reporting in Workday and Greenhouse ATS.
- Lead annual compensation benchmarking, salary band reviews, and merit cycle administration in collaboration with Finance.
- Design and track Diversity, Equity, Inclusion & Belonging (DEIB) initiatives and semi-annual employee engagement surveys (Culture Amp).
- Guide complex employee relations investigations, FMLA/ADA compliance, and multi-state labor law adherence.
- Coach people managers on conflict resolution, empathetic leadership, and structured feedback conversations.

Required Qualifications:
- 5+ years of progressive HR Generalist or HRBP experience in fast-growing organizations.
- SHRM-CP or PHR certification strongly preferred.
- Demonstrated proficiency in Workday HRIS, people analytics dashboards, and executive stakeholder influence.`,
    resume: `Jordan Brooks
Human Resources Specialist | Employee Relations & Talent Operations
Email: jordan.brooks.hr@example.com | LinkedIn: linkedin.com/in/jordanbrooks-hr

PROFESSIONAL SUMMARY
People-centered Human Resources professional with 5 years of experience supporting full-cycle recruiting, employee onboarding, benefits administration, and workplace policy compliance across mid-sized corporate teams.

SKILLS & HR SYSTEMS
- HR Operations: Full-Cycle Recruiting, Onboarding, Employee Relations, Benefits Administration, Performance Reviews
- Compliance & Policy: FLSA, EEOC, Employee Handbooks, Leave Administration, Confidential Investigations
- Tools: BambooHR, Greenhouse ATS, ADP Workforce Now, Excel, Slack, Microsoft 365

PROFESSIONAL EXPERIENCE

Human Resources Generalist — Veridian Logistics Group (2022 – Present)
- Supported 240+ corporate and operations employees on employee relations inquiries, policy interpretation, and leave administration.
- Partnered with hiring managers in Greenhouse ATS to fill 65+ roles annually, reducing average time-to-fill from 46 days to 29 days.
- Redesigned the 30-60-90 day onboarding experience in BambooHR, lifting 90-day new-hire retention from 84% to 94%.
- Coordinated semi-annual performance review cycles and delivered training workshops for 25 first-time people managers.

HR Coordinator — Harborview Financial Services (2020 – 2022)
- Processed bi-weekly payroll updates, benefits enrollments, and employee lifecycle changes in ADP with 99.8% accuracy.
- Maintained compliant personnel records, I-9 audits, and annual EEO-1 reporting documentation.
- Organized quarterly employee recognition events and wellness programs to strengthen team morale.

EDUCATION
B.S. in Human Resource Management — Northbridge University (2020)`,
  },

  'finance-accounting': {
    id: 'finance-accounting',
    label: 'Finance & Accounting',
    sampleRoleLabel: 'Senior Financial Analyst (FP&A)',
    fileName: 'david_kim_finance_resume.txt',
    jobDescription: `Senior Financial Analyst — FP&A & Strategic Finance
Location: Hybrid (Corporate Finance Team)

About the Role:
We are seeking an analytical Senior Financial Analyst to own quarterly forecasting, three-statement financial modeling, SaaS/unit-economics analysis, and board reporting packages for our executive leadership team.

Key Responsibilities:
- Build and maintain dynamic 3-statement financial models, rolling 12-month forecasts, and annual operating budgets ($80M+ revenue).
- Perform monthly budget-vs-actual (BvA) variance analysis and partner with department heads to track KPIs, gross margin, and EBITDA.
- Extract and reconcile large financial datasets using SQL, NetSuite ERP, and Power BI / Tableau executive dashboards.
- Ensure strict alignment with US GAAP revenue recognition (ASC 606) and coordinate closely with Accounting during month-end close.
- Prepare concise board decks, cash-flow sensitivity analyses, and scenario modeling for capital allocation decisions.
- Communicate complex financial trade-offs clearly to non-finance executives and cross-functional budget owners.

Required Qualifications:
- 4+ years in Corporate FP&A, Investment Banking, or Big 4 Financial Advisory.
- Advanced Excel modeling (INDEX/MATCH, Power Query, dynamic arrays), NetSuite ERP, and SQL or BI visualization experience.
- CPA or CFA Level II+ candidate preferred.`,
    resume: `David Kim
Financial Analyst | Corporate Budgeting & Variance Reporting
Email: david.kim.fin@example.com | LinkedIn: linkedin.com/in/davidkim-finance

PROFESSIONAL SUMMARY
Detail-oriented Financial Analyst with 4 years of experience in corporate budgeting, month-end variance reporting, and operational expense forecasting. Skilled in Excel financial modeling, ERP reconciliations, and cross-departmental budget partnering.

CORE SKILLS
- Financial Analysis: Budgeting & Forecasting, Variance Analysis (BvA), Cash Flow Tracking, Cost Accounting, KPI Reporting
- Accounting & Standards: US GAAP Fundamentals, Month-End Close Support, Accruals, General Ledger Reconciliations
- Technical Tools: Advanced Microsoft Excel (PivotTables, VLOOKUP, INDEX/MATCH, Macros), QuickBooks Enterprise, SAP, PowerPoint

PROFESSIONAL EXPERIENCE

Financial Analyst — Summit Manufacturing Corp. (2022 – Present)
- Managed annual departmental budgets totaling $42M across 8 cost centers, identifying $1.4M in vendor consolidation savings.
- Prepared monthly budget-vs-actual variance reports and executive summary slides for the VP of Finance within 4 business days of close.
- Built automated Excel forecasting templates using Power Query and dynamic formulas, cutting monthly reporting prep time by 35%.
- Collaborated with Accounting on quarterly accruals, fixed-asset schedules, and external audit workpapers.

Junior Financial Analyst — Crestline Retail Partners (2021 – 2022)
- Analyzed store-level revenue trends, inventory turnover, and promotional margin impact across 32 retail locations.
- Reconciled weekly sales deposits and operating expenses in QuickBooks Enterprise and SAP, resolving discrepancies prior to close.
- Assisted senior analysts with quarterly board presentations and ad-hoc pricing sensitivity worksheets.

EDUCATION
B.S. in Finance & Accounting — Midwest Business College (2021)`,
  },

  healthcare: {
    id: 'healthcare',
    label: 'Healthcare',
    sampleRoleLabel: 'Healthcare Operations & Quality Coordinator',
    fileName: 'elena_martinez_healthcare_resume.txt',
    jobDescription: `Clinical Operations & Healthcare Quality Coordinator
Location: On-Site / Hybrid (Regional Health Network)

About the Role:
We are seeking a compassionate, detail-oriented Clinical Operations & Healthcare Quality Coordinator to oversee outpatient clinic workflows, regulatory accreditation readiness, and patient safety metrics across 4 multi-specialty clinics.

Key Responsibilities:
- Coordinate clinic operations, staffing templates, and patient access initiatives to reduce appointment wait times and no-show rates.
- Lead quality assurance audits, Joint Commission accreditation readiness, and CMS Quality Payment Program / HEDIS metric reporting.
- Optimize Electronic Health Record (EHR) documentation workflows and reporting dashboards in Epic Systems.
- Ensure 100% adherence to HIPAA privacy regulations, OSHA workplace safety standards, and infection control protocols.
- Partner with physicians, nurse managers, and revenue cycle teams on care coordination and prior authorization bottlenecks.
- Facilitate interdisciplinary root-cause analysis (RCA) huddles and empathetic patient grievance resolution.

Required Qualifications:
- 3+ years of healthcare operations, clinical coordination, or hospital quality improvement experience.
- Proficiency with Epic EHR, HIPAA compliance, and healthcare quality frameworks (Lean Six Sigma or PDSA cycles preferred).
- Strong empathetic communication, de-escalation skills, and cross-clinical leadership.`,
    resume: `Elena Martinez
Healthcare Operations Coordinator | Patient Access & Clinic Workflow Specialist
Email: elena.martinez.hc@example.com | LinkedIn: linkedin.com/in/elenamartinez-health

PROFESSIONAL SUMMARY
Dedicated Healthcare Operations Coordinator with 4 years of experience improving outpatient clinic efficiency, patient scheduling workflows, and HIPAA-compliant medical record management in fast-paced clinical environments.

CORE COMPETENCIES
- Clinical Operations: Patient Access & Scheduling, Care Coordination, Clinic Staffing Support, Prior Authorizations, Intake Workflows
- Compliance & Records: HIPAA Privacy & Security, Medical Terminology, Insurance Verification, Patient Confidentiality
- Systems & Tools: Athenahealth EHR, Cerner, Microsoft Excel, Patient Portal Administration, Bilingual (English/Spanish)

PROFESSIONAL EXPERIENCE

Clinic Operations Coordinator — Valley Care Medical Associates (2022 – Present)
- Supervised daily front-office operations and scheduling templates for 14 providers handling 1,100+ outpatient visits weekly.
- Implemented automated SMS appointment reminders and waitlist outreach in Athenahealth, cutting patient no-show rates by 24%.
- Streamlined specialist referral tracking and prior authorization follow-ups, improving average referral turnaround from 9 days to 4 days.
- Conducted monthly HIPAA privacy audits and trained 18 medical receptionists and coordinators on updated intake protocols.

Patient Services Representative — Mercy Regional Outpatient Center (2021 – 2022)
- Verified commercial, Medicare, and Medicaid coverage for 75+ daily patients with a 98.5% clean-claim registration accuracy rate.
- Resolved patient billing inquiries and scheduling conflicts with empathy, earning a 96% patient satisfaction score.
- Maintained accurate patient charts and immunization records inside Cerner EHR.

EDUCATION
B.S. in Healthcare Administration — Oakridge State University (2021)`,
  },

  'graphic-design': {
    id: 'graphic-design',
    label: 'Graphic Design',
    sampleRoleLabel: 'Senior Brand & Graphic Designer',
    fileName: 'samira_noor_design_resume.txt',
    jobDescription: `Senior Brand & Graphic Designer — Visual Identity & Campaign Systems
Location: Hybrid / Remote (Brand Studio)

About the Role:
We are looking for a conceptual Senior Brand & Graphic Designer to evolve our visual identity system across digital campaigns, editorial publications, packaging, and motion assets.

Key Responsibilities:
- Own end-to-end visual identity systems, typography hierarchies, and multi-channel brand guidelines in Figma and Adobe Creative Cloud (Illustrator, Photoshop, InDesign).
- Create short-form motion graphics, animated social templates, and kinetic typography using Adobe After Effects and Lottie.
- Prepare print-ready packaging, trade-show booths, and editorial layouts with accurate CMYK color profiles, bleed, and prepress vendor specs.
- Collaborate with Copywriters, Product Designers, and Marketing leads to translate campaign briefs into high-converting visual storytelling.
- Present creative concepts persuasively in stakeholder critiques, incorporate constructive feedback gracefully, and mentor junior designers.
- Maintain organized digital asset libraries and scalable design tokens to ensure brand consistency globally.

Required Qualifications:
- 4+ years of agency or in-house brand/graphic design experience with a standout portfolio.
- Expert proficiency in Adobe Illustrator, Photoshop, InDesign, Figma, and After Effects motion workflows.
- Deep craft in typography, grid systems, color theory, print production, and art direction.`,
    resume: `Samira Noor
Brand & Graphic Designer | Visual Identity & Digital Campaigns
Email: samira.noor.design@example.com | Portfolio: samiranoor.design | Behance: behance.net/samiranoor

PROFESSIONAL SUMMARY
Creative Graphic Designer with 4 years of agency and in-house experience crafting cohesive brand identities, digital marketing visuals, and editorial layouts. Known for strong typographic craft, clean grid systems, and delivering polished campaigns on tight deadlines.

DESIGN SKILLS & TOOLS
- Design Software: Adobe Illustrator, Adobe Photoshop, Adobe InDesign, Figma, Canva Pro
- Design Disciplines: Brand Identity, Logo Design, Social Media Campaigns, Pitch Decks, Editorial Layout, Typography
- Workflow: Creative Brief Interpretation, Photo Retouching, Stakeholder Presentations, Design QA

PROFESSIONAL EXPERIENCE

Graphic Designer — Studio North Creative (2022 – Present)
- Designed brand identity refreshes, logos, and digital style guides for 12 B2B and consumer lifestyle clients across tech and hospitality.
- Produced 180+ paid social ads, email headers, and landing page hero illustrations in Figma and Photoshop, lifting client ad click-through rates by 27%.
- Created executive pitch decks, whitepapers, and annual impact reports in InDesign ranging from 16 to 48 pages.
- Partnered directly with copywriters and account directors to run weekly creative reviews and hit 100% of campaign launch milestones.

Junior Graphic Designer — Beacon Media Collective (2021 – 2022)
- Illustrated custom icon sets, infographics, and event collateral for quarterly conferences attended by 2,500+ guests.
- Retouched product photography and maintained shared brand asset folders for internal marketing teams.

EDUCATION
B.F.A. in Graphic Design — Cascade College of Art & Design (2021)`,
  },

  custom: {
    id: 'custom',
    label: 'Custom Industry / Role',
    sampleRoleLabel: 'Operations & Project Manager',
    fileName: 'taylor_reed_general_resume.txt',
    jobDescription: `Senior Project & Operations Manager
Location: Hybrid / Remote

About the Role:
We are looking for a versatile Senior Project & Operations Manager to lead cross-functional initiatives, standardize operational playbooks, and deliver high-priority programs on time and under budget.

Key Responsibilities:
- Own end-to-end project delivery lifecycles including scope definition, milestone tracking, risk mitigation, and stakeholder reporting.
- Optimize operational workflows using data analytics, KPI scorecards, and continuous process improvement methodologies (Lean / Agile).
- Manage vendor contracts, resource allocation, and quarterly budget forecasting ($1.5M+ program portfolio).
- Facilitate executive alignment meetings, resolve cross-departmental blockers, and mentor junior project coordinators.

Required Qualifications:
- 4+ years of project management, operations leadership, or program delivery experience.
- PMP or Agile certification preferred, alongside strong executive communication and analytical decision-making.`,
    resume: `Taylor Reed
Project & Operations Manager | Cross-Functional Program Delivery
Email: taylor.reed.ops@example.com | LinkedIn: linkedin.com/in/taylorreed-ops

PROFESSIONAL SUMMARY
Structured Project & Operations Manager with 4 years of experience coordinating multi-department initiatives, streamlining business processes, and improving on-time project delivery across distributed teams.

CORE COMPETENCIES
- Delivery & Operations: Project Planning, Resource Scheduling, Process Improvement, Risk Management, Vendor Coordination
- Tools & Reporting: Asana, Jira, Smartsheet, Microsoft Excel, Tableau Basics, Executive Presentations

PROFESSIONAL EXPERIENCE

Operations & Project Manager — Meridian Services Group (2022 – Present)
- Managed 14 concurrent client implementation projects totaling $900K in annual value, achieving 94% on-time milestone delivery.
- Standardized onboarding checklists and weekly status reporting in Asana, reducing project kickoff delays by 28%.
- Facilitated cross-functional sprint reviews with operations, finance, and client success leads to resolve scope bottlenecks.

Project Coordinator — Harborline Consulting (2021 – 2022)
- Tracked deliverable timelines, vendor invoices, and meeting action items across 6 enterprise accounts.
- Built KPI dashboards in Excel to highlight utilization trends and resource constraints for senior leadership.

EDUCATION
B.A. in Business Administration — Lakeview University (2021)`,
  },
};

export function resolveTargetIndustryLabel(
  industryId: IndustryId,
  customIndustry: string
): string {
  if (industryId === 'custom') {
    const trimmed = customIndustry.trim();
    return trimmed || 'Custom Profession / Role';
  }
  return INDUSTRY_DEMO_DATA[industryId]?.label ?? 'General Profession';
}

export function getDemoProfileForIndustry(
  industryId: IndustryId
): IndustryDemoProfile {
  return INDUSTRY_DEMO_DATA[industryId] ?? INDUSTRY_DEMO_DATA.custom;
}
