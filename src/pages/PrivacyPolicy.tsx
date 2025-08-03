import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us. This may include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Account credentials and profile information</li>
                <li>Payment and billing information</li>
                <li>Communications with us</li>
                <li>Service preferences and requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Connect customers with service providers</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>With service providers who perform services on our behalf</li>
                <li>Between customers and workers to facilitate service arrangements</li>
                <li>If required by law or to protect our rights and safety</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security of our systems completely.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more details, please see our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to erase your personal information</li>
                <li>The right to restrict processing</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your jurisdiction where data protection laws may differ from those in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for children under 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="text-muted-foreground">
                  <strong>WorkersMate Ltd.</strong><br />
                  Email: privacy@workersmate.ie<br />
                  Phone: 085 8156521
                </p>
              </div>
            </section>

            <div className="text-sm text-muted-foreground mt-8 pt-8 border-t border-border">
              Last updated: January 2025
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;