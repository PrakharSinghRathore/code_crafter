
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Clock, Play, CheckCircle, Star, Sparkles, Plus } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { analyzeComplexity } from '@/utils/codeAnalyzer';
import { useToast } from '@/hooks/use-toast';

// Simulated practice problems
const PRACTICE_PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    category: 'Arrays',
    constraints: 'You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    testCases: [
      { input: '[2,7,11,15]', target: 9, expected: '[0,1]' },
      { input: '[3,2,4]', target: 6, expected: '[1,2]' },
      { input: '[3,3]', target: 6, expected: '[0,1]' }
    ]
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    difficulty: 'Easy',
    category: 'Stacks',
    constraints: 'An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    testCases: [
      { input: '()', expected: 'true' },
      { input: '()[]{}', expected: 'true' },
      { input: '(]', expected: 'false' },
      { input: '([)]', expected: 'false' },
      { input: '{[]}', expected: 'true' }
    ]
  },
  {
    id: 3,
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    constraints: 'The array size will be between 1 and 105. Elements can be negative.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5,4,-1,7,8]', expected: '23' }
    ]
  }
];

// Difficulty color mapping
const DIFFICULTY_COLORS = {
  Easy: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
};

const PracticePage = () => {
  const [selectedProblem, setSelectedProblem] = useState<typeof PRACTICE_PROBLEMS[0] | null>(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [results, setResults] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProblem) {
      // Reset code and results when problem changes
      setCode('');
      setResults(null);
    }
  }, [selectedProblem]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode('');
    setResults(null);
  };

  const handleSelectProblem = (problem: typeof PRACTICE_PROBLEMS[0]) => {
    setSelectedProblem(problem);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setResults(null);
  };

  const handleRunCode = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please write some code to run",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);

    // Simulate code execution delay
    setTimeout(() => {
      try {
        const passed = Math.random() > 0.3; // Simulate test results
        const passedTests = Math.floor(Math.random() * (selectedProblem?.testCases.length || 3)) + (passed ? 3 : 0);
        const totalTests = selectedProblem?.testCases.length || 5;
        const executionTime = Math.floor(Math.random() * 100) + 10; // ms
        
        // Get complexity analysis
        const complexity = analyzeComplexity(code, language);
        
        setResults({
          passed,
          passedTests,
          totalTests,
          executionTime,
          memory: Math.floor(Math.random() * 10) + 36, // MB
          complexity
        });

        toast({
          title: passed ? "All Tests Passed!" : "Some Tests Failed",
          description: `${passedTests} of ${totalTests} tests passed`,
          variant: passed ? "default" : "destructive",
        });
      } catch (error) {
        console.error("Run error:", error);
        toast({
          title: "Execution Failed",
          description: "An error occurred during code execution",
          variant: "destructive",
        });
      } finally {
        setIsRunning(false);
      }
    }, 2000);
  };

  const filteredProblems = activeTab === 'all' 
    ? PRACTICE_PROBLEMS
    : PRACTICE_PROBLEMS.filter(p => p.difficulty.toLowerCase() === activeTab);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">Practice Problems</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Improve your coding skills by solving algorithmic challenges and get instant feedback.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Problem List</CardTitle>
              <CardDescription>Select a problem to solve</CardDescription>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredProblems.map((problem) => (
                <motion.div
                  key={problem.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`cursor-pointer ${selectedProblem?.id === problem.id ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
                    onClick={() => handleSelectProblem(problem)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{problem.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {problem.description.substring(0, 80)}...
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={DIFFICULTY_COLORS[problem.difficulty as keyof typeof DIFFICULTY_COLORS]}
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Code className="h-3 w-3 mr-1" />
                        {problem.category}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Card className="cursor-pointer hover:border-primary/50 border-dashed">
                <CardContent className="p-4 flex items-center justify-center">
                  <Button variant="ghost" className="w-full h-full py-6 text-muted-foreground">
                    <Plus className="h-5 w-5 mr-2" />
                    More problems coming soon
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedProblem ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedProblem.title}</CardTitle>
                      <CardDescription>
                        <Badge 
                          variant="outline" 
                          className={DIFFICULTY_COLORS[selectedProblem.difficulty as keyof typeof DIFFICULTY_COLORS]}
                        >
                          {selectedProblem.difficulty}
                        </Badge>
                        <span className="ml-2">{selectedProblem.category}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Problem Description</h3>
                    <p className="text-muted-foreground">{selectedProblem.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Constraints</h3>
                    <p className="text-muted-foreground">{selectedProblem.constraints}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Examples</h3>
                    <div className="space-y-3">
                      {selectedProblem.examples.map((example, index) => (
                        <div key={index} className="bg-secondary/30 p-3 rounded-md">
                          <div><span className="font-mono">Input:</span> {example.input}</div>
                          <div><span className="font-mono">Output:</span> {example.output}</div>
                          {example.explanation && (
                            <div><span className="font-mono">Explanation:</span> {example.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <CodeEditor
                title="Solution"
                description="Write your solution here"
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                defaultLanguage={language}
                submitLabel="Run Code"
                onSubmit={handleRunCode}
                showTabs={true}
              />
              
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {results.passed ? (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                            <span className="text-green-500">All Tests Passed!</span>
                          </>
                        ) : (
                          <>
                            <Star className="h-5 w-5 mr-2 text-yellow-500" />
                            <span>Test Results</span>
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ResultCard
                          title="Test Cases"
                          value={`${results.passedTests}/${results.totalTests}`}
                          icon={<Play className="h-4 w-4 text-primary" />}
                        />
                        
                        <ResultCard
                          title="Runtime"
                          value={`${results.executionTime} ms`}
                          icon={<Clock className="h-4 w-4 text-primary" />}
                        />
                        
                        <ResultCard
                          title="Memory"
                          value={`${results.memory} MB`}
                          icon={<Code className="h-4 w-4 text-primary" />}
                        />
                      </div>
                      
                      <div className="p-4 bg-secondary/30 rounded-md">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-primary" />
                          Complexity Analysis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Time Complexity</p>
                            <p className="text-lg font-mono">{results.complexity.timeComplexity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Space Complexity</p>
                            <p className="text-lg font-mono">{results.complexity.spaceComplexity}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-[400px] bg-secondary/20 rounded-lg">
              <div className="text-center">
                <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-medium mb-2">No Problem Selected</h3>
                <p className="text-muted-foreground">Select a problem from the list to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ResultCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const ResultCard = ({ title, value, icon }: ResultCardProps) => (
  <div className="bg-secondary/30 p-4 rounded-md">
    <div className="flex items-center mb-1">
      {icon}
      <span className="text-sm font-medium ml-2">{title}</span>
    </div>
    <div className="text-lg font-mono">{value}</div>
  </div>
);

export default PracticePage;
