import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase,
  Camera,
  ArrowLeft
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface WorkerProfile {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  years_experience: number;
  status: string;
  is_verified: boolean;
}

interface Service {
  id: string;
  service_name: string;
  description: string;
  category: string;
  price_from: number;
  price_to: number;
}

interface PortfolioImage {
  id: string;
  image_url: string;
  caption?: string;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  customer_id: string;
}

const WorkerProfile = () => {
  const { workerId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, review_text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (workerId) {
      fetchWorkerData();
      trackProfileView();
    }
  }, [workerId]);

  const trackProfileView = async () => {
    try {
      // Track profile view
      await supabase
        .from('profile_views')
        .insert({
          worker_id: workerId,
          viewer_user_id: user?.id || null
        });
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  };

  const fetchWorkerData = async () => {
    try {
      // Fetch worker profile
      const { data: profileData, error: profileError } = await supabase
        .from('worker_portfolios')
        .select('*')
        .eq('id', workerId)
        .eq('status', 'active')
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch services
      const { data: servicesData } = await supabase
        .from('worker_services')
        .select('*')
        .eq('worker_id', workerId);
      setServices(servicesData || []);

      // Fetch portfolio images
      const { data: imagesData } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('worker_id', workerId);
      setPortfolioImages(imagesData || []);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('worker_reviews')
        .select('*')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });
      setReviews(reviewsData || []);

    } catch (error) {
      console.error('Error fetching worker data:', error);
      toast({
        title: "Error",
        description: "Failed to load worker profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to leave a review",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('worker_reviews')
        .insert({
          worker_id: workerId,
          customer_id: user.id,
          rating: newReview.rating,
          review_text: newReview.review_text
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setNewReview({ rating: 5, review_text: "" });
      fetchWorkerData(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="text-lg">Loading profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The worker profile you're looking for doesn't exist or is not available.
              </p>
              <Button onClick={() => navigate('/browse-workers')}>
                Browse Other Workers
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{profile.business_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={profile.status === 'active' ? 'default' : 'secondary'}>
                        {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                      </Badge>
                      {profile.is_verified && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{calculateAverageRating()}</span>
                      <span className="text-muted-foreground">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {profile.description || "No description provided."}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.years_experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{service.service_name}</h4>
                    <Badge variant="outline" className="mt-1">
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {service.description}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      From €{service.price_from}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Gallery */}
        {portfolioImages.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolioImages.map((image) => (
                  <img
                    key={image.id}
                    src={image.image_url}
                    alt={image.caption || "Portfolio image"}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Leave a Review */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Review</label>
                  <Textarea
                    value={newReview.review_text}
                    onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                    placeholder="Share your experience..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={submitReview} 
                  disabled={submittingReview}
                  className="w-full"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to leave a review!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WorkerProfile;