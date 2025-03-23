import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from './CodeEditor';
import { analyzeComplexity, detectPlagiarism } from '@/utils/codeAnalyzer';
import { useToast } from '@/hooks/use-toast';

interface ComplexityAnalyzerProps {
  initialCode?: string;
  initialLanguage?: string;
}

const ComplexityAnalyzer: React.FC<ComplexityAnalyzerProps> = ({ initialCode = '', initialLanguage = 'javascript' }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [timeComplexity, setTimeComplexity] = useState('O(?)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(?)');
  const [plagiarismScore, setPlagiarismScore] = useState(0);
  const [activeTab, setActiveTab] = useState('analyzer');
  const { toast } = useToast();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleAnalyzeComplexity = () => {
    if (!code.trim()) {
      toast({
        title: "Missing Code",
        description: "Please enter code to analyze",
        variant: "destructive",
      });
      return;
    }

    const complexity = analyzeComplexity(code, language);
    setTimeComplexity(complexity.time);
    setSpaceComplexity(complexity.space);
    
    toast({
      title: "Complexity Analyzed",
      description: "Time and space complexity analysis complete",
    });
  };

  const handleDetectPlagiarism = () => {
    if (!code.trim()) {
      toast({
        title: "Missing Code",
        description: "Please enter code to detect plagiarism",
        variant: "destructive",
      });
      return;
    }

    // Mock code base for plagiarism detection
    const codeBase = [
      'function example() { console.log("Hello, world!"); }',
      'def example():\n    print("Hello, world!")',
      'public class Example {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}',
    ];

    const score = detectPlagiarism(code, codeBase);
    setPlagiarismScore(score);
    
    toast({
      title: "Plagiarism Check Complete",
      description: `Plagiarism score: ${score}%`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold tracking-tight mb-4">Code Analyzer</h1>
      <p className="text-muted-foreground mb-8">
        Analyze the time and space complexity of your code, and detect potential plagiarism.
      </p>

      <Card className="shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 py-2 border-b">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
              <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analyzer" className="mt-0">
            <CardContent className="p-6">
              <CodeEditor
                title="Code Editor"
                description="Enter your code to analyze its complexity"
                defaultCode={code}
                defaultLanguage={language}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
              />

              <div className="flex justify-between mt-4">
                <Button onClick={handleAnalyzeComplexity}>Analyze Complexity</Button>
                <div>
                  <p>Time Complexity: {timeComplexity}</p>
                  <p>Space Complexity: {spaceComplexity}</p>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="plagiarism" className="mt-0">
            <CardContent className="p-6">
              <CodeEditor
                title="Code Editor"
                description="Enter your code to detect plagiarism"
                defaultCode={code}
                defaultLanguage={language}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
              />

              <div className="flex justify-between mt-4">
                <Button onClick={handleDetectPlagiarism}>Detect Plagiarism</Button>
                <p>Plagiarism Score: {plagiarismScore}%</p>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default ComplexityAnalyzer;
