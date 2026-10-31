/* Change this file to get your personal Portfolio */

// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation"; // Rename to your file name for custom animation
import petzLogo from "./assets/images/petz_logo.svg";

// Splash Screen

const splashScreen = {
  enabled: false, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: false // Set to false to use static SVG
};

const birthDate = new Date("1992-09-15");
const currentDate = new Date();
const myage = Math.floor((currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

const firstxp = new Date("2012-01-01");
const totalxp = Math.floor((currentDate - firstxp) / (365.25 * 24 * 60 * 60 * 1000));

const greeting = {
  username: "Rennan Chagas",
  title: "Hi all, I'm Rennan",
  subTitle: emoji(
    `I am a ${myage} years old Brazilian with PhD in Industrial Engineering & OR. For ${totalxp} years I've been responsible for providing optimization and analytics solutions in different fields such as manufacturing, logistics, marketing science, software development, and consulting.`
  ),
  resumeLink:
    "https://drive.google.com/file/d/17ylDJ0VQmW2Ep32ZvoLaPLeQ0PlzIdSh/view?usp=sharing", // Set to empty to hide the button
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/chagasrennan",
  linkedin: "https://www.linkedin.com/in/rseimetz/",
  gmail: "chagasrennan@gmail.com",
  // gitlab: "https://gitlab.com/saadpasta",
  // facebook: "https://www.facebook.com/saad.pasta7",
  // medium: "https://medium.com/@saadpasta",
  // stackoverflow: "https://stackoverflow.com/users/10422806/saad-pasta",
  // Instagram, Twitter and Kaggle are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle: "DATA SCIENTIST WITH OVER A DECADE OF EXPERIENCE BUILDING MODELS AND SOLVING PROBLEMS",
  skills: [
    emoji(
      "⚡ Smart optimization solutions that streamline complex processes across industries"
    ),
    emoji("⚡ impactful data science models that drive business success, from marketing strategies to automated decision-making."),
    emoji(
      "⚡ Apply generative AI and machine learning to transform ideas into innovative, cutting-edge projects"
    )
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "Data Science",
      fontAwesomeClassname: "fas fa-chart-line"
    },
    {
      skillName: "Optimization",
      fontAwesomeClassname: "fas fa-route"
    },
    {
      skillName: "Artificial Intelligence",
      fontAwesomeClassname: "fa fa-brain"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "sql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "aws",
      fontAwesomeClassname: "fab fa-aws"
    },
    {
      skillName: "google-cloud",
      fontAwesomeClassname: "fab fa-google"
    },
    // {
    //   skillName: "docker",
    //   fontAwesomeClassname: "fa-light fa-microship-ai"
    // },
    // {
    //   skillName: "docker",
    //   fontAwesomeClassname: "fab fa-docker"
    // },
  ],
  display: true // Set false to hide this section, defaults to true
};

// Education Section

const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "Federal University of Rio de Janeiro - UFRJ",
      logo: require("./assets/images/ufrj-vertical-cor-rgb-telas.png"),
      subHeader: "Doctor of Science in Industrial Engineering - Operations Research",
      duration: "June 2015 - September 2022",
      desc: "Planning offshore supply deliveries with multiproduct vessels",
      descBullets: [
        "Interniship at CIRRELT - Centre interuniversitaire de recherche sur les reseaux d'entreprise, la logistique et le transport. Montreal - Canada",
      ]
    },
    {
      schoolName: "Federal University of Rio de Janeiro - UFRJ",
      logo: require("./assets/images/ufrj-vertical-cor-rgb-telas.png"),
      subHeader: "Master of Science in Industrial Engineering - Operations Research",
      duration: "March 2013 - May 2015",
      desc: "The Berth Scheduling Problem for Offshore Supply Operations",
      // descBullets: [
      //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      // ]
    },
    {
      schoolName: "Fluminense Federal University - UFF",
      logo: require("./assets/images/UFF_brasao.png"),
      subHeader: "Bachelor in Industrial Engineering",
      duration: "March 2008 - December 2012",
      // desc: "Ranked top 10% in the program. Took courses about Software Engineering, Web Security, Operating Systems, ...",
      // descBullets: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit"]
    }
  ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: true, //Set it to true to show Proficiency Section
  experience: [
    {
      Stack: "Portuguese - Native", //Insert stack or technology you have experience in
      progressPercentage: "100%" //Insert relative proficiency in percentage
    },
    {
      Stack: "English - Fluent",
      progressPercentage: "100%"
    },
    {
      Stack: "French - Advanced",
      progressPercentage: "80%"
    },
    {
      Stack: "German - Basic",
      progressPercentage: "40%"
    }
  ],
  displayCodersrank: true // Set true to display codersrank badges section need to changes your username in src/containers/skillProgress/skillProgress.js:17:62, defaults to false
};

