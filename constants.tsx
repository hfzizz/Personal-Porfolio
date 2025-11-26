import { ExperienceItem, ProjectItem, EducationItem, SkillCategory } from './types';
import { Terminal, Folder, Briefcase, Code, GraduationCap, Mail } from 'lucide-react';

export const RESUME_DATA = {
  name: "Mohammad Hafiz Izzuddin Bin Haji Tejuddin",
  shortName: "Hafiz Izzuddin",
  contact: {
    phone: "(+673) 8900205",
    altPhone: "7202543",
    email: "izzuddin315@gmail.com",
    linkedin: "Linkedin",
    github: "Github"
  },
  objective: "Motivated Applied Artificial Intelligence graduate with practical experience in AI, web development, and IoT projects. Strong problem-solving skills and a proven ability to work in teams. Eager to contribute technical expertise and creativity to support organizational goals and continuous innovation.",
  education: [
    {
      institution: "Universiti Brunei Darussalam",
      degree: "Bachelor of Digital Science, Major in Applied AI",
      period: "Aug 2022 - May 2025",
      cgpa: "3.37"
    }
  ] as EducationItem[],
  projects: [
    {
      name: "HR Management System",
      stack: "Django, HTMX, PostgreSQL",
      description: [
        "Built a full-stack HR platform tailored for university needs, focusing on employee records and appraisals workflows.",
        "Developed custom Employee and Appraisals modules, including role-based access (HR, appraiser, appraisee)."
      ]
    },
    {
      name: "RoboTeach - NAO Humanoid Robot",
      stack: "Python, Flask, NAOqi, AI, Web Development",
      description: [
        "Developed a humanoid robot system integration speech recognition, local LLMs, and AI-driven dialogue.",
        "Built two-part architecture: Python 3 script for speech-to-text & LLM responses, and Python 2.7 script for robot control using NAOqi.",
        "Integrated a web-based chatbot interface for user-friendly human-robot interaction.",
        "Showcased at National Teachers' Day STEAM Exhibition, attended by His Majesty, representing UBD."
      ]
    }
  ] as ProjectItem[],
  experience: [
    {
      company: "Dynamik Technologies Sdn Bhd",
      role: "Summer Internship - Change Management Analyst",
      period: "Jun 2023 - Aug 2023",
      details: [
        "Produced user, quick, and video guides for the Sistem Sumber Manusia (SSM) system.",
        "Supported on-site demos and 'train the trainer' sessions for government staff.",
        "Managed client communication by monitoring a shared mailbox, replying to queries, and extracting data for reports.",
        "Gained hands-on experience with tools like SAP GUI, FIORI, Canva, and MS Excel/PowerPoint.",
        "Developed strong communication, documentation, and time management skills in cross-functional teams."
      ]
    },
    {
      company: "Haz Bridal Boutique",
      role: "Summer Internship - Digital Transformation Specialist",
      period: "Jun 2024 - Aug 2024",
      details: [
        "Digitized customer records and business workflows using Airtable, improving accuracy and efficiency.",
        "Built a new website on Framer to showcase services, packages, and integrate social media.",
        "Created user and video guides to train staff on the new digital system.",
        "Designed dashboards and reports for customer trends and payment tracking.",
        "Strengthened skills in data management, problem-solving, and digital adoption."
      ]
    }
  ] as ExperienceItem[],
  skills: [
    {
      category: "Languages & Core",
      items: ["Python", "Java", "HTML", "SQL"]
    },
    {
      category: "Frameworks & Tools",
      items: ["Django", "HTMX", "Flask", "React (Learning)", "PostgreSQL", "Airtable", "Framer", "Microsoft Office", "SAP GUI"]
    },
    {
      category: "AI & Robotics",
      items: ["Applied AI", "Local LLMs", "Speech Recognition", "NAOqi", "Reinforcement Learning"]
    },
    {
      category: "Soft Skills",
      items: ["Leadership", "Teamwork", "Time Management", "Problem Solving", "Documentation"]
    }
  ] as SkillCategory[],
  certifications: [
    "Google Data Analytics",
    "IBM Applied AI",
    "IBM AI Developer",
    "Fundamentals of Reinforcement Learning"
  ]
};

export const MENU_ITEMS = [
  { id: 'home', label: '~/home', icon: <Terminal size={18} /> },
  { id: 'education', label: '~/education', icon: <GraduationCap size={18} /> },
  { id: 'experience', label: '~/experience', icon: <Briefcase size={18} /> },
  { id: 'projects', label: '~/projects', icon: <Code size={18} /> },
  { id: 'skills', label: '~/skills', icon: <Folder size={18} /> },
  { id: 'contact', label: '~/contact', icon: <Mail size={18} /> },
];