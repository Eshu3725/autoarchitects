/**
 * Single source of truth for club content shown on the public site.
 * Source: the team's BAJA SAEINDIA 2027 sponsorship brochure (team docket,
 * contacts, sponsorship scheme), plus the team's own photos.
 * Fields marked TODO need confirmation from the team.
 */
import car150Track from '@/assets/web/car150-track.jpg';
import m37Pits from '@/assets/web/m37-pits.jpg';
import car96 from '@/assets/web/car96.jpg';
import car2016 from '@/assets/web/car2016.jpg';
import chassisShakedown from '@/assets/web/chassis-shakedown.jpg';
import teamBaja2025 from '@/assets/web/team-baja2025.jpg';
import car53 from '@/assets/car1.png';
import car98 from '@/assets/car2.jpg';
import car150 from '@/assets/car5.png';
import carE65 from '@/assets/Ecar.png';
import {
  Box,
  Waves,
  Navigation as SteeringIcon,
  Disc3,
  Cog,
  ClipboardList,
  PenTool,
  Cpu,
  Flame,
  Gauge,
  Flag,
  type LucideIcon,
} from 'lucide-react';

export const IMAGES = { car150Track, m37Pits, car96, chassisShakedown, teamBaja2025 };

export const CLUB = {
  name: 'Team AutoArchitects',
  longName: 'Auto Architects Motorsports Team',
  institute: 'Siddaganga Institute of Technology',
  department: 'Department of Mechanical Engineering',
  city: 'Tumakuru, Karnataka',
  founded: 2010,
  crew: 25,
  motto: 'Learn · Build · Compete',
  tagline: 'Where ideas take shape and the future is built',
  email: 'autoarchitects@gmail.com',
  instagram: '@autoarchitects',
  nowBuilding: 'BAJA SAEINDIA 2027',
};

export const STATS = [
  { value: String(CLUB.founded), label: 'Established', note: 'Dept. of Mechanical Engineering, SIT' },
  // TODO(team): the brochure's "About team" text says 5 ATVs; its team docket shows 9 cars.
  { value: '9', label: 'ATVs raced', note: 'Designed & fabricated in-house' },
  { value: String(CLUB.crew), label: 'Student engineers', note: 'Across six sub-teams' },
  { value: '1st', label: 'Overall · CoC 2020', note: 'Champions of Champions, with car 150' },
];

/* ── Subsystems: map 1:1 to the team's real departments ─────────────── */
export type SubsystemId = 'chassis' | 'suspension' | 'steering' | 'brakes' | 'transmission' | 'operations';

export interface Subsystem {
  id: SubsystemId;
  code: string;
  name: string;
  team: string;
  anchor: string; // section id on /members
  icon: LucideIcon;
  summary: string;
  onDrawing: boolean;
}

export const SUBSYSTEMS: Subsystem[] = [
  {
    id: 'chassis',
    code: '01',
    name: 'Chassis & CAE',
    team: 'Chassis / CAE',
    anchor: 'chassis-team',
    icon: Box,
    summary:
      "The roll cage is the car's skeleton and the driver's survival cell. It is laid out to the rulebook, verified with FEA, then cut, notched and welded by hand.",
    onDrawing: true,
  },
  {
    id: 'suspension',
    code: '02',
    name: 'Suspension',
    team: 'Suspension',
    anchor: 'suspension-team',
    icon: Waves,
    summary:
      'Independent suspension with coilover shocks soaks up jumps, rocks and ruts while keeping all four tyres in contact with the dirt.',
    onDrawing: true,
  },
  {
    id: 'steering',
    code: '03',
    name: 'Steering',
    team: 'Steering',
    anchor: 'steering-team',
    icon: SteeringIcon,
    summary:
      'Steering geometry tuned for a tight turning radius and predictable feedback on loose, uneven surfaces.',
    onDrawing: true,
  },
  {
    id: 'brakes',
    code: '04',
    name: 'Brakes',
    team: 'Brakes',
    anchor: 'brakes-team',
    icon: Disc3,
    summary:
      'Hydraulic disc brakes that have to lock every wheel on demand. It is a pass/fail check at technical inspection, so there is no margin for error.',
    onDrawing: true,
  },
  {
    id: 'transmission',
    code: '05',
    name: 'Transmission',
    team: 'Transmission',
    anchor: 'transmission-team',
    icon: Cog,
    summary:
      'Engine-to-wheel power delivery. Gearing and reduction are matched to the engine for acceleration, hill-climb and four hours of endurance.',
    onDrawing: true,
  },
  {
    id: 'operations',
    code: '06',
    name: 'Operations',
    team: 'Operations',
    anchor: 'operations-team',
    icon: ClipboardList,
    summary:
      'Sponsorship, budgets, logistics, design reports and the cost event: the team that keeps the car funded, documented and on the trailer.',
    onDrawing: false,
  },
];

