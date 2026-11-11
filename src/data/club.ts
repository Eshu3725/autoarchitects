/**
 * Single source of truth for club content shown on the public site.
 * Everything here is drawn from the previous site copy or is visible in the
 * team's own photos. Fields marked TODO need confirmation from the team.
 */
import car150Track from '@/assets/web/car150-track.jpg';
import m37Pits from '@/assets/web/m37-pits.jpg';
import car96 from '@/assets/web/car96.jpg';
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
  institute: 'Siddaganga Institute of Technology',
  city: 'Tumakuru, Karnataka',
  founded: 2008,
  motto: 'One Team One Dream',
  email: 'autoarchitects@gmail.com',
  nowBuilding: 'ATVC India 2026',
};

export const STATS = [
  { value: '2008', label: 'Established', note: 'Seasons of student-built machines' },
  { value: '10+', label: 'ATVs built', note: 'Designed & fabricated in-house' },
  { value: '35+', label: 'Student engineers', note: 'Across six sub-teams' },
  { value: '10+', label: 'Awards', note: 'Design, durability & craftsmanship' },
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
    body: 'Technical inspection, static design events, dynamic events and endurance at BAJA SAE India and ATVC, judged on engineering as much as speed.',
    tags: ['Tech inspection', 'Dynamics', 'Endurance'],
  },
];

/* ── The garage: machines the team has built ──────────────────────── */
export interface Machine {
  plate: string;
  name: string;
  meta: string;
  note: string;
  image: string;
  /** Archive screenshots have a white frame baked in; zoom to crop it. */
  cropFrame?: boolean;
  latest?: boolean;
}

// TODO(team): add the season/year for each machine once confirmed.
export const GARAGE: Machine[] = [
  {
    plate: 'M37',
    name: 'BAJA SAEINDIA 2025',
    meta: 'mBAJA · Combustion',
    note: 'Cleared the technical inspection round at BAJA SAEINDIA 2025.',
    image: m37Pits,
    latest: true,
  },
  {
    plate: '150',
    name: 'Imagination 4.0',
    meta: 'Combustion · Briggs & Stratton',
    note: 'Fourth generation of the Imagination line, with flame livery and hex-mesh body panels.',
    image: car150,
  },
  {
    plate: 'E65',
    name: 'Electric build',
    meta: 'eBAJA · Electric',
    note: "The team's electric-drivetrain ATV, built for the SAEINDIA eBAJA category.",
    image: carE65,
    cropFrame: true,
  },
  {
    plate: '98',
    name: 'Imagination 3.0',
    meta: 'Combustion',
    note: 'Third car of the Imagination series, with teal suspension and a full front bulkhead panel.',
    image: car98,
    cropFrame: true,
  },
  {
    plate: '96',
    name: 'BAJA for Life',
    meta: 'Combustion',
    note: 'Yellow-arm build on Fox shocks, one of the most photographed cars in the paddock.',
    image: car96,
  },
  {
    plate: '53',
    name: 'Auto Architects V2',
    meta: 'Combustion · Early era',
    note: 'The second-generation Auto Architects car, from the early years of the team.',
    image: car53,
    cropFrame: true,
  },
];

/* ── Competition record / timeline ───────────────────────────────── */
export interface RecordEntry {
  year: string;
  event: string;
  detail: string;
  result: string;
  members?: string;
  status?: 'live' | 'award' | 'result' | 'milestone';
}

export const RECORD: RecordEntry[] = [
  { year: '2026', event: 'ATVC India 2026', detail: 'Next event: machine in build', result: 'In build', members: '30+', status: 'live' },
  { year: '2025', event: 'BAJA SAEINDIA 2025', detail: 'Car M37', result: 'Tech cleared', members: '30+', status: 'result' },
  { year: '2020', event: 'Champions of Champions', detail: 'Technical design & manufacturing quality', result: 'Awarded', members: '30+', status: 'award' },
  { year: '2016', event: 'National recognition', detail: 'Team milestone', result: 'Milestone', members: '30+', status: 'milestone' },
  { year: '2010', event: 'BAJA SAEINDIA 2010', detail: 'First competition', result: 'P37 / 180', members: '25+', status: 'result' },
  { year: '2008', event: 'Team founded', detail: 'Siddaganga Institute of Technology', result: 'Est.', members: '10+', status: 'milestone' },
];

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
