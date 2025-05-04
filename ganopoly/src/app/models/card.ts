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
  loyer: number;
  groupe: number;
  house1: number;
  house2: number;
  house3: number;
  house4: number;
  hotel1: number;
  prixHouse: number;
  prixHotel: number;
  hypotheque: number;
  leverhypotheque: number;
 }

 export type Case = {
  name: string;
  ville: string;
  color: string;
  price: number;
  orientation: 'horizontal' | 'vertical';
  cardtype: CardType;
  isCorner: boolean;
  info: string;
};

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
