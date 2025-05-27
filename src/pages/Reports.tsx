import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { FileText, Calendar, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PDFReport from "@/components/Reports/PDFReport";
import { PDFReportOptions, HealthLog } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getHealthData } from "@/lib/api";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
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

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Reset PDF generated state when dates change
  useEffect(() => {
    setPdfGenerated(false);
  }, [reportOptions.startDate, reportOptions.endDate]);

  // Fetch data on component mount
  useEffect(() => {
    fetchHealthData();
  }, [reportOptions.startDate, reportOptions.endDate]);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      
      // Calculate number of days between start and end dates
      const daysDiff = Math.ceil(
        (reportOptions.endDate.getTime() - reportOptions.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const response = await getHealthData(daysDiff);
      
      if (response.success) {
        const { data } = response;
        
        // Process exercise logs into HealthLog format
        const exerciseLogs = data.exerciseLogs.map((log: any) => ({
          id: `exercise-${Date.now()}-${Math.random()}`,
          timestamp: new Date(log.date),
          rawMessage: `Exercise: ${log.type} for ${log.duration} minutes`,
          category: 'exercise' as const,
          confidence: 0.95,
          processed: {
            exercise: {
              duration: log.duration,
              type: log.type,
              distance: log.distance
            }
          }
        }));
        
        // Process food logs into HealthLog format
        const foodLogs = data.foodLogs.map((log: any) => ({
          id: `food-${Date.now()}-${Math.random()}`,
          timestamp: new Date(log.date),
          rawMessage: `Food: ${log.foodItems}`,
          category: 'food' as const,
          confidence: 0.95,
          processed: {
            food: {
              description: log.foodItems
            }
          }
        }));
        
        // Combine logs
        const allLogs = [...exerciseLogs, ...foodLogs];
        
        // Filter logs based on date range
        const filteredLogs = allLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= reportOptions.startDate && logDate <= reportOptions.endDate;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setHealthLogs(filteredLogs);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch health data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = () => {
    setGeneratingPDF(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setGeneratingPDF(false);
      setPdfGenerated(true);
      
      toast({
        title: "PDF Generated",
        description: "Your health report has been generated.",
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
                          readOnly
                          type="text"
                          value={reportOptions.startDate.toISOString().split('T')[0]}
                          onClick={() => setShowStartCalendar((v) => !v)}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStartCalendar((v) => !v)}
                          className="absolute right-3 top-2.5"
                          tabIndex={-1}
                          aria-label="Pick start date"
                          style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {showStartCalendar && (
                          <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                            <CalendarPicker
                              mode="single"
                              selected={reportOptions.startDate}
                              onSelect={(date) => {
                                if (date) {
                                  setReportOptions((prev) => ({ ...prev, startDate: date }));
                                  setShowStartCalendar(false);
                                }
                              }}
                              initialFocus
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">End Date</label>
                      <div className="relative">
                        <input
                          readOnly
                          type="text"
                          value={reportOptions.endDate.toISOString().split('T')[0]}
                          onClick={() => setShowEndCalendar((v) => !v)}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEndCalendar((v) => !v)}
                          className="absolute right-3 top-2.5"
                          tabIndex={-1}
                          aria-label="Pick end date"
                          style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {showEndCalendar && (
                          <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                            <CalendarPicker
                              mode="single"
                              selected={reportOptions.endDate}
                              onSelect={(date) => {
                                if (date) {
                                  setReportOptions((prev) => ({ ...prev, endDate: date }));
                                  setShowEndCalendar(false);
                                }
                              }}
                              initialFocus
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="sm:self-end">
                      <Button 
                        variant={pdfGenerated ? "secondary" : "default"}
                        size="default"
                        className="w-full sm:w-auto"
                        disabled={generatingPDF}
                        onClick={handleGeneratePDF}
                      >
                        {generatingPDF ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            Generate PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {healthLogs.length > 0 ? (
                <PDFReport 
                  logs={healthLogs}
                  options={reportOptions}
                  onDownload={handleGeneratePDF}
                />
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium">No Health Data for Selected Period</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    Try adjusting the date range or send health updates via WhatsApp to see data here.
                  </p>
                  <div className="bg-secondary/70 p-4 rounded-lg inline-block text-left">
                    <p className="font-medium">Example messages to send:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>I ran for 30 minutes today</li>
                      <li>Had a salad with grilled chicken for lunch</li>
                      <li>Walked 2 miles this morning</li>
                      <li>Type "status" to get your weekly report</li>
                    </ul>
                  </div>
                </div>
              )}
              
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