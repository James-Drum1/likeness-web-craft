import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Calendar, MapPin, Upload, Save, LogIn } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

interface QRCode {
  id: string;
  memorial_url: string;
  status: string;
  claimed_by: string | null;
  memorial_id: string | null;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  birth_date: string | null;
  death_date: string | null;
  photos: string[] | null;
  profile_picture_url: string | null;
}

const QRMemory = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<QRCode | null>(null);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");

  useEffect(() => {
    if (qrCode) {
      loadQRData();
    }
  }, [qrCode]);

  const loadQRData = async () => {
    try {
      console.log('Loading QR data for code:', qrCode);
      
      // First check if QR code exists
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCode)
        .single();

      if (qrError || !qrData) {
        console.error('QR code not found:', qrError);
        toast({
          title: "QR Code Not Found",
          description: "This QR code does not exist in our system.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setQrData(qrData);

      // If QR code has a memory, load it
      if (qrData.status === 'claimed' && qrData.memorial_id) {
        const { data: memoryData, error: memoryError } = await supabase
          .from('memorials')
          .select('*')
          .eq('id', qrData.memorial_id)
          .single();

        if (memoryData && !memoryError) {
          setMemory(memoryData);
          setTitle(memoryData.title);
          setDescription(memoryData.description || '');
          setBirthDate(memoryData.birth_date || '');
          setDeathDate(memoryData.death_date || '');
          setHasMemory(memoryData.title ? true : false);
        }
      } else if (qrData.status === 'unclaimed' && !user) {
        // If QR code is unclaimed and user is not logged in, show login prompt
        setShowLoginPrompt(true);
      }

    } catch (error) {
      console.error('Error loading QR data:', error);
      toast({
        title: "Error",
        description: "Failed to load QR code data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to create a memory.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsCreating(true);

    try {
      // Update QR code to mark as claimed and create memorial
      const { error: updateError } = await supabase
        .from('qr_codes')
        .update({ 
          status: 'claimed', 
          claimed_by: user.id 
        })
        .eq('id', qrData?.id);

      if (updateError) {
        console.error('Error updating QR code:', updateError);
        throw updateError;
      }

      // The trigger will automatically create the memorial
      toast({
        title: "Memorial Created!",
        description: "Your memorial has been successfully created and linked to this QR code.",
      });

      // Refresh data
      await loadQRData();

    } catch (error: any) {
      console.error('Error creating memory:', error);
      toast({
        title: "Error",
        description: "Failed to create memory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !memory) {
      toast({
        title: "Not Authorized",
        description: "Only the creator can edit this memory.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('memorials')
        .update({
          title: title.trim(),
          description: description.trim(),
          birth_date: birthDate || null,
          death_date: deathDate || null,
        })
        .eq('id', memory.id);

      if (error) throw error;

      toast({
        title: "Memory Updated!",
        description: "Your memory has been successfully updated.",
      });

      setIsEditing(false);
      await loadQRData();

    } catch (error: any) {
      console.error('Error updating memory:', error);
      toast({
        title: "Error",
        description: "Failed to update memory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading memory...</div>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">QR Code Not Found</h1>
          <p className="text-muted-foreground">This QR code does not exist in our system.</p>
        </div>
      </div>
    );
  }

  // Show login prompt for unclaimed QR codes
  if (showLoginPrompt && !memory && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl text-primary">Create a Memory</CardTitle>
              <CardDescription className="text-lg">
                Please log in to create a beautiful memory for this QR code
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                To create a memorial for this QR code, you need to create an account or log in.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/login")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign Up
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                QR Code: {qrData?.id}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show memory view if memory exists and not editing
  if (memory && !isEditing) {
    const canEdit = user && qrData?.claimed_by === user.id;
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl text-primary">{memory.title}</CardTitle>
              <CardDescription className="text-lg">In loving memory</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {memory.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-muted-foreground">{memory.description}</p>
                </div>
              )}

              {memory.birth_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Born: {new Date(memory.birth_date).toLocaleDateString()}</span>
                </div>
              )}

              {memory.death_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Passed: {new Date(memory.death_date).toLocaleDateString()}</span>
                </div>
              )}

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Created with love • QR Code: {qrData.id}
                </p>
              </div>

              {/* Edit button for creator */}
              {canEdit && (
                <div className="pt-4 text-center">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Edit Memory
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show create/edit form
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl text-primary">
              {memory ? 'Edit Memory' : 'Create a Memory'}
            </CardTitle>
            <CardDescription className="text-lg">
              {memory ? 'Update this beautiful memory' : 'Create a beautiful memory for this QR code'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={memory ? handleUpdateMemory : handleCreateMemory} className="space-y-6">
              {!memory && user && (
                <div className="space-y-2">
                  <Label>Creator Email</Label>
                  <Input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    You are logged in as the creator of this memory.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Memory Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., In loving memory of John Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share a beautiful memory, story, or tribute..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deathDate">Death Date</Label>
                <Input
                  id="deathDate"
                  type="date"
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Saving...' : (memory ? 'Update Memory' : 'Create Memory')}
                </Button>
                
                {memory && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRMemory;