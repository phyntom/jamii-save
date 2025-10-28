import { ArrowRight, BarChart3, Check, Globe, Shield, Smartphone, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import { Logo } from '@/components/commons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThemeToggle } from '@/components/commons/theme-toggle';

export default function LandingPage() {
  const featuresId = useId();
  const pricingId = useId();
  const testimonialsId = useId();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-dashed backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="default" />
            <div className="hidden md:flex items-center space-x-8">
              <a href={`#${featuresId}`} className="text-gray-600 dark:text-foreground hover:text-gray-900 dark:hover:text-secondary-foreground">
                Features
              </a>
              <a href={`#${pricingId}`} className="text-gray-600 dark:text-foreground hover:text-gray-900 dark:hover:text-secondary-foreground">
                Pricing
              </a>
              <a href={`#${testimonialsId}`} className="text-gray-600 dark:text-foreground hover:text-gray-900 dark:hover:text-secondary-foreground">
                Testimonials
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
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
              🚀 Now Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 dark:text-foreground">
              Digital Group Savings
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {' '}
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto dark:text-secondary-foreground">
              Transform your community savings groups with our modern platform. Manage
              contributions, track loans, and build financial resilience together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 text-sm text-gray-500 dark:text-muted-foreground">Trusted by 500+ communities worldwide</div>
          </div>
        </div>
      </section>

      <div className='border-t-1 border-dashed w-full'></div>

      {/* Features Section */}
      <section id={featuresId} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-foreground">
              Everything you need to manage group savings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-muted-foreground">
              From contribution tracking to loan management, we've got your community covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:border-1">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Community Management</CardTitle>
                <CardDescription>
                  Create and manage savings groups with flexible member roles and invitation
                  systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border-1">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Contribution Tracking</CardTitle>
                <CardDescription>
                  Record and approve contributions with complete audit trails and status tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Secure & Compliant</CardTitle>
                <CardDescription>
                  Bank-level security with Better-Auth and complete data protection for your
                  community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border-1">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Mobile Ready</CardTitle>
                <CardDescription>
                  Access your community savings from anywhere with our responsive web platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border-1">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Global Access</CardTitle>
                <CardDescription>
                  Support for multiple payment methods including mobile money and bank transfers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:border-1">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed reports and insights to help your community make informed financial
                  decisions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <div className='border-t-1 border-dashed w-full'></div>

      {/* Pricing Section */}
      <section id={pricingId} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-muted-foreground">
              Choose the plan that fits your community's needs. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-1 dark:bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for small communities</CardDescription>
                <div className="text-4xl font-bold text-gray-900 dark:text-foreground">$0</div>
                <div className="text-gray-600 dark:text-secondary-foreground">per month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />1 community maximum
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    10 members per community
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Basic contribution tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Email notifications
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Basic reporting
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Get Started Free
                </Button>
              </CardFooter>
            </Card>

            {/* Basic Plan */}
            <Card className="border-2 border-primary relative bg-primary/10">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl dark:text-foreground">Basic</CardTitle>
                <CardDescription>Great for growing communities</CardDescription>
                <div className="text-4xl font-bold text-gray-900 dark:text-foreground">$29</div>
                <div className="text-gray-600 dark:text-secondary-foreground">per month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />5 communities maximum
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    50 members per community
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Loan management features
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    SMS notifications
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Advanced reporting
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Data export capabilities
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Basic Plan</Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-1 dark:bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="text-4xl font-bold text-gray-900 dark:text-foreground">$99</div>
                <div className="text-gray-600 dark:text-secondary-foreground">per month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Unlimited communities
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Unlimited members
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    All notification channels
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    Custom branding
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3" />
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

      <div className='border-t-1 border-dashed w-full'></div>

      {/* Testimonials Section */}
      <section id={testimonialsId} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-foreground">
              Trusted by communities worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-muted-foreground">
              See what our users say about transforming their savings groups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 mb-4 dark:text-secondary-foreground">
                  "Jamii Save has revolutionized how our community manages savings. The transparency
                  and ease of use is incredible."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold">Alice Mwangi</div>
                    <div className="text-sm text-gray-500 dark:text-muted-foreground">Community Leader, Nairobi</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 mb-4 dark:text-secondary-foreground">
                  "Finally, a platform that understands African savings culture. Our group has grown
                  from 10 to 50 members since using Jamii Save."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">J</span>
                  </div>
                  <div>
                    <div className="font-semibold">John Ochieng</div>
                    <div className="text-sm text-gray-500 dark:text-muted-foreground">Treasurer, Kisumu</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 mb-4 dark:text-secondary-foreground">
                  "The loan management features are game-changing. We can now track everything
                  digitally with complete transparency."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold">Mary Wanjiku</div>
                    <div className="text-sm text-gray-500 dark:text-muted-foreground">Secretary, Mombasa</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className='border-t-1 border-dashed w-full'></div>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your community savings?
          </h2>
          <p className="text-xl mb-8">
            Join hundreds of communities already using Jamii Save to build financial resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
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

      <div className='border-t-1 border-dashed w-full'></div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="default" variant="white" />
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
            <p>&copy; 2024 Jamii Save. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
