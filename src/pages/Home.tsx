import {
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  Shield,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { useId } from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const featuresId = useId();
  const pricingId = useId();
  const testimonialsId = useId();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-dashed bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href={`#${featuresId}`}
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href={`#${pricingId}`}
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </a>
              <a
                href={`#${testimonialsId}`}
                className="text-muted-foreground hover:text-foreground"
              >
                Testimonials
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Now Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Digital Group Savings
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                {" "}
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your community savings groups with our modern platform.
              Manage contributions, track loans, and build financial resilience
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 text-sm text-muted-foreground">
              Trusted by 500+ communities worldwide
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed w-full" />

      {/* Features Section */}
      <section id={featuresId} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage group savings
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From contribution tracking to loan management, we've got your
              community covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:border">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Community Management</CardTitle>
                <CardDescription>
                  Create and manage savings groups with flexible member roles
                  and invitation systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Contribution Tracking</CardTitle>
                <CardDescription>
                  Record and approve contributions with complete audit trails
                  and status tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Secure & Compliant</CardTitle>
                <CardDescription>
                  Enterprise-grade security with complete data protection for
                  your community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Mobile Ready</CardTitle>
                <CardDescription>
                  Access your community savings from anywhere with our
                  responsive web platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Global Access</CardTitle>
                <CardDescription>
                  Support for multiple payment methods including mobile money
                  and bank transfers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed reports and insights to help your community make
                  informed financial decisions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed w-full" />

      {/* Pricing Section */}
      <section id={pricingId} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your community's needs. Start free and
              scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border dark:bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for small communities</CardDescription>
                <div className="text-4xl font-bold text-foreground">$0</div>
                <div className="text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />1
                    community maximum
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    10 members per community
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Basic contribution tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Email notifications
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Basic reporting
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Get Started Free</Button>
              </CardFooter>
            </Card>

            {/* Basic Plan */}
            <Card className="border-2 border-primary relative bg-primary/10">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Basic</CardTitle>
                <CardDescription>Great for growing communities</CardDescription>
                <div className="text-4xl font-bold text-foreground">$29</div>
                <div className="text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />5
                    communities maximum
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    50 members per community
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Loan management features
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    SMS notifications
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Advanced reporting
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Data export capabilities
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Basic Plan</Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border dark:bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="text-4xl font-bold text-foreground">$99</div>
                <div className="text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Unlimited communities
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Unlimited members
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    All notification channels
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Custom branding
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 shrink-0" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed w-full" />

      {/* Testimonials Section */}
      <section id={testimonialsId} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by communities worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users say about transforming their savings groups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Jamii Save has revolutionized how our community manages
                  savings. The transparency and ease of use is incredible."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      A
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Alice Mwangi</div>
                    <div className="text-sm text-muted-foreground">
                      Community Leader, Nairobi
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Finally, a platform that understands African savings culture.
                  Our group has grown from 10 to 50 members since using Jamii
                  Save."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      J
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">John Ochieng</div>
                    <div className="text-sm text-muted-foreground">
                      Treasurer, Kisumu
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The loan management features are game-changing. We can now
                  track everything digitally with complete transparency."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      M
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Mary Wanjiku</div>
                    <div className="text-sm text-muted-foreground">
                      Secretary, Mombasa
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed w-full" />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to transform your community savings?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of communities already using Jamii Save to build
            financial resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Community Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <div className="border-t border-dashed w-full" />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <img
                  src="/logo.png"
                  alt="Jamii Save"
                  className="h-8 w-auto brightness-200"
                />
              </div>
              <p className="text-gray-400">
                Building financial resilience through community savings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href={`#${featuresId}`} className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href={`#${pricingId}`} className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/api" className="hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="/integrations" className="hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/help" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/docs" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/status" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Jamii Save. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
