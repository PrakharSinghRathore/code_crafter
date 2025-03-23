import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { generateCode } from '@/utils/openAI';

interface PromptBasedGeneratorProps {
  onCodeGenerated: (code: string) => void;
}

const PromptBasedGenerator: React.FC<PromptBasedGeneratorProps> = ({ onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generationsRemaining, updateUserData } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a description of what you want to create',
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
      const code = await generateCode({
        language: 'react',
        problem: 'Create a website or component based on the following description',
        requirements: prompt,
      });

      onCodeGenerated(code);

      // Update remaining generations
      await updateUserData({
        generationsRemaining: generationsRemaining - 1,
      });

      toast({
        title: 'Success',
        description: 'Code generated successfully',
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe Your Website or Component</Label>
          <Textarea
            id="prompt"
            placeholder="Example: Create a modern landing page with a hero section, features grid, and a contact form. Use a blue and white color scheme."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Generations remaining: {generationsRemaining}
          </span>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Website
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptBasedGenerator;