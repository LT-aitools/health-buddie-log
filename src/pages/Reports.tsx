
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import PDFReport from "@/components/Reports/PDFReport";
import { mockHealthLogs } from "@/lib/mock-data";
import { PDFReportOptions } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { toast } = useToast();

  // Set up default report options (last 7 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  
  const [reportOptions, setReportOptions] = useState<PDFReportOptions>({
    startDate,
    endDate,
    includeRawMessages: true,
  });

  // Filter logs based on date range
  const filteredLogs = mockHealthLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= reportOptions.startDate && logDate <= reportOptions.endDate;
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = () => {
    setGeneratingPDF(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setGeneratingPDF(false);
      
      toast({
        title: "PDF Generated",
        description: "Your health report has been downloaded.",
        variant: "default",
      });
    }, 2000);
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
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-8">
                <div className="mr-4 bg-primary text-white p-3 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Health Reports</h1>
                  <p className="text-muted-foreground">
                    View and download summaries of your health progress
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-medium mb-4">Generate Report</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">Start Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={reportOptions.startDate.toISOString().split('T')[0]}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            setReportOptions(prev => ({
                              ...prev,
                              startDate: newDate
                            }));
                          }}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">End Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={reportOptions.endDate.toISOString().split('T')[0]}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            setReportOptions(prev => ({
                              ...prev,
                              endDate: newDate
                            }));
                          }}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="sm:self-end">
                      <Button 
                        variant="default" 
                        size="default"
                        className="w-full sm:w-auto"
                        disabled={generatingPDF}
                        onClick={handleDownloadPDF}
                      >
                        {generatingPDF ? (
                          <>
                            <div className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>Generate PDF</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <PDFReport 
                logs={filteredLogs}
                options={reportOptions}
                onDownload={handleDownloadPDF}
              />
              
              <p className="text-sm text-muted-foreground text-center mt-8">
                Reports are generated on-demand and reflect your logged health activities during the selected time period.
              </p>
            </motion.div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Reports;
