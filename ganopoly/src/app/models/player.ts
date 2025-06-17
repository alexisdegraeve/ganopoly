import { Billet } from "./billet";
import { ccCard } from "./ccCard";
import { HouseCard } from "./house";
import { Pawn } from "./pawn";

export class Player {
  name: string = '';
  playerColor: string = '';
  pawnShape: Pawn = Pawn.trident;
  properties: {index: number; house: number}[]=[];
  currentCase: number = 0;
  jail = false;
  jailDice = 0;
  communityCards: ccCard[] = [];
  chanceCards: ccCard[] = [];
  //houses: HouseCard[] = [];
  billets: Billet[] = [];
}

