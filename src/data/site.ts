// Single source for every claim on the site. Provenance for each claim is in docs/claim-audit.md.
// Leadership scope differs per role on purpose: ran / led / enabled and coached.

export type Story = {
  headline: string; // the result, stated as the outcome a hiring manager wants
  steps: string[]; // what I actually did, in order
  result: string;
};
export type Role = {
  id: string;
  short: string; // short label beside the card
  title: string;
  org: string;
  dates: string;
  years: string;
  tint: string; // sea-glass rgb triplet for this role's card
  context?: string;
  figure?: string; // key result shown beside the card
  beats: [string, string, string, string];
  numbers?: { value: string; label: string }[];
  story?: Story;
  extraRoles?: { title: string; org: string; dates: string }[];
  skill: string; // the skill this role added: the card's headline
  cardTitle: string; // title and company as they fit on a card label
  cardProof: string; // one proof on the card label
  alongside?: boolean; // part-time or concurrent: a slim card beside the main sequence
  progress?: boolean; // still being built: the card is drawn unfinished
};

// Every role is told in the same four parts. That repetition is the point of the page.
export const BEATS = ['The problem', 'What I did', 'Who had to use it', 'The result'] as const;

export const roles: Role[] = [
  {
    id: 'right-choice',
    skill: 'Building and running a company',
    cardTitle: 'Co-Founder & CEO, Right Choice Security',
    cardProof: '56 people; ~90% client retention',
    short: 'Co-Founder & CEO',
    title: 'Co-Founder & CEO',
    org: 'Right Choice Security',
    dates: 'Jan 2003 – Feb 2013',
    years: '2003–2013',
    tint: '95, 168, 148',
    context: 'A security services company I co-founded and ran.',
    figure: '56 people, ~90% retention',
    beats: [
      'A service business starting from nothing, where every client’s experience depended on frontline staff working on their own.',
      'Built the operating system from scratch: hiring, onboarding, training, scheduling, SOPs, reporting and client communication. I co-led sales with my partner, owning needs analysis, contract negotiation and expansion to additional client sites.',
      'A frontline team that grew to 56 people. I coached them and wrote the guidance that let them make good decisions independently.',
      'About 90% client retention. Needs analysis after service started at the first sites uncovered additional sites and led to expanded contracts.',
    ],
    numbers: [
      { value: '56', label: 'people at its largest' },
      { value: '~90%', label: 'client retention' },
    ],
    story: {
      headline: 'Won back customers we had lost to competitors, usually within one to three months',
      steps: [
        'Kept up consistent outreach to customers who had switched to a competitor.',
        'Made our service quality the reason to come back.',
      ],
      result: 'Multiple customers won back, typically within one to three months, inside a business that kept about 90% of its clients.',
    },
  },
  {
    id: 'ralph-realty',
    skill: 'Building the financial case',
    cardTitle: 'Realtor, Ralph Realty (part-time)',
    cardProof: '~$750K average monthly sales volume',
    alongside: true,
    short: 'Realtor',
    title: 'Realtor',
    org: 'Ralph Realty Inc.',
    dates: 'Feb 2010 – Mar 2020',
    years: '2010–2020',
    tint: '166, 217, 212',
    context: 'Part-time, alongside my other roles.',
    figure: '~$750K monthly sales volume',
    beats: [
      'Investors and rental-property owners weighing fix-and-flip, buy-and-hold and wholesale strategies, with financing and market tradeoffs to sort out.',
      'Turned market data, returns, financing options and tradeoffs into clear recommendations, and coordinated deals across hard-money lenders, conventional lenders, investors and other stakeholders.',
      'Investors, rental-property owners and buyers making large financial decisions.',
      'About $750K in average monthly sales volume, built largely on repeat and referral business.',
    ],
    numbers: [{ value: '~$750K', label: 'average monthly sales volume' }],
  },
  {
    id: 'wasatch',
    skill: 'Collecting and following through',
    cardTitle: 'Asst. / Finance Mgr, Wasatch Property Mgmt',
    cardProof: 'Unpaid rent down ~5–8%',
    alongside: true,
    short: 'Property finance & operations',
    title: 'Assistant Manager / Finance Manager',
    org: 'Wasatch Property Management',
    dates: 'Jul 2010 – Oct 2013',
    years: '2010–2013',
    tint: '150, 198, 188',
    context: 'A 250-unit apartment community in Sacramento. I managed its finance and operations.',
    figure: 'Unpaid rent down ~5–8%',
    beats: [
      'A 250-unit community that had to keep units filled and rent collected.',
      'Ran revenue and collection initiatives with disciplined follow-up on resident accounts, and partnered with the corporate team on leasing, marketing and referral programs.',
      'Residents and prospective residents, and the corporate marketing team I worked with.',
      'Unpaid rent down about 5–8%, occupancy held at roughly 92–95%, and top rankings in sales-call reviews.',
    ],
    numbers: [
      { value: '~5–8%', label: 'less unpaid rent' },
      { value: '92–95%', label: 'occupancy' },
    ],
    story: {
      headline: 'Cut unpaid rent about 5–8% at a 250-unit community',
      steps: [
        'Ran revenue and collection initiatives on resident accounts.',
        'Followed up on resident accounts with discipline and kept communication with residents clear.',
        'Kept units filled at the same time, through leasing, marketing and referral programs with the corporate team.',
      ],
      result: 'Unpaid rent down about 5–8%, with occupancy held at roughly 92–95%.',
    },
  },
  {
    id: 'apex-labs',
    skill: 'Growing accounts after the sale',
    cardTitle: 'Sr. Mgr, Client Ops & Accounts, Apex Labs',
    cardProof: 'Recurring revenue +30%',
    short: 'Client Operations',
    title: 'Senior Manager, Client Operations & Accounts',
    org: 'Apex Labs',
    dates: 'May 2017 – Apr 2021',
    years: '2017–2021',
    tint: '111, 181, 195',
    context: 'A B2B hardware and consumables manufacturer. Its customers were in the cannabis industry.',
    figure: '+30% recurring revenue',
    beats: [
      'About 30 recurring B2B accounts with ongoing hardware, consumable and service needs, moving through several internal teams, with breakdowns showing up at the handoffs.',
      'Standardized the customer lifecycle from setup through service and renewal, with cleaner handoffs, reporting and documentation, and ran recurring business reviews that turned client requirements into custom specs and delivery priorities.',
      'Owners, executives, purchasing and hardware-design contacts at each account, and the internal teams delivering their products.',
      'Recurring revenue up about 30%, from retention, expansion within existing accounts and new accounts.',
    ],
    numbers: [
      { value: '+30%', label: 'recurring revenue' },
      { value: '~30', label: 'recurring accounts' },
    ],
    story: {
      headline: 'Grew recurring revenue about 30% by working three levers at once',
      steps: [
        'Retention: standardized workflows, handoffs, reporting and documentation so service stayed continuous from team to team and every account stayed visible.',
        'Expansion: used recurring business reviews with owners, executives, purchasing and design contacts to surface new needs, then turned them into custom specs and delivery priorities.',
        'New accounts: added new customers alongside the existing book, while satisfied clients became references and testimonials.',
      ],
      result: 'Recurring revenue up about 30% across roughly 30 accounts.',
    },
  },
  {
    id: 'vessel-brand',
    skill: 'Leading a sales team',
    cardTitle: 'Director of Sales, Vessel Brand',
    cardProof: '15 AEs; deal size +35%',
    short: 'Director of Sales',
    title: 'Director of Sales',
    org: 'Vessel Brand',
    dates: 'May 2021 – Mar 2023',
    years: '2021–2023',
    tint: '143, 205, 180',
    figure: '15 AEs, deal size +35%',
    beats: [
      'New product lines launching, a $2M+ book of SMB accounts on annual renewals, and a sales team that needed consistent discovery and a clear value story.',
      'Drove consultative discovery, account planning and expansion conversations grounded in each customer’s goals, and coached the team on pipeline routines, product launches and account execution.',
      '15 quota-carrying account executives who reported to me, each carrying about $60K in monthly quota. I owned hiring, goals, coaching, reviews and compensation.',
      'Average deal size up about 35%, and the team hit quota in about 88% of months. I also managed a $2M+ portfolio of about 15–20 SMB accounts myself.',
    ],
    numbers: [
      { value: '15', label: 'account executives led' },
      { value: '+35%', label: 'average deal size' },
      { value: '~88%', label: 'of months, the team hit quota' },
    ],
    story: {
      headline: 'Kept an account a competitor was circling, without cutting the price',
      steps: [
        'When a customer began evaluating alternatives at renewal, I didn’t treat it as a price objection.',
        'Used open discovery to work backward from the business problem they were trying to solve.',
        'Found the real gap: they didn’t know Vessel already offered the service they needed. I reframed the decision around value instead of price.',
      ],
      result: 'Account retained by solving the right problem, not by discounting the relationship.',
    },
  },
  {
    id: 'visiativ',
    skill: 'Enablement at scale',
    cardTitle: 'Sr. BD & Enablement Manager, Visiativ–ABGI',
    cardProof: '30+ BDMs coached; first AI step adopted',
    short: 'Enablement',
    title: 'Senior Business Development & Enablement Manager',
    org: 'Visiativ–ABGI',
    dates: 'Feb 2023 – May 2024',
    years: '2023–2024',
    tint: '125, 211, 203',
    figure: '30+ BDMs, research time halved',
    beats: [
      'Purchased leads of uneven quality reaching sellers, and prospecting and qualification that needed shared standards.',
      'Wrote playbooks for discovery, qualification and account research; ran recurring team training and one-to-one coaching on a steady operating cadence with Salesforce discipline. With IT, I co-designed and piloted an AI-assisted research step.',
      'About 60 people, including 30+ business development managers I enabled and coached (not direct reports), with each change coordinated across Sales, Marketing, Legal, IT and leadership.',
      'Part of a broader program tied to 40% higher conversion and 30% faster ramp, with $2.5M+ in quarterly pipeline supported. Research time per lead fell from 20–30 minutes to 5–10, time the BDMs got back for selling.',
    ],
    numbers: [
      { value: '+40%', label: 'conversion, broader program' },
      { value: '30%', label: 'faster ramp, broader program' },
      { value: '$2.5M+', label: 'quarterly pipeline supported' },
    ],
  },
  {
    id: 'ai-systems',
    skill: 'Building with AI',
    cardTitle: 'Self-directed',
    cardProof: '4 AI systems with test results',
    progress: true,
    short: 'AI systems',
    title: 'Building with AI',
    org: 'Self-directed',
    dates: 'May 2024 – present',
    years: '2024–now',
    tint: '196, 236, 234',
    figure: '4 public case studies',
    extraRoles: [
      { title: 'AI and business systems development', org: 'alongside family caregiving', dates: 'May 2024 – Jun 2026' },
      { title: 'Response Flow Systems', org: 'an ongoing side project for building AI skills', dates: 'Jun 2026 – present' },
    ],
    beats: [
      'Capable AI tools, with no dependable way to know when their output is good enough to act on.',
      'Built hands-on in Python and SQLite: workflows with defined stages, evidence requirements, tests, and a person approving anything consequential. I direct AI coding agents in bounded steps and review what comes back.',
      'The people who would have to rely on them. Consequential steps wait for a person, and anything ambiguous stops instead of guessing.',
      'Four public case studies, each with its tests and its limits written down. Self-directed, separate from my paid roles, and still growing.',
    ],
    numbers: [
      { value: '222/222', label: 'tests passing, Job Opportunity Engine' },
      { value: '186/186', label: 'tests passing, Response Flow Systems' },
    ],
  },
];

