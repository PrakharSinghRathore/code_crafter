import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { generateCode } from '@/utils/openAI';

interface WebsiteBuilderProps {
  onCodeGenerated: (code: string) => void;
}

const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dependencies, setDependencies] = useState<string[]>([]);
  const { toast } = useToast();
  const { generationsRemaining, updateUserData } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please describe the website you want to create',
        variant: 'destructive',
      });
      return;
    }

    if (generationsRemaining <= 0) {
      toast({
        title: 'Limit Reached',
        description: 'You have reached your generation limit. Please upgrade your plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate the website code
      const websiteCode = await generateCode({
        language: 'react',
        problem: 'Create a complete website based on the following description',
        requirements: `${prompt}\n\nRequirements:\n- Create a modern, responsive website\n- Use React with Vite\n- Include proper component organization\n- Implement responsive design\n- Add necessary routing\n- Include proper TypeScript types\n- Use best practices for performance`,
      });

      // Extract dependencies from the generated code
      const extractedDependencies = extractDependencies(websiteCode);
      setDependencies(extractedDependencies);

      onCodeGenerated(websiteCode);

      // Update remaining generations
      await updateUserData({
        generationsRemaining: generationsRemaining - 1,
      });

      toast({
        title: 'Success',
        description: 'Website code generated successfully',
      });
    } catch (error) {
      console.error('Error generating website:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate website code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const extractDependencies = (code: string): string[] => {
    const importRegex = /from\s+['"]([^'"]+)['"];?/g;
    const matches = Array.from(code.matchAll(importRegex));
    const deps = matches
      .map(match => match[1])
      .filter(dep => !dep.startsWith('.') && !dep.startsWith('@/'))
      .filter((dep, index, self) => self.indexOf(dep) === index);
    return deps;
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe Your Website</Label>
          <Textarea
            id="prompt"
            placeholder="Example: Create a modern e-commerce website with a hero section, product grid, shopping cart, and checkout process. Use a minimalist design with a dark theme."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Generations remaining: {generationsRemaining}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(previewUrl, '_blank')}
              disabled={!previewUrl}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Website
            </Button>
          </div>
        </div>

        {dependencies.length > 0 && (
          <div className="mt-4">
            <Label>Required Dependencies</Label>
            <div className="mt-2 p-4 bg-muted rounded-md">
              <code className="text-sm">
                npm install {dependencies.join(' ')}
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteBuilder;