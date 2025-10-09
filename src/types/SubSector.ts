import type { PrimarySector } from './PrimarySector';

export interface SubSector {
  id: string;
  name: string;
  primarySector: PrimarySector;
}
