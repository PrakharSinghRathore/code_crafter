
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onSubmit?: (code: string, language: string) => void;
  defaultCode?: string;
  defaultLanguage?: string;
  readOnly?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  showTabs?: boolean;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const DEFAULT_CODE = {
  javascript: '// Write your JavaScript code here\nfunction example() {\n  console.log("Hello, world!");\n  return true;\n}',
  python: '# Write your Python code here\ndef example():\n    print("Hello, world!")\n    return True',
  java: '// Write your Java code here\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}',
  cpp: '// Write your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}',
  csharp: '// Write your C# code here\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, world!");\n    }\n}',
  go: '// Write your Go code here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}',
  rust: '// Write your Rust code here\nfn main() {\n    println!("Hello, world!");\n}',
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  onCodeChange,
  onLanguageChange,
  onSubmit,
  defaultCode = '',
  defaultLanguage = 'javascript',
  readOnly = false,
  title = 'Code Editor',
  description = 'Write your code here',
  submitLabel = 'Submit',
  showTabs = false,
}) => {
  const [code, setCode] = useState(defaultCode || DEFAULT_CODE[defaultLanguage as keyof typeof DEFAULT_CODE]);
  const [language, setLanguage] = useState(defaultLanguage);
  const [activeTab, setActiveTab] = useState('code');

  // Update code when defaultCode prop changes
  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
    }
  }, [defaultCode]);

  // Update language when defaultLanguage prop changes
  useEffect(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (!defaultCode) {
      setCode(DEFAULT_CODE[newLanguage as keyof typeof DEFAULT_CODE]);
    }
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code, language);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden border bg-card text-card-foreground shadow-lg">
        <div className="px-6 py-4 bg-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showTabs ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 py-2 border-b">
              <TabsList className="grid grid-cols-2 w-[200px]">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="console">Console</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="code" className="mt-0">
              <div className="p-4">
                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  readOnly={readOnly}
                  spellCheck={false}
                  className="w-full h-[300px] font-mono text-sm p-4 bg-secondary/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Write your code here..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="console" className="mt-0">
              <div className="p-4 h-[300px] bg-secondary/20 font-mono text-sm overflow-auto">
                <p className="text-muted-foreground">Console output will appear here...</p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4">
            <textarea
              value={code}
              onChange={handleCodeChange}
              readOnly={readOnly}
              spellCheck={false}
              className="w-full h-[300px] font-mono text-sm p-4 bg-secondary/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Write your code here..."
            />
          </div>
        )}
        
        {onSubmit && (
          <div className="px-6 py-4 bg-secondary/50 border-t flex justify-end">
            <Button onClick={handleSubmit} className="transition-all">
              {submitLabel}
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CodeEditor;