// The problems most revenue and customer teams have, each with my result and a link to how I did it.
export const solved = [
  { problem: 'A renewal at risk to a competitor', result: 'Kept, without discounting', role: 'vessel-brand', href: '#vessel-brand-story' },
  { problem: 'Sellers spending 20–30 minutes researching each purchased lead', result: 'Cut to 5–10 minutes, adopted by 30+ BDMs', role: 'visiativ', href: '#visiativ-story' },
  { problem: 'Growing deal size across an existing book', result: 'Average deal size up ~35%', role: 'vessel-brand', href: '#vessel-brand' },
  { problem: 'Recurring revenue across ~30 B2B accounts', result: 'Up ~30% through retention, expansion and new accounts', role: 'apex-labs', href: '#apex-labs-story' },
  { problem: 'Seller conversion and ramp time', result: '+40% conversion and 30% faster ramp, as part of a broader program', role: 'visiativ', href: '#visiativ' },
  { problem: 'Customers lost to competitors', result: 'Won back, typically within one to three months', role: 'right-choice', href: '#right-choice-story' },
  { problem: 'Unpaid rent at a 250-unit community', result: 'Down ~5–8%, with 92–95% occupancy', role: 'wasatch', href: '#wasatch-story' },
  { problem: 'A service company with no operating system yet', result: 'Built to 56 people with ~90% client retention', role: 'right-choice', href: '#right-choice' },
];