// Work experience section

const workExperiences = {
  display: true, //Set it to true to show workExperiences Section
  experience: [
    {
      role: "Data Science Manager",
      company: "Petz (now Petz–Cobasi)",
      companylogo: petzLogo,
      logoFit: "contain",
      date: "Dec 2024 – Sep 2025",
      employmentType: "Contractor",
      desc: "Led hands-on Data Science initiatives across retail, supply chain, operations, e-commerce and customer analytics at one of Brazil’s leading pet retailers. Partnered with business stakeholders to identify and prioritize opportunities, structure projects, mentor Data Scientists and translate models and technical trade-offs into operational decisions during the Petz–Cobasi merger process.",
      descBullets: [
        "Demand Forecasting & Inventory Optimization — Redesigned SKU-level forecasting and safety stock using demand patterns, seasonality, service-level targets and supplier lead-time uncertainty. Identified multi-million-real opportunities to reduce inventory while preserving product availability.",
        "Supply Chain & Network Optimization — Developed stochastic analyses of inventory consolidation and risk pooling, including studies supporting Petz–Cobasi integration planning and evaluating network trade-offs in inventory, cost, risk and responsiveness.",
        "Operations Research & Workforce Planning — Built optimization models that translate forecasted workload into staffing schedules while respecting capacity, shift and labor constraints.",
        "Search & Recommendation — Developed semantic product search, retrieval and reranking, recommendation models and commercial ranking strategies for e-commerce.",
        "Customer Science — Applied segmentation, RFM, repurchase analysis, LTV, cohorts and experimentation to support personalization, retention and commercial decisions.",
        "Data Science Platform — Helped evolve analytical workloads across Databricks, Snowflake and Snowpark, building reusable datasets and APIs with attention to performance, integration and cloud cost."
      ],
      coreAreas: "Data Science Leadership · Operations Research · Supply Chain Analytics · Demand Forecasting · Inventory Optimization · Machine Learning · Recommender Systems · Customer Analytics · Snowflake · Python · SQL"
    },
    {
      role: "Senior Data Scientist",
      company: "TechnipFMC",
      companylogo: require("./assets/images/technip_logo.png"),
      date: "Mar 2022 – Dec 2024",
      desc: "Member of global data science team responsible designing models and data process for business challenges such as:",
      descBullets: [
        "Automation and optimization of S&OP process",
        "Reduced costs trough Inventory optimization",
        "Optimization of offshore windfarm systems ",
        "Implementation of an AI governance framework",
        "Automated documents summarization with LLMs",
      ]
    },
    {
      role: "Senior Data Scientist",
      company: "MINT",
      companylogo: require("./assets/images/mint_logo.png"),
      date: "Mar 2021 – Mar 2022",
      desc: "Member of international development team responsible for algorithm and software design for marketing challenges such as: budget optimization, ROI measurement and decision automation."
    },
    {
      role: "Lead Data Scientist",
      company: "WMcCann",
      companylogo: require("./assets/images/wmccann_logo.png"),
      date: "Mar 2020 – Mar 2021",
      desc: "Business Analytics and Machine Learning; AI/ML and optimization techniques applied to media and marketing mix modeling; Causal impact analysis and campaign ROI measurement; Processes and reports automations"
    },
    {
      role: "Researcher",
      company: "LORDE",
      companylogo: require("./assets/images/lorde_logo.png"),
      date: "Aug 2013 – Sep 2022",
      desc: "In the past years, I've been working with logistics consulting with focus to develop and design logistics networks, task scheduling using integer programming anda data analysis tools. Projects in partnership with the national and largest oil company Petrobras; Evaluation of Petrobras offshore supply cargo operations design and analysis of new supply policies. Improvement in port operational efficiency through berth scheduling and vessel routes optimization and operations simulation."
    },
    {
      role: "Visiting Research Scholar",
      company: "CIRRELT",
      companylogo: require("./assets/images/cirrelt_logo.png"),
      date: "Sep 2017 – Jan 2018",
      desc: "Period of five months as visiting researcher at CIRRELT, one of the most prolific research centers in Operations Research and Logistics Field."
    },
    {
      role: "Intern",
      company: "BBM Bank",
      companylogo: require("./assets/images/bbm_logo.png"),
      date: "Sep 2017 – Jan 2018",
      desc: "Currently BOCOM BBM - Period of five months as visiting researcher at CIRRELT, one of the most prolific research centers in Operations Research and Logistics Field."
    },
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  showGithubProfile: "fasle", // Set true or false to show Contact profile using Github, defaults to true
  display: false // Set false to hide this section, defaults to true
};

// Some big projects you have worked on

const bigProjects = {
  title: "Big Projects",
  subtitle: "SOME STARTUPS AND COMPANIES THAT I HELPED TO CREATE THEIR TECH",
  projects: [
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/saayaHealthLogo.webp"),
      projectName: "Saayahealth",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/nextuLogo.webp"),
      projectName: "Nextu",
      projectDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://nextu.se/"
        }
      ]
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Achievement Section
// Include certificates, talks etc

const achievementSection = {
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [
    {
      title: "ANP Award for Technological Innovation",
      subtitle:
        "Finalist - 2018",
      image: require("./assets/images/Anp-logo-3.png"),
      imageAlt: "ANP Prize",
      footerLink: [
        {
          name: "View ANP website (portuguese only)",
          url: "https://www.gov.br/anp/pt-br/assuntos/tecnologia-meio-ambiente/premio-anp-inovacao-tecnologica/edicoes-anteriores/premio-anp-inovacao-tecnologica-2018"
        },
      ]
    },
    {
      title: "Brazilian Physics Olympiad",
      subtitle:
        "Silver Medal - 2007",
      image: require("./assets/images/obf.webp"),
      imageAlt: "Obf",
      footerLink: [
        {
          name: "OBF Website",
          url: "https://sec.sbfisica.org.br/olimpiadas/obf2007/resultadofinal_1serie.htm"
        }
      ]
    },
    {
      title: "Rio de Janeiro State Chemistry Olympiad",
      subtitle:
        "Silver Medal  - 2007 ",
      image: require("./assets/images/oqrj.jpeg"),
      imageAlt: "Oqrj",
      footerLink: [
        {
          name: "OQRJ Website",
          url: ""
        }
      ]
    },
    {
      title: "Rio de Janeiro State Mathematics Olympiad",
      subtitle:
        "Bonze Medal  - 2007",
      image: require("./assets/images/omerj_sq.png"),
      imageAlt: "Omerj",
      footerLink: [
        {
          name: "OMERJ Website",
          url: "https://sites.google.com/site/omerj314/lista-de-premiados?authuser=0"
        }
      ]
    },
  ],
  display: true // Set false to hide this section, defaults to true
};

// Blogs Section

const blogSection = {
  title: "Writing",
  subtitle:
    "Thoughts and white papers on data science, optimization, and research.",
  display: true
};

// Talks Sections

const talkSection = {
  title: "TALKS",
  subtitle: emoji(
    "I LOVE TO SHARE MY LIMITED KNOWLEDGE AND GET A SPEAKER BADGE 😅"
  ),

  talks: [
    {
      title: "Build Actions For Google Assistant",
      subtitle: "Codelab at GDG DevFest Karachi 2019",
      slides_url: "https://bit.ly/saadpasta-slides",
      event_url: "https://www.facebook.com/events/2339906106275053/"
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Podcast Section

const podcastSection = {
  title: emoji("Podcast 🎙️"),
  subtitle: "I LOVE TO TALK ABOUT MYSELF AND TECHNOLOGY",

  // Please Provide with Your Podcast embeded Link
  podcast: [
    "https://anchor.fm/codevcast/embed/episodes/DevStory---Saad-Pasta-from-Karachi--Pakistan-e9givv/a-a15itvo"
  ],
  display: false // Set false to hide this section, defaults to true
};

// Resume Section
const resumeSection = {
  title: "Resume",
  subtitle: "Feel free to download my resume",

  // Please Provide with Your Podcast embeded Link
  display: false // Set false to hide this section, defaults to true
};

// Publications Section

const publicationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "Relax-and-fix heuristics for the Multi-Commodity PSV Planning Problem with Order Selection and Time Window Decisions",
      logo: require("./assets/images/academic.png"),
      subHeader: "Computers & Industrial Engineering",
      duration: "March 2023",
      desc: "https://doi.org/10.1016/j.cie.2023.109040",
      // descBullets: [
      //   "",
      // ]
    },
    {
      schoolName: "A solution framework for the integrated periodic supply vessel planning and port scheduling in oil and gas supply logistics",
      logo: require("./assets/images/academic.png"),
      subHeader: "Optimization and Engineering",
      duration: "April 2022",
      desc: "https://doi.org/10.1007/s11081-022-09723-6",
    },
    {
      schoolName: "A solution framework for the integrated problem of cargo assignment, fleet sizing, and delivery planning in offshore logistics",
      logo: require("./assets/images/academic.png"),
      subHeader: "Computers & Industrial Engineering",
      duration: "November 2021",
      desc: "https://doi.org/10.1016/j.cie.2021.107653",
    },
    {
      schoolName: "Programação de Cargas em Barcos de Suprimento de Unidades Marítimas",
      logo: require("./assets/images/conference.png"),
      subHeader: "Anais do Simpósio Brasileiro de Pesquisa Operacional",
      duration: "2018",
      desc: "https://doi.org/10.59254/sbpo-2018-85367",
    },
    {
      schoolName: "Decision suport tool applied to supply vessel scheduling in offshore logistics",
      logo: require("./assets/images/conference.png"),
      subHeader: "Rio Oil & Gas Conference, 19., 2018, Rio de Janeiro",
      duration: "2018",
      desc: "https://biblioteca.ibp.org.br/scripts/bnmapi.exe?router=upload/32127",
    },
    {
      schoolName: "The problem of scheduling offshore supply port operations",
      logo: require("./assets/images/conference.png"),
      subHeader: "XVIII Latin-Iberoamerican Conference on Operations Research, CLAIO 2016",
      duration: "2018",
      desc: "https://easychair.org/smart-program/CLAIO-2016/2016-10-03.html#talk:32088",
    },
  ]
};


const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Discuss a project or just want to say hi? My Inbox is open for all.",
  // number: "+92-0000000000",
  email_address: "chagasrennan@gmail.com"
};

// Twitter Section

const twitterDetails = {
  userName: "twitter", //Replace "twitter" with your twitter username without @
  display: false // Set true to display this section, defaults to false
};

const isHireable = true; // Set false if you are not looking for a job. Also isHireable will be display as Open for opportunities: Yes/No in the GitHub footer

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  openSource,
  bigProjects,
  achievementSection,
  publicationInfo,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo,
  twitterDetails,
  isHireable,
  resumeSection
};
