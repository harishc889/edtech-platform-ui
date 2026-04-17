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
  hours: string;
  internshipDuration: string;
  internshipHours: string;
  language: string;
  mode: string;
  assessments: string;
  eligibility: string;
  /**
   * Card hero background image, served from `public/`.
   * Use a root-relative URL, e.g. `/images/courses/bim-mep.jpg`.
   */
  cardCoverImage?: string;
  level?: string;
  description?: string;
  highlights: string[];
  engineeringBenefits: string[];
  modules: Array<{ title: string; hours: string; desc: string }>;
  tools?: Array<{ name: string; imagePath: string }>;
  certifications?: Array<{
    title: string;
    description: string;
    imagePath: string;
  }>;
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
    id: "BIM-Architecture",
    title: "BIM-Architecture",
    subtitle: "Certification in BIM Architecture",
    duration: "2 months",
    hours: "60 Hours",
    internshipDuration: "2 months",
    internshipHours: "60 Hours",
    language: "Hindi/English",
    mode: "Online",
    assessments: "3",
    eligibility: "Bachelor’s in Architecture",
    cardCoverImage: "/images/courses/bim-arch.png",
    // level: "Advanced",
    // description:
    //   "Deepen BIM coordination, clash management, and delivery standards used on international projects. You will work through structured modules covering model authoring, collaboration workflows, ISO-style information management, and leadership skills for multi-discipline teams.",
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
        title: "BIM Fundamentals + Revit Basics",
        hours: "10 Hours",
        desc: `<p>Goal: Understand BIM workflow + start Revit</p>
                <ul>
                  <li>Introduction to BIM concepts (LOD, clash detection, coordination)</li>
                  <li>BIM lifecycle (Design → Construction → Facility Management)</li>
                  <li>Interface of Autodesk Revit</li>
                  <li>Project setup (units, templates, levels, grids)</li>
                  <li>Basic drawing tools (walls, doors, windows)</li>           
                </ul>
                <p>Practice: Create a simple 2D floor plan in Revit</p>
              `,
      },
      {
        title: "Revit Architectural Modeling",
        hours: "30 Hours",
        desc: `<p>Goal: Build full architectural model</p>
                <ul>
                <li>Walls, floors, roofs, ceilings</li>
                <li>Curtain walls & glazing systems</li>
                <li>Stairs, ramps, railings</li>
                <li>Families (loadable vs system families)</li>
                <li>Basic annotation (dimensions, tags)</li>
                  
                </ul>
                <p>Practice: Model a residential house (LOD 200)</p>
                `,
      },
      {
        title: "Advanced Revit + Documentation",
        hours: "28 Hours",
        desc: `<p>Goal: Make project sheets & details</p>
                <ul>
                  <li>Views (plans, sections, elevations, 3D)</li>
                  <li>Sheet creation & title blocks</li>
                  <li>Schedules (doors, windows, materials)</li>
                  <li>Phasing & design options</li>
                  <li>Basic rendering in Revit</li>
                </ul>
                <p>Practice: Complete drawing set (plans + sections + sheets)</p>
        `,
      },
      {
        title: "Revit Collaboration + BIM Workflow",
        hours: "26 Hours",
        desc: `<p>Goal: Work in team environment</p>
                <ul>
                  <li>Worksharing (central & local files)</li>
                  <li>Linking CAD & Revit models</li>
                  <li>Coordination with structural & MEP</li>
                  <li>Introduction to cloud collaboration via Autodesk BIM 360</li>
                </ul>
                <p>Practice: Simulate multi-user project</p>
                `,
      },
      {
        title: "Navisworks for Coordination",
        hours: "24 Hours",
        desc: `<p>Goal: Clash detection & model review</p>
                <ul>
                  <li>Interface of Autodesk Navisworks</li>
                  <li>Importing Revit models (NWC/NWD)</li>
                  <li>Clash detection (hard & soft clashes)</li>
                  <li>Timeliner (4D simulation basics)</li>
                  <li>Quantification basics</li>
                </ul>
                <p>Practice: Detect clashes between architectural & structural models</p>
                `,
      },
      {
        title: "BIM 360 / Autodesk Construction Cloud",
        hours: "20 Hours",
        desc: `<p>Goal: Cloud-based BIM management</p>
                <ul>
                  <li>Overview of Autodesk Construction Cloud</li>
                  <li>Document management & version control</li>
                  <li>Model coordination workflows</li>
                  <li>Issue tracking & RFIs</li>
                  <li>Design collaboration module</li>
                </ul>
                `,
      },
      {
        title: "Bluebeam for Documentation & Review",
        hours: "12 Hours",
        desc: `<p>Goal: PDF workflows & site coordination</p>
                <ul>
                  <li>Interface of Bluebeam Revu</li>
                  <li>Markups & annotations</li>
                  <li>Measurement tools (area, length)</li>
                  <li>Studio sessions (real-time collaboration)</li>
                  <li>Creating reports from markups</li>
                </ul>
                <p>Practice: Review construction drawings and add markups</p>
                `,
      },
      {
        title: "Final Project + Integration",
        hours: "10 Hours",
        desc: `<p>Goal: Apply full BIM workflow</p>
                <p>Create complete BIM project:</p>
                <ul>
                  <li>Revit model (LOD 300)</li>
                  <li>Export to Navisworks for clash detection</li>
                  <li>Upload to BIM 360/ACC</li>
                  <li>Review via Bluebeam</li>
                </ul>
                `,
      },
      
    ],
    tools: [
      { name: "Revit", imagePath: "/images/tools/revit.png" },
      { name: "Navisworks", imagePath: "/images/tools/naviswork.png" },
      { name: "Autodesk BIM 360", imagePath: "/images/tools/bim360.png" },
      { name: "Autodesk Construction Cloud", imagePath: "/images/tools/acc.png" },
      { name: "Bluebeam", imagePath: "/images/tools/bluebeam.jpg" }
    ],
    certifications: [
      {
        title: "Work Experience Certificate",
        description: "More than a certificate—it’s your gateway to BIM jobs.”",
        imagePath: "/images/certificates/certificateOfCompletion.png",
      },
      {
        title: "Internship Letter",
        description: "This isn’t just a letter; it’s your BIM job offer waiting to happen.",
        imagePath: "/images/certificates/internshipLetter.png",
      },
      // {
      //   title: "ISO 19650 Certified BIM Professional",
      //   description: "Add your certificate details and description.",
      //   imagePath: "",
      // },
    ],
    learningOutcomes: [
      "Develop intelligent 3D architectural models using Autodesk Revit",
      "Create accurate drawings including plans, sections, and elevations",
      "Apply real-world BIM workflows and industry standards",
      "Build a professional portfolio for job opportunities",
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
    id: "BIM Structure",
    title: "BIM Structure",
    subtitle: "Certification in BIM Structure",
    duration: "2 months",
    hours: "60 Hours",
    internshipDuration: "2 months",
    internshipHours: "60 Hours",
    language: "Hindi/English",
    mode: "Online",
    assessments: "3",
    eligibility: "Bachelor’s in Civil, Master's in Structure",
    cardCoverImage: "/images/courses/bim-str.jpg",
    // level: "Intermediate",
    // description:
    //   "Focus on architectural modeling, documentation sets, design options, and coordination with structure and MEP. Ideal for architects moving from CAD-centric workflows to model-based delivery.",
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
    id: "BIM MEP",
    title: "BIM MEP",
    subtitle: "Certification in BIM MEP",
    duration: "2 months",
    hours: "60 Hours",
    internshipDuration: "2 months",
    internshipHours: "60 Hours",
    language: "Hindi/English",
    mode: "Online",
    assessments: "3",
    eligibility: "Bachelor’s in Mechanical or Electrical",
    cardCoverImage: "/images/courses/bim-mep.png",
    // level: "Intermediate",
    // description:
    //   "Structural and civil BIM workflows: templates, rebar and precast concepts, quantities, and coordination with architecture and MEP in a federated environment.",
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
    id: "BIM Civil",
    title: "BIM Civil",
    subtitle: "Certification in BIM Structure",
    duration: "2 months",
    hours: "60 Hours",
    internshipDuration: "2 months",
    internshipHours: "60 Hours",
    language: "Hindi/English",
    mode: "Online",
    assessments: "3",
    eligibility:
      "Bachelor’s in civil",
    cardCoverImage: "/images/courses/bim-civil.png",
    // level: "Beginner–intermediate",
    // description:
    //   "A complete pathway from fundamentals to coordination: modeling, views, sheets, collaboration in the cloud, and basic clash workflows—designed to make you job-ready faster.",
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
  {
    id: "BIM Complete",
    title: "BIM Complete",
    subtitle: "Certification in BIM Modeling & Coordination",
    duration: "4 months",
    hours: "120 Hours",
    internshipDuration: "4 months",
    internshipHours: "120 Hours",
    language: "Hindi/English",
    mode: "Online",
    assessments: "3",
    eligibility:
      "Bachelor’s in civil, Architecture,Mechanical or Electrical",
    cardCoverImage: "/images/courses/bim-complete.jpg",
  
    // level: "Beginner–intermediate",
    // description:
    //   "A complete pathway from fundamentals to coordination: modeling, views, sheets, collaboration in the cloud, and basic clash workflows—designed to make you job-ready faster.",
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
