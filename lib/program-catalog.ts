export type PaymentOption = {
  id: string;
  label: string;
  amountDisplay: string;
  amountInr: number;
};

export type Program = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  language: string;
  eligibility: string;
  level: string;
  description: string;
  highlights: string[];
  engineeringBenefits: string[];
  modules: Array<{ title: string; hours: string; desc: string }>;
  learningOutcomes: string[];
  careerRoles: string[];
  criteriaSummary: {
    totalCredits: string;
    minimumScore: string;
    description: string;
  };
  upfrontInr: number;
  seatBookingInr: number;
};

/**
 * Featured courses for marketing / enroll flows.
 * Replace or extend when wired to your CMS or API.
 */
export const PROGRAM_CATALOG: Program[] = [
  {
    id: "bim-ready-plus",
    title: "BIM-Ready+",
    subtitle: "International post-graduate certification in BIM management",
    duration: "10 months",
    language: "English",
    eligibility: "3+ years experience in the AEC industry",
    level: "Advanced",
    description:
      "Deepen BIM coordination, clash management, and delivery standards used on international projects. You will work through structured modules covering model authoring, collaboration workflows, ISO-style information management, and leadership skills for multi-discipline teams.",
    highlights: [
      "Live mentor sessions and structured assignments",
      "Portfolio-ready deliverables from real-style project briefs",
      "Career-focused reviews: resume, interviews, and role mapping",
    ],
    engineeringBenefits: [
      "Leadership-level BIM governance",
      "Multi-discipline coordination at scale",
      "Risk and quality control workflows",
      "Data-backed decision support",
    ],
    modules: [
      {
        title: "Advanced BIM Strategy",
        hours: "10 Hours",
        desc: "Program governance, execution planning, delivery frameworks, and standards.",
      },
      {
        title: "Model Authoring Excellence",
        hours: "30 Hours",
        desc: "Advanced authoring, standards libraries, and quality-first documentation.",
      },
      {
        title: "Coordination & Federation",
        hours: "28 Hours",
        desc: "Clash resolution protocols, issue dashboards, and cross-team review cycles.",
      },
      {
        title: "4D/5D & Data Workflows",
        hours: "26 Hours",
        desc: "Schedule-cost integration and data extraction for execution reporting.",
      },
      {
        title: "Information Management",
        hours: "24 Hours",
        desc: "CDE workflows, naming conventions, and audit-ready data structures.",
      },
      {
        title: "Capstone & Portfolio",
        hours: "20 Hours",
        desc: "Real-project simulation, mentor review, and portfolio positioning.",
      },
    ],
    learningOutcomes: [
      "Design and run enterprise BIM delivery systems.",
      "Lead multidisciplinary collaboration with measurable quality metrics.",
      "Implement data-driven BIM workflows for project controls.",
      "Present portfolio artifacts aligned to senior BIM roles.",
    ],
    careerRoles: [
      "BIM Manager",
      "BIM Project Lead",
      "Digital Delivery Specialist",
      "BIM Coordination Head",
    ],
    criteriaSummary: {
      totalCredits: "30",
      minimumScore: "6 CGPA (out of 10)",
      description:
        "Completion requires assessment performance, project submission quality, and final evaluation.",
    },
    upfrontInr: 190000,
    seatBookingInr: 25000,
  },
  {
    id: "bim-arch-advanced",
    title: "BIM-Ready Architecture Advanced",
    subtitle: "International post-graduate certification in BIM–architecture",
    duration: "8 months",
    language: "English",
    eligibility: "Bachelor’s in architecture or equivalent",
    level: "Intermediate",
    description:
      "Focus on architectural modeling, documentation sets, design options, and coordination with structure and MEP. Ideal for architects moving from CAD-centric workflows to model-based delivery.",
    highlights: [
      "Design development to construction documentation pathways",
      "Families, detailing, and sheet standards for practice",
      "Coordination exercises with linked models",
    ],
    engineeringBenefits: [
      "Architectural model precision",
      "Design-to-documentation continuity",
      "Interdisciplinary collaboration readiness",
      "Improved visualization and client communication",
    ],
    modules: [
      {
        title: "Architectural BIM Foundations",
        hours: "12 Hours",
        desc: "Templates, standards, and model setup for architecture teams.",
      },
      {
        title: "Concept to Detailed Modeling",
        hours: "32 Hours",
        desc: "Massing, families, design options, and intelligent model development.",
      },
      {
        title: "Documentation Workflow",
        hours: "24 Hours",
        desc: "Views, sheets, detailing, and construction-ready output workflows.",
      },
      {
        title: "Coordination with Structure/MEP",
        hours: "22 Hours",
        desc: "Linked model coordination, clash handling, and update cycles.",
      },
      {
        title: "Presentation and Review",
        hours: "20 Hours",
        desc: "Visualization, review sets, and stakeholder communication packs.",
      },
      {
        title: "Final Project",
        hours: "18 Hours",
        desc: "Portfolio-level final submission with expert critique.",
      },
    ],
    learningOutcomes: [
      "Create architecture-first BIM models with production standards.",
      "Build complete drawing/documentation sets from BIM data.",
      "Coordinate architecture scope with structural and MEP teams.",
      "Showcase architecture BIM portfolio for hiring outcomes.",
    ],
    careerRoles: [
      "BIM Architect",
      "Architectural BIM Modeler",
      "Design Coordination Specialist",
      "Project Documentation Lead",
    ],
    criteriaSummary: {
      totalCredits: "28",
      minimumScore: "5.5 CGPA (out of 10)",
      description:
        "Learners must pass module assessments and submit a complete architecture capstone.",
    },
    upfrontInr: 165000,
    seatBookingInr: 22000,
  },
  {
    id: "bim-civil",
    title: "BIM-Ready Civil Course",
    subtitle: "International certification in BIM–structure",
    duration: "6 months",
    language: "English",
    eligibility: "Bachelor’s in civil or mechanical engineering",
    level: "Intermediate",
    description:
      "Structural and civil BIM workflows: templates, rebar and precast concepts, quantities, and coordination with architecture and MEP in a federated environment.",
    highlights: [
      "Structural modeling standards and QC checklists",
      "Quantity takeoff and documentation handoffs",
      "Clash detection and issue tracking workflows",
    ],
    engineeringBenefits: [
      "Collaborative efficiency",
      "Design optimization",
      "Cost and time savings",
      "Sustainable engineering decisions",
    ],
    modules: [
      {
        title: "Introduction to BIM",
        hours: "03 Hours",
        desc: "Foundation concepts, workflows, and collaboration standards for projects.",
      },
      {
        title: "BIM Model Authoring using Revit",
        hours: "37 Hours",
        desc: "Build structural/civil-ready models with robust authoring standards.",
      },
      {
        title: "Steel Drawings with Advance Steel",
        hours: "10 Hours",
        desc: "Develop fabrication-ready steel detailing workflows.",
      },
      {
        title: "BIM in Civil and Infrastructure",
        hours: "25 Hours",
        desc: "Apply BIM methods to infrastructure planning and delivery contexts.",
      },
      {
        title: "Advanced Steel Structures using Tekla",
        hours: "30 Hours",
        desc: "High-precision modeling and detailing for structural systems.",
      },
      {
        title: "BIM Coordination & Visual Programming",
        hours: "15 Hours",
        desc: "Clash coordination, automation logic, and model intelligence.",
      },
    ],
    learningOutcomes: [
      "Master structural and civil BIM authoring workflows.",
      "Generate accurate quantities and documentation outputs.",
      "Coordinate multidisciplinary issues with BIM platforms.",
      "Apply BIM for infrastructure-grade project delivery.",
    ],
    careerRoles: [
      "BIM Structural Engineer",
      "BIM Steel Detailer",
      "BIM Civil Engineer",
      "BIM Coordinator",
    ],
    criteriaSummary: {
      totalCredits: "25",
      minimumScore: "5 CGPA (out of 10)",
      description:
        "To earn BIM-Ready Civil certification, all modules and assessment requirements must be completed.",
    },
    upfrontInr: 135000,
    seatBookingInr: 20000,
  },
  {
    id: "bim-complete",
    title: "BIM-Ready Complete",
    subtitle: "International certification in BIM modeling & coordination",
    duration: "6 months",
    language: "English",
    eligibility:
      "Bachelor’s in civil, architecture, mechanical, or electrical",
    level: "Beginner–intermediate",
    description:
      "A complete pathway from fundamentals to coordination: modeling, views, sheets, collaboration in the cloud, and basic clash workflows—designed to make you job-ready faster.",
    highlights: [
      "Foundations through coordination in one track",
      "Cloud collaboration and common data environments",
      "Weekly assignments with mentor feedback",
    ],
    engineeringBenefits: [
      "End-to-end BIM competency",
      "Faster role readiness",
      "Cross-domain collaboration confidence",
      "Portfolio-oriented execution",
    ],
    modules: [
      {
        title: "BIM Core Fundamentals",
        hours: "08 Hours",
        desc: "Essential BIM principles, terms, templates, and baseline standards.",
      },
      {
        title: "Modeling Workflows",
        hours: "28 Hours",
        desc: "Architecture/structure modeling fundamentals and document output.",
      },
      {
        title: "Coordination Essentials",
        hours: "20 Hours",
        desc: "Federated model handling, clash checks, and issue response cycles.",
      },
      {
        title: "Quantities & Documentation",
        hours: "22 Hours",
        desc: "Quantity extraction, schedules, and handoff-ready documentation.",
      },
      {
        title: "Cloud Collaboration",
        hours: "18 Hours",
        desc: "CDE-based collaboration and revision management workflows.",
      },
      {
        title: "Final Delivery Sprint",
        hours: "14 Hours",
        desc: "Integrated final submission with QA and portfolio packaging.",
      },
    ],
    learningOutcomes: [
      "Build practical BIM capability from zero to coordination.",
      "Deliver complete model + drawing + quantity outputs.",
      "Operate confidently in collaborative BIM teams.",
      "Create portfolio artifacts for entry-level BIM roles.",
    ],
    careerRoles: [
      "BIM Modeler",
      "Junior BIM Coordinator",
      "Project BIM Assistant",
      "CAD-to-BIM Specialist",
    ],
    criteriaSummary: {
      totalCredits: "24",
      minimumScore: "5 CGPA (out of 10)",
      description:
        "Successful completion requires module submissions, attendance, and final project approval.",
    },
    upfrontInr: 120000,
    seatBookingInr: 18000,
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAM_CATALOG.find((p) => p.id === id);
}
