import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCode } from '@/utils/openAI';
import CodeEditor from './CodeEditor';
import { useToast } from '@/components/ui/use-toast';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const COMPLEXITY_OPTIONS = [
  { value: 'any', label: 'Any Complexity' },
  { value: 'O(1)', label: 'O(1) - Constant' },
  { value: 'O(log n)', label: 'O(log n) - Logarithmic' },
  { value: 'O(n)', label: 'O(n) - Linear' },
  { value: 'O(n log n)', label: 'O(n log n) - Linearithmic' },
  { value: 'O(n²)', label: 'O(n²) - Quadratic' },
  { value: 'O(2^n)', label: 'O(2^n) - Exponential' },
];

const CodeGenerator = () => {
  const [problem, setProblem] = useState('');
  const [requirements, setRequirements] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [complexity, setComplexity] = useState('any');
  const [approach, setApproach] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!problem.trim()) {
      toast({
        title: "Missing Problem Description",
        description: "Please describe what code you want to generate",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCode('');

    try {
      const code = await generateCode({
        language,
        problem,
        requirements: requirements.trim() ? requirements : undefined,
        complexity: complexity !== 'any' ? complexity : undefined,
        approach: approach.trim() ? approach : undefined,
      });
      
      setGeneratedCode(code);
      
      toast({
        title: "Code Generated",
        description: "Your code has been generated successfully",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "An error occurred during code generation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "Code copied to clipboard successfully",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">AI Code Generator</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Generate optimized code in any programming language with our AI assistant.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="problem">Problem Description</Label>
                  <Textarea
                    id="problem"
                    placeholder="Describe the problem or what code you need..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (Optional)</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Any specific requirements or constraints..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="complexity">Target Complexity</Label>
                    <Select value={complexity} onValueChange={setComplexity}>
                      <SelectTrigger id="complexity">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPLEXITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approach">Preferred Approach (Optional)</Label>
                  <Input
                    id="approach"
                    placeholder="E.g., dynamic programming, greedy algorithm..."
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !problem.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <Wand2 className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Code
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <CodeEditor
              title="Generated Code"
              description="AI generated code will appear here"
              defaultCode={generatedCode}
              defaultLanguage={language}
              readOnly={true}
              onLanguageChange={(newLang) => setLanguage(newLang)}
            />
            
            {generatedCode && (
              <div className="absolute top-4 right-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
            
            {!generatedCode && !isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Fill out the form and click "Generate Code"</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeGenerator;
