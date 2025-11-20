import { db } from '@/drizzle/db';
import { plan } from '@/drizzle/schema';

// seed.ts

async function seedPlans() {
	await db.insert(plan).values([
		{
			name: 'Free',
			description: 'Perfect for getting started',
			price: '0',
			max_communities: 1,
			base_members_per_community: 10,
			max_members_per_community: 10,
			features: [
				{ feature: 'Basic support', included: true },
				{ feature: 'Community chat', included: true },
				{ feature: 'Member management (up to 10)', included: true },
				{ feature: 'Custom branding', included: false },
				{ feature: 'Analytics', included: false },
				{ feature: 'API access', included: false },
			],
		},
		{
			name: 'Pro',
			description: 'For growing organizations',
			price: '29.99',
			max_communities: 5,
			base_members_per_community: 50,
			max_members_per_community: 50,
			features: [
				{ feature: 'Priority support', included: true },
				{ feature: 'Advanced community chat', included: true },
				{ feature: 'Member management (up to 50)', included: true },
				{ feature: 'Custom branding', included: true },
				{ feature: 'Analytics', included: true },
				{ feature: 'Multiple communities (up to 5)', included: true },
				{ feature: 'API access', included: false },
				{ feature: 'Dedicated account manager', included: false },
			],
			stripe_price_id_monthly: 'price_xxx',
			stripe_price_id_yearly: 'price_yyy',
		},
		{
			name: 'Advanced',
			description: 'Unlimited scalability',
			price: '99.99',
			max_communities: 999999,
			base_members_per_community: 100,
			max_members_per_community: 999999,
			additional_member_price: '5.00',
			additional_member_batch_size: 10,
			features: [
				{ feature: '24/7 Premium support', included: true },
				{ feature: 'Enterprise chat with video calls', included: true },
				{ feature: 'Unlimited members (pay per batch)', included: true },
				{ feature: 'White-label branding', included: true },
				{ feature: 'Advanced analytics & reports', included: true },
				{ feature: 'Unlimited communities', included: true },
				{ feature: 'Full API access & webhooks', included: true },
				{ feature: 'Dedicated account manager', included: true },
				{ feature: 'Custom integrations', included: true },
				{ feature: '99.9% SLA guarantee', included: true },
			],
			stripe_price_id_monthly: 'price_zzz',
			stripe_price_id_yearly: 'price_aaa',
		},
	]);
}

seedPlans()
	.then(() => {
		console.log('Seeding completed.');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Seeding failed:', error);
		process.exit(1);
	});
