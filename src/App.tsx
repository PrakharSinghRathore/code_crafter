
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import ComplexityAnalysis from "./pages/ComplexityAnalysis";
import CodeGeneration from "./pages/CodeGeneration";
import ProblemSolving from "./pages/ProblemSolving";
import Practice from "./pages/Practice";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ComponentGenerator from "./pages/ComponentGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/complexity-analysis" element={<ComplexityAnalysis />} />
                <Route path="/code-generation" element={<CodeGeneration />} />
                <Route path="/problem-solving" element={<ProblemSolving />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/login" element={<Login />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/component-generator" element={<ComponentGenerator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextThemesProvider>
  </QueryClientProvider>
);

export default App;
