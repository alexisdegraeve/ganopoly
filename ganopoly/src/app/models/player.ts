import { Billet } from "./billet";
import { HouseCard } from "./house";
import { Pawn } from "./pawn";

export class Player {
  name: string = '';
  pawnShape: Pawn = Pawn.cat;
  dices: number = 0;
  properties: number[]=[];
  //houses: HouseCard[] = [];
  billets: Billet[] = [];
}