/* ── A season, as a manufacturing route sheet ─────────────────────── */
export const BUILD_STAGES = [
  {
    op: 'OP-10',
    title: 'Design',
    icon: PenTool,
    body: 'Rulebook first. The car is laid out in CAD around driver ergonomics, suspension geometry and the competition safety rules.',
    tags: ['CAD', 'Rulebook', 'Ergonomics'],
  },
  {
    op: 'OP-20',
    title: 'Analyse',
    icon: Cpu,
    body: 'The CAE team runs the roll cage and key components through FEA (impact, rollover and torsion cases) before a single tube is cut.',
    tags: ['FEA', 'Load cases', 'Iteration'],
  },
  {
    op: 'OP-30',
    title: 'Fabricate',
    icon: Flame,
    body: 'Tubes are cut, notched and welded into the chassis in-house. Mounts, hubs and brackets are machined, fitted and assembled.',
    tags: ['Notching', 'Welding', 'Machining'],
  },
  {
    op: 'OP-40',
    title: 'Test',
    icon: Gauge,
    body: 'Shakedown runs on dirt. Suspension gets tuned, brakes bedded in and the drivetrain debugged. Things break here so they hold up at the event.',
    tags: ['Shakedown', 'Tuning', 'Validation'],
  },
  {
    op: 'OP-50',
    title: 'Compete',
    icon: Flag,
    body: 'Technical inspection, static design, cost and sales events, dynamic events and the four-hour endurance race, judged on engineering as much as speed.',
    tags: ['Tech inspection', 'Dynamics', 'Endurance'],
  },
];

/* ── The garage: machines the team has built ──────────────────────── */
export interface Machine {
  /** Competition number, when known. */
  plate?: string;
  name: string;
  season?: string;
  meta: string;
  /** Vehicle mass as published in the team docket. */
  mass?: string;
  note: string;
  image?: string;
  /** Archive screenshots have a white frame baked in; zoom to crop it. */
  cropFrame?: boolean;
  /** The car currently being built (no photo yet). */
  inBuild?: boolean;
}

