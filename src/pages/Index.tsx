
import WeeklySummary from "@/components/Dashboard/WeeklySummary";
import { mockHealthLogs, mockWeeklySummary } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

const Index = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-24 md:pb-6 md:pt-24">
      <div className="container px-4 md:px-6">
        {loading ? (
          <div className="h-[80vh] flex items-center justify-center">
            <div className="relative h-16 w-16">
              <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
            </div>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            <motion.div variants={item}>
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight">Welcome to HealthBuddie</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Track your health journey with simple voice and text messages. Get insights into your exercise and nutrition habits.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <WeeklySummary summary={mockWeeklySummary} recentLogs={mockHealthLogs.slice(0, 5)} />
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl flex flex-col items-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Send Health Updates</h3>
                <p className="text-muted-foreground">
                  Simply send voice or text messages to log your exercise and food habits.
                </p>
              </div>

              <div className="glass-card rounded-2xl flex flex-col items-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Get Weekly Reports</h3>
                <p className="text-muted-foreground">
                  Send "status" to receive a summary of your weekly health activities.
                </p>
              </div>

              <div className="glass-card rounded-2xl flex flex-col items-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Create Care Plans</h3>
                <p className="text-muted-foreground">
                  Set up simple templates for exercise and nutrition tracking.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Index;