export const record = [
  { dates: 'Jun 2026 – present', title: 'Response Flow Systems', org: 'Side project: governed AI operations systems' },
  { dates: 'May 2024 – Jun 2026', title: 'AI and business systems development', org: 'Professional development, alongside family caregiving' },
  { dates: 'Feb 2023 – May 2024', title: 'Senior Business Development & Enablement Manager', org: 'Visiativ–ABGI' },
  { dates: 'May 2021 – Mar 2023', title: 'Director of Sales', org: 'Vessel Brand' },
  { dates: 'May 2017 – Apr 2021', title: 'Senior Manager, Client Operations & Accounts', org: 'Apex Labs LLC' },
  { dates: 'Jul 2010 – Oct 2013', title: 'Assistant Manager / Finance Manager', org: 'Wasatch Property Management' },
  { dates: 'Feb 2010 – Mar 2020', title: 'Realtor (part-time, concurrent)', org: 'Ralph Realty Inc.' },
  { dates: 'Jan 2003 – Feb 2013', title: 'Co-Founder & CEO', org: 'Right Choice Security' },
];

export type Project = {
  slug: string;
  name: string;
  short: string;
  line: string;
  status: string;
  proof: string;
  evidence: { label: string; href: string };
};

// Order matches the existing public case-study navigation.
export const projects: Project[] = [
  {
    slug: 'job-opportunity-engine',
    name: 'Job Opportunity Engine',
    short: 'JOE',
    line: 'Weighs job openings consistently and drafts only claims I can prove. I approve everything.',
    status: 'Private Python and SQLite system',
    proof: '222 of 222 tests passing',
    evidence: { label: 'Validation snapshot on GitHub', href: 'https://github.com/matt-rfs/matthew-ralph-work-samples/blob/main/job-opportunity-engine/validation-snapshot.md' },
  },
  {
    slug: 'response-flow-systems',
    name: 'Response Flow Systems',
    short: 'RFS',
    line: 'Designed to keep new leads from going cold between handoffs, with a person approving what goes out.',
    status: 'Offline governance infrastructure, live runtime held',
    proof: '186 of 186 tests passing',
    evidence: { label: 'Validation snapshot on GitHub', href: 'https://github.com/matt-rfs/matthew-ralph-work-samples/blob/main/response-flow-systems/validation-snapshot.md' },
  },
  {
    slug: 'personal-intelligence-refinery',
    name: 'Personal Intelligence Refinery',
    short: 'PIR',
    line: 'Turns outside research into claims a person has checked before anyone relies on them.',
    status: 'Private, local-first; bounded hosted-model validation',
    proof: '6 proposals reviewed: 5 accepted, 1 rejected',
    evidence: { label: 'Curated work sample on GitHub', href: 'https://github.com/matt-rfs/matthew-ralph-work-samples/tree/main/personal-intelligence-refinery' },
  },
  {
    slug: 'ai-systems-reliability-lab',
    name: 'AI Systems Reliability Lab',
    short: 'Lab',
    line: 'Four tests of when AI output is good enough to act on, and when to stop and ask.',
    status: 'Public repository',
    proof: '14 of 14 failures traced to the right stage',
    evidence: { label: 'Lab repository on GitHub', href: 'https://github.com/matt-rfs/ai-systems-reliability-lab' },
  },
];

