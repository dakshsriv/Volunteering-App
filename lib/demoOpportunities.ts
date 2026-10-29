import type { Opportunity } from "@prisma/client";

const base = {
  status: "approved" as const,
  sourceId: null,
  sourceUrl: null,
  reviewedAt: null,
};

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Youth Coding & Robotics Mentor",
    organization: "Oakville Public Library",
    contactInfo: "youthprograms@oakvillelibrary.ca",
    category: "STEM",
    commitment: "Weekly",
    eventDate: new Date("2026-11-03T17:00:00.000Z"),
    hours: 12,
    description:
      "Assist elementary school students with basic Scratch, Python, and LEGO robotics building during after-school workshops.",
    requirements:
      "Basic programming knowledge (Python/Scratch) and good communication skills.",
    location: "Central Branch Library",
    link: "https://forms.gle/demo-library-stem",
    ...base,
    createdAt: new Date("2026-09-01T10:00:00.000Z"),
    updatedAt: new Date("2026-09-01T10:00:00.000Z"),
  },
  {
    id: 2,
    title: "Community Food Bank Assistant",
    organization: "Halton Food Network",
    contactInfo: "volunteer@haltonfoodnetwork.ca",
    category: "Community",
    commitment: "One-Time",
    eventDate: new Date("2026-11-07T14:00:00.000Z"),
    hours: 4,
    description:
      "Help sort non-perishable food donations, assemble emergency hampers, and restock distribution shelves.",
    requirements: "Ability to lift up to 15 lbs. Closed-toe shoes required.",
    location: "Community Hub North",
    link: "https://forms.gle/demo-food-bank",
    ...base,
    createdAt: new Date("2026-09-02T10:00:00.000Z"),
    updatedAt: new Date("2026-09-02T10:00:00.000Z"),
  },
  {
    id: 3,
    title: "Autumn Park & Trail Cleanup",
    organization: "Town Environmental Advisory",
    contactInfo: "environment@oakville.ca",
    category: "Environment",
    commitment: "One-Time",
    eventDate: new Date("2026-11-14T09:00:00.000Z"),
    hours: 3,
    description:
      "Join local youth leads in clearing litter along Sixteen Mile Creek trails to protect local wildlife habitats.",
    requirements:
      "Gloves and garbage bags provided on-site. Dress for outdoor weather.",
    location: "Lions Valley Park",
    link: "https://forms.gle/demo-trail-cleanup",
    ...base,
    createdAt: new Date("2026-09-03T10:00:00.000Z"),
    updatedAt: new Date("2026-09-03T10:00:00.000Z"),
  },
  {
    id: 4,
    title: "Peer Homework & Math Tutor",
    organization: "High School Academic Council",
    contactInfo: "academiccouncil@oakvillehigh.ca",
    category: "Tutoring",
    commitment: "Weekly",
    eventDate: new Date("2026-11-04T15:30:00.000Z"),
    hours: 10,
    description:
      "Provide 1-on-1 peer tutoring in Grade 9 Academic Math, Science, and English during quiet study periods or after school.",
    requirements:
      "Grade 11 or 12 student with a minimum 85% average in target subject.",
    location: "School Library - Room 204",
    link: "https://forms.gle/demo-peer-tutoring",
    ...base,
    createdAt: new Date("2026-09-04T10:00:00.000Z"),
    updatedAt: new Date("2026-09-04T10:00:00.000Z"),
  },
  {
    id: 5,
    title: "A/V & Stage Tech Crew",
    organization: "School Drama & Arts Dept",
    contactInfo: "arts@oakvillehigh.ca",
    category: "Arts & Tech",
    commitment: "Weekly",
    eventDate: new Date("2026-11-05T16:00:00.000Z"),
    hours: 8,
    description:
      "Help manage audio boards, stage lighting, and stream setups for school assemblies, drama productions, and music concerts.",
    requirements:
      "Interest in sound, lighting, or video production. Training provided on-site.",
    location: "School Auditorium",
    link: "https://forms.gle/demo-stage-crew",
    ...base,
    createdAt: new Date("2026-09-05T10:00:00.000Z"),
    updatedAt: new Date("2026-09-05T10:00:00.000Z"),
  },
  {
    id: 6,
    title: "Youth Basketball Event Assistant",
    organization: "YMCA Community Sports",
    contactInfo: "volunteer@ymcahalton.ca",
    category: "Sports",
    commitment: "One-Time",
    eventDate: new Date("2026-11-21T12:00:00.000Z"),
    hours: 5,
    description:
      "Support youth weekend basketball tournaments by keeping game scoreboards, managing equipment, and directing attendees.",
    requirements:
      "Enthusiastic attitude and basic knowledge of basketball rules.",
    location: "Community YMCA Gym",
    link: "https://forms.gle/demo-ymca-sports",
    ...base,
    createdAt: new Date("2026-09-06T10:00:00.000Z"),
    updatedAt: new Date("2026-09-06T10:00:00.000Z"),
  },
];