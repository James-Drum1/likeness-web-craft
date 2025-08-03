import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Back to home link */}
        <div className="mb-4 md:mb-8">
          <a 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </div>

        <div className="prose prose-gray max-w-none">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6">Cookie Policy</h1>
          
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                WorkersMate uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.</li>
                <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting anonymous information about page visits and user behavior.</li>
                <li><strong>Functionality Cookies:</strong> These cookies allow us to remember your preferences and provide enhanced features and personalization.</li>
                <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites to display relevant advertisements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are strictly necessary for the operation of our website. They include authentication cookies, 
                    security cookies, and cookies that remember your cookie preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground">
                    We use Google Analytics to analyze website traffic and usage patterns. These cookies help us improve 
                    our website and user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Preference Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies remember your settings and preferences, such as your location selection and display preferences.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Browser settings: Most browsers allow you to control cookies through their settings preferences.</li>
                <li>Cookie banner: Use our cookie consent banner to accept or reject non-essential cookies.</li>
                <li>Third-party opt-out: You can opt out of third-party cookies through their respective websites.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Cookie Retention</h2>
              <p className="text-muted-foreground mb-4">
                Different types of cookies are stored for different periods:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
                <li><strong>Analytics cookies:</strong> Typically stored for up to 2 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>Email: privacy@workersmate.ie</li>
                <li>Phone: +353 1 234 5678</li>
                <li>Address: 123 Business Street, Dublin, Ireland</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;