export const lenses = [
  {
    id: 'ai',
    tab: 'AI deployment and programs',
    lit: ['visiativ', 'ai-systems'],
    need: 'For teams whose AI pilots haven’t yet become the way work gets done.',
    proof: [
      'Co-designed an AI research step with IT inside a live sales workflow, piloted it, trained 30+ BDMs and got it adopted. Research time per lead fell from 20–30 minutes to 5–10, time the BDMs got back for selling.',
      'Designs governed workflows with stages, evidence gates, validation, human approval and evaluation, documented in four public case studies.',
      'Two decades of the hard part: getting people to adopt a new way of working.',
    ],
    read: [
      { label: 'The AI research step', href: '#visiativ-story' },
      { label: 'The four AI case studies', href: '#work' },
    ],
    titles: 'AI Deployment Strategist, AI Program Manager, AI Enablement and Change, Technical and Agentic Enablement',
  },
  {
    id: 'enablement',
    tab: 'Revenue enablement',
    lit: ['vessel-brand', 'visiativ'],
    need: 'For sales organizations where training isn’t yet changing what happens in the field.',
    proof: [
      'Enabled and coached 30+ BDMs, in an audience of about 60, inside a program tied to 40% higher conversion and 30% faster ramp.',
      'Wrote the playbooks and ran recurring training, one-to-one coaching and the operating cadence behind them.',
      'Led 15 quota-carrying account executives at Vessel Brand; the team hit quota in about 88% of months.',
    ],
    read: [
      { label: 'Visiativ: playbooks, coaching and the AI step', href: '#visiativ' },
      { label: 'Vessel: moving a team to consultative discovery', href: '#vessel-brand' },
    ],
    titles: 'Revenue or Sales Enablement Manager, Learning and Enablement Program Manager, Technical Enablement Lead',
  },
  {
    id: 'ops',
    tab: 'Customer success and operations',
    lit: ['wasatch', 'apex-labs', 'right-choice'],
    need: 'For customer and revenue teams losing accounts, money or time to broken handoffs and follow-through.',
    proof: [
      'Apex Labs: recurring revenue up about 30% across roughly 30 B2B accounts, through retention, expansion and new accounts.',
      'Vessel Brand: kept an at-risk renewal by finding the real problem instead of discounting.',
      'Wasatch: unpaid rent down about 5–8% at a 250-unit community, with occupancy at 92–95%.',
    ],
    read: [
      { label: 'Apex: three revenue levers', href: '#apex-labs-story' },
      { label: 'Vessel: the renewal I didn’t discount', href: '#vessel-brand-story' },
      { label: 'Wasatch: cutting unpaid rent', href: '#wasatch-story' },
    ],
    titles: 'Strategic Customer Success Manager, Customer Success Operations, Sales Operations Manager, Commercial and Business Operations',
  },
  {
    id: 'sales',
    tab: 'Sales leadership',
    lit: ['right-choice', 'vessel-brand', 'visiativ'],
    need: 'For teams that need someone to lead people and own the number.',
    proof: [
      'Director of Sales at Vessel Brand: 15 quota-carrying account executives, about $60K monthly quota each; the team hit quota in about 88% of months.',
      'Average deal size up about 35%, while personally managing a $2M+ account portfolio.',
      'Co-founded and ran a company that grew to 56 people, and won back customers lost to competitors within one to three months.',
    ],
    read: [
      { label: 'Vessel: the renewal I didn’t discount', href: '#vessel-brand-story' },
      { label: 'Right Choice: winning customers back', href: '#right-choice-story' },
    ],
    titles: 'Sales Manager, Regional Sales Manager, Director of Sales',
  },
];

