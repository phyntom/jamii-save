/**
 * Static mock data for UI development.
 * All IDs are fake strings typed loosely — these will be replaced
 * with real Convex queries once the backend is wired up.
 */

// ── Helpers ──────────────────────────────────────────────────────────

const day = (daysAgo: number) => Date.now() - daysAgo * 86_400_000;

// ── Users ────────────────────────────────────────────────────────────

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

export const mockCurrentUser: MockUser = {
  _id: "user_1",
  name: "Amina Wanjiku",
  email: "amina@example.com",
  phone: "+254 712 345 678",
  image: undefined,
};

export const mockUsers: MockUser[] = [
  mockCurrentUser,
  {
    _id: "user_2",
    name: "Brian Otieno",
    email: "brian@example.com",
    phone: "+254 723 456 789",
  },
  {
    _id: "user_3",
    name: "Catherine Muthoni",
    email: "catherine@example.com",
    phone: "+254 734 567 890",
  },
  {
    _id: "user_4",
    name: "David Kamau",
    email: "david@example.com",
    phone: "+254 745 678 901",
  },
  {
    _id: "user_5",
    name: "Esther Njeri",
    email: "esther@example.com",
    phone: "+254 756 789 012",
  },
];

// ── Communities ───────────────────────────────────────────────────────

export interface MockCommunity {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  createdBy: string;
  isActive: boolean;
  country?: string;
  logo?: string;
  memberCount: number;
  targetAmount: number;
  contributionFrequency: string;
  currency: string;
}

export const mockCommunities: MockCommunity[] = [
  {
    _id: "comm_1",
    name: "Nairobi Savers Circle",
    description:
      "A community of professionals in Nairobi pooling resources for mutual benefit.",
    slug: "nairobi-savers",
    createdBy: "user_1",
    isActive: true,
    country: "Kenya",
    memberCount: 12,
    targetAmount: 50000,
    contributionFrequency: "Monthly",
    currency: "KES",
  },
  {
    _id: "comm_2",
    name: "Kigali Investment Club",
    description:
      "Young professionals in Kigali saving together for investment opportunities.",
    slug: "kigali-invest",
    createdBy: "user_2",
    isActive: true,
    country: "Rwanda",
    memberCount: 8,
    targetAmount: 200000,
    contributionFrequency: "Monthly",
    currency: "RWF",
  },
  {
    _id: "comm_3",
    name: "Kampala Women's Fund",
    description: "Women entrepreneurs building a savings and loan fund together.",
    slug: "kampala-women",
    createdBy: "user_3",
    isActive: true,
    country: "Uganda",
    memberCount: 15,
    targetAmount: 1000000,
    contributionFrequency: "Monthly",
    currency: "UGX",
  },
];

// ── Memberships ──────────────────────────────────────────────────────

export interface MockMembership {
  _id: string;
  communityId: string;
  userId: string;
  role: "owner" | "admin" | "treasurer" | "secretary" | "member";
  joinedAt: number;
}

export const mockMemberships: MockMembership[] = [
  {
    _id: "mem_1",
    communityId: "comm_1",
    userId: "user_1",
    role: "owner",
    joinedAt: day(90),
  },
  {
    _id: "mem_2",
    communityId: "comm_1",
    userId: "user_2",
    role: "admin",
    joinedAt: day(85),
  },
  {
    _id: "mem_3",
    communityId: "comm_1",
    userId: "user_3",
    role: "treasurer",
    joinedAt: day(80),
  },
  {
    _id: "mem_4",
    communityId: "comm_1",
    userId: "user_4",
    role: "member",
    joinedAt: day(60),
  },
  {
    _id: "mem_5",
    communityId: "comm_1",
    userId: "user_5",
    role: "member",
    joinedAt: day(45),
  },
  {
    _id: "mem_6",
    communityId: "comm_2",
    userId: "user_1",
    role: "member",
    joinedAt: day(30),
  },
  {
    _id: "mem_7",
    communityId: "comm_3",
    userId: "user_1",
    role: "admin",
    joinedAt: day(20),
  },
];

// ── Contributions ────────────────────────────────────────────────────

export type ContributionStatus = "approved" | "pending" | "rejected";

export interface MockContribution {
  _id: string;
  communityId: string;
  userId: string;
  userName: string;
  amount: number;
  reference: string;
  paymentMethod: string;
  status: ContributionStatus;
  createdAt: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: number;
}

