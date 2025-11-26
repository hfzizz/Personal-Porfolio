import React from 'react';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  fullHeight?: boolean;
  contentId?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  title, 
  children, 
  isActive = true, 
  className = "",
  fullHeight = false,
  contentId
}) => {
  return (
    <div className={`flex flex-col border ${isActive ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'border-slate-700'} bg-slate-950 ${fullHeight ? 'h-full' : ''} ${className} transition-colors duration-300`}>
      {/* Title Bar */}
      <div className={`flex items-center justify-between px-3 py-1 border-b ${isActive ? 'border-blue-500 bg-slate-900' : 'border-slate-700 bg-slate-900'} select-none`}>
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${isActive ? 'text-blue-300' : 'text-slate-500'}`}>{title}</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>
      
      {/* Content Area */}
      <div id={contentId} className={`p-4 overflow-y-auto ${fullHeight ? 'flex-grow' : ''} scroll-smooth`}>
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;