// Where Matthew comes from, in his words (2026-10-25).
export const personal = {
  nightTitle: 'AI does the reps. A person makes the call.',
  nightLine:
    'At 19 I refereed soccer in Spain: watch the play, then make the call. That’s how I build with AI.',
  origin:
    'I competed in gymnastics until soccer took over. At 14 I played in Italy, Austria, Germany and the Netherlands. From 15 to 19 I coached gymnastics, my first real job. At 19 I refereed soccer in Spain and sold fine jewelry and luxury watches.',
  offClock: 'Off the clock: riding my green Indian Scout Bobber, skydiving, and science fiction where the AI is a partner, not a replacement.',
  engineCaption: 'Built from parts. Still tuning it.',
};

// Hero: who, the lanes, and the proof row. Team and revenue proof first, AI last.
export const profile = {
  lanes: ['Sales leadership', 'Enablement', 'Operations', 'AI programs'],
  status: 'Relocating to North County San Diego (Carlsbad, Oceanside) now. Open to remote. Currently in Alameda, CA.',
  portraitAlt: 'Matthew Ralph, smiling, in a navy blazer over a white T-shirt',
};

// The first screen's answer to "can he fix what we're dealing with?": the problem in a hiring manager's words,
// then the number that shows it was solved. Same claims and scopes as the tour and "Sound familiar?". Each points at
// the layer (role) it came from: hovering or focusing it lifts that layer out of the hero's stack; clicking opens its story.
export const heroFixes: { problem: string; num: string; result: string; role: string }[] = [
  { problem: 'Numbers that swing', num: '88%', result: 'of months my 15 AEs hit quota; deal size up\u00a035%', role: 'vessel-brand' },
  { problem: 'New tools, old habits', num: '5–10', result: 'minutes of research per lead, down from 20\u2060–\u206030', role: 'visiativ' },
  { problem: 'Customers drifting away', num: '+30%', result: 'recurring revenue across ~30 B2B accounts', role: 'apex-labs' },
  { problem: 'Starting from zero', num: '56', result: 'people in a company I co‑founded; ~90% of clients kept', role: 'right-choice' },
];

