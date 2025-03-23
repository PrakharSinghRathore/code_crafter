
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Eye, Code, Download, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ComponentOptions from './component-generator/ComponentOptions';
import ComponentPreview from './component-generator/ComponentPreview';
import CodeOutput from './component-generator/CodeOutput';
import PromptBasedGenerator from './component-generator/PromptBasedGenerator';
import WebsiteBuilder from './component-generator/WebsiteBuilder';
import { generateComponentCode } from '@/utils/componentGenerator';

// Component types that can be generated
export const COMPONENT_TYPES = [
  { value: 'button', label: 'Button' },
  { value: 'form', label: 'Form' },
  { value: 'card', label: 'Card' },
  { value: 'navbar', label: 'Navigation Bar' },
  { value: 'modal', label: 'Modal' },
  { value: 'accordion', label: 'Accordion' },
  { value: 'table', label: 'Table' },
];

// Framework options
export const FRAMEWORKS = [
  { value: 'html', label: 'HTML/CSS' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
];

// UI libraries
export const UI_LIBRARIES = [
  { value: 'none', label: 'None (Vanilla)' },
  { value: 'bootstrap', label: 'Bootstrap' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'material', label: 'Material UI' },
];

// Default component options
const DEFAULT_OPTIONS = {
  componentType: 'button',
  framework: 'react',
  uiLibrary: 'tailwind',
  theme: 'light',
  size: 'medium',
  shape: 'rounded',
  primaryColor: '#3b82f6',
  secondaryColor: '#93c5fd',
  hasIcon: false,
  hasAnimation: false,
  isResponsive: true,
  variant: 'primary',
  customClasses: '',
  text: 'Click Me',
};

const ComponentGeneratorTool = () => {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [activeTab, setActiveTab] = useState('options');
  const [justCopied, setJustCopied] = useState(false);
  const { toast } = useToast();
  const { user, generationsRemaining, updateUserData } = useAuth();

  // Generate code when options change
  useEffect(() => {
    handleGenerateCode();
  }, [options]);

  // Handle generating code based on current options
  const handleGenerateCode = async () => {
    try {
      // Get generated code based on options
      const code = await generateComponentCode(options);
      setGeneratedCode(code);

      // For preview, we always use React/HTML regardless of the selected framework
      const previewCode = await generateComponentCode({
        ...options,
        framework: 'react',
      });
      setPreviewCode(previewCode);
    } catch (error) {
      console.error('Error generating component code:', error);
      toast({
        title: 'Generation Error',
        description: 'Failed to generate component code',
        variant: 'destructive',
      });
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setJustCopied(true);
    toast({
      title: 'Copied to Clipboard',
      description: 'Code has been copied to your clipboard',
    });
    setTimeout(() => setJustCopied(false), 2000);
  };

  // Download code as a file
  const handleDownloadCode = () => {
    const fileExtensions = {
      react: 'jsx',
      vue: 'vue',
      angular: 'ts',
      html: 'html',
    };
    
    const extension = fileExtensions[options.framework as keyof typeof fileExtensions];
    const filename = `${options.componentType}-component.${extension}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: `File saved as ${filename}`,
    });
  };

  // Update options when user changes settings
  const handleOptionChange = (name: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset options to defaults
  const handleResetOptions = () => {
    setOptions(DEFAULT_OPTIONS);
    toast({
      title: 'Options Reset',
      description: 'Component options have been reset to default',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="options" className="flex-1">
              <span className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Customize
              </span>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex-1">
              <span className="flex items-center">
                <Wand2 className="mr-2 h-4 w-4" />
                AI Generate
              </span>
            </TabsTrigger>
            <TabsTrigger value="website" className="flex-1">
              <span className="flex items-center">
                <Wand2 className="mr-2 h-4 w-4" />
                Website Builder
              </span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex-1">
              <span className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Code
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="m-0">
            <CardContent className="p-6">
              <ComponentOptions 
                options={options} 
                onChange={handleOptionChange}
                onReset={handleResetOptions}
              />
            </CardContent>
          </TabsContent>

          <TabsContent value="prompt" className="m-0">
            <CardContent className="p-6">
              <PromptBasedGenerator
                onCodeGenerated={(code) => {
                  setGeneratedCode(code);
                  setPreviewCode(code);
                  setActiveTab('code');
                }}
              />
            </CardContent>
          </TabsContent>

          <TabsContent value="website" className="m-0">
            <CardContent className="p-6">
              <WebsiteBuilder
                onCodeGenerated={(code) => {
                  setGeneratedCode(code);
                  setPreviewCode(code);
                  setActiveTab('code');
                }}
              />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="code" className="m-0">
            <CardContent className="p-6">
              <CodeOutput 
                code={generatedCode} 
                language={options.framework}
                onCopy={handleCopyCode}
                onDownload={handleDownloadCode}
                justCopied={justCopied}
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Component Preview</h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyCode}
                className="flex items-center"
              >
                {justCopied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {justCopied ? 'Copied!' : 'Copy Code'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDownloadCode}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <ComponentPreview 
            options={options}
            previewCode={previewCode}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentGeneratorTool;
