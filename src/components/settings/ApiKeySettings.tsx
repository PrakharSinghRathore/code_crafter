
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const providers = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'google', name: 'Google AI' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'openrouter', name: 'OpenRouter' },
];

const ApiKeySettings = () => {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would validate the API key with the provider
    // For this demo, we'll just save it to localStorage
    localStorage.setItem(`${provider}_api_key`, apiKey);
    
    toast({
      title: "API Key Saved",
      description: `Your ${providers.find(p => p.id === provider)?.name} API key has been saved`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Custom API Key Settings</CardTitle>
        <CardDescription>
          Use your own API keys to access AI providers directly
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="provider">AI Provider</Label>
          <Select 
            value={provider} 
            onValueChange={setProvider}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Enter your ${providers.find(p => p.id === provider)?.name} API key`}
          />
        </div>
        
        <Button onClick={handleSaveApiKey}>Save API Key</Button>
        
        <div className="pt-4 text-sm text-muted-foreground">
          <p>
            Your API key is stored locally in your browser and is never sent to our servers.
            We use it to make direct calls to the AI provider's API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySettings;
