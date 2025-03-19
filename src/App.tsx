
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Reports from "./pages/Reports";
import Templates from "./pages/Templates";
import TwilioIntegration from "./pages/TwilioIntegration";
import Auth from "./pages/Auth";

// Import the AuthProvider
import { AuthProvider } from "./context/AuthContext";
// Import the PrivateRoute
import PrivateRoute from "./components/common/PrivateRoute";
// Change BrowserRouter to HashRouter
import { HashRouter as Router, Routes, Route } from "react-router-dom";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
            <Route path="/twilio-setup" element={<PrivateRoute><TwilioIntegration /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
export default App;
