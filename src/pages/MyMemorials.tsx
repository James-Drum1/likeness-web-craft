import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ImageIcon, Calendar, ExternalLink } from "lucide-react";

interface Memorial {
  id: string;
  title: string | null;
  description: string | null;
  profile_picture_url: string | null;
  photos: string[] | null;
  created_at: string;
  updated_at: string;
}

const MyMemorials = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("memorials")
          .select("id, title, description, profile_picture_url, photos, created_at, updated_at")
          .eq("owner_id", user.id)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        setMemorials(data || []);
      } catch (err) {
        console.error("Failed to load your memorials", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Memorials</h1>
          <p className="text-muted-foreground mb-8">View and manage the memorials you own.</p>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">Loading your memorials…</div>
          ) : memorials.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-lg text-muted-foreground">You don't have any memorials yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Claim a QR code to create your first memorial.</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button asChild variant="secondary">
                    <Link to="/view-all-memories">Browse Public Memories</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/shop">Get a QR Code</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memorials.map((m) => (
                <Card key={m.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="truncate">{m.title || "Untitled Memorial"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {m.profile_picture_url ? (
                      <img
                        src={m.profile_picture_url}
                        alt={`Profile photo for ${m.title || "memorial"}`}
                        loading="lazy"
                        className="w-full h-40 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-40 rounded bg-muted/50 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                    {m.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{m.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Updated {formatDate(m.updated_at)}</p>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button asChild size="sm" variant="secondary">
                      <Link to={`/memory/${m.id}`}>
                        Open
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to={`/memory/${m.id}`}>
                        Edit on Page
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyMemorials;
