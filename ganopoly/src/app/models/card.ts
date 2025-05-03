export interface Card {
  street: string;
  name: string;
  ville: string;
  color: string;
  prix: number;
  case: number;
  orientation: string;
  coin: boolean;
  type: CardType;
  info: string;
 }

 export enum CardType {
  immobilier = 'immobilier',
  chance = 'chance',
  prison = 'prison',
  toprison = 'toprison',
  caisse = 'caisse',
  eaux = 'eaux',
  gare = 'gare',
  start = 'start',
  elec = 'elec',
  parking = 'parking',
  taxe = 'taxe',
  impots = 'impots'
 }
