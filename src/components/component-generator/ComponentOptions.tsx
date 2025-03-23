
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paintbrush, RotateCcw, Smartphone, Monitor } from 'lucide-react';
import { COMPONENT_TYPES, FRAMEWORKS, UI_LIBRARIES } from '@/components/ComponentGeneratorTool';

interface ComponentOptionsProps {
  options: any;
  onChange: (name: string, value: any) => void;
  onReset: () => void;
}

const ComponentOptions: React.FC<ComponentOptionsProps> = ({
  options,
  onChange,
  onReset
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Configuration</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="componentType">Component Type</Label>
            <Select 
              value={options.componentType} 
              onValueChange={(value) => onChange('componentType', value)}
            >
              <SelectTrigger id="componentType">
                <SelectValue placeholder="Select component type" />
              </SelectTrigger>
              <SelectContent>
                {COMPONENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <Select 
              value={options.framework} 
              onValueChange={(value) => onChange('framework', value)}
            >
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                {FRAMEWORKS.map((framework) => (
                  <SelectItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="uiLibrary">UI Library</Label>
            <Select 
              value={options.uiLibrary} 
              onValueChange={(value) => onChange('uiLibrary', value)}
            >
              <SelectTrigger id="uiLibrary">
                <SelectValue placeholder="Select UI library" />
              </SelectTrigger>
              <SelectContent>
                {UI_LIBRARIES.map((library) => (
                  <SelectItem key={library.value} value={library.value}>
                    {library.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={options.theme} 
                  onValueChange={(value) => onChange('theme', value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select 
                  value={options.size} 
                  onValueChange={(value) => onChange('size', value)}
                >
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shape">Shape</Label>
                <Select 
                  value={options.shape} 
                  onValueChange={(value) => onChange('shape', value)}
                >
                  <SelectTrigger id="shape">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="pill">Pill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <Select 
                  value={options.variant} 
                  onValueChange={(value) => onChange('variant', value)}
                >
                  <SelectTrigger id="variant">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: options.primaryColor }}
                  />
                  <Input 
                    id="primaryColor" 
                    type="color" 
                    value={options.primaryColor} 
                    onChange={(e) => onChange('primaryColor', e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: options.secondaryColor }}
                  />
                  <Input 
                    id="secondaryColor" 
                    type="color" 
                    value={options.secondaryColor} 
                    onChange={(e) => onChange('secondaryColor', e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasIcon" 
                  checked={options.hasIcon}
                  onCheckedChange={(checked) => onChange('hasIcon', checked)}
                />
                <Label htmlFor="hasIcon" className="cursor-pointer">Include Icon</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasAnimation" 
                  checked={options.hasAnimation}
                  onCheckedChange={(checked) => onChange('hasAnimation', checked)}
                />
                <Label htmlFor="hasAnimation" className="cursor-pointer">Add Animation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isResponsive" 
                  checked={options.isResponsive}
                  onCheckedChange={(checked) => onChange('isResponsive', checked)}
                />
                <Label htmlFor="isResponsive" className="cursor-pointer">Make Responsive</Label>
              </div>
              
              {options.componentType === 'button' && (
                <div className="space-y-2">
                  <Label htmlFor="text">Button Text</Label>
                  <Input 
                    id="text" 
                    value={options.text} 
                    onChange={(e) => onChange('text', e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="customClasses">Custom Classes</Label>
                <Input 
                  id="customClasses" 
                  value={options.customClasses} 
                  onChange={(e) => onChange('customClasses', e.target.value)}
                  placeholder="Add custom classes"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ComponentOptions;