export const mockContributions: MockContribution[] = [
  {
    _id: "contrib_1",
    communityId: "comm_1",
    userId: "user_1",
    userName: "Amina Wanjiku",
    amount: 5000,
    reference: "MPE-2025-001",
    paymentMethod: "M-Pesa",
    status: "approved",
    createdAt: day(2),
    approvedBy: "Brian Otieno",
    approvedAt: day(1),
  },
  {
    _id: "contrib_2",
    communityId: "comm_1",
    userId: "user_2",
    userName: "Brian Otieno",
    amount: 5000,
    reference: "MPE-2025-002",
    paymentMethod: "M-Pesa",
    status: "approved",
    createdAt: day(3),
    approvedBy: "Amina Wanjiku",
    approvedAt: day(2),
  },
  {
    _id: "contrib_3",
    communityId: "comm_1",
    userId: "user_3",
    userName: "Catherine Muthoni",
    amount: 5000,
    reference: "BNK-2025-003",
    paymentMethod: "Bank Transfer",
    status: "pending",
    createdAt: day(1),
    notes: "Transferred from KCB account",
  },
  {
    _id: "contrib_4",
    communityId: "comm_1",
    userId: "user_4",
    userName: "David Kamau",
    amount: 3000,
    reference: "MPE-2025-004",
    paymentMethod: "M-Pesa",
    status: "rejected",
    createdAt: day(5),
    notes: "Partial payment — will top up next week",
  },
  {
    _id: "contrib_5",
    communityId: "comm_1",
    userId: "user_5",
    userName: "Esther Njeri",
    amount: 5000,
    reference: "MPE-2025-005",
    paymentMethod: "M-Pesa",
    status: "approved",
    createdAt: day(4),
    approvedBy: "Brian Otieno",
    approvedAt: day(3),
  },
  {
    _id: "contrib_6",
    communityId: "comm_2",
    userId: "user_1",
    userName: "Amina Wanjiku",
    amount: 20000,
    reference: "BNK-2025-006",
    paymentMethod: "Bank Transfer",
    status: "approved",
    createdAt: day(10),
    approvedBy: "Brian Otieno",
    approvedAt: day(9),
  },
  {
    _id: "contrib_7",
    communityId: "comm_3",
    userId: "user_1",
    userName: "Amina Wanjiku",
    amount: 50000,
    reference: "BNK-2025-007",
    paymentMethod: "Bank Transfer",
    status: "pending",
    createdAt: day(1),
  },
];

// ── Loans ────────────────────────────────────────────────────────────

export type LoanStatus = "active" | "pending" | "repaid" | "rejected" | "defaulted";

export interface MockLoan {
  _id: string;
  communityId: string;
  userId: string;
  borrowerName: string;
  principal: number;
  interestRate: number;
  totalAmount: number;
  repaidAmount: number;
  purpose: string;
  status: LoanStatus;
  repaymentMonths: number;
  requestedAt: number;
  disbursedAt?: number;
}

export const mockLoans: MockLoan[] = [
  {
    _id: "loan_1",
    communityId: "comm_1",
    userId: "user_4",
    borrowerName: "David Kamau",
    principal: 20000,
    interestRate: 5,
    totalAmount: 21000,
    repaidAmount: 14000,
    purpose: "School fees for January term",
    status: "active",
    repaymentMonths: 6,
    requestedAt: day(60),
    disbursedAt: day(58),
  },
  {
    _id: "loan_2",
    communityId: "comm_1",
    userId: "user_5",
    borrowerName: "Esther Njeri",
    principal: 15000,
    interestRate: 5,
    totalAmount: 15750,
    repaidAmount: 15750,
    purpose: "Emergency medical bills",
    status: "repaid",
    repaymentMonths: 3,
    requestedAt: day(120),
    disbursedAt: day(118),
  },
  {
    _id: "loan_3",
    communityId: "comm_1",
    userId: "user_3",
    borrowerName: "Catherine Muthoni",
    principal: 30000,
    interestRate: 5,
    totalAmount: 31500,
    repaidAmount: 0,
    purpose: "Business stock purchase",
    status: "pending",
    repaymentMonths: 6,
    requestedAt: day(2),
  },
];

// ── Loan Repayments ──────────────────────────────────────────────────

export interface MockLoanRepayment {
  _id: string;
  loanId: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  status: "completed" | "pending";
  paidAt: number;
}

