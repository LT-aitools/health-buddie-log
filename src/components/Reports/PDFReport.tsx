import { PDFReportOptions, HealthLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import GlassCard from "@/components/ui-custom/GlassCard";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

interface PDFReportProps {
  logs: HealthLog[];
  options: PDFReportOptions;
  onDownload: () => void;
}

const PDFReport: React.FC<PDFReportProps> = ({ logs, options, onDownload }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      // Call the onDownload to show loading state
      onDownload();

      // Create canvas from the report div
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download PDF
      pdf.save('health-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Calculate summary statistics
  const exerciseLogs = logs.filter(log => log.category === 'exercise');
  const foodLogs = logs.filter(log => log.category === 'food');
  
  const exerciseCount = exerciseLogs.length;
  
  const totalDuration = exerciseLogs.reduce((total, log) => {
    return total + (log.processed.exercise?.duration || 0);
  }, 0);
  
  const averageDuration = exerciseCount > 0 ? totalDuration / exerciseCount : 0;
  
  // Get exercise types
  const exerciseTypes: { [key: string]: number } = {};
  exerciseLogs.forEach(log => {
    const type = log.processed.exercise?.type || 'unknown';
    exerciseTypes[type] = (exerciseTypes[type] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <GlassCard className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-medium">Health Report</h2>
          </div>
          <Button 
            onClick={generatePDF}
            className="rounded-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        
        <div ref={reportRef} className="mt-6 space-y-8 bg-white p-8 rounded-lg">
          <div>
            <h3 className="text-xl font-medium border-b pb-2">Weekly Summary</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {formatDateRange(options.startDate, options.endDate)}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Exercise Sessions</p>
                <p className="text-3xl font-bold mt-1">{exerciseCount}</p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Average Duration</p>
                <p className="text-3xl font-bold mt-1">{averageDuration.toFixed(0)} <span className="text-base font-normal">mins</span></p>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Food Logs</p>
                <p className="text-3xl font-bold mt-1">{foodLogs.length}</p>
              </div>
            </div>
            
            {Object.keys(exerciseTypes).length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Exercise Types</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(exerciseTypes).map(([type, count], index) => (
                    <div 
                      key={type}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        index % 4 === 0 ? "bg-blue-100 text-blue-700" :
                        index % 4 === 1 ? "bg-green-100 text-green-700" :
                        index % 4 === 2 ? "bg-purple-100 text-purple-700" :
                        "bg-amber-100 text-amber-700"
                      )}
                    >
                      <span className="capitalize">{type}</span> {count}x
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-medium border-b pb-2">Detailed Log</h3>
            
            <div className="space-y-4 mt-4">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="border border-border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        log.category === "exercise" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      )}>
                        {log.category === "exercise" ? "Exercise" : "Food"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <p className="mt-2 text-sm">{log.rawMessage}</p>
                    
                    {log.category === "exercise" && log.processed.exercise && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {log.processed.exercise.duration && (
                          <span className="bg-secondary/50 px-2 py-1 rounded text-xs">
                            {log.processed.exercise.duration} mins
                          </span>
                        )}
                        {log.processed.exercise.type && (
                          <span className="bg-secondary/50 px-2 py-1 rounded text-xs capitalize">
                            {log.processed.exercise.type}
                          </span>
                        )}
                        {log.processed.exercise.distance && (
                          <span className="bg-secondary/50 px-2 py-1 rounded text-xs">
                            {log.processed.exercise.distance}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {log.category === "food" && log.processed.food && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-secondary/50 px-2 py-1 rounded text-xs">
                          {log.processed.food.description}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No logs found for this period</p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default PDFReport;
