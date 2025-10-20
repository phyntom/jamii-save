// Static data for the landing page - can be adapted to database later

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  popular?: boolean;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Pricing plans data
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for small communities',
    price: 0,
    currency: '$',
    period: 'per month',
    features: [
      '1 community maximum',
      '10 members per community',
      'Basic contribution tracking',
      'Email notifications',
      'Basic reporting',
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline',
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for growing communities',
    price: 29,
    currency: '$',
    period: 'per month',
    popular: true,
    features: [
      '5 communities maximum',
      '50 members per community',
      'Loan management features',
      'SMS notifications',
      'Advanced reporting',
      'Data export capabilities',
    ],
    buttonText: 'Start Basic Plan',
    buttonVariant: 'default',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For large organizations',
    price: 99,
    currency: '$',
    period: 'per month',
    features: [
      'Unlimited communities',
      'Unlimited members',
      'Advanced analytics',
      'All notification channels',
      'Custom branding',
      'API access',
      'Priority support',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
  },
];

// Testimonials data
export const testimonials: Testimonial[] = [
  {
    id: 'alice-mwangi',
    name: 'Alice Mwangi',
    role: 'Community Leader',
    location: 'Nairobi',
    content:
      'Jamii Save has revolutionized how our community manages savings. The transparency and ease of use is incredible.',
    rating: 5,
    avatar: 'A',
  },
  {
    id: 'john-ochieng',
    name: 'John Ochieng',
    role: 'Treasurer',
    location: 'Kisumu',
    content:
      'Finally, a platform that understands African savings culture. Our group has grown from 10 to 50 members since using Jamii Save.',
    rating: 5,
    avatar: 'J',
  },
  {
    id: 'mary-wanjiku',
    name: 'Mary Wanjiku',
    role: 'Secretary',
    location: 'Mombasa',
    content:
      'The loan management features are game-changing. We can now track everything digitally with complete transparency.',
    rating: 5,
    avatar: 'M',
  },
];

// Features data
export const features: Feature[] = [
  {
    id: 'community-management',
    title: 'Community Management',
    description:
      'Create and manage savings groups with flexible member roles and invitation systems.',
    icon: 'Users',
    color: 'blue',
  },
  {
    id: 'contribution-tracking',
    title: 'Contribution Tracking',
    description: 'Record and approve contributions with complete audit trails and status tracking.',
    icon: 'BarChart3',
    color: 'green',
  },
  {
    id: 'security-compliance',
    title: 'Secure & Compliant',
    description:
      'Bank-level security with Better-Auth and complete data protection for your community.',
    icon: 'Shield',
    color: 'purple',
  },
  {
    id: 'mobile-ready',
    title: 'Mobile Ready',
    description: 'Access your community savings from anywhere with our responsive web platform.',
    icon: 'Smartphone',
    color: 'orange',
  },
  {
    id: 'global-access',
    title: 'Global Access',
    description: 'Support for multiple payment methods including mobile money and bank transfers.',
    icon: 'Globe',
    color: 'indigo',
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics',
    description:
      'Detailed reports and insights to help your community make informed financial decisions.',
    icon: 'BarChart3',
    color: 'red',
  },
];

// Hero section data
export const heroData = {
  badge: '🚀 Now Available',
  title: 'Digital Group Savings',
  titleHighlight: 'Made Simple',
  description:
    'Transform your community savings groups with our modern platform. Manage contributions, track loans, and build financial resilience together.',
  primaryButton: {
    text: 'Start Your Community',
    href: '/sign-up',
  },
  secondaryButton: {
    text: 'Watch Demo',
    href: '#',
  },
  socialProof: 'Trusted by 500+ communities worldwide',
};

// CTA section data
export const ctaData = {
  title: 'Ready to transform your community savings?',
  description:
    'Join hundreds of communities already using Jamii Save to build financial resilience.',
  primaryButton: {
    text: 'Start Your Community Today',
    href: '/sign-up',
  },
  secondaryButton: {
    text: 'Schedule a Demo',
    href: '#',
  },
};

// Footer data
export const footerData = {
  company: {
    name: 'Jamii Save',
    description: 'Building financial resilience through community savings.',
    logo: 'J',
  },
  links: {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '/api' },
      { name: 'Integrations', href: '/integrations' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Contact', href: '/contact' },
      { name: 'Status', href: '/status' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Privacy', href: '/privacy' },
    ],
  },
  copyright: '© 2024 Jamii Save. All rights reserved.',
};