export const mockLoanRepayments: MockLoanRepayment[] = [
  {
    _id: "repay_1",
    loanId: "loan_1",
    amount: 3500,
    paymentMethod: "M-Pesa",
    reference: "RPY-001",
    status: "completed",
    paidAt: day(45),
  },
  {
    _id: "repay_2",
    loanId: "loan_1",
    amount: 3500,
    paymentMethod: "M-Pesa",
    reference: "RPY-002",
    status: "completed",
    paidAt: day(30),
  },
  {
    _id: "repay_3",
    loanId: "loan_1",
    amount: 3500,
    paymentMethod: "Bank Transfer",
    reference: "RPY-003",
    status: "completed",
    paidAt: day(15),
  },
  {
    _id: "repay_4",
    loanId: "loan_1",
    amount: 3500,
    paymentMethod: "M-Pesa",
    reference: "RPY-004",
    status: "completed",
    paidAt: day(1),
  },
];

// ── Invitations ──────────────────────────────────────────────────────

export interface MockInvite {
  _id: string;
  communityId: string;
  communityName: string;
  email: string;
  invitedByName: string;
  token: string;
  status: "pending" | "confirmed" | "declined";
  expiresAt: number;
}

export const mockInvites: MockInvite[] = [
  {
    _id: "inv_1",
    communityId: "comm_1",
    communityName: "Nairobi Savers Circle",
    email: "jane@example.com",
    invitedByName: "Amina Wanjiku",
    token: "abc123",
    status: "pending",
    expiresAt: day(-5), // 5 days from now
  },
  {
    _id: "inv_2",
    communityId: "comm_1",
    communityName: "Nairobi Savers Circle",
    email: "john@example.com",
    invitedByName: "Amina Wanjiku",
    token: "def456",
    status: "confirmed",
    expiresAt: day(-2),
  },
];

// ── Subscriptions / Plans ────────────────────────────────────────────

export interface MockSubscription {
  plan: string;
  billingCycle: string;
  status: "active" | "expired" | "cancelled";
  renewsAt: number;
  price: number;
  currency: string;
}

export const mockSubscription: MockSubscription = {
  plan: "Basic",
  billingCycle: "Monthly",
  status: "active",
  renewsAt: day(-30), // 30 days from now
  price: 29,
  currency: "USD",
};

// ── Admin Stats ──────────────────────────────────────────────────────

export const mockAdminStats = {
  totalUsers: 128,
  totalCommunities: 14,
  totalContributions: 1_247,
  totalLoans: 89,
  activeLoans: 23,
  pendingApprovals: 7,
};

// ── Audit Logs ───────────────────────────────────────────────────────

export interface MockAuditLog {
  _id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: number;
}

export const mockAuditLogs: MockAuditLog[] = [
  {
    _id: "log_1",
    action: "Created community",
    performedBy: "Amina Wanjiku",
    target: "Nairobi Savers Circle",
    timestamp: day(90),
  },
  {
    _id: "log_2",
    action: "Invited member",
    performedBy: "Amina Wanjiku",
    target: "brian@example.com",
    timestamp: day(85),
  },
  {
    _id: "log_3",
    action: "Approved contribution",
    performedBy: "Brian Otieno",
    target: "KES 5,000 from Esther Njeri",
    timestamp: day(3),
  },
  {
    _id: "log_4",
    action: "Disbursed loan",
    performedBy: "Amina Wanjiku",
    target: "KES 20,000 to David Kamau",
    timestamp: day(58),
  },
  {
    _id: "log_5",
    action: "Rejected contribution",
    performedBy: "Brian Otieno",
    target: "KES 3,000 from David Kamau",
    timestamp: day(4),
  },
  {
    _id: "log_6",
    action: "Updated community settings",
    performedBy: "Amina Wanjiku",
    target: "Nairobi Savers Circle",
    timestamp: day(10),
  },
  {
    _id: "log_7",
    action: "Loan repayment received",
    performedBy: "David Kamau",
    target: "KES 3,500 for Loan #loan_1",
    timestamp: day(1),
  },
];

// ── Dashboard Computed Stats ─────────────────────────────────────────

export function getDashboardStats() {
  const userCommunities = mockCommunities.filter((c) =>
    mockMemberships.some(
      (m) => m.communityId === c._id && m.userId === mockCurrentUser._id,
    ),
  );

  const userContributions = mockContributions.filter(
    (c) => c.userId === mockCurrentUser._id,
  );

  const approvedContributions = userContributions.filter(
    (c) => c.status === "approved",
  );

  const totalContributed = approvedContributions.reduce(
    (sum, c) => sum + c.amount,
    0,
  );

  const activeLoans = mockLoans.filter((l) => l.status === "active");

  return {
    totalCommunities: userCommunities.length,
    totalContributions: totalContributed,
    activeLoans: activeLoans.length,
    savingsRate: 85, // percentage, faked
  };
}
