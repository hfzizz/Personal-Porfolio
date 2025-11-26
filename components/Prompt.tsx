import React from 'react';

interface PromptProps {
  path?: string;
  command?: string;
  cursor?: boolean;
}

const Prompt: React.FC<PromptProps> = ({ path = "~", command = "", cursor = false }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base">
      <div className="flex whitespace-nowrap">
        <span className="text-green-500">[visitor@arch</span>
        <span className="text-slate-400 mx-1"></span>
        <span className="text-blue-400">{path}</span>
        <span className="text-green-500">]$</span>
      </div>
      <div className="text-slate-200 flex items-center">
        {command}
        {cursor && <span className="inline-block w-2.5 h-5 bg-blue-400 ml-1 animate-pulse"></span>}
      </div>
    </div>
  );
};

export default Prompt;