export const GARAGE: Machine[] = [
  {
    name: 'Under wraps',
    season: '2027',
    meta: 'BAJA SAEINDIA 2027 · IC engine',
    note: 'The next ATV is in design and fabrication now, built to the SAE rulebook around an IC engine.',
    inBuild: true,
  },
  {
    plate: 'M47',
    name: 'Fair Play winner',
    season: '2026',
    meta: 'Combustion',
    note: 'Overall AIR 11. AIR 9 in design and endurance, AIR 7 in the business plan. Won the Fair Play Award and was second runner-up for Best Innovation.',
  },
  {
    plate: 'M37',
    name: 'First-ever 4×4',
    season: '2025',
    meta: 'Combustion · 4WD',
    note: "The team's first four-wheel-drive ATV. Overall AIR 39. 2nd in Karnataka in Phase I, and 1st in Karnataka in the sales event.",
    image: m37Pits,
  },
  {
    plate: 'E65',
    name: 'Electric build',
    season: '2025',
    meta: 'eBAJA · Electric',
    note: 'Overall AIR 21, AIR 8 in the design finals and AIR 4 in sales. The 3rd-lightest car among 95 teams.',
    image: carE65,
    cropFrame: true,
  },
  {
    plate: '59',
    name: 'Endurance runner',
    season: '2025',
    meta: 'Combustion',
    note: 'AIR 11 in the endurance race and AIR 15 in acceleration.',
  },
  {
    plate: '150',
    name: 'Imagination 4.0',
    season: '2020',
    meta: 'Combustion · Briggs & Stratton',
    mass: '174.8 kg',
    note: 'Champion at Champions of Champions 2020. Ran 19 laps of the four-hour endurance without a failure and was picked in the top 7 for innovation.',
    image: car150,
  },
  {
    plate: '98',
    name: 'Imagination 3.0',
    season: '2019',
    meta: 'Combustion',
    mass: '200.6 kg',
    note: '1st in Karnataka and 50th of 350 teams in the virtual round, 10th in design presentation and 42nd overall in India.',
    image: car98,
    cropFrame: true,
  },
  {
    plate: '96',
    name: 'BAJA for Life',
    season: '2018',
    meta: 'Combustion',
    mass: '278 kg',
    note: '3rd in Karnataka in the virtual round. The yellow-arm build on Fox shocks.',
    image: car96,
  },
  {
    name: 'Imagination',
    season: '2016',
    meta: 'Combustion',
    mass: '339 kg',
    note: 'Cleared every technical test and drove the endurance race.',
    image: car2016,
    cropFrame: true,
  },
  {
    plate: '53',
    name: 'Auto Architects V2',
    season: '2012',
    meta: 'Combustion · Early era',
    mass: '380.2 kg',
    note: '37th of 180 teams in India, and AIR 39 in the virtual round.',
    image: car53,
    cropFrame: true,
  },
];

/* ── Competition record / timeline (newest first) ─────────────────── */
export interface RecordEntry {
  /** Season, when known. Undated entries show the car number instead. */
  year?: string;
  car?: string;
  event: string;
  /** Achievements, separated by " · ". */
  detail: string;
  result: string;
  status?: 'live' | 'award' | 'result' | 'milestone';
  /** Other cars the team ran the same season, each with its own results. */
  others?: { car: string; title: string; detail: string; result: string }[];
}

export interface RecordCarGroup {
  car?: string;
  title?: string;
  result?: string;
  achievements: string[];
}

export interface RecordRow extends Omit<RecordEntry, 'others'> {
  /** Every car in this entry, main car first. */
  cars: string[];
  /** Achievements grouped by car (one group when only one car ran). */
  groups: RecordCarGroup[];
}

const RECORD_ROWS: RecordEntry[] = [
  { year: '2027', event: 'BAJA SAEINDIA 2027', detail: 'IC-engine ATV in design and fabrication', result: 'In build', status: 'live' },
  {
    year: '2026',
    car: 'M47',
    event: 'ATVC Season 9',
    detail: `Fair Play Award · Design AIR 9 · Endurance AIR 9 · Business plan AIR 7 · Acceleration AIR 10 · Cost AIR 14 · Best Innovation 2nd runner-up · A crew of ${CLUB.crew} in the paddock`,
    result: 'AIR 11',
    status: 'award',
  },
  {
    year: '2025',
    car: 'M37',
    event: 'First-ever 4×4',
    detail: 'Phase I: 2nd in Karnataka, AIR 22 · Sales: 1st in Karnataka, AIR 8',
    result: 'AIR 39',
    status: 'result',
    others: [
      { car: 'E65', title: '3rd-lightest of 95', detail: 'Design finals AIR 8 · Sales event AIR 4', result: 'AIR 21' },
      { car: '59', title: 'Endurance & acceleration', detail: 'Endurance AIR 11 · Acceleration AIR 15', result: 'End. AIR 11' },
    ],
  },
  {
    year: '2020',
    car: '150',
    event: 'Champions of Champions',
    detail: '1st in endurance, design presentation and manoeuvrability',
    result: '1st overall',
    status: 'award',
  },
  {
    year: '2020',
    car: '150',
    event: 'BAJA SAEINDIA 2020',
    detail: '19 laps of the 4-hour endurance with no failure (P9) · Top 7 for innovation · Virtual round: 4th in Karnataka',
    result: 'AIR 30',
    status: 'result',
  },
  {
    year: '2019',
    car: '98',
    event: 'M-BAJA SAEINDIA 2019',
    detail: 'Virtual round: 1st in Karnataka, 50th of 350 · Design presentation P10 · 14 endurance laps',
    result: 'AIR 42',
    status: 'result',
  },
  { year: '2018', car: '96', event: 'Virtual round', detail: '3rd in Karnataka · 278 kg', result: 'P3 Karnataka', status: 'result' },
  { year: '2016', event: 'Tech & endurance', detail: 'Cleared every technical test and drove the endurance race · 339 kg', result: 'Tech cleared', status: 'result' },
  { year: '2012', car: '53', event: 'BAJA SAEINDIA 2012', detail: 'Virtual round AIR 39 · 380.2 kg', result: 'P37 / 180', status: 'result' },
  { year: '2010', event: 'Team founded', detail: `${CLUB.department}, SIT`, result: 'Est.', status: 'milestone' },
];

