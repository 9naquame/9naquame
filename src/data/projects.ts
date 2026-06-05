export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  image: string;
  imageAlt?: string;
  productImage?: string;
  productImageAlt?: string;
  productImageLabel?: string;
  imageKind?: "photograph" | "illustration";
  designCredit?: string;
  laterRedesign?: boolean;
  url: string;
  tags: string[];
  detail: string;
};

export const projects: Project[] = [
  {
    slug: "rideon",
    number: "01",
    name: "RideOn",
    category: "MOBILE · COMMUNITY TRANSPORT",
    description:
      "Getting people there, together. Connected rider, driver, and admin applications for coordinating community transportation.",
    image: "/images/rideon-platform.svg?v=5",
    imageAlt:
      "RideOn platform illustration connecting rider, driver, and operations experiences",
    imageKind: "illustration",
    url: "https://rideon.cmfinl.ca",
    tags: ["Flutter", "FastAPI", "PostgreSQL"],
    detail:
      "A multi-tenant transportation platform spanning rider and driver mobile apps, organization administration, scheduling, routing, and background processing.",
  },
  {
    slug: "transactiq",
    number: "02",
    name: "TransactIQ",
    category: "FINTECH · COMMUNITY",
    description:
      "Less administration. More impact. A contribution platform for churches and charities, from donation tracking to tax receipts.",
    image: "/images/transactiq-platform.svg?v=3",
    imageAlt:
      "TransactIQ illustration connecting contributions, financial records, and tax receipts",
    imageKind: "illustration",
    url: "https://www.transactiq.ca",
    tags: ["FastAPI", "PostgreSQL", "React"],
    detail:
      "Donation records, contribution management, and automated tax receipt generation in one platform. Built with FastAPI and PostgreSQL, with Docker, Kubernetes, and Terraform in the infrastructure stack.",
  },
  {
    slug: "skill-match-ai",
    designCredit: "Earlier version · Later redesign by a third party.",
    laterRedesign: true,
    number: "04",
    name: "Skill Match AI",
    category: "AI · CAREER TECHNOLOGY",
    description:
      "Finding the fit beyond a job title. AI-assisted resume analysis and skill matching to connect people with opportunities.",
    image: "/images/skillmatch.webp",
    url: "https://skillmatchai.ca/",
    tags: ["Python", "OpenAI", "React"],
    detail:
      "A career and hiring platform using resume analysis, skills, and experience to inform job matching. The stack combines a FastAPI backend, PostgreSQL, React, and OpenAI-powered workflows.",
  },
  {
    slug: "rivet-sales-blueprint",
    designCredit: "Earlier version · Later redesign by a third party.",
    laterRedesign: true,
    number: "03",
    name: "Rivet Sales Blueprint",
    category: "AI · GO-TO-MARKET",
    description:
      "Turning an ambitious idea into a plan. Structured go-to-market strategies for early-stage and founder-led companies.",
    image: "/images/rivet.webp",
    url: "https://www.rivetsalesblueprint.ca",
    tags: ["Next.js", "LangGraph", "AWS"],
    detail:
      "An AI-assisted sales strategy platform that uses LangGraph workflows to generate structured go-to-market plans. Built with Next.js, FastAPI, MongoDB, and AWS.",
  },
];

export const featuredProjects = projects.filter((project) =>
  ["rideon", "transactiq"].includes(project.slug),
);
export const otherProjects = projects.filter((project) =>
  Boolean(project.laterRedesign),
);