export const contact = {
  email: 'sales.success@gmail.com',
  // every "Compare notes for 15 minutes" button: a 15-minute Calendly event (Matthew, 2026-10-27)
  booking: 'https://calendly.com/sales-success_matt_ralph/meet-and-greet-with-matt-sig',
  linkedin: 'https://www.linkedin.com/in/salessuccess/',
  github: 'https://github.com/matt-rfs/matthew-ralph-work-samples',
  location: 'Alameda, California',
};

// The studio: the glass stack comes apart along one axis, one role at a time. One number per role, in real type.
export type Moment = {
  role: string; // the card that comes forward
  skill: string;
  from?: string; // shown first, then struck through (a before → after)
  num: string;
  line: string;
  who: string; // title, company · years
};
export const moments: Moment[] = [
  {
    role: 'right-choice',
    skill: 'Building and running a company',
    num: '56',
    line: 'people, built from scratch. About 90% of clients kept.',
    who: 'Co-Founder & CEO, Right Choice Security · 2003–2013',
  },
  {
    role: 'ralph-realty',
    skill: 'Building the financial case',
    num: '~$750K',
    line: 'a month in sales, advising investors on returns, financing and risk.',
    who: 'Realtor, Ralph Realty · part-time, alongside · 2010–2020',
  },
  {
    role: 'apex-labs',
    skill: 'Growing accounts after the sale',
    num: '+30%',
    line: 'recurring revenue across about 30 B2B accounts.',
    who: 'Senior Manager, Client Operations & Accounts, Apex Labs · 2017–2021',
  },
  {
    role: 'vessel-brand',
    skill: 'Leading a sales team',
    num: '+35%',
    line: 'average deal size. 15 account executives; the team hit quota in about 88% of months.',
    who: 'Director of Sales, Vessel Brand · 2021–2023',
  },
  {
    role: 'visiativ',
    skill: 'Enablement at scale',
    from: '20–30',
    num: '5–10',
    line: 'minutes of research per lead. 30+ BDMs got that time back for selling.',
    who: 'Senior Business Development & Enablement Manager, Visiativ–ABGI · 2023–2024',
  },
  {
    role: 'ai-systems',
    skill: 'Building with AI',
    num: '4',
    line: 'AI systems, built hands-on, with test results. Still building.',
    who: 'Self-directed · 2024–now',
  },
];