/** Keep "AIR" and its rank on the same line. */
const keepRank = (t: string) => t.replace(/AIR /g, 'AIR ');
const splitDetail = (d: string) => d.split(' · ').map(keepRank);

export const RECORD: RecordRow[] = RECORD_ROWS.map(({ others = [], ...r }) => {
  const groups: RecordCarGroup[] = [
    { car: r.car, result: others.length ? keepRank(r.result) : undefined, achievements: splitDetail(r.detail) },
    ...others.map((o) => ({ car: o.car, title: o.title, result: keepRank(o.result), achievements: splitDetail(o.detail) })),
  ];
  // Flat one-line summary for the About timeline.
  const detail = [r.detail, ...others.map((o) => `#${o.car}: ${o.title}, ${o.result}`)].join(' · ');
  return {
    ...r,
    detail: keepRank(detail),
    result: keepRank(r.result),
    cars: [r.car, ...others.map((o) => o.car)].filter((c): c is string => !!c),
    groups,
  };
});

export const VIDEOS = [
  {
    id: 's5r2IgRNKy8',
    title: 'Imagination 4.0',
    description: 'The design process and technical story behind the Imagination 4.0 build.',
  },
  {
    id: 'jJvIsFY4SLE',
    title: 'Offroad Hustle',
    description: 'Track-side: what it takes to keep a student-built ATV running on rough terrain.',
  },
  {
    id: '3iw9kQVrP6A',
    title: 'Team AutoArchitects',
    description: 'The people, the workshop and the team culture behind every machine.',
  },
];

export const BRANCHES = [
  'Mechanical',
  'Computer Science',
  'AI & Data Science',
  'Chemical',
];

/* ── Context: the competition and the institute ──────────────────── */
export const BAJA_FACTS = [
  { value: '1976', label: 'First Mini-Baja' },
  { value: '6', label: 'Host countries' },
  { value: '4', label: 'Days of events' },
  { value: '250+', label: 'Teams in India' },
];

export const SIT_FACTS = [
  { value: '1963', label: 'Established' },
  { value: '12', label: 'UG disciplines' },
  { value: '5000+', label: 'Students' },
  { value: '343', label: 'Faculty' },
];

