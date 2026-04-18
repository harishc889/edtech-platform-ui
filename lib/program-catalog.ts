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
  courseDetailCoverImage?: string;
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
  faqs?: Array<{
    q: string;
    answerHtml: string;
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
    courseDetailCoverImage: "/images/courses-details/bim-arch.png",
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
    faqs:[
    { q: "What is Architectural BIM?",
      answerHtml: "<p>Architectural BIM is the process of creating intelligent 3D building models that include design, data, and documentation for construction projects.</p>",
    },
    { q: "Which software is used in Architectural BIM?",
      answerHtml: "<p>The primary software used is Autodesk Revit, along with other tools that support BIM workflows and coordination.</p>",
    },
    { q: "Is this course suitable for beginners?",
      answerHtml: "<p>Yes, the course starts from basics and is designed for both beginners and experienced professionals.</p>",
    },
      { q: "What will I learn in this course?",
      answerHtml: "<p>You will learn 3D modeling, creating plans, sections, elevations, and generating detailed construction drawings.</p>",
    },
    { q: "Do I need prior experience in BIM?",
      answerHtml: "<p>No prior BIM experience is required, but basic knowledge of architecture or construction is helpful.</p>",
    },
    { q: "Will I work on real projects?",
      answerHtml: "<p>Yes, the course includes practical, real-world projects to give you hands-on industry experience.</p>",
    },
    
    { q: "What career opportunities are available after this course?",
      answerHtml: "<p>You can apply for roles like BIM Modeler, Revit Designer, or Architectural BIM Engineer.</p>",
    },
    { q: "Do you provide certification?",
      answerHtml: "<p>Yes, you will receive a certification upon successful completion of the course.</p>",
    },
    { q: "Is there placement assistance?",
      answerHtml: "<p>Yes, we provide placement support including resume building, portfolio creation, and interview preparation.</p>",
    },
    { q: "How can I enroll in the course?",
      answerHtml: "<p>You can enroll through our website or contact our team for guidance and support.</p>",
    }
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
    upfrontInr: 39999,
    seatBookingInr: 5000,
  },
  {
    id: "BIM-Structure",
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
    courseDetailCoverImage: "/images/courses-details/bim-str.png",
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
        title: "BIM Basics + Revit Structure Introduction",
        hours: "10 Hours",
        desc: `<p>Goal: Understand BIM for structural engineering</p>
                <ul>
                  <li>Introduction to BIM concepts (LOD, coordination, interoperability)</li>
                  <li>Structural BIM workflow (Design → Analysis → Documentation)</li>
                  <li>Interface of Autodesk Revit</li>
                  <li>Project setup (levels, grids, structural settings)</li>
                  <li>Structural elements intro (columns, beams, foundations)</li>
                </ul>
                <p>Practice: Create a basic structural grid + column layout</p>
              `,
      },
      {
        title: "Structural Modeling in Revit",
        hours: "10 Hours",
        desc: `<p>Goal: Build core structural system</p>
                <ul>
                  <li>Concrete vs steel structures</li>
                  <li>Beams, beam systems, bracing</li>
                  <li>Slabs (structural floors)</li>
                  <li>Isolated & combined footings</li>
                  <li>Structural walls & cores</li>
                </ul>
                <p>Practice: Create a complete structural model (concrete + steel)</p>
              `,
      },
      
    {
      title: "Advanced Structural Components + Reinforcement",
      hours: "10 Hours",
      desc: `<p>Goal: Reinforcement detailing</p>
                <ul>
                  <li>Rebar tools in Autodesk Revit</li>
                  <li>Beam, slab, column reinforcement</li>
                  <li>Rebar shapes & schedules</li>
                  <li>Connections (steel connections basics)</li>
                  <li>Analytical model basics</li>
                </ul>
                <p>Practice: Add reinforcement to beams & slabs</p>
              `,
    },
    {
      title: "Documentation + Structural Drawings",
      hours: "10 Hours",
      desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Structural plans, sections, details</li>
                  <li>Rebar detailing sheets</li>
                  <li>Quantity takeoff basics</li>
                  <li>Drawing standards</li>
                </ul>
                <p>Practice: Prepare full structural drawing set</p>
              `,
    },
    {
      title: "Navisworks for Structural Coordination",
      hours: "10 Hours",
      desc: `<p>Goal: Clash detection & coordination</p>
                <ul>
                  <li>Interface of Autodesk Navisworks</li>
                  <li>Import structural + architectural + MEP models</li>
                  <li>Clash detection (beam vs duct, column vs wall)</li>
                  <li>Clash reports generation</li>
                  <li>4D simulation basics (construction sequencing)</li>
                </ul>
                <p>Practice: Run clash detection for a multi-discipline model</p>
              `,
    },
    {
      title: "BIM 360 / Autodesk Construction Cloud",
      hours: "10 Hours",
      desc: `<p>Goal: Cloud collaboration for structural teams</p>
                <ul>
                  <li>Overview of Autodesk BIM 360</li>
                  <li>Working with Autodesk Construction Cloud</li>
                  <li>Model coordination workflows</li>
                  <li>Issue tracking (site + design issues)</li>
                  <li>Version control & approvals</li>
                </ul>
                <p>Practice: Run clash detection for a multi-discipline model</p>
              `,
    },
    {
      title: "Bluebeam for Structural Review",
      hours: "10 Hours",
      desc: `<p>Goal: Drawing review & site communication</p>
                <ul>
                  <li>Interface of Bluebeam Revu</li>
                  <li>Structural drawing markups (rebar corrections, beam changes)</li>
                  <li>Measurement tools (quantities, steel estimation)</li>
                  <li>Studio collaboration sessions</li>
                  <li>Report generation</li>
                </ul>
                <p>Practice: Review structural drawings and prepare issue report</p>
              `,
    },
    {
      title: "Final BIM Structural Project",
      hours: "10 Hours",
      desc: `<p>Goal: End-to-end structural BIM workflow</p>
                <b>Project Tasks:</b>
                <ul>
                  <li>Create structural model (LOD 300)</li>
                  <li>Add reinforcement detailing</li>
                  <li>Export to Navisworks for clash detection</li>
                  <li>Upload to BIM 360 / ACC</li>
                  <li>Review drawings in Bluebeam</li>
                </ul>
                
              `,
    },
    
    ],
    tools: [
      { name: "Revit", imagePath: "/images/tools/autodesk-str.png" },
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
    faqs:[
      { q: "What is BIM Structural Modeling?",
        answerHtml: "<p>BIM Structural Modeling involves creating intelligent 3D models of structural elements like beams, columns, slabs, and foundations with accurate data for design and construction.</p>",
      },
      { q: "Which software will I learn in this course?",
        answerHtml: "<p>You will learn industry-standard tools like Autodesk Revit Structure, along with basic exposure to structural workflows.</p>",
      },
      { q: "Is this course suitable for beginners?",
        answerHtml: "<p>Yes, this course is designed for both beginners and professionals, starting from basics to advanced structural modeling.</p>",
      },
      { q: "What are the prerequisites for this course?",
        answerHtml: "<p>Basic knowledge of structural engineering or civil concepts is helpful but not mandatory.</p>",
      },
      { q: "What will I learn in this course?",
        answerHtml: "<p>You will learn structural modeling, reinforcement detailing, creating drawings, and understanding BIM workflows used in real projects.</p>",
      },
      { q: "Will I work on real-time projects?",
        answerHtml: "<p>Yes, the course includes practical, project-based learning to simulate real-world structural design workflows.</p>",
      },
      { q: "What job roles can I apply for after completing this course?",
        answerHtml: `<p>You can apply for roles like:</p>
        <ul>
          <li>BIM Structural Modeler</li>
          <li>Revit Structure Engineer</li>
          <li>Structural Detailer</li>
          <li>BIM Coordinator (with experience)</li>
        </ul>`,
      },
      { q: "Do you provide placement assistance?",
        answerHtml: "<p>Yes, we provide lifetime placement support including resume building, portfolio creation, and interview preparation.</p>",
      },
      { q: "Will I receive a certificate after completion?",
        answerHtml: "<p>Yes, you will receive a certification that validates your structural BIM skills.</p>",
      },
      { q: "Can working professionals join this course?",
        answerHtml: "<p>Absolutely! The course is flexible and suitable for both students and working professionals.</p>",
      },
    ],
    learningOutcomes: [
      "Develop accurate structural BIM models including beams, columns, and foundations",
      "Generate detailed structural drawings and documentation",
      "Understand reinforcement modeling and structural detailing workflows",
      "Apply real-world BIM coordination with architectural and MEP models",
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
    upfrontInr: 39999,
    seatBookingInr: 5000,
  },
  {
    id: "BIM-MEP",
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
    courseDetailCoverImage: "/images/courses-details/bim-mep.jpg",
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
        title: "BIM + Revit MEP Basics",
        hours: "10 Hours",
        desc: `
        <p>Goal: Understand MEP BIM workflow</p>
        <ul>
            <li>BIM concepts (LOD, coordination, clash detection)</li>
            <li>MEP disciplines overview (HVAC, Electrical, Plumbing)</li>
            <li>Interface of Autodesk Revit (MEP workspace)</li>
            <li>Project setup (levels, grids, spaces & zones)</li>
            <li>Basic systems introduction</li>
        </ul>
        <p>Practice: Create basic MEP layout with spaces/zones</p>
        </ul>
              `,
      },
      {
        title: "HVAC Modeling (Mechanical)",
        hours: "10 Hours",
        desc: `
        <p>Goal: Design air systems</p>
        <ul>
            <li>Duct creation (rectangular, round, oval)</li>
            <li>Air terminals (diffusers, grilles)</li>
            <li>Mechanical equipment (AHU, FCU)</li>
            <li>Duct fittings & routing</li>
            <li>Basic airflow concepts</li>
        </ul>
        <p>Practice: Model HVAC system for a small office</p>
        `,
      },
      {
        title: "Plumbing (Public Health Engineering)",
        hours: "10 Hours",
        desc: `
        <p>Goal: Water supply & drainage systems</p>
        <ul>
            <li>Pipe systems (hot water, cold water, drainage)</li>
            <li>Fixtures (wash basins, toilets, sinks)</li>
            <li>Pipe routing & slopes</li>
      Goal: Water supply & drainage systems
            <li>Valves & fittings</li>
            <li>System classification</li>
        </ul>
        <p>Practice: Model plumbing system for residential building</p>
        `,
      },
      {
        title: "Electrical Systems",
        hours: "10 Hours",
        desc: `
        <p>Goal: Electrical BIM modeling</p>
        <ul>
            <li>Lighting systems & fixtures</li>
            <li>Power circuits & panels</li>
            <li>Cable trays & conduits</li>
            <li>Switchboards & distribution boards</li>
            <li>Load calculations (basic)</li>
        </ul>
        <p>Practice: Create electrical layout with circuits</p>
        `,
      },

      {
        title: "Advanced MEP + Coordination in Revit",
        hours: "10 Hours",
        desc: `
        <p>Goal: Integrated MEP systems</p>
        <ul>
            <li>System analysis (flow, pressure basics)</li>
            <li>Interference checking in Autodesk Revit</li>
            <li>Worksharing (team collaboration)</li>
            <li>Linking architectural & structural models</li>
            <li>MEP coordination workflow</li>
        </ul>
        <p>Practice: Combine HVAC + Plumbing + Electrical in one model</p>
        `,
      },
      {
        title: "Navisworks for MEP Coordination",
        hours: "10 Hours",
        desc: `
        <p>Goal: Clash detection & coordination</p>
        <ul>
            <li>Interface of Autodesk Navisworks</li>
            <li>Import multi-discipline models</li>
            <li>Clash detection (duct vs beam, pipe vs cable tray)</li>
            <li>Clash grouping & reports</li>
            <li>4D simulation basics</li>
        </ul>
        <p>Practice: Perform clash detection for MEP vs structure</p>
        `,
      },
      {
        title: "BIM 360 / Autodesk Construction Cloud",
        hours: "10 Hours",
        desc: `
        <p>Goal: Cloud collaboration & issue tracking</p>
        <ul>
            <li>Overview of Autodesk BIM 360</li>
            <li>Working with Autodesk Construction Cloud</li>
            <li>Model coordination workflows</li>
            <li>Issue tracking & RFIs</li>
            <li>Document management & approvals</li>
        </ul>
        <p>Practice: Upload MEP model + track coordination issues</p>
        `,
      },
      {
        title: "Bluebeam + Final BIM MEP Project",
        hours: "10 Hours",
        desc: `
        <p>Goal: Documentation + full workflow</p>
        <b>Bluebeam Skills:</b>
        <ul>
            <li>Interface of Bluebeam Revu</li>
            <li>MEP drawing markups (duct/pipe corrections)</li>
            <li>Measurement tools (quantities, pipe length)</li>
            <li>Studio collaboration</li>
        </ul>
        `,
      },
 
    ],
    tools: [
      { name: "Revit", imagePath: "/images/tools/autodesk-mep.png" },
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
    faqs:[
      { q: "What is BIM MEP?",
        answerHtml: "<p>BIM MEP involves modeling and coordinating Mechanical, Electrical, and Plumbing systems using intelligent 3D models for efficient building design and construction.</p>",
      },
      { q: "Which software will I learn in this course?",
        answerHtml: "<p>You will learn tools like Autodesk Revit MEP and Navisworks for modeling, coordination, and clash detection.</p>",
      },
      { q: "Is this course suitable for beginners?",
        answerHtml: "<p>Yes, the course is designed for both beginners and professionals, starting from basics to advanced MEP workflows.</p>",
      },
      { q: "What are the prerequisites for BIM MEP?",
        answerHtml: "<p>Basic knowledge of mechanical, electrical, or plumbing systems is helpful but not mandatory.</p>",
      },
      { q: "What will I learn in this course?",
        answerHtml: "<p>You will learn MEP system modeling, HVAC design basics, electrical layouts, plumbing systems, and clash detection.</p>",
      },
      { q: "Will I work on real projects?",
        answerHtml: "<p>Yes, you will get hands-on experience with real-world MEP projects and coordination workflows.</p>",
      },
      { q: "What job roles can I apply for after this course?",
        answerHtml: `<p>You can apply for roles like:</p>
        <ul>
          <li>BIM MEP Modeler</li>
          <li>MEP Engineer</li>
          <li>Revit MEP Designer</li>
          <li>BIM Coordinator (with experience)</li>
        </ul>`,
      },
      { q: "Do you provide placement assistance?",
        answerHtml: "<p>Yes, we provide lifetime placement assistance including resume building, portfolio creation, and interview preparation.</p>",
      },
      { q: "Will I receive a certificate?",
        answerHtml: "<p>Yes, you will receive a course completion certificate along with internship recognition (if applicable).</p>",
      },
      { q: "Can working professionals join this course?",
        answerHtml: "<p>Absolutely! The course is flexible and suitable for both students and working professionals.</p>",
      },
    ],
    learningOutcomes: [
      "Create accurate 3D models for Mechanical, Electrical, and Plumbing (MEP) systems",
      "Develop detailed layouts including ducting, piping, and electrical systems",
      "Perform clash detection and coordination using industry workflows",
      "Generate construction-ready drawings and documentation from BIM models",
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
    upfrontInr: 39999,
    seatBookingInr: 5000,
  },
  {
    id: "BIM-Civil",
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
    courseDetailCoverImage: "/images/courses-details/bim-civil.jpg",
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
        title: "BIM Basics + Revit Introduction",
        hours: "10 Hours",
        desc: `<p>Goal: Understand BIM for civil engineering</p>
                <ul>
                  <li>Introduction to BIM concepts (LOD, coordination, interoperability)</li>
                  <li>Structural BIM workflow (Design → Analysis → Documentation)</li>
                  <li>Interface of Autodesk Revit</li>
                  <li>Project setup (levels, grids, structural settings)</li>
                  <li>Structural elements intro (columns, beams, foundations)</li>
                </ul>
                <p>Practice: Create a basic structural grid + column layout</p>
              `,
      },
      {
        title: "Structural Modeling in Revit",
        hours: "10 Hours",
        desc: `<p>Goal: Build core structural system</p>
                <ul>
                  <li>Concrete vs steel structures</li>
                  <li>Beams, beam systems, bracing</li>
                  <li>Slabs (structural floors)</li>
                  <li>Isolated & combined footings</li>
                  <li>Structural walls & cores</li>
                </ul>
                <p>Practice: Create a complete structural model (concrete + steel)</p>
              `,
      },
      
    {
      title: "Advanced Structural Components + Reinforcement",
      hours: "10 Hours",
      desc: `<p>Goal: Reinforcement detailing</p>
                <ul>
                  <li>Rebar tools in Autodesk Revit</li>
                  <li>Beam, slab, column reinforcement</li>
                  <li>Rebar shapes & schedules</li>
                  <li>Connections (steel connections basics)</li>
                  <li>Analytical model basics</li>
                </ul>
                <p>Practice: Add reinforcement to beams & slabs</p>
              `,
    },
    {
      title: "Documentation + Structural Drawings",
      hours: "10 Hours",
      desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Structural plans, sections, details</li>
                  <li>Rebar detailing sheets</li>
                  <li>Quantity takeoff basics</li>
                  <li>Drawing standards</li>
                </ul>
                <p>Practice: Prepare full structural drawing set</p>
              `,
    },
    {
      title: "Navisworks for Structural Coordination",
      hours: "10 Hours",
      desc: `<p>Goal: Clash detection & coordination</p>
                <ul>
                  <li>Interface of Autodesk Navisworks</li>
                  <li>Import structural + architectural + MEP models</li>
                  <li>Clash detection (beam vs duct, column vs wall)</li>
                  <li>Clash reports generation</li>
                  <li>4D simulation basics (construction sequencing)</li>
                </ul>
                <p>Practice: Run clash detection for a multi-discipline model</p>
              `,
    },
    {
      title: "BIM 360 / Autodesk Construction Cloud",
      hours: "10 Hours",
      desc: `<p>Goal: Cloud collaboration for structural teams</p>
                <ul>
                  <li>Overview of Autodesk BIM 360</li>
                  <li>Working with Autodesk Construction Cloud</li>
                  <li>Model coordination workflows</li>
                  <li>Issue tracking (site + design issues)</li>
                  <li>Version control & approvals</li>
                </ul>
                <p>Practice: Run clash detection for a multi-discipline model</p>
              `,
    },
    {
      title: "Bluebeam for Structural Review",
      hours: "10 Hours",
      desc: `<p>Goal: Drawing review & site communication</p>
                <ul>
                  <li>Interface of Bluebeam Revu</li>
                  <li>Structural drawing markups (rebar corrections, beam changes)</li>
                  <li>Measurement tools (quantities, steel estimation)</li>
                  <li>Studio collaboration sessions</li>
                  <li>Report generation</li>
                </ul>
                <p>Practice: Review structural drawings and prepare issue report</p>
              `,
    },
    {
      title: "Final BIM Civil Project",
      hours: "10 Hours",
      desc: `<p>Goal: End-to-end structural BIM workflow</p>
                <b>Project Tasks:</b>
                <ul>
                  <li>Create structural model (LOD 300)</li>
                  <li>Add reinforcement detailing</li>
                  <li>Export to Navisworks for clash detection</li>
                  <li>Upload to BIM 360 / ACC</li>
                  <li>Review drawings in Bluebeam</li>
                </ul>
                
              `,
    },
    
    ],
    tools: [
      { name: "Revit", imagePath: "/images/tools/autodesk-str.png" },
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
    faqs:[
      { q: "What is BIM in civil engineering?",
        answerHtml: "<p>BIM in civil engineering is a digital process used to design, plan, and manage infrastructure projects like roads, bridges, and drainage systems using intelligent 3D models.</p>",
      },
      { q: "Which software will I learn in this course?",
        answerHtml: "<p>You will learn tools like Revit (Structure), and other supporting BIM software used in infrastructure projects.</p>",
      },
      { q: "Is this course suitable for beginners?",
        answerHtml: "<p>Yes, the course is designed for both beginners and professionals, starting from basic concepts to advanced project workflows.</p>",
      },
      { q: "What are the prerequisites for this course?",
        answerHtml: "<p>Basic knowledge of civil engineering concepts is helpful but not mandatory.</p>",
      },
      { q: "What kind of projects will I work on?",
        answerHtml: "<p>You will work on real-world projects such as road design, site development, grading, and infrastructure modeling.</p>",
      },
      { q: "What job roles can I apply for after this course?",
        answerHtml: "<p>You can apply for roles like BIM Civil Engineer, Civil 3D Designer, BIM Modeler, and Infrastructure Engineer.</p>",
      },
      { q: "Do you provide placement assistance?",
        answerHtml: "<p>Yes, we provide lifetime placement assistance including resume building, portfolio creation, and interview preparation.</p>",
      },
      { q: "Will I receive a certificate after completion?",
        answerHtml: "<p>Yes, you will receive an industry-recognized certificate after successfully completing the course.</p>",
       },
      { q: "How long is the course duration?",
        answerHtml: "<p>The course typically lasts between 4 to 8 weeks depending on the learning mode.</p>",
      },
      { q: "Can working professionals join this course?",
        answerHtml: "<p>Yes, the course is flexible and designed to suit both students and working professionals.</p>",
      },
    
    ],
    learningOutcomes: [
      "Develop accurate 3D civil and infrastructure models using BIM tools",
      "Create detailed drawings for roads, bridges, and site development",
      "Apply real-world BIM workflows for coordination and project execution",
      "Build industry-ready skills and a portfolio for civil BIM job roles",
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
    upfrontInr: 39999,
    seatBookingInr: 5000,
  },
  {
    id: "BIM-Complete",
    title: "BIM Complete",
    subtitle: "Certification in BIM Modeling & Coordination",
    duration: "4 months",
    hours: "120 Hours",
    internshipDuration: "2 months",
    internshipHours: "60 Hours",
    language: "Hindi/English",
    mode: "Online",
    assessments: "5",
    eligibility:
      "Bachelor’s in civil, Architecture,Mechanical or Electrical",
    cardCoverImage: "/images/courses/bim-complete.jpg",
    courseDetailCoverImage: "/images/courses-details/bim-complete.jpg",
  
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
        title: "BIM + Revit Basics",
        hours: "10 Hours",
        desc: `<p>Goal: Strong foundation</p>
                <ul>
                  <li>BIM concepts (LOD, BEP, coordination workflow)</li>
                  <li>BIM lifecycle (Design → Construction → FM)</li>
                  <li>Interface of Autodesk Revit</li>
                  <li>Project setup (units, levels, grids)</li>
                  <li>Basic tools (walls, doors, windows)</li>
                </ul>
                <p>Practice: 2D floor plan</p>
              `,
      },
      {
        title: "Architectural Modeling",
        hours: "10 Hours",
        desc: `<p>Goal: Build architectural model</p>
                <ul>
                  <li>Walls, floors, roofs, ceilings</li>
                  <li>Curtain walls & glazing</li>
                  <li>Stairs, ramps</li>
                  <li>Families & components</li>
                </ul>
                <p>Practice: Residential building model (LOD 200)</p>
              `,
      },
      {
        title: "Advanced Architecture + Documentation",
        hours: "10 Hours",
        desc: `<p>Goal: Drawings & presentation</p>
                <ul>
                  <li>Sections, elevations, 3D views</li>
                  <li>Sheets & title blocks</li>
                  <li>Schedules (doors, windows)</li>
                 <li>Rendering basics</li>
                </ul>
                <p>Practice: Complete drawing set</p>
              `,
      },
      {
        title: "Collaboration in Architecture",
        hours: "10 Hours",
        desc: `<p>Goal: Team workflow</p>
                <ul>
                  <li>Worksharing (central model)</li>
                  <li>Linking CAD & models</li>
                  <li>Intro to Autodesk BIM 360</li>
                </ul>
                <p>Practice: Multi-user setup</p>
              `,
      },
      {
        title: "Structural Basics",
        hours: "10 Hours",
        desc: `<p>Goal: Structural layout</p>
                <ul>
                  <li>Structural grids, columns, beams</li>
                  <li>Foundations (isolated, raft)</li>
                  <li>Slabs & structural walls</li>
                </ul>
                <p>Practice: Structural layout</p>
              `,
      },
      {
        title: "Advanced Structure + Reinforcement",
        hours: "10 Hours",
        desc: `<p>Goal: Reinforcement detailing</p>
                <ul>
                  <li>Rebar detailing in Autodesk Revit</li>
                  <li>Beam, slab, column reinforcement</li>
                  <li>Steel basics</li>
                </ul>
                <p>Practice: Reinforcement modeling</p>
              `,
      },
      {
        title: "Structural Documentation",
        hours: "10 Hours",
        desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Structural drawings</li>
                  <li>Quantity takeoff</li>
                </ul>
                <p>Practice: Structural sheets</p>
              `,
      },
      {
        title: "Structural Coordination",
        hours: "10 Hours",
        desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Link architectural model</li>
                  <li>Interference checking</li>
                  <li>Multi-discipline workflow</li>
                </ul>
                <p>Practice: Arch + Struct coordination</p>
              `,
      },
      {
        title: "HVAC Systems",
        hours: "10 Hours",
        desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Ducting, AHU, diffusers</li>
                  <li>Airflow basics</li>
                </ul>
                <p>Practice: HVAC layout</p>
              `,
      },
      {
        title: "Plumbing Systems",
        hours: "10 Hours",
        desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Water supply & drainage</li>
                  <li>Pipe routing & fixtures</li>
                </ul>
                <p>Practice: Plumbing layout</p>
              `,
      },
      {
        title: "Electrical Systems",
        hours: "10 Hours",
        desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Lighting, circuits, panels</li>
                  <li>Cable trays & conduits</li>
                </ul>
                <p>Practice: Electrical layout</p>
              `,
      },
      {
        title: "MEP Integration",
        hours: "10 Hours",
        desc: `<p>Goal: Produce construction drawings</p>
                <ul>
                  <li>Combine HVAC + Plumbing + Electrical</li>
                  <li>Clash detection in Autodesk Revit</li>
                  <li>Worksharing</li>
                </ul>
                <p>Practice: Full MEP model</p>
              `,
      },
      {
        title: "Navisworks (Clash Detection)",
        hours: "10 Hours",
        desc: `<p>Goal: Coordination expert</p>
                <ul>
                  <li>Interface of Autodesk Navisworks</li>
                  <li>Clash detection (all disciplines)</li>
                  <li>Clash reports</li>
                  <li>4D simulation</li>
                </ul>
                <p>Practice: Full coordination model</p>
              `,
      },
      {
        title: "BIM 360 + Autodesk Construction Cloud",
        hours: "10 Hours",
        desc: `<p>Goal: Cloud BIM workflow</p>
                <ul>
                  <li>Autodesk BIM 360 workflows</li>
                  <li>Autodesk Construction Cloud</li>
                  <li>Issue tracking, RFIs</li>
                  <li>Document management</li>
                </ul>
                <p>Practice: Upload + manage project</p>
              `,
      },
      {
        title: "Bluebeam + Documentation Review",
        hours: "10 Hours",
        desc: `<p>Goal: Industry-level review process</p>
                <ul>
                  <li>Interface of Bluebeam Revu</li>
                  <li>Markups, measurement tools</li>
                  <li>Studio collaboration</li>
                  <li>Report generation</li>
                </ul>
                <p>Practice: Review full project drawings</p>
              `,
      },
      {
        title: "Final BIM Project (Capstone)",
        hours: "10 Hours",
        desc: `<p>Goal: Real-world BIM delivery</p>
                <ul>
                  <li>Architectural model (LOD 300)</li>
                  <li>Structural model + reinforcement</li>
                  <li>MEP systems (HVAC + Plumbing + Electrical)</li>
                  <li>Clash detection (Navisworks)</li>
                  <li>Cloud collaboration (BIM 360 / ACC)</li>
                  
                </ul>
                `,
      },

    
    ],
    tools: [
      { name: "Revit", imagePath: "/images/tools/autodesk-revit-complete.png" },
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
    faqs:[
      { q: "What is BIM?",
        answerHtml: "<p>Building Information Modeling (BIM) is a smart digital process used to design, visualize, and manage construction projects using 3D models and data.</p>",
      },
      { q: "Who can enroll in this BIM course?",
        answerHtml: "<p>Students, architects, civil engineers, MEP engineers, and working professionals can enroll.</p>",
      },
      { q: "Which software will I learn?",
        answerHtml: "<p>You will learn industry tools like Autodesk Revit, Navisworks, and other BIM-related software.</p>",
      },
      { q: "Is this course suitable for beginners?",
        answerHtml: "<p>Yes, the course starts from basics and gradually moves to advanced concepts.</p>",
      },
      { q: "What is the duration of the BIM course?",
        answerHtml: "<p>The course typically lasts between 4 to 12 weeks depending on the module.</p>",
      },
      { q: "Will I get practical training?",
        answerHtml: "<p>Yes, the course focuses on hands-on training with real-world projects.</p>",
      },
      { q: "Do you provide certification?",
        answerHtml: "<p>Yes, you will receive an industry-recognized certification after completion.</p>",
      },
      { q: "Do you offer internship opportunities?",
        answerHtml: "<p>Yes, we provide internship opportunities with a certificate for real project experience.</p>",
      },
      { q: "Is placement assistance available?",
        answerHtml: "<p>Yes, we offer lifetime placement assistance including interview preparation and portfolio support.</p>",
      },
      { q: "Can I learn BIM online?",
        answerHtml: "<p>Yes, the course is available online with flexible learning options.</p>",
      },
      { q: "What job roles can I apply for after this course?",
        answerHtml: "<p>You can apply for roles like BIM Modeler, BIM Engineer, Revit Designer, and Coordinator.</p>",
      },
      { q: "Do I need prior software knowledge?",
        answerHtml: "<p>No, basic computer knowledge is enough to start.</p>",
      },
      { q: "What projects will I work on?",
        answerHtml: "<p>You will work on architectural, structural, and MEP-based BIM projects.</p>",
      },
      { q: "Will I learn clash detection?",
        answerHtml: "<p>Yes, you will learn clash detection using Navisworks.</p>",
      },
      { q: "Is this course useful for career growth?",
        answerHtml: "<p>Yes, BIM skills are in high demand globally and open multiple career opportunities.</p>",
      },
      { q: "Will I get recorded sessions?",
        answerHtml: "<p>Yes, recorded sessions may be provided for revision.</p>",
      },
      { q: "What makes this course different?",
        answerHtml: "<p>We focus on practical training, real projects, and job readiness.</p>",
      },
      { q: "How will this course help in getting a job?",
        answerHtml: "<p>It helps you build a strong portfolio, gain practical skills, and prepare for interviews.</p>",
      },
      { q: "What support will I get during the course?",
        answerHtml: "<p>You will get mentor support, doubt sessions, and career guidance.</p>",
      },
      { q: "How can I enroll?",
        answerHtml: "<p>You can enroll through our website or contact our team directly.</p>",
      },      
    
    ],
    learningOutcomes: [
      "Master BIM concepts and workflows used in real-world projects",
      "Create detailed 3D models using tools like Autodesk Revit",
      "Generate accurate drawings, documentation, and project data",
      "Perform clash detection and coordination using Navisworks",
      "Understand multi-discipline collaboration (Architecture, Structure, MEP)",
      "Build a strong portfolio and become job-ready for BIM roles",
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
    upfrontInr: 49000,
    seatBookingInr: 5000,
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAM_CATALOG.find((p) => p.id === id);

  
}
