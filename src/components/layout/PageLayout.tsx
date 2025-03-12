
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <PageTransition>
          {children}
        </PageTransition>
      </AnimatePresence>
      <Navbar />
    </div>
  );
};

export default PageLayout;
