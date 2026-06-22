export type FilingStatus = "single" | "married_joint" | "married_separate" | "head_of_household";

export type TaxYear = 2026;

export type TaxPaymentMethod = "outside_funds" | "withhold_from_ira" | "not_sure";

export type StateResidencyStatus = "not_provided" | "resident" | "part_year" | "nonresident";

export interface StateReadinessInputs {
  residencyStatus: StateResidencyStatus;
  stateAdjustedGrossIncome: number | null;
  stateIraBasis: number | null;
  reviewedStateTaxEstimate?: number | null;
  localTaxApplies: boolean | null;
  otherStateTaxCreditApplies: boolean | null;
  notes: string;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface FederalTaxDeltaInput {
  filingStatus: FilingStatus;
  currentTaxableIncome: number;
  additionalTaxableIncome: number;
  taxYear: TaxYear;
}

export interface RothConversionInput {
  conversionAmount: number;
  traditionalIraBalance: number;
  basis: number;
  filingStatus: FilingStatus;
  currentTaxableIncome: number;
  netInvestmentIncome?: number | null;
  annualSocialSecurityBenefits?: number | null;
  taxExemptInterest?: number | null;
  annualAdvancePremiumTaxCredit?: number | null;
  marketplaceCoverageMonths?: number | null;
  amtTentativeMinimumTax?: number | null;
  amtRegularTaxLiability?: number | null;
  selectedState?: string | null;
  stateReadinessInputs?: StateReadinessInputs;
  stateMarginalTaxRate: number;
  age: number;
  penaltyException: boolean;
  taxPaymentMethod: TaxPaymentMethod;
  withheldForTaxes: number;
  retirementAge: number;
  expectedAnnualReturn: number;
  retirementMarginalTaxRate: number;
  inflationRate: number;
  taxYear: TaxYear;
}

export interface RothConversionResult {
  taxableConversion: number;
  federalTax: number;
  stateTax: number;
  earlyDistributionPenalty: number;
  totalUpfrontCost: number;
  rothFutureValue: number;
  traditionalAfterTaxValue: number;
  afterTaxDifference: number;
  breakEvenYear: number | null;
  accuracyNotes: string[];
  projection: ProjectionPoint[];
  breakdown: CalculationBreakdown;
  bracketImpact: BracketImpact;
}

export interface ProjectionPoint {
  year: number;
  rothValue: number;
  traditionalAfterTaxValue: number;
}

export interface CalculationBreakdown {
  basisExclusionRatio: number;
  taxableConversionRatio: number;
  effectiveFederalTaxRate: number;
  effectiveStateTaxRate: number;
  totalCostRate: number;
  penaltyBasis: number;
  penaltyExplanation: string;
}

export interface BracketImpact {
  beforeRate: number;
  afterRate: number;
  beforeBracketTop: number | null;
  afterBracketTop: number | null;
  roomInCurrentBracketBeforeConversion: number | null;
  roomInCurrentBracketAfterConversion: number | null;
  incomeTaxedInHigherBrackets: number;
  crossesBracket: boolean;
}

export type CalculatorErrors = Partial<Record<keyof RothConversionInput, string>>;
