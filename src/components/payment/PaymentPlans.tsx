
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Basic features for personal projects",
    features: [
      "3 code generations per day",
      "Basic complexity analysis",
      "Standard response time"
    ],
    buttonText: "Current Plan",
    popular: false
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Unlock advanced features for professional use",
    features: [
      "Unlimited code generations",
      "Advanced complexity analysis",
      "Priority response time",
      "Custom API key support",
      "Premium support"
    ],
    buttonText: "Upgrade",
    popular: true
  }
];

const PaymentPlans = () => {
  const { isSubscribed, setIsSubscribed, setGenerationsRemaining } = useAuth();

  const handleSubscribe = () => {
    // In a real app, this would redirect to a payment processor
    toast({
      title: "Subscription upgraded",
      description: "You've been upgraded to the Pro plan",
    });
    setIsSubscribed(true);
    setGenerationsRemaining(Infinity);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upgrade to unlock unlimited generations and premium features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`${plan.popular ? 'border-primary shadow-lg' : ''} relative overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-md">
                  POPULAR
                </div>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.name === "Free" ? "outline" : "default"}
                disabled={(plan.name === "Free" && !isSubscribed) || (plan.name === "Pro" && isSubscribed)}
                onClick={plan.name === "Pro" ? handleSubscribe : undefined}
              >
                {plan.name === "Pro" && <Zap className="mr-2 h-4 w-4" />}
                {isSubscribed && plan.name === "Pro" ? "Current Plan" : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentPlans;
