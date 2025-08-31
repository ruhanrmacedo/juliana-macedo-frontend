import { AuthProvider } from "@/hooks/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister";
import UserMetrics from "./pages/UserMetrics";
import Perfil from "./pages/Perfil";
import PostDetail from "./pages/PostDetail";
import PatientsIndex from "./pages/patients/PatientsIndex";
import PatientLayout from "./pages/patients/PatientLayout";
import PatientProfile from "./pages/patients/sections/PatientProfile";
import PatientAnamneses from "./pages/patients/sections/PatientAnamneses";
import PatientMetrics from "./pages/patients/sections/PatientMetrics";
import PatientAnthropometry from "./pages/patients/sections/PatientAnthropometry";
import PatientCalculators from "./pages/patients/sections/PatientCalculators";
import PatientGestational from "./pages/patients/sections/PatientGestational";
import PatientFinance from "./pages/patients/sections/PatientFinance";
import PatientMealPlan from "./pages/patients/sections/PatientMealPlan";
import PatientsPhotos from "./pages/patients/sections/PatientPhotos";
import PatientsHistory from "./pages/patients/sections/PatientsHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider> {/* 👈 envolve aqui */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/metrics" element={<UserMetrics />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/patients" element={<PatientsIndex />} />
            <Route path="/patients/:id" element={<PatientLayout />}>
              <Route index element={<PatientProfile />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="anamneses" element={<PatientAnamneses />} />
              <Route path="metrics" element={<PatientMetrics />} />
              <Route path="anthropometry" element={<PatientAnthropometry />} />
              <Route path="calculators" element={<PatientCalculators />} />
              <Route path="gestational" element={<PatientGestational />} />
              <Route path="meal-plan" element={<PatientMealPlan />} />
              <Route path="evolution-photos" element={<PatientsPhotos />} />
              <Route path="history-evolution" element={<PatientsHistory />} />
              <Route path="finance" element={<PatientFinance />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
