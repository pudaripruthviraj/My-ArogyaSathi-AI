import { InsurancePolicy } from './types';

// Simulating data fetched from an aggregator API
export const MOCK_POLICIES: InsurancePolicy[] = [
  {
    id: 'pol_001',
    insurerName: 'HDFC Ergo',
    policyName: 'Optima Secure',
    sumInsured: '10 Lakhs',
    premium: 1250,
    copay: 'No Co-pay',
    roomRentLimit: 'No Limit (Single Private AC)',
    waitingPeriod: '30 Days Initial',
    pedWaitingPeriod: '3 Years',
    networkHospitals: 13000,
    claimSettlementRatio: 98.2,
    features: ['4X Cover Benefit', 'Restoration Benefit', 'Annual Health Checkup']
  },
  {
    id: 'pol_002',
    insurerName: 'Star Health',
    policyName: 'Assure Plan',
    sumInsured: '10 Lakhs',
    premium: 1050,
    copay: '10% if age > 60',
    roomRentLimit: 'Single Private Room',
    waitingPeriod: '30 Days Initial',
    pedWaitingPeriod: '2 Years (Buyback available)',
    networkHospitals: 14000,
    claimSettlementRatio: 99.1,
    features: ['Auto Restoration', 'Ayush Treatment', 'Wellness Program']
  },
  {
    id: 'pol_003',
    insurerName: 'Niva Bupa',
    policyName: 'ReAssure 2.0',
    sumInsured: '15 Lakhs',
    premium: 1380,
    copay: 'No Co-pay',
    roomRentLimit: 'Any Room',
    waitingPeriod: '30 Days Initial',
    pedWaitingPeriod: '3 Years',
    networkHospitals: 10000,
    claimSettlementRatio: 96.5,
    features: ['ReAssure Forever', 'Lock the Clock (Age)', 'Booster Benefit']
  },
  {
    id: 'pol_004',
    insurerName: 'Care Insurance',
    policyName: 'Supreme',
    sumInsured: '7 Lakhs',
    premium: 850,
    copay: '20% Zone 2',
    roomRentLimit: '1% of SI',
    waitingPeriod: '30 Days Initial',
    pedWaitingPeriod: '4 Years',
    networkHospitals: 9500,
    claimSettlementRatio: 95.8,
    features: ['Unlimited Recharge', 'OPD Cover', 'No Claim Bonus Super']
  },
  {
    id: 'pol_005',
    insurerName: 'Acko',
    policyName: 'Platinum Health',
    sumInsured: '1 Crore',
    premium: 1600,
    copay: 'No Co-pay',
    roomRentLimit: 'No Limit',
    waitingPeriod: '0 Days',
    pedWaitingPeriod: '0 Days (Disclosed PED covered)',
    networkHospitals: 7000,
    claimSettlementRatio: 94.5,
    features: ['Zero Waiting Period', 'Full Cashless', 'Inflation Protect']
  }
];

export const INITIAL_QUESTIONS = [
  "Hello! I'm BimaSathi. I can help you find the perfect health insurance.",
  "To start, who are you looking to insure? (e.g., Yourself, Family, Parents)"
];