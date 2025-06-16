import { Billet } from "./billet";
import { HouseCard } from "./house";
import { Pawn } from "./pawn";

export class Player {
  name: string = '';
  playerColor: string = '';
  pawnShape: Pawn = Pawn.trident;
  properties: number[]=[];
  currentCase: number = 0;
  jail = false;
  jailDice = 0;
  //houses: HouseCard[] = [];
  billets: Billet[] = [];
}