export const projectStories = {
  rideon: {
    headline: "Getting people there, together.",
    introduction:
      "Community transportation is a coordination problem with people at its center. RideOn connects the rider requesting a trip, the driver making it happen, and the organization bringing it all together.",
    problem:
      "A ride depends on more than a request. Riders, drivers, vehicles, events, assignments, and routes all have to line up, while different organizations need their own operating space.",
    product:
      "A multi-tenant transportation platform with dedicated Flutter applications for riders and drivers, a Next.js administration application, and a shared FastAPI backend. An Astro website supports public information and guest ride requests.",
    capabilities: [
      {
        title: "Rider experience",
        text: "Registration, ride requests, trip information, and notifications in a dedicated mobile application.",
      },
      {
        title: "Driver coordination",
        text: "Assignments, navigation, trip status, and location in a separate driver application.",
      },
      {
        title: "Organization operations",
        text: "Administration across riders, drivers, vehicles, events, assignments, and routes.",
      },
    ],
    focus: [
      {
        title: "Several clients, one set of rules",
        text: "The API owns domain rules. Mobile and web clients consume shared contracts, with generated Dart and TypeScript clients keeping their integration aligned.",
      },
      {
        title: "Organization boundaries",
        text: "Transportation operations are scoped to an organization. Tenant isolation and authorization are part of the platform's data boundaries.",
      },
      {
        title: "Work beyond the request",
        text: "Scheduling, routing, and background processing extend the system beyond its screens. Separately deployable applications keep client and service responsibilities distinct.",
      },
    ],
    stack: [
      {
        label: "EXPERIENCES",
        technology: "Flutter + Next.js",
        text: "Separate Flutter applications serve riders and drivers. Next.js supports organization administration, while Astro provides the public website and guest ride request experience.",
        icon: "interface",
      },
      {
        label: "PLATFORM",
        technology: "FastAPI",
        text: "The API owns the domain rules behind scheduling, routing, and transportation workflows. Generated Dart and TypeScript clients connect the applications through shared contracts.",
        icon: "application",
      },
      {
        label: "DATA",
        technology: "PostgreSQL",
        text: "PostgreSQL is the platform's database, with organization boundaries and authorization governing access to transportation data.",
        icon: "data",
      },
    ],
    infrastructure: ["Astro", "Docker", "Background workers"],
    accent: "cyan",
  },
  transactiq: {
    headline: "More time for the mission.",
    introduction:
      "Financial administration can pull a community away from the work it exists to do. TransactIQ brings contribution tracking and tax receipt generation into one place.",
    problem:
      "For churches and charities, a donation is more than a payment. It belongs to a contributor, becomes part of an ongoing record, and needs to be reflected accurately in reporting and receipts.",
    product:
      "A financial contribution platform that connects donation management, contribution tracking, and automated tax receipt generation. The product gives those related activities a shared home.",
    capabilities: [
      {
        title: "Contribution tracking",
        text: "Keep donations and contribution records together in a financial tracking platform.",
      },
      {
        title: "Tax receipts",
        text: "Generate receipts from contribution information as part of the same workflow.",
      },
      {
        title: "Community operations",
        text: "Support the administration behind churches and charitable organizations.",
      },
    ],
    focus: [
      {
        title: "Connected financial records",
        text: "Contributors, donations, and receipts form a connected domain. Consistency between those records is central to a useful financial product.",
      },
      {
        title: "An operational workflow",
        text: "The engineering challenge extends beyond capturing a donation: the information also has to support ongoing tracking and receipt generation.",
      },
    ],
    stack: [
      {
        label: "INTERFACE",
        technology: "React",
        text: "The user-facing application for contribution management and financial workflows.",
        icon: "interface",
      },
      {
        label: "APPLICATION",
        technology: "FastAPI",
        text: "The Python application layer behind the platform's financial workflows.",
        icon: "application",
      },
      {
        label: "DATA",
        technology: "PostgreSQL",
        text: "The relational database in the platform's published technology stack.",
        icon: "data",
      },
    ],
    infrastructure: ["Docker", "Kubernetes", "Terraform"],
    accent: "emerald",
  },
  "skill-match-ai": {
    headline: "Potential beyond a job title.",
    introduction:
      "Experience rarely fits neatly into a list of keywords. Skill Match AI brings resume analysis and skill-based matching together to help people find a better fit.",
    problem:
      "A job title tells only part of someone's story. Skills, experience, and the way those connect to a role matter when matching people with opportunities.",
    product:
      "An AI-assisted career and hiring platform that uses resume analysis and skills to inform job matching. It brings career information and language-model workflows into the same product.",
    capabilities: [
      {
        title: "Resume analysis",
        text: "Use AI-assisted analysis to work with the information in a candidate's resume.",
      },
      {
        title: "Skill-based matching",
        text: "Consider skills and experience when connecting people with opportunities.",
      },
      {
        title: "Career intelligence",
        text: "Bring AI-powered workflows into a career and hiring experience.",
      },
    ],
    focus: [
      {
        title: "Unstructured information",
        text: "A resume is written for people. Working with its meaning is a different engineering problem from simply storing form fields.",
      },
      {
        title: "AI in a product",
        text: "Model-powered analysis is one part of the experience. The application, data, and interface still need to work together around it.",
      },
    ],
    stack: [
      {
        label: "INTERFACE",
        technology: "React",
        text: "The user-facing application for the career and hiring experience.",
        icon: "interface",
      },
      {
        label: "APPLICATION",
        technology: "FastAPI + OpenAI",
        text: "The Python backend and language-model tooling in the platform's published stack, supporting resume analysis and AI-assisted workflows.",
        icon: "application",
      },
      {
        label: "DATA",
        technology: "PostgreSQL",
        text: "The relational database in the platform's published technology stack.",
        icon: "data",
      },
    ],
    infrastructure: ["Python", "Docker", "Jenkins"],
    accent: "cyan",
  },
  "rivet-sales-blueprint": {
    headline: "From ambition to direction.",
    introduction:
      "Early-stage companies have ideas. Turning them into a clear go-to-market strategy is a different challenge. Rivet helps put structure around that next step.",
    problem:
      "A founder's sales strategy spans several connected questions: how to build traction, where to focus, and how to turn those answers into a usable plan.",
    product:
      "An AI-assisted sales blueprint builder for early-stage and founder-led companies. LangGraph workflows support the generation of structured go-to-market plans.",
    capabilities: [
      {
        title: "Structured strategy",
        text: "Generate go-to-market plans with a clear structure around sales and growth.",
      },
      {
        title: "AI workflows",
        text: "Use LangGraph-based workflows to support the blueprint generation process.",
      },
      {
        title: "Founder focus",
        text: "Shape the product around early-stage and founder-led companies.",
      },
    ],
    focus: [
      {
        title: "Workflow orchestration",
        text: "A structured strategy spans connected questions. Workflow tooling offers a way to organize the AI-assisted generation process.",
      },
      {
        title: "A usable deliverable",
        text: "The value of generated content depends on its structure and relevance to the founder's next steps, alongside the generation itself.",
      },
    ],
    stack: [
      {
        label: "INTERFACE",
        technology: "Next.js",
        text: "The web application layer in Rivet's published technology stack.",
        icon: "interface",
      },
      {
        label: "APPLICATION",
        technology: "FastAPI + LangGraph",
        text: "The Python application and workflow tooling behind the AI-assisted strategy builder, alongside OpenAI.",
        icon: "application",
      },
      {
        label: "DATA",
        technology: "MongoDB",
        text: "The document database in Rivet's published technology stack.",
        icon: "data",
      },
    ],
    infrastructure: ["AWS", "Kubernetes", "OpenAI"],
    accent: "violet",
  },
};
