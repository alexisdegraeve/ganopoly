import { Billet } from "./billet";
import { HouseCard } from "./house";
import { Pawn } from "./pawn";

export class Player {
  name: string = '';
  pawnShape: Pawn = Pawn.trident;
  dices: number = 0;
  properties: number[]=[];
  currentCase: number = 0;
  //houses: HouseCard[] = [];
  billets: Billet[] = [];
}

