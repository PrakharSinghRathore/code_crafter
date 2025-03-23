
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import CodeEditor from './CodeEditor';
import { generateApproaches } from '@/utils/openAI';
import { useToast } from '@/components/ui/use-toast';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
];

const ProblemSolver = () => {
  const [problem, setProblem] = useState('');
  const [platformProblem, setPlatformProblem] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [approachCount, setApproachCount] = useState('3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('problem-description');
  const [approaches, setApproaches] = useState<string[]>([]);
  const [expandedApproaches, setExpandedApproaches] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  const handleGenerateApproaches = async () => {
    const problemText = activeTab === 'problem-description' ? problem : platformProblem;
    
    if (!problemText.trim()) {
      toast({
        title: "Missing Problem",
        description: "Please describe the problem or enter a platform problem",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setApproaches([]);

    try {
      const generatedApproaches = await generateApproaches(
        problemText,
        language,
        parseInt(approachCount)
      );
      
      setApproaches(generatedApproaches);
      
      // Initialize all approaches as expanded
      const initialExpandState: { [key: number]: boolean } = {};
      generatedApproaches.forEach((_, index) => {
        initialExpandState[index] = true;
      });
      setExpandedApproaches(initialExpandState);
      
      toast({
        title: "Approaches Generated",
        description: `${generatedApproaches.length} solution approaches have been generated`,
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "An error occurred during approach generation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleApproach = (index: number) => {
    setExpandedApproaches(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">Problem Solver</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Get multiple approaches to solve coding problems from platforms like LeetCode and GeeksForGeeks.
        </p>
      </motion.div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="problem-description">Custom Problem</TabsTrigger>
              <TabsTrigger value="platform-problem">Platform Problem</TabsTrigger>
            </TabsList>
            
            <TabsContent value="problem-description" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Description</Label>
                <Textarea
                  id="problem"
                  placeholder="Describe the coding problem in detail..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="platform-problem" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-problem">Platform Problem</Label>
                <Textarea
                  id="platform-problem"
                  placeholder="Enter the full problem statement from LeetCode, GeeksForGeeks, etc..."
                  value={platformProblem}
                  onChange={(e) => setPlatformProblem(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
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

            <div className="space-y-2">
              <Label htmlFor="approach-count">Number of Approaches</Label>
              <Select value={approachCount} onValueChange={setApproachCount}>
                <SelectTrigger id="approach-count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Approach</SelectItem>
                  <SelectItem value="2">2 Approaches</SelectItem>
                  <SelectItem value="3">3 Approaches</SelectItem>
                  <SelectItem value="4">4 Approaches</SelectItem>
                  <SelectItem value="5">5 Approaches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerateApproaches}
                disabled={isGenerating || (!problem.trim() && !platformProblem.trim())}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Approaches"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isGenerating && (
        <div className="flex justify-center my-12">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-lg font-medium">Generating solution approaches...</p>
            <p className="text-muted-foreground">This may take a few moments</p>
          </div>
        </div>
      )}

      {approaches.length > 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Solution Approaches</h2>
          
          {approaches.map((approach, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-secondary/50 cursor-pointer" onClick={() => toggleApproach(index)}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                      Approach {index + 1}
                    </CardTitle>
                    <Button variant="ghost" size="icon">
                      {expandedApproaches[index] ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                </CardHeader>
                
                {expandedApproaches[index] && (
                  <CardContent className="p-0">
                    <div className="p-6">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {approach}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isGenerating && approaches.length === 0 && (
        <div className="flex justify-center my-12">
          <div className="text-center text-muted-foreground">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Enter a problem and click "Generate Approaches" to see solutions</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSolver;
