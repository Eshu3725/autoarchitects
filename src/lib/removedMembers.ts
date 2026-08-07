const REMOVED_EMAILS = new Set([
  'arjunm.kaveti@gmail.com',
  'dhanushggowdaa@gmail.com',
  'dhanushgowdaa@gmail.com',
  'incharakswamy31@gmail.com',
  'siddharth.s7060@gmail.com',
  'sharadhisimhachina@gmail.com',
  'dimplek5936@gmail.com',
  'deepakdeepuks75@gmail.com',
  'karthikkarthik19370@gmail.com',
  '1si25me409@sit.ac.in',
  'nikshithjagadeesh@gmail.com',
  'mdumarsiddiq5@gmail.com',
  'yashasms9125@gmail.com'
]);

const REMOVED_NAMES = new Set([
  'arjun m',
  'dhanush gowda',
  'inchara m.k',
  'siddharth s.',
  'sharadhi simha chi na',
  'dimple k',
  'karthik s',
  'kiran i',
  'mayur s',
  'nikshith j',
  'mohammed umar siddi',
  'mohammed umar siddiq',
  'yashas m.s'
]);

export const isRemovedMember = (member: { name?: string | null; email?: string | null }) => {
  if (member.email && REMOVED_EMAILS.has(member.email.toLowerCase().trim())) {
    return true;
  }
  if (member.name && REMOVED_NAMES.has(member.name.toLowerCase().trim())) {
    return true;
  }
  return false;
};
