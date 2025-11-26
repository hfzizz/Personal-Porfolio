import React, { useState, useEffect, useRef } from 'react';
import { SectionType } from './types';
import { RESUME_DATA, MENU_ITEMS } from './constants';
import TerminalWindow from './components/TerminalWindow';
import Prompt from './components/Prompt';
import TypingEffect from './components/TypingEffect';
import { 
  Terminal, 
  MapPin, 
  ExternalLink, 
  ChevronRight, 
  Battery,
  Wifi,
  Clock
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.HOME);
  const [bootSequence, setBootSequence] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Terminal Interaction State
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{path: string, command: string, output: React.ReactNode}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulating a boot sequence
  useEffect(() => {
    const logs = [
      "Initialising Arch Linux kernel...",
      "Loading drivers...",
      "Mounting /home/hafiz...",
      "Starting graphical interface...",
      "Loading resume data...",
      "Welcome, User."
    ];
    
    let delay = 0;
    logs.forEach((log, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setBootLogs(prev => [...prev, `[ OK ] ${log}`]);
        if (index === logs.length - 1) {
          setTimeout(() => setBootSequence(false), 800);
        }
      }, delay);
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll Logic
  // 1. When switching sections (Sidebar click), scroll to TOP to show new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  // 2. When executing commands (History update), scroll to BOTTOM
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab Completion Logic
    if (e.key === 'Tab') {
      e.preventDefault();
      const args = input.split(' ');
      const cmd = args[0].toLowerCase();
      
      // 1. Complete Command
      if (args.length === 1) {
        const availableCommands = ['help', 'ls', 'cd', 'cat', 'clear', 'whoami', 'reboot', 'sudo'];
        const match = availableCommands.find(c => c.startsWith(cmd));
        if (match) setInput(match);
      }
      
      // 2. Complete Arguments
      else if (args.length === 2) {
        const arg = args[1].toLowerCase();
        
        if (cmd === 'cd') {
          // Directories: home, education, etc.
          const dirs = MENU_ITEMS.map(i => i.id);
          const labels = MENU_ITEMS.map(i => i.label.replace('~/', ''));
          const allDirs = [...dirs, ...labels, '..', '~'];
          const match = allDirs.find(d => d.startsWith(arg));
          if (match) setInput(`${cmd} ${match}`);
        }
        
        else if (cmd === 'cat') {
          // Files
          const files = ['resume.pdf', 'secret.txt', 'work_history.txt', 'degree.info', 'list_capabilities.sh', 'contact.card'];
          const match = files.find(f => f.startsWith(arg));
          if (match) setInput(`${cmd} ${match}`);
        }
      }
      return;
    }

    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;

      const currentPath = activeSection === SectionType.HOME ? '~' : `~/${activeSection}`;
      let output: React.ReactNode = null;
      
      const args = cmd.split(' ').filter(Boolean);
      const command = args[0].toLowerCase();
      const argument = args[1]?.toLowerCase();

      switch (command) {
        case 'help':
          output = (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300 animate-print">
              <div><span className="text-blue-400 font-bold">ls</span> - List directory contents</div>
              <div><span className="text-blue-400 font-bold">cd &lt;dir&gt;</span> - Change directory</div>
              <div><span className="text-blue-400 font-bold">cat &lt;file&gt;</span> - Display file content</div>
              <div><span className="text-blue-400 font-bold">clear</span> - Clear terminal</div>
              <div><span className="text-blue-400 font-bold">whoami</span> - Display user info</div>
              <div><span className="text-blue-400 font-bold">reboot</span> - Restart system</div>
            </div>
          );
          break;
          
        case 'ls':
          output = (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-blue-300 font-bold animate-print">
              {MENU_ITEMS.map(item => (
                <span key={item.id}>{item.label.replace('~/', '')}/</span>
              ))}
              <span className="text-slate-500 font-normal">resume.pdf</span>
              <span className="text-slate-500 font-normal">secret.txt</span>
            </div>
          );
          break;

        case 'cd':
          if (!argument || argument === '~') {
            setActiveSection(SectionType.HOME);
          } else if (argument === '..') {
            setActiveSection(SectionType.HOME);
          } else {
            const section = MENU_ITEMS.find(item => item.id === argument || item.label.includes(argument));
            if (section) {
              setActiveSection(section.id as SectionType);
            } else {
              output = <span className="text-red-400">cd: no such file or directory: {argument}</span>;
            }
          }
          break;

        case 'clear':
          setHistory([]);
          setInput('');
          return;

        case 'whoami':
          output = "visitor";
          break;

        case 'sudo':
          output = <span className="text-yellow-400">user is not in the sudoers file. This incident will be reported.</span>;
          break;

        case 'reboot':
          setBootSequence(true);
          setHistory([]);
          setInput('');
          return;

        case 'cat':
          if (argument === 'resume.pdf') {
             output = "Opening resume PDF viewer... [Simulated]";
          } else if (argument === 'secret.txt') {
             output = "The secret is: You are awesome!";
          } else if (argument?.includes('work')) {
             setActiveSection(SectionType.EXPERIENCE);
             output = "Displaying work history...";
          } else {
             output = <span className="text-red-400">cat: {argument || ''}: No such file or directory</span>;
          }
          break;

        default:
          output = <span className="text-red-400">zsh: command not found: {command}</span>;
      }

      setHistory(prev => [...prev, { path: currentPath, command: cmd, output }]);
      setInput('');
    }
  };

  const handleSidebarClick = (id: SectionType) => {
    setActiveSection(id);
    // Note: We deliberately do NOT add to history here to keep the terminal clean
    // when using the GUI navigation.
  };

  const renderContent = () => {
    switch (activeSection) {
      case SectionType.HOME:
        return (
          <div className="space-y-6 animate-print">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* ASCII Art / Logo Placeholder */}
              <div className="hidden md:block text-blue-500 font-bold whitespace-pre text-xs sm:text-sm leading-none select-none opacity-80 animate-pulse">
{`
      /\\
     /  \\
    /    \\
   /      \\
  /   __   \\
 /   |  |   \\
/____|__|____\\
`}
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">user</span>
                  <span className="text-slate-500">@</span>
                  <span className="text-blue-400 font-bold">hafiz-pc</span>
                </div>
                <div className="h-px bg-slate-800 w-full my-2"></div>
                
                <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm sm:text-base">
                  <span className="text-blue-400">OS</span>
                  <span className="text-slate-300">Arch Linux (Portfolio Edition)</span>
                  
                  <span className="text-blue-400">Host</span>
                  <span className="text-slate-300">{RESUME_DATA.shortName}</span>
                  
                  <span className="text-blue-400">Role</span>
                  <span className="text-slate-300">Applied AI Graduate</span>
                  
                  <span className="text-blue-400">Uptime</span>
                  <span className="text-slate-300">22 Years, 8 Months</span>
                  
                  <span className="text-blue-400">Shell</span>
                  <span className="text-slate-300">zsh 5.9</span>
                  
                  <span className="text-blue-400">Location</span>
                  <span className="text-slate-300">Brunei Darussalam</span>
                </div>

                <div className="mt-6 p-4 border border-slate-800 rounded bg-slate-900/50">
                   <p className="text-slate-300 leading-relaxed">
                    <span className="text-blue-400 font-bold">Objective:</span> 
                    <TypingEffect text={` ${RESUME_DATA.objective}`} speed={10} delay={100} />
                   </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-blue-400 border-b border-blue-900/50 pb-2 mb-4 font-bold flex items-center gap-2">
                <Terminal size={16} /> RECENT ACTIVITY
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Latest Project", value: "RoboTeach", sub: "NAO Humanoid Robot Integration" },
                  { label: "Education", value: "Bachelor Digital Science", sub: "Universiti Brunei Darussalam" },
                  { label: "Focus", value: "Applied AI", sub: "IoT, Web Dev, Automation" }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-slate-900 border border-slate-800 p-3 hover:border-blue-500/50 transition-colors cursor-default group animate-print stagger-${idx+1}`}>
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className="text-blue-300 font-bold group-hover:text-blue-400">
                      <TypingEffect text={item.value} speed={30} delay={400 + (idx * 200)} />
                    </div>
                    <div className="text-xs text-slate-400 mt-2">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case SectionType.EXPERIENCE:
        return (
          <div className="space-y-8 animate-print">
            <Prompt path="~/experience" command="cat work_history.txt" />
            <div className="space-y-8 mt-4">
              {RESUME_DATA.experience.map((job, idx) => (
                <div key={idx} className={`relative pl-6 border-l border-slate-800 hover:border-blue-600 transition-colors duration-300 animate-print stagger-${idx+1}`}>
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-slate-950 group-hover:bg-blue-500"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <h3 className="text-xl text-blue-300 font-bold">
                       <TypingEffect text={job.role} speed={20} delay={idx * 200} />
                    </h3>
                    <span className="text-xs bg-slate-800 text-blue-200 px-2 py-1 rounded mt-1 sm:mt-0 w-fit">{job.period}</span>
                  </div>
                  <div className="text-cyan-600 font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={14} /> {job.company}
                  </div>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    {job.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">›</span>
                        <TypingEffect 
                          text={detail} 
                          speed={5} 
                          delay={300 + (idx * 300) + (dIdx * 50)} 
                          as="span"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case SectionType.PROJECTS:
        return (
          <div className="space-y-6 animate-print">
            <Prompt path="~/projects" command="ls -la ./portfolio" />
            <div className="grid grid-cols-1 gap-6 mt-4">
              {RESUME_DATA.projects.map((project, idx) => (
                <div key={idx} className={`border border-slate-800 bg-slate-900/30 p-5 hover:border-blue-500/50 transition-all group animate-print stagger-${idx+1}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg text-blue-300 font-bold group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-mono text-cyan-400 border border-cyan-900/50 bg-cyan-950/30 px-2 py-1 rounded">
                      {project.stack}
                    </span>
                  </div>
                  <ul className="space-y-2 text-slate-300 text-sm mb-4">
                    {project.description.map((desc, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-slate-600">-</span>
                        <TypingEffect 
                          text={desc} 
                          speed={5} 
                          delay={200 + (idx * 200) + (dIdx * 100)} 
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case SectionType.EDUCATION:
        return (
          <div className="space-y-6 animate-print">
            <Prompt path="~/education" command="cat degree.info" />
            <div className="mt-4 border border-blue-900/30 bg-blue-950/10 p-6 rounded relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute -right-10 -top-10 text-slate-800 opacity-20 transform rotate-12">
                 <Terminal size={200} />
               </div>
               
               {RESUME_DATA.education.map((edu, idx) => (
                 <div key={idx} className="relative z-10 animate-print">
                   <h2 className="text-2xl text-blue-300 font-bold mb-1">
                     <TypingEffect text={edu.institution} speed={20} delay={100} />
                   </h2>
                   <h3 className="text-xl text-slate-200 mb-4">
                     <TypingEffect text={edu.degree} speed={20} delay={800} />
                   </h3>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                      <div className="bg-slate-900/80 p-3 border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Period</div>
                        <div className="text-blue-400 font-mono">{edu.period}</div>
                      </div>
                      <div className="bg-slate-900/80 p-3 border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">CGPA</div>
                        <div className="text-green-400 font-mono">{edu.cgpa}</div>
                      </div>
                   </div>

                   <div className="mt-6">
                     <h4 className="text-sm text-cyan-500 font-bold mb-2 uppercase tracking-wide">Certifications</h4>
                     <div className="flex flex-wrap gap-2">
                        {RESUME_DATA.certifications.map((cert, cIdx) => (
                          <div key={cIdx} className={`animate-print stagger-${(cIdx % 5) + 1}`}>
                             <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 border border-slate-700 hover:border-blue-500 hover:text-blue-300 transition-colors cursor-default">
                                {cert}
                              </span>
                          </div>
                        ))}
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case SectionType.SKILLS:
        return (
          <div className="space-y-6 animate-print">
            <Prompt path="~/skills" command="./list_capabilities.sh" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {RESUME_DATA.skills.map((category, idx) => (
                <div key={idx} className={`border border-slate-800 bg-slate-950 p-4 relative animate-print stagger-${idx+1}`}>
                  <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 pb-2 border-b border-slate-800">
                     <span className="text-slate-600">0{idx + 1}.</span> {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {category.items.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 group cursor-default">
                        <div className="w-1.5 h-1.5 bg-slate-700 group-hover:bg-green-500 transition-colors"></div>
                        <TypingEffect 
                           text={skill} 
                           speed={10} 
                           delay={300 + (idx * 200) + (sIdx * 30)}
                           className="text-slate-300 text-sm group-hover:text-white transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case SectionType.CONTACT:
        return (
          <div className="space-y-6 animate-print">
             <Prompt path="~/contact" command="whoami --contact" />
             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 border border-blue-900/30 bg-slate-900/50 flex flex-col items-center justify-center text-center hover:bg-slate-900 transition-colors animate-print stagger-1">
                   <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                     <Battery size={24} />
                   </div>
                   <h3 className="text-slate-400 text-sm mb-1">Phone</h3>
                   <p className="text-xl text-blue-300 select-all">
                     <TypingEffect text={RESUME_DATA.contact.phone} delay={200} />
                   </p>
                   <p className="text-sm text-slate-500 mt-1">WA available</p>
                </div>
                
                <div className="p-6 border border-blue-900/30 bg-slate-900/50 flex flex-col items-center justify-center text-center hover:bg-slate-900 transition-colors animate-print stagger-2">
                   <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                     <Wifi size={24} />
                   </div>
                   <h3 className="text-slate-400 text-sm mb-1">Email</h3>
                   <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-xl text-blue-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4">
                      <TypingEffect text={RESUME_DATA.contact.email} delay={400} />
                   </a>
                </div>

                <div className="sm:col-span-2 p-6 border border-slate-800 bg-slate-950 animate-print stagger-3">
                  <h3 className="text-blue-400 mb-4 font-bold border-b border-slate-800 pb-2">Social Connections</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <a href="#" className="flex-1 flex items-center justify-between p-3 border border-slate-800 hover:border-blue-500 hover:bg-slate-900 group transition-all">
                        <span className="text-slate-300 group-hover:text-white">LinkedIn Profile</span>
                        <ExternalLink size={16} className="text-slate-600 group-hover:text-blue-400" />
                     </a>
                     <a href="#" className="flex-1 flex items-center justify-between p-3 border border-slate-800 hover:border-blue-500 hover:bg-slate-900 group transition-all">
                        <span className="text-slate-300 group-hover:text-white">Github Profile</span>
                        <ExternalLink size={16} className="text-slate-600 group-hover:text-blue-400" />
                     </a>
                  </div>
                </div>
             </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (bootSequence) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-4 sm:p-8 flex flex-col justify-end">
        <div className="space-y-1">
          {bootLogs.map((log, i) => (
            <div key={i} className={`${i === bootLogs.length - 1 ? 'animate-pulse text-blue-400' : 'text-slate-400'}`}>
              {log}
            </div>
          ))}
          <div className="w-2.5 h-5 bg-slate-400 animate-pulse mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono selection:bg-blue-500/30 selection:text-blue-200 flex flex-col overflow-hidden">
      {/* Top Status Bar (i3wm style) */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-1 px-4 flex justify-between items-center select-none sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <span className="bg-blue-600 text-slate-950 px-2 py-0.5 font-bold">1</span>
          <span className="text-blue-400 hidden sm:inline">/home/hafiz/portfolio</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1">
            <Wifi size={12} /> <span className="hidden sm:inline">Wired</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery size={12} /> <span className="hidden sm:inline">100%</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Clock size={12} /> <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

      <div className="flex-grow p-2 sm:p-4 md:p-6 grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-[240px_1fr] lg:grid-rows-1 gap-4 max-w-7xl mx-auto w-full h-[calc(100vh-40px)]">
        {/* Sidebar Navigation */}
        <TerminalWindow title="File Manager" className="h-fit lg:h-full flex flex-col overflow-hidden">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 mb-2 px-2 uppercase tracking-widest">Directories</div>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSidebarClick(item.id as SectionType)}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 text-sm transition-all duration-200 border border-transparent
                  ${activeSection === item.id 
                    ? 'bg-blue-900/20 text-blue-300 border-blue-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
              >
                <span className={`${activeSection === item.id ? 'text-blue-400' : 'text-slate-600'}`}>
                  {item.icon}
                </span>
                {item.label}
                {activeSection === item.id && <ChevronRight size={14} className="ml-auto text-blue-500" />}
              </button>
            ))}
            
            <div className="mt-8 border-t border-slate-800 pt-4 hidden lg:block">
              <div className="text-xs text-slate-500 mb-2 px-2 uppercase tracking-widest">System</div>
              <div className="px-3 py-2 text-xs text-slate-500 font-mono">
                <div>Mem: 512MiB / 16GiB</div>
                <div className="w-full bg-slate-800 h-1 mt-1 mb-2">
                   <div className="bg-blue-500 h-1 w-[4%]"></div>
                </div>
                <div>CPU: 2%</div>
                <div className="w-full bg-slate-800 h-1 mt-1">
                   <div className="bg-green-500 h-1 w-[2%]"></div>
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>

        {/* Main Content Area */}
        <div className="flex flex-col border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.15)] bg-slate-950 h-full transition-colors duration-300 min-h-0">
            {/* Title Bar */}
            <div className="flex items-center justify-between px-3 py-1 border-b border-blue-500 bg-slate-900 select-none shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-blue-300">Terminal - {activeSection}</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              </div>
            </div>
            
            {/* Content Area with Ref for Scrolling */}
            <div 
              ref={scrollRef} 
              id="main-terminal-content" 
              className="p-4 overflow-y-auto flex-grow scroll-smooth min-h-0 custom-scrollbar"
            >
              {/* Render key ensures animation replays on section change */}
              <div key={activeSection}>
                {renderContent()}
              </div>

              {/* Interactive Shell / Command Line */}
              <div className="mt-12 pt-4 border-t border-slate-800/50">
                 {/* Command History */}
                 {history.map((item, idx) => (
                    <div key={idx} className="mb-2 animate-print">
                       <div className="flex flex-wrap gap-2 text-sm sm:text-base font-mono">
                         <div className="flex whitespace-nowrap">
                             <span className="text-green-500">[visitor@arch</span>
                             <span className="text-slate-400 mx-1"></span>
                             <span className="text-blue-400">{item.path}</span>
                             <span className="text-green-500">]$</span>
                         </div>
                         <span className="text-slate-200">{item.command}</span>
                       </div>
                       {item.output && (
                         <div className="text-slate-400 mt-1 mb-2 text-sm sm:text-base whitespace-pre-wrap pl-2 border-l-2 border-slate-800">
                            {item.output}
                         </div>
                       )}
                    </div>
                 ))}

                 {/* Input Field */}
                 <div className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base">
                     <div className="flex whitespace-nowrap">
                         <span className="text-green-500">[visitor@arch</span>
                         <span className="text-slate-400 mx-1"></span>
                         <span className="text-blue-400">{activeSection === 'home' ? '~' : `~/${activeSection}`}</span>
                         <span className="text-green-500">]$</span>
                     </div>
                     <input 
                         type="text"
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         onKeyDown={handleCommand}
                         className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-700 min-w-[200px]"
                         placeholder="Type 'help' or press Tab..."
                         autoComplete="off"
                         spellCheck="false"
                     />
                 </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-slate-800/50 text-slate-600 text-xs font-mono flex justify-between">
                 <span>-- INSERT MODE --</span>
                 <span>Ln 24, Col 8</span>
              </div>
            </div>
        </div>
      </div>
      
      {/* Footer shortcut hints */}
      <div className="bg-slate-950 border-t border-slate-900 text-slate-600 text-xs py-1 px-4 hidden sm:flex gap-4 shrink-0">
        <span>^C Exit</span>
        <span>^O WriteOut</span>
        <span>^W Search</span>
        <span>^K Cut Text</span>
        <span>^J Justify</span>
      </div>
    </div>
  );
};

export default App;