/* ── People ──────────────────────────────────────────────────────── */
export interface Contact {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

/** Sponsor-facing contacts, as listed in the brochure. */
export const CONTACTS: Contact[] = [
  { name: 'Darshan H S', role: 'Captain', phone: '+91 87627 51648', email: 'darshanvaibhav2@gmail.com' },
  { name: 'Mithan Yadav H R', role: 'Vice Captain', phone: '+91 63665 60289', email: 'mithunyadavhr@gmail.com' },
  { name: 'Dr. B Sunil', role: 'Faculty Advisor · Asst. Professor', phone: '+91 99640 11547', email: 'sunilb@sit.ac.in' },
  { name: 'Dr. Naresh H', role: 'Faculty Advisor · Asst. Professor', phone: '+91 90084 89027', email: 'naresh@sit.ac.in' },
];

export const PATRONS: Contact[] = [
  { name: 'Dr. Virupaxi Auradi', role: 'Head of Department, Mechanical Engineering', email: 'hodmed@sit.ac.in' },
  { name: 'Dr. S V Dinesh', role: 'Principal, SIT Tumakuru', email: 'principal@sit.ac.in' },
];

/** Primary team phone (the captain), used in the footer and contact sheet. */
export const TEAM_PHONE = { display: CONTACTS[0].phone!, href: 'tel:+918762751648' };

/* ── Sponsorship ─────────────────────────────────────────────────── */
export const PARTNERS: { tier: string; names: string[] }[] = [
  { tier: 'Title', names: ['Siddaganga Institute of Technology'] },
  { tier: 'Major', names: ['AICTE', 'AICTE IDEA Lab'] },
  { tier: 'Manufacturing', names: ['Burnout by 3 Brothers Machination Pvt Ltd'] },
  { tier: 'Technical', names: ['SOLIDWORKS', 'Ansys', 'Altair', 'Lotus Engineering'] },
  { tier: 'Co-sponsors', names: ['Inner Wheel', 'Gosala Ventures'] },
];

export type TierId = 'title' | 'major' | 'associate' | 'technical' | 'workshop' | 'media';

export const TIERS: { id: TierId; code: string; name: string; amount: string; pitch: string }[] = [
  { id: 'title', code: '01', name: 'Title', amount: 'Above ₹3 lakh', pitch: 'You pick the colour of the car and the crew kit, and your name leads everything we do.' },
  { id: 'major', code: '02', name: 'Major', amount: '₹1 – 3 lakh', pitch: 'Your logo on the nose of the car, the driver’s helmet and the team apparel.' },
  { id: 'associate', code: '03', name: 'Associate', amount: 'Up to ₹1 lakh', pitch: 'Your logo on the sidepods and team apparel, and in every static presentation.' },
  { id: 'technical', code: '04', name: 'Technical', amount: 'In kind', pitch: 'Software, parts, tooling or services. Sidepod logo and a place in the pit sponsor corner.' },
  { id: 'workshop', code: '05', name: 'Workshop', amount: 'Event sponsor', pitch: 'Your brand on our workshops: city-wide banners, the auditorium and every certificate.' },
  { id: 'media', code: '06', name: 'Media partner', amount: 'Coverage', pitch: 'Sidepod logo, pit-corner presence and credit at the end of every team video.' },
];

/** What each tier receives. `true` = included; a string = included, with a qualifier. */
export const DELIVERABLES: { item: string; tiers: Partial<Record<TierId, true | string>> }[] = [
  { item: 'Choose the car colour & team apparel', tiers: { title: true } },
  { item: 'Logo on the nose of the car', tiers: { title: true, major: true } },
  { item: 'Logo on the driver’s helmet', tiers: { title: true, major: true } },
  { item: 'Logo on the car sidepods', tiers: { associate: true, technical: true, media: true } },
  { item: 'Logo on team apparel', tiers: { title: 'Front', major: true, associate: true, technical: true } },
  { item: 'Pit sponsor corner & promo video', tiers: { title: 'Top spot', major: true, technical: true, media: true } },
  { item: 'Static event presentation backdrop', tiers: { title: 'Lead', major: true, associate: true, technical: true, media: true } },
  { item: 'Media articles with the car', tiers: { title: true, major: true, associate: true, technical: true, workshop: true } },
  { item: 'Website link, logo & description', tiers: { title: true, major: true, associate: true, technical: true, workshop: true, media: true } },
  { item: 'Social media publicity', tiers: { title: 'Cover photo', major: true, associate: true, technical: true, workshop: true, media: true } },
  { item: 'Banners at unveiling, alumni meet & workshops', tiers: { title: true, major: true, associate: true, technical: true, media: true } },
  { item: 'Credit in team YouTube videos', tiers: { title: 'Start & end', major: 'Start & end', technical: 'End', workshop: 'Workshop videos', media: 'End' } },
  { item: 'Workshop banners, certificates & report', tiers: { workshop: true } },
];
