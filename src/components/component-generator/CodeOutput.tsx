
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, CheckCircle } from 'lucide-react';

interface CodeOutputProps {
  code: string;
  language: string;
  onCopy: () => void;
  onDownload: () => void;
  justCopied: boolean;
}

const CodeOutput: React.FC<CodeOutputProps> = ({
  code,
  language,
  onCopy,
  onDownload,
  justCopied
}) => {
  // Convert language value to display name
  const getLanguageDisplay = (lang: string) => {
    const map: Record<string, string> = {
      html: 'HTML/CSS',
      react: 'React',
      vue: 'Vue.js',
      angular: 'Angular'
    };
    return map[lang] || lang;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Generated {getLanguageDisplay(language)} Code</h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onCopy}
            className="flex items-center"
          >
            {justCopied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {justCopied ? 'Copied!' : 'Copy'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onDownload}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <pre className="p-4 border rounded-md bg-secondary/20 overflow-auto max-h-[500px] text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeOutput;
