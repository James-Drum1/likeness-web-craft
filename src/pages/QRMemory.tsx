import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Calendar, MapPin, Save, LogIn, MessageSquare, User } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

interface QRCode {
  id: string;
  memorial_url: string;
  status: string;
  claimed_by: string | null;
  memorial_id: string | null;
}

interface Memorial {
  id: string;
  title: string;
  description: string;
  birth_date: string | null;
  death_date: string | null;
  photos: string[] | null;
  profile_picture_url: string | null;
  owner_id: string;
}

interface GuestbookMessage {
  id: string;
  author_name: string;
  author_email: string | null;
  message: string;
  created_at: string;
  is_approved: boolean;
}

const QRMemory = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Validate QR code parameter
  if (!qrCode || qrCode === 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid QR Code</h1>
          <p className="text-gray-600 mb-6">The QR code URL is invalid or missing.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<QRCode | null>(null);
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCondolences, setShowCondolences] = useState(false);
  
  // Memorial form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");

  // Sign up form state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");

  // Guestbook form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  useEffect(() => {
    console.log('QRMemory component mounted with qrCode:', qrCode);
    if (qrCode) {
      loadQRData();
    } else {
      console.log('No qrCode parameter found in URL');
    }
  }, [qrCode]);

  const loadQRData = async () => {
    try {
      console.log('Loading QR data for code:', qrCode);
      
      // First try to load memorial directly by ID (for existing memorials)
      const { data: memorialData, error: memorialError } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', qrCode)
        .maybeSingle();

      if (memorialData && !memorialError) {
        console.log('Found existing memorial:', memorialData);
        setMemorial(memorialData);
        setTitle(memorialData.title || '');
        setDescription(memorialData.description || '');
        setBirthDate(memorialData.birth_date || '');
        setDeathDate(memorialData.death_date || '');
        
        // Load guestbook messages for this memorial
        const { data: guestbookData } = await supabase
          .from('guestbook_messages')
          .select('*')
          .eq('memorial_id', memorialData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });
        
        setGuestbookMessages(guestbookData || []);
        return;
      }

      // If no memorial found, check if it's a QR code
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCode)
        .maybeSingle();

      if (qrError) {
        console.error('Database error:', qrError);
        toast({
          title: "Database Error",
          description: "Failed to fetch QR code data.",
          variant: "destructive",
        });
        return;
      }

      if (!qrData) {
        console.error('QR code not found in database:', qrCode);
        toast({
          title: "QR Code Not Found",
          description: "This QR code does not exist in our system.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setQrData(qrData);

      // If QR code has a memorial, load it and guestbook messages
      if (qrData.status === 'claimed') {
        // The memorial should have the same ID as the QR code
        const { data: memorialData, error: memorialError } = await supabase
          .from('memorials')
          .select('*')
          .eq('id', qrData.id)
          .single();

        if (memorialData && !memorialError) {
          setMemorial(memorialData);
          setTitle(memorialData.title || '');
          setDescription(memorialData.description || '');
          setBirthDate(memorialData.birth_date || '');
          setDeathDate(memorialData.death_date || '');

          // Load guestbook messages
          const { data: messages } = await supabase
            .from('guestbook_messages')
            .select('*')
            .eq('memorial_id', memorialData.id)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

          setGuestbookMessages(messages || []);
        }
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signUpName
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created",
        description: "Your account has been created. You can now create a memorial.",
      });

      setShowSignUp(false);
      // User will be automatically logged in, so we can proceed to memorial creation

    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateMemorial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !qrData) {
      toast({
        title: "Login Required",
        description: "Please log in to create a memorial.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      console.log('Starting memorial creation process...');
      
      // Step 1: Claim the QR code (this will trigger the automatic memorial creation)
      const { error: claimError } = await supabase
        .from('qr_codes')
        .update({ 
          status: 'claimed', 
          claimed_by: user.id,
          memorial_id: qrData.id  // Link to the memorial that will be created
        })
        .eq('id', qrData.id)
        .eq('status', 'unclaimed'); // Only update if still unclaimed

      if (claimError) {
        console.error('Error claiming QR code:', claimError);
        throw new Error('Failed to claim QR code. It may have already been claimed.');
      }

      console.log('QR code claimed successfully, waiting for trigger...');
      
      // Step 2: Wait a moment for the database trigger to create the memorial
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Update the memorial with user's form data
      const { error: updateError } = await supabase
        .from('memorials')
        .update({
          title: title.trim(),
          description: description.trim(),
          birth_date: birthDate || null,
          death_date: deathDate || null,
        })
        .eq('id', qrData.id)
        .eq('owner_id', user.id); // Ensure only the owner can update

      if (updateError) {
        console.error('Error updating memorial:', updateError);
        // If the update fails, try to verify the memorial was created
        const { data: memorial } = await supabase
          .from('memorials')
          .select('*')
          .eq('id', qrData.id)
          .single();
          
        if (!memorial) {
          throw new Error('Memorial was not created by the trigger. Please try again.');
        }
        
        throw new Error('Failed to update memorial details. Please try editing it after creation.');
      }

      console.log('Memorial updated successfully!');

      toast({
        title: "Memorial Created!",
        description: "Your memorial has been successfully created.",
      });

      // Refresh data to show the new memorial
      await loadQRData();

    } catch (error: any) {
      console.error('Error in memorial creation process:', error);
      
      // Provide specific error messages
      let errorMessage = "Failed to create memorial. Please try again.";
      if (error.message.includes('claimed')) {
        errorMessage = "This QR code has already been claimed by someone else.";
      } else if (error.message.includes('trigger')) {
        errorMessage = "Memorial creation failed. Please contact support.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMemorial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !memorial || memorial.owner_id !== user.id) {
      toast({
        title: "Not Authorized",
        description: "Only the creator can edit this memorial.",
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
        .eq('id', memorial.id);

      if (error) throw error;

      toast({
        title: "Memorial Updated!",
        description: "Your memorial has been successfully updated.",
      });

      setIsEditing(false);
      await loadQRData();

    } catch (error: any) {
      console.error('Error updating memorial:', error);
      toast({
        title: "Error",
        description: "Failed to update memorial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddCondolence = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memorial) {
      toast({
        title: "Error",
        description: "Memorial not found.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .insert({
          memorial_id: memorial.id,
          author_name: guestName.trim(),
          author_email: guestEmail.trim() || null,
          message: guestMessage.trim(),
        });

      if (error) throw error;

      toast({
        title: "Condolence Added",
        description: "Your message has been added to the guestbook.",
      });

      // Reset form
      setGuestName("");
      setGuestEmail("");
      setGuestMessage("");
      setShowCondolences(false);

      // Refresh guestbook messages
      await loadQRData();

    } catch (error: any) {
      console.error('Error adding condolence:', error);
      toast({
        title: "Error",
        description: "Failed to add your message. Please try again.",
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
          <div className="text-lg">Loading memorial...</div>
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

  // Show sign up prompt for unclaimed QR codes when user is not logged in
  if (qrData.status === 'unclaimed' && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl text-primary">Create a Memorial</CardTitle>
              <CardDescription className="text-lg">
                Create a beautiful memorial for your loved one
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!showSignUp ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    To create a memorial for this QR code, you need to create an account or log in.
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => navigate("/login")}
                      variant="outline"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      I Have an Account
                    </Button>
                    
                    <Button 
                      onClick={() => setShowSignUp(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Create Account
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    QR Code: {qrData.id}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signUpName">Full Name</Label>
                    <Input
                      id="signUpName"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signUpEmail">Email</Label>
                    <Input
                      id="signUpEmail"
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signUpPassword">Password</Label>
                    <Input
                      id="signUpPassword"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Choose a secure password"
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {isCreating ? 'Creating Account...' : 'Create Account & Memorial'}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowSignUp(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show memorial view if memorial exists and not editing
  if (memorial && !isEditing) {
    const canEdit = user && memorial.owner_id === user.id;
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl text-primary">{memorial.title}</CardTitle>
              <CardDescription className="text-lg">In loving memory</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {memorial.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-muted-foreground">{memorial.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {memorial.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Born</div>
                      <div>{new Date(memorial.birth_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}

                {memorial.death_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                      <div>{new Date(memorial.death_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guestbook Messages */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Condolences ({guestbookMessages.length})</h3>
                  <Button 
                    onClick={() => setShowCondolences(true)}
                    variant="outline"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Condolence
                  </Button>
                </div>

                {showCondolences && (
                  <Card className="mb-4 p-4">
                    <form onSubmit={handleAddCondolence} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Your Name</Label>
                        <Input
                          id="guestName"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestEmail">Email (optional)</Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestMessage">Your Message</Label>
                        <Textarea
                          id="guestMessage"
                          value={guestMessage}
                          onChange={(e) => setGuestMessage(e.target.value)}
                          placeholder="Share your condolences or a fond memory..."
                          rows={3}
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          type="submit"
                          disabled={isCreating}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isCreating ? 'Adding...' : 'Add Condolence'}
                        </Button>
                        
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setShowCondolences(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="space-y-4">
                  {guestbookMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No condolences yet. Be the first to share your thoughts.</p>
                  ) : (
                    guestbookMessages.map((message) => (
                      <Card key={message.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <User className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{message.author_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(message.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{message.message}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

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
                    Edit Memorial
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
              {memorial ? 'Edit Memorial' : 'Create a Memorial'}
            </CardTitle>
            <CardDescription className="text-lg">
              {memorial ? 'Update this beautiful memorial' : 'Create a beautiful memorial for your loved one'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={memorial ? handleUpdateMemorial : handleCreateMemorial} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Memorial Title *</Label>
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Saving...' : (memorial ? 'Update Memorial' : 'Create Memorial')}
                </Button>
                
                {memorial && (
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