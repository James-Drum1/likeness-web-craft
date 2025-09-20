import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Memory {
  id: string;
  title: string;
  description: string;
  birth_date: string;
  death_date: string;
  owner_id: string;
  photos: string[];
  created_at: string;
}

interface QRCode {
  id: string;
  memorial_url: string;
  status: string;
  claimed_by: string | null;
  memorial_id: string | null;
  created_at: string;
}

const ViewAllMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemoriesAndQRCodes();
  }, []);

  const loadMemoriesAndQRCodes = async () => {
    try {
      setLoading(true);
      
      // Load all memories
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('memorials')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (memoriesError) {
        console.error('Error loading memories:', memoriesError);
        toast.error('Failed to load memories');
        return;
      }

      // Load all QR codes
      const { data: qrCodesData, error: qrCodesError } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (qrCodesError) {
        console.error('Error loading QR codes:', qrCodesError);
        toast.error('Failed to load QR codes');
        return;
      }

      setMemories(memoriesData || []);
      setQRCodes(qrCodesData || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getQRCodeForMemory = (memorialId: string) => {
    return qrCodes.find(qr => qr.memorial_id === memorialId);
  };

  const claimedQRCodes = qrCodes.filter(qr => qr.status === 'claimed');
  const unclaimedQRCodes = qrCodes.filter(qr => qr.status === 'unclaimed');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading memories...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              All Memories & QR Codes
            </h1>
            <p className="text-muted-foreground text-lg">
              View all created memories and QR codes in your system
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Memories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{memories.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Claimed QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{claimedQRCodes.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unclaimed QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{unclaimedQRCodes.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Memories Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Created Memories</h2>
            {memories.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-lg">No memories have been created yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Memories will appear here when QR codes are scanned and claimed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memories.map((memory) => {
                  const qrCode = getQRCodeForMemory(memory.id);
                  return (
                    <Card key={memory.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg truncate">{memory.title}</CardTitle>
                          {qrCode && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {qrCode.id}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {memory.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {memory.description}
                          </p>
                        )}
                        
                        <div className="space-y-2">
                          {memory.birth_date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Born: {formatDate(memory.birth_date)}</span>
                            </div>
                          )}
                          
                          {memory.death_date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Passed: {formatDate(memory.death_date)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="truncate">Owner: {memory.owner_id}</span>
                          </div>
                          
                          {memory.photos && memory.photos.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ImageIcon className="h-4 w-4" />
                              <span>{memory.photos.length} photo(s)</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Created {formatDate(memory.created_at)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* QR Codes Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">QR Code Status</h2>
            
            {/* Claimed QR Codes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-green-600">
                Claimed QR Codes ({claimedQRCodes.length})
              </h3>
              {claimedQRCodes.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No QR codes have been claimed yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {claimedQRCodes.map((qr) => (
                    <Card key={qr.id} className="p-3">
                      <div className="text-center">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {qr.id}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(qr.created_at)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Unclaimed QR Codes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-600">
                Unclaimed QR Codes ({unclaimedQRCodes.length})
              </h3>
              {unclaimedQRCodes.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">All QR codes have been claimed!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {unclaimedQRCodes.map((qr) => (
                    <Card key={qr.id} className="p-3">
                      <div className="text-center">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {qr.id}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(qr.created_at)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewAllMemories;