
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Settings, PlusCircle, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui-custom/GlassCard";
import { mockCareTemplates } from "@/lib/mock-data";
import { CareTemplate, HealthCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const Templates = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<CareTemplate[]>(mockCareTemplates);
  const [editingTemplate, setEditingTemplate] = useState<CareTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<CareTemplate> | null>(null);
  const { toast } = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTemplate = () => {
    setNewTemplate({
      name: "",
      category: "exercise",
      frequency: "",
      active: true,
    });
  };

  const handleEditTemplate = (template: CareTemplate) => {
    setEditingTemplate({ ...template });
  };

  const handleSaveTemplate = (template: Partial<CareTemplate>, isNew: boolean) => {
    if (!template.name || !template.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isNew && template) {
      const newTemplateWithId: CareTemplate = {
        id: `template-${Date.now()}`,
        name: template.name || "",
        category: template.category as HealthCategory || "exercise",
        frequency: template.frequency || "",
        active: template.active || false,
      };
      
      setTemplates([...templates, newTemplateWithId]);
      setNewTemplate(null);
      
      toast({
        title: "Template Created",
        description: "Your new care plan template has been created.",
        variant: "default",
      });
    } else if (editingTemplate) {
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? { ...editingTemplate, ...template } : t
      );
      
      setTemplates(updatedTemplates);
      setEditingTemplate(null);
      
      toast({
        title: "Template Updated",
        description: "Your care plan template has been updated.",
        variant: "default",
      });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    
    toast({
      title: "Template Deleted",
      description: "Your care plan template has been deleted.",
      variant: "default",
    });
  };

  const handleToggleActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    ));
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
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="mr-4 bg-primary text-white p-3 rounded-full">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Care Templates</h1>
                    <p className="text-muted-foreground">
                      Create and manage your health tracking templates
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddTemplate}
                  className="rounded-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              <div className="space-y-4">
                {templates.map((template) => (
                  <GlassCard key={template.id} className="relative">
                    {editingTemplate && editingTemplate.id === template.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Edit Template</h3>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() => setEditingTemplate(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() => handleSaveTemplate(editingTemplate, false)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Template Name</label>
                            <Input 
                              value={editingTemplate.name}
                              onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                              placeholder="E.g., Regular Exercise"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={editingTemplate.category === "exercise" ? "default" : "outline"}
                                onClick={() => setEditingTemplate({ ...editingTemplate, category: "exercise" })}
                                className={cn("flex-1", editingTemplate.category === "exercise" ? "" : "text-muted-foreground")}
                              >
                                Exercise
                              </Button>
                              <Button
                                type="button"
                                variant={editingTemplate.category === "food" ? "default" : "outline"}
                                onClick={() => setEditingTemplate({ ...editingTemplate, category: "food" })}
                                className={cn("flex-1", editingTemplate.category === "food" ? "" : "text-muted-foreground")}
                              >
                                Food
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-1 block">Frequency</label>
                            <Input 
                              value={editingTemplate.frequency}
                              onChange={(e) => setEditingTemplate({ ...editingTemplate, frequency: e.target.value })}
                              placeholder="E.g., 3 times a week"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <label className="text-sm font-medium">Active</label>
                            <Switch
                              checked={editingTemplate.active}
                              onCheckedChange={(checked) => setEditingTemplate({ ...editingTemplate, active: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{template.name}</h3>
                            <Badge className={template.category === "exercise" ? "bg-blue-500" : "bg-green-500"}>
                              {template.category}
                            </Badge>
                            {!template.active && (
                              <Badge variant="outline" className="text-muted-foreground">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            Frequency: {template.frequency}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          <Switch
                            checked={template.active}
                            onCheckedChange={() => handleToggleActive(template.id)}
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8 rounded-full text-destructive"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                ))}

                {newTemplate && (
                  <GlassCard className="border-2 border-dashed border-primary/20 animate-fade-in">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">New Template</h3>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => setNewTemplate(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => handleSaveTemplate(newTemplate, true)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Template Name</label>
                          <Input 
                            value={newTemplate.name || ''}
                            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                            placeholder="E.g., Regular Exercise"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Category</label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={newTemplate.category === "exercise" ? "default" : "outline"}
                              onClick={() => setNewTemplate({ ...newTemplate, category: "exercise" })}
                              className={cn("flex-1", newTemplate.category === "exercise" ? "" : "text-muted-foreground")}
                            >
                              Exercise
                            </Button>
                            <Button
                              type="button"
                              variant={newTemplate.category === "food" ? "default" : "outline"}
                              onClick={() => setNewTemplate({ ...newTemplate, category: "food" })}
                              className={cn("flex-1", newTemplate.category === "food" ? "" : "text-muted-foreground")}
                            >
                              Food
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Frequency</label>
                          <Input 
                            value={newTemplate.frequency || ''}
                            onChange={(e) => setNewTemplate({ ...newTemplate, frequency: e.target.value })}
                            placeholder="E.g., 3 times a week"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <label className="text-sm font-medium">Active</label>
                          <Switch
                            checked={newTemplate.active || false}
                            onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, active: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {templates.length === 0 && !newTemplate && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first care template to start tracking your health goals.
                    </p>
                    <Button 
                      onClick={handleAddTemplate}
                      className="rounded-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-medium">How Templates Work</h3>
                
                <div className="space-y-3 text-sm">
                  <p>
                    Templates help you establish regular health tracking habits:
                  </p>
                  
                  <div className="pl-4 border-l-2 border-primary/20">
                    <p className="mb-2"><strong>Exercise Templates:</strong> Set goals like "exercise 3 times a week"</p>
                    <p><strong>Food Templates:</strong> Create routines like "log meals once a day"</p>
                  </div>
                  
                  <p>
                    While templates provide guidance, you can always log health updates outside of these parameters. 
                    They serve as reminders rather than strict limitations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Templates;
