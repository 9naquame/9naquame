export type CommunityEntry = {
  name: string;
  role: "Panelist" | "Mentor" | "Instructor" | "Facilitator";
  organization: string;
  organizationUrl: string;
  eventUrl?: string;
  contribution: string;
};

export const communityGroups: {
  id: "speaking" | "building";
  title: string;
  introduction: string;
  entries: CommunityEntry[];
}[] = [
  {
    id: "speaking",
    title: "Sharing the journey",
    introduction:
      "Conversations on careers, leadership, and finding your place in tech.",
    entries: [
      {
        name: "Beyond the Degree",
        role: "Panelist",
        organization: "Dikan Tech Corp.",
        organizationUrl: "https://dikantech.ca/",
        contribution:
          "Shared perspectives on career growth, entering the technology industry, and navigating a career in software engineering. Brought the practical experience of working as both a developer and an engineering leader to conversations about learning, professional growth, and finding a path forward.",
      },
      {
        name: "Youth Leadership Summit",
        role: "Panelist",
        organization: "CMFI NL Community",
        organizationUrl: "https://cmfinlcommunity.ca/",
        contribution:
          "Contributed to discussions on leadership, professional development, and career pathways for young people. Drew on experience leading engineering teams to bring a practical perspective to personal growth, responsibility, and contributing to a wider community.",
      },
      {
        name: "Black Excellence Summit",
        role: "Panelist",
        organization: "Civic Roots Foundation",
        organizationUrl: "http://civicrootsfoundation.org/",
        contribution:
          "Joined conversations on representation, excellence, and impact in technology and leadership. Shared a perspective shaped by hands-on software development, engineering management, and community involvement, connecting professional achievement with the importance of supporting others.",
      },
    ],
  },
  {
    id: "building",
    title: "Building community",
    introduction:
      "Supporting people as they learn, build, and take their next step.",
    entries: [
      {
        name: "Mentorship Over Coffee",
        role: "Mentor",
        organization: "Dikan Tech Corp.",
        organizationUrl: "https://dikantech.ca/",
        contribution:
          "Supported early-career professionals through one-to-one conversations about career direction and growth in technology. Drew on experience across software engineering and team leadership to offer a practical perspective on professional development and the next steps in their careers.",
      },
      {
        name: "Digital Makers Lab",
        role: "Instructor",
        organization: "Dikan Tech Corp.",
        organizationUrl: "https://dikantech.ca/",
        contribution:
          "Delivered hands-on technology instruction for youth and students through Digital Makers Lab, a program exploring coding, AI, and digital tools. Focused on making technical ideas approachable through practical learning, with room for questions, experimentation, and curiosity.",
      },
      {
        name: "Community Build Lab",
        role: "Facilitator",
        organization: "The Applied Studio",
        organizationUrl: "https://theappliedstudio.ca/",
        contribution:
          "Facilitated collaborative, project-based learning around real community needs and served as a judge for participant projects. Supported a setting where participants could exchange ideas, work through challenges together, and connect what they were learning to a practical project with a community purpose.",
      },
    ],
  },
];
