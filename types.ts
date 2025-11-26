export enum SectionType {
  HOME = 'home',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  SKILLS = 'skills',
  EDUCATION = 'education',
  CONTACT = 'contact'
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  details: string[];
}

export interface ProjectItem {
  name: string;
  stack: string;
  description: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  cgpa: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}