// Straight answers: the questions a careful hiring manager asks, answered in a sentence or two.
// Ordered by what a hiring manager asks first. Coaching and the first 90 days are in Matthew's words (2026-10-26).
export const answers: { id: string; q: string; a: string }[] = [
  {
    id: 'path',
    q: 'Your path isn’t a straight line. What ties it together?',
    a: 'Teams that perform. Each role added a skill I still use: running a company, leading sellers, growing accounts, building the financial case, coaching at scale. Together they let me see a problem from every seat: owner, manager, seller and customer.',
  },
  {
    id: 'ninety',
    q: 'What would your first 90 days look like?',
    a: 'Listen and learn first: how the team sells, where the time goes, what the numbers say. Then pick what’s worth improving, and bring the reps into the change so it’s theirs before it’s a rule. Then build the weekly rhythm that keeps it working.',
  },
  {
    id: 'coaching',
    q: 'What’s your coaching style?',
    a: 'Like a spotter. I stay close while someone learns a skill, then step back as they land it on their own. No two reps get the same coaching: each one responds to different motivation and encouragement, so I fit it to the person. The goal is a team that makes good calls without me in the room.',
  },
  {
    id: 'direct',
    q: 'How much of your leadership was direct?',
    a: 'I ran a 56-person company. Fifteen account executives reported to me at Vessel Brand. At Visiativ–ABGI I enabled and coached 30+ BDMs who weren’t my reports.',
  },
  {
    id: 'push-ai',
    q: 'Would you come in and push AI on my team?',
    a: 'No. AI is a skill I bring, not a plan I’d arrive with. I’d learn how your team works first, and use AI only where it gives people back time.',
  },
  {
    id: 'technical',
    q: 'How technical are you?',
    a: 'I design the workflows, direct AI coding agents in bounded steps, and test the results in Python and SQLite. I’m not a software or ML engineer.',
  },
  {
    id: 'ai-approach',
    q: 'How would you approach AI with my team?',
    a: 'The way I’d approach any change: learn how the team works first, find the step that eats their time, and build one AI-assisted fix with them. If it gives people time back, it spreads. AI does the reps; a person makes the call.',
  },
  {
    id: 'enable-method',
    q: 'How do you run enablement?',
    a: 'As a cycle, not an event. Listen and learn what the team needs. Write playbooks they’ll actually use. Coach one-to-one, fitted to each rep. Reinforce it with a weekly rhythm. Then measure what moved: ramp, conversion, time saved.',
  },
  {
    // tools Matthew has worked in (2026-10-26); only what he confirmed, older tools he couldn't name left out
    id: 'tools',
    q: 'What tools have you worked in?',
    a: 'Salesforce and HubSpot for CRM, Outreach and Salesloft for outreach sequences, and LinkedIn Sales Navigator for prospecting. Gong and similar call-recording tools for coaching from real calls. I also turn screen recordings into step-by-step PDF guides. New tools are the easy part; getting a team to actually use them is the job.',
  },
  {
    id: 'gap',
    q: 'What happened between 2024 and 2026?',
    a: 'Family caregiving. During it I built the four AI systems on this page.',
  },
  {
    id: 'start',
    q: 'Where did you start?',
    a: 'Gymnastics, then soccer: at 14 I played in Italy, Austria, Germany and the Netherlands. From 15 to 19 I coached gymnastics, and at 19 I refereed soccer in Spain and sold fine jewelry and luxury watches.',
  },
];

// An outside voice: a LinkedIn recommendation, quoted word for word (first paragraph), shared by Matthew 2026-10-26.
export const voice = {
  quote: 'Matt is an amazing communicator. He breaks down conversations and requests clearly and concisely whilst providing in-depth knowledge and insight.',
  name: 'George Oram',
  role: 'VP of Engineering and Product Design',
  source: 'LinkedIn recommendation',
};

// What a hiring manager is wrestling with, said the way they'd say it; a quiet reframe of what's really going on;
// then proof that it's been solved before. Rapport first, then evidence, never a hard sell.
export const pitch: { problem: string; insight: string; proof: string; story: string }[] = [
  {
    problem: 'We bought the AI tools. The team still does it the old way.',
    insight: 'It’s rarely the tool. People adopt what saves them time on Monday morning, so start with one step and make it theirs.',
    proof: 'That’s how 30+ BDMs went from 20–30 minutes of research per lead to 5–10.',
    story: 'visiativ',
  },
  {
    problem: 'The talent is there, but the numbers swing month to month.',
    insight: 'Consistency comes from rhythm, not pressure: the same discovery, planning and coaching, every week.',
    proof: 'My 15 AEs hit quota in about 88% of months, and average deal size grew 35%.',
    story: 'vessel-brand',
  },
  {
    problem: 'Training happens. Then nothing changes in the field.',
    insight: 'A session doesn’t change a habit. Playbooks people actually use, and one-to-one coaching, do.',
    proof: 'That was my part of a program that saw 40% higher conversion and 30% faster ramp.',
    story: 'visiativ',
  },
  {
    problem: 'Good customers quietly drift away between handoffs.',
    insight: 'Accounts rarely leave all at once. A clean lifecycle and regular check-ins catch the drift early.',
    proof: 'Recurring revenue up about 30% across ~30 B2B accounts.',
    story: 'apex-labs',
  },
];

// Three front doors to one story. The homepage is the general version; /ai/ and /enablement/ tell the same facts with
// that role's evidence first (Matthew, 2026-10-26: "AI-first front door if done subtly yet well"; enablement addressed).
// Same design, same claims and scopes; only the order, the headline and the first proofs change.
type Fix = (typeof heroFixes)[number];
export type FrontDoor = {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  lanes: string[];
  t1: string;
  t2: string;
  fixes: Fix[];
  pitch: typeof pitch;
  answers: typeof answers;
  workFirst?: boolean; // the AI work comes straight after the hero
  labLede: string;
};
const fix = (problem: string) => heroFixes.find((f) => f.problem === problem)!;
const ask = (...ids: string[]) => ids.map((id) => answers.find((a) => a.id === id)!);

export const frontDoors: Record<'general' | 'ai' | 'enablement', FrontDoor> = {
  general: {
    path: '/',
    title: 'Matthew Ralph: building teams that perform',
    description: 'I build teams that perform: a company grown to 56 people, a 15-AE sales team, 30+ BDMs coached. Now adding AI as a hands-on skill.',
    ogTitle: 'I build teams that perform.',
    ogDescription: 'And I keep adding skills that help them. The newest one is AI.',
    lanes: profile.lanes,
    t1: 'I build teams that perform.',
    t2: 'And I keep adding skills that help them. The newest one is AI.',
    fixes: heroFixes,
    pitch,
    answers: ask('path', 'ninety', 'coaching', 'direct', 'push-ai', 'technical', 'gap', 'start'),
    labLede: 'Four systems, built on my own time since 2024.',
  },
  ai: {
    path: '/ai/',
    title: 'Matthew Ralph: helping teams actually use AI',
    description: 'I help teams actually use the AI they bought: 30+ BDMs adopted an AI research step I co-designed with IT, cutting research per lead from 20–30 minutes to 5–10. Four AI systems built hands-on, each with a case study.',
    ogTitle: 'I help teams actually use the AI they bought.',
    ogDescription: 'Twenty years of getting people to adopt new ways of working. Now I build with AI hands-on, too.',
    lanes: ['AI programs', 'Enablement', 'Sales leadership', 'Operations'],
    t1: 'I help teams actually use the AI they bought.',
    t2: 'Twenty years of getting people to adopt new ways of working. Now I build with AI hands-on, too.',
    fixes: [
      fix('New tools, old habits'),
      { problem: 'Pilots that stall', num: '30+', result: 'BDMs using an AI step I co‑designed with IT', role: 'visiativ' },
      { problem: 'Can we trust the output?', num: '4', result: 'AI systems built hands-on, each tested, with human sign-off', role: 'ai-systems' },
      fix('Starting from zero'),
    ],
    pitch: [pitch[0], pitch[2], pitch[1], pitch[3]],
    answers: ask('ai-approach', 'technical', 'ninety', 'path', 'coaching', 'direct', 'gap', 'start'),
    workFirst: true,
    labLede: 'Four systems, built hands-on since 2024. Each has a full case study.',
  },
  enablement: {
    path: '/enablement/',
    title: 'Matthew Ralph: enablement that changes what happens in the field',
    description: 'Enablement that sticks: playbooks people use, coaching fitted to each rep, and a weekly rhythm. 30+ BDMs coached inside a program tied to 40% higher conversion and 30% faster ramp.',
    ogTitle: 'I build teams that perform.',
    ogDescription: 'With playbooks people use, coaching that fits each rep, and a rhythm that makes it stick.',
    lanes: ['Enablement', 'Sales leadership', 'Operations', 'AI programs'],
    t1: 'I build teams that perform.',
    t2: 'With playbooks people use, coaching that fits each rep, and a rhythm that makes it stick.',
    fixes: [
      { problem: 'Training that doesn’t stick', num: '30%', result: 'faster ramp, in a program I wrote the playbooks for', role: 'visiativ' },
      { problem: 'Too many reps, too few coaches', num: '30+', result: 'BDMs coached one-to-one and in team sessions', role: 'visiativ' },
      fix('New tools, old habits'),
      fix('Numbers that swing'),
    ],
    pitch: [pitch[2], pitch[0], pitch[1], pitch[3]],
    answers: ask('enable-method', 'tools', 'ninety', 'coaching', 'direct', 'path', 'push-ai', 'technical', 'gap', 'start'),
    labLede: 'Four systems, built on my own time since 2024.',
  },
};
