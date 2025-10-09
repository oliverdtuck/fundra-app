import type { Country } from './Country';
import type { FundingRound } from './FundingRound';
import type { SubSector } from './SubSector';

export interface Company {
  country: Country;
  fundingRound: FundingRound | null;
  id: string;
  name: string;
  productsAndServices: null | string;
  subSector: null | SubSector;
  targetCustomers: null | string;
  website: null | string;
}
