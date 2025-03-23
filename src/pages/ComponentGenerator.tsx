
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ComponentGeneratorTool from '@/components/ComponentGeneratorTool';

const ComponentGenerator = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Component Generator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate customizable components for different web frameworks.
            Select options, preview the result, and copy the code to your project.
          </p>
        </div>
        
        <ComponentGeneratorTool />
      </motion.div>
    </Layout>
  );
};

export default ComponentGenerator;
