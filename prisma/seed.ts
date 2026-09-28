import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const opportunities = [
  {
    title: "Youth Coding & Robotics Mentor",
    organization: "Oakville Public Library",
    category: "STEM",
    commitment: "Weekly",
    hours: 12,
    description:
      "Assist elementary school students with basic Scratch, Python, and LEGO robotics building during after-school workshops.",
    requirements: "Basic programming knowledge (Python/Scratch) and good communication skills.",
    location: "Central Branch Library",
    link: "https://forms.gle/demo-library-stem",
  },
  {
    title: "Community Food Bank Assistant",
    organization: "Halton Food Network",
    category: "Community",
    commitment: "One-Time",
    hours: 4,
    description:
      "Help sort non-perishable food donations, assemble emergency hampers, and restock distribution shelves.",
    requirements: "Ability to lift up to 15 lbs. Closed-toe shoes required.",
    location: "Community Hub North",
    link: "https://forms.gle/demo-food-bank",
  },
  {
    title: "Autumn Park & Trail Cleanup",
    organization: "Town Environmental Advisory",
    category: "Environment",
    commitment: "One-Time",
    hours: 3,
    description:
      "Join local youth leads in clearing litter along Sixteen Mile Creek trails to protect local wildlife habitats.",
    requirements: "Gloves and garbage bags provided on-site. Dress for outdoor weather.",
    location: "Lions Valley Park",
    link: "https://forms.gle/demo-trail-cleanup",
  },
  {
    title: "Peer Homework & Math Tutor",
    organization: "High School Academic Council",
    category: "Tutoring",
    commitment: "Weekly",
    hours: 10,
    description:
      "Provide 1-on-1 peer tutoring in Grade 9 Academic Math, Science, and English during quiet study periods or after school.",
    requirements: "Grade 11 or 12 student with a minimum 85% average in target subject.",
    location: "School Library - Room 204",
    link: "https://forms.gle/demo-peer-tutoring",
  },
  {
    title: "A/V & Stage Tech Crew",
    organization: "School Drama & Arts Dept",
    category: "Arts & Tech",
    commitment: "Weekly",
    hours: 8,
    description:
      "Help manage audio boards, stage lighting, and stream setups for school assemblies, drama productions, and music concerts.",
    requirements: "Interest in sound, lighting, or video production. Training provided on-site.",
    location: "School Auditorium",
    link: "https://forms.gle/demo-stage-crew",
  },
  {
    title: "Youth Basketball Event Assistant",
    organization: "YMCA Community Sports",
    category: "Sports",
    commitment: "One-Time",
    hours: 5,
    description:
      "Support youth weekend basketball tournaments by keeping game scoreboards, managing equipment, and directing attendees.",
    requirements: "Enthusiastic attitude and basic knowledge of basketball rules.",
    location: "Community YMCA Gym",
    link: "https://forms.gle/demo-ymca-sports",
  },
];

async function main() {
  let created = 0;

  for (const opp of opportunities) {
    const existing = await prisma.opportunity.findFirst({
      where: {
        title: opp.title,
        organization: opp.organization,
      },
    });

    if (!existing) {
      await prisma.opportunity.create({ data: opp });
      created++;
    }
  }

  if (created === 0) {
    console.log("All demo opportunities already exist; skipping seed.");
  } else {
    console.log(`Seeded ${created} volunteer opportunities.`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
