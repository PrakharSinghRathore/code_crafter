
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Monitor } from 'lucide-react';

interface ComponentPreviewProps {
  options: any;
  previewCode: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ options, previewCode }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState('desktop');

  useEffect(() => {
    if (previewRef.current) {
      try {
        // For simple components like buttons, we can render HTML directly
        if (options.componentType === 'button') {
          // Extract just the HTML part from the code
          const htmlMatch = previewCode.match(/<button[^>]*>.*?<\/button>/s);
          
          if (htmlMatch) {
            previewRef.current.innerHTML = htmlMatch[0];
            
            // Add event handlers to prevent clicks
            const buttons = previewRef.current.querySelectorAll('button');
            buttons.forEach(button => {
              button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
            });
            
            // Add inline styles based on selected options
            if (options.theme === 'dark') {
              previewRef.current.style.backgroundColor = '#1f2937';
              previewRef.current.style.color = 'white';
            } else {
              previewRef.current.style.backgroundColor = '#f9fafb';
              previewRef.current.style.color = 'black';
            }
          } else {
            previewRef.current.innerHTML = '<div>Preview not available</div>';
          }
        } 
        // For more complex components, we can render a placeholder
        else {
          previewRef.current.innerHTML = `
            <div class="flex items-center justify-center p-8 text-center">
              <div>
                <div class="text-xl font-semibold mb-2">${options.componentType.charAt(0).toUpperCase() + options.componentType.slice(1)} Preview</div>
                <p class="text-muted-foreground">Preview will be generated based on your settings</p>
              </div>
            </div>
          `;
        }
      } catch (error) {
        console.error('Error rendering preview:', error);
        previewRef.current.innerHTML = '<div>Error rendering preview</div>';
      }
    }
  }, [previewCode, options]);

  return (
    <div className="space-y-4">
      <Tabs value={viewMode} onValueChange={setViewMode} className="mb-4">
        <TabsList className="w-[200px] mx-auto">
          <TabsTrigger value="desktop" className="flex-1">
            <Monitor className="mr-2 h-4 w-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex-1">
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className={`overflow-hidden transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto h-[640px]' : 'w-full'}`}>
        <CardContent className="p-0">
          <div 
            className={`flex items-center justify-center p-12 transition-colors ${
              options.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}
          >
            <div ref={previewRef} className="preview-container"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentPreview;
