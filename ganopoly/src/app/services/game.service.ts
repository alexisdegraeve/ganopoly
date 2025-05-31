import { HttpClient } from '@angular/common/http';
import { CSP_NONCE, Injectable } from '@angular/core';
import { ccCard } from '../models/ccCard';
import { BehaviorSubject, combineLatest, firstValueFrom, forkJoin, map, Observable, Subject } from 'rxjs';
import { Billet } from '../models/billet';
import { Player } from '../models/player';
import { Card } from '../models/card';
import { Pawn } from '../models/pawn';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _dice1: number = 0;
  public get dice1(): number {
    return this._dice1;
  }
  public set dice1(value: number) {
    this._dice1 = value;
  }
  private _dice2: number = 0;
  public get dice2(): number {
    return this._dice2;
  }
  public set dice2(value: number) {
    this._dice2 = value;
  }
  private chanceCards: ccCard[] = [];
  private communauteCards: ccCard[] = [];
  private banque: Billet[] = [
    { euro: 1, quantity: 30, color: 'white' },
    { euro: 5, quantity: 30, color: 'pink' },
    { euro: 10, quantity: 30, color: 'cyan' },
    { euro: 20, quantity: 30, color: 'green' },
    { euro: 50, quantity: 30, color: 'purple' },
    { euro: 100, quantity: 30, color: 'salmon' },
    { euro: 500, quantity: 30, color: 'orange' },
  ];

  private usedFirstnames: Set<string>;
  private playerHuman$: BehaviorSubject<Player>;
  private playerComputer1$: BehaviorSubject<Player>;
  private playerComputer2$: BehaviorSubject<Player>;
  private playerComputer3$: BehaviorSubject<Player>;
  private playerToPlay$: BehaviorSubject<Player>;
  private isHumanTurn$ = new BehaviorSubject<boolean>(true);
  private requestDiceRoll$ = new BehaviorSubject<boolean>(false);
  public diceRollCompleted$ = new Subject<void>();



  constructor(private httpClient: HttpClient) {
    this.usedFirstnames = new Set();
    this.playerHuman$ = this.createNewPlayer(Pawn.cat);
    this.playerComputer1$ = this.createNewPlayer(Pawn.dog);
    this.playerComputer2$ = this.createNewPlayer(Pawn.hat);
    this.playerComputer3$ = this.createNewPlayer(Pawn.lotus);
    this.playerToPlay$ = new BehaviorSubject<Player>({ ...this.playerHuman$.value });
  }

  async nextPlayerToPlay() {
    console.log('Tour du joueur humain terminé.');
    this.isHumanTurn$.next(false);

    // Les 3 joueurs ordinateurs vont jouer l’un après l’autre
    const computerPlayers = [
      this.playerComputer1$,
      this.playerComputer2$,
      this.playerComputer3$
    ];

    for (const player$ of computerPlayers) {
      this.playerToPlay$.next({ ...player$.value }); // Affiche le joueur courant
      console.log(`Ordinateur ${player$.value.name} commence son tour...`);

      await this.computerPlay(player$); // attendre 10s

      console.log(`Ordinateur ${player$.value.name} a terminé son tour.`);
      // Tu peux ici appeler ta vraie fonction de tour (ex: move, acheter, etc.)
    }

    // Retour au joueur humain
    this.playerToPlay$.next({ ...this.playerHuman$.value });
    console.log('Retour au joueur humain.');
    this.isHumanTurn$.next(true);
  }

  async computerPlay(player: BehaviorSubject<Player>) {
    console.log('Ordinateur va lancer les dés...');
    this.requestDiceRoll$.next(true);
    await firstValueFrom(this.diceRollCompleted$);
    const current = structuredClone(player.value);
    const nextCase = (current.currentCase + this.dice1 + this.dice2);
    current.currentCase =  nextCase < 40 ? nextCase : nextCase % 40;
    player.next(current);

    console.log("⏳ Étape 1 : Vérifie si la case appartient à un joueur...");
    await this.sleep(500);

    console.log("⏳ Étape 2 : Calcule s’il doit payer ou non...");
    await this.sleep(500);

    console.log("⏳ Étape 3 : Décide s’il veut acheter la propriété...");
    await this.sleep(500);

    console.log("⏳ Étape 4 : Fin du tour de l’ordinateur.");
    await this.sleep(500);
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRandomFirstname(): string {
    const firstnames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hana', 'Isaac', 'Julia'];
    const available = firstnames.filter(name => !this.usedFirstnames.has(name));
    if (available.length === 0) {
      this.usedFirstnames.clear();
      available.push(...firstnames);
    }
    const index = Math.floor(Math.random() * available.length);
    const selected = available[index];
    this.usedFirstnames.add(selected);
    return selected;
  }

  getRandomPawn(pawnPlayer: Pawn) {
    const pawns = [Pawn.lotus, Pawn.cat, Pawn.dog, Pawn.hat];
    console.log('before Pawns ', pawns);
    const pawnsShuffle = this.shuffleArrayGeneric(pawns);
    console.log('after Pawns ', pawnsShuffle);
    const filterPawnsShuffle = pawnsShuffle.filter(pawn => pawn !== pawnPlayer);
    console.log('after filter Pawns ', filterPawnsShuffle);
    this.updatePawnPlayer(this.playerComputer1$, filterPawnsShuffle[0])
    this.updatePawnPlayer(this.playerComputer2$, filterPawnsShuffle[1])
    this.updatePawnPlayer(this.playerComputer3$, filterPawnsShuffle[2])

  }
  updatePawnPlayer(player: BehaviorSubject<Player>, newPawn: Pawn) {
    const currentPlayer = structuredClone(player.value);
    currentPlayer.pawnShape = newPawn;
    player.next(currentPlayer);
  }

  updateCurrentCasePlayer(player: BehaviorSubject<Player>) {
    const currentPlayer = structuredClone(player.value);
    const nextCase = (currentPlayer.currentCase + this.dice1 + this.dice2);
    currentPlayer.currentCase =  nextCase < 40 ? nextCase : nextCase % 40;
    player.next(currentPlayer);
  }

  updatePropertiesPlayer(player: BehaviorSubject<Player>, propertyCase: number) {
    const currentPlayer = structuredClone(player.value);
    currentPlayer.properties.push(propertyCase);
    player.next(currentPlayer);
  }

  shuffleArrayGeneric<T>(array: T[]): T[] {
    const arr = [...array]; // pour ne pas modifier l'original
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  createNewPlayer(pawnShape: Pawn): BehaviorSubject<Player> {
    return new BehaviorSubject<Player>({
      name: this.getRandomFirstname(),
      pawnShape,
      dices: 0,
      currentCase: 0,
      properties: [],
      billets: [
        { euro: 1, quantity: 0, color: 'white' },
        { euro: 5, quantity: 0, color: 'pink' },
        { euro: 10, quantity: 0, color: 'cyan' },
        { euro: 20, quantity: 0, color: 'green' },
        { euro: 50, quantity: 0, color: 'purple' },
        { euro: 100, quantity: 0, color: 'salmon' },
        { euro: 500, quantity: 0, color: 'orange' },
      ]
    });
  }

  startGame(playerChange: { name: string, pawn: Pawn }): Observable<void> {
    console.log('start game ');
    console.log(name);
    this.usedFirstnames.clear();
    this.getRandomPawn(playerChange.pawn);
    const current = structuredClone(this.playerHuman$.value);
    current.name = playerChange.name;
    current.pawnShape = playerChange.pawn;
    this.playerHuman$.next(current);
    this.playerToPlay$.next(current);



    return new Observable<void>((observer) => {
      forkJoin({
        chanceCards: this.httpClient.get<ccCard[]>('/cards/chance.json'),
        communauteCards: this.httpClient.get<ccCard[]>(
          '/cards/communaute.json'
        ),
      }).subscribe({
        next: ({ chanceCards, communauteCards }) => {
          this.chanceCards = this.shuffleArray(chanceCards);
          this.communauteCards = this.shuffleArray(communauteCards);
          console.log('Billets');
          console.log('banque : ', JSON.parse(JSON.stringify(this.banque)));
          //console.log('player Human :', JSON.parse(JSON.stringify(this.playerHuman)));
          //console.log('playerComputer 1 :',JSON.parse(JSON.stringify(this.playerComputer1)));
          //console.log('playerComputer 2 :',JSON.parse(JSON.stringify(this.playerComputer2)));
          //console.log('playerComputer 3 :',JSON.parse(JSON.stringify(this.playerComputer3)));
          //this.testAddProperties();
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('Erreur lors du démarrage du jeu', err);
          observer.error(err);
        },
      });
    });
  }

  throwDice() {
    const sides = 6;
    this.dice1 = Math.floor(Math.random() * sides) + 1;
    this.dice2 = Math.floor(Math.random() * sides) + 1;
    console.log(this.dice1, this.dice2, this.chanceCards, this.communauteCards);
  }

  shuffleArray(array: ccCard[]): ccCard[] {
    for (let index = 0; index < array.length / 2; index++) {
      let swapIndex = Math.floor(Math.random() * array.length);
      let temp = array[index];
      array[index] = array[swapIndex];
      array[swapIndex] = temp;
    }
    return array;
  }
  pickChanceCard(): ccCard | undefined {
    console.log(this.banque);
    //console.log(this.playerHuman);
    let lastCard = this.chanceCards.pop();
    if (lastCard) {
      this.chanceCards = [lastCard, ...this.chanceCards];
    }
    return lastCard;
  }

  takeMoneyFromBank(dstEuro: number, dstQuantity: number, dstPlayer: BehaviorSubject<Player>) {
    const currentPlayer = dstPlayer.value;
    const updatedPlayer = { ...currentPlayer };

    this.banque
      .filter((billet) => billet.euro === dstEuro)
      .forEach((billet) => {
        if (billet.quantity > 0) {
          billet.quantity -= dstQuantity;
          updatedPlayer.billets
            .filter((billet) => billet.euro === dstEuro)
            .forEach((billet) => {
              billet.quantity += dstQuantity;
            });
        }
      });

    dstPlayer.next(updatedPlayer);
  }

  giveBilletsPlayer(player: BehaviorSubject<Player>) {
    this.takeMoneyFromBank(1, 5, player);
    this.takeMoneyFromBank(5, 1, player);
    this.takeMoneyFromBank(10, 2, player);
    this.takeMoneyFromBank(20, 1, player);
    this.takeMoneyFromBank(50, 1, player);
    this.takeMoneyFromBank(100, 4, player);
    this.takeMoneyFromBank(500, 2, player);
  }

  distributeBillets() {
    this.giveBilletsPlayer(this.playerHuman$);
    this.giveBilletsPlayer(this.playerComputer1$);
    this.giveBilletsPlayer(this.playerComputer2$);
    this.giveBilletsPlayer(this.playerComputer3$);
    console.log('disribute Billets');
    console.log('banque : ', JSON.parse(JSON.stringify(this.banque)));
    // console.log('player Human :', JSON.parse(JSON.stringify(this.playerHuman)));
    // console.log('playerComputer 1 :',JSON.parse(JSON.stringify(this.playerComputer1)));
    // console.log('playerComputer 2 :',JSON.parse(JSON.stringify(this.playerComputer2)));
    // console.log('playerComputer 3 :',JSON.parse(JSON.stringify(this.playerComputer3)));
    console.log('total ');
    // console.log('Human :', this.calcTotal(this.playerHuman));
    // console.log('playerComputer 1 :', this.calcTotal(this.playerComputer1));
    // console.log('playerComputer 2 :', this.calcTotal(this.playerComputer2));
    // console.log('playerComputer 3 :', this.calcTotal(this.playerComputer3));
  }

  calcTotal(player: Player): number {
    let total = 0;
    player.billets.forEach(billet => {
      total += (billet.euro * billet.quantity);
    })
    return total;
  }
  getCards(): Observable<Card[]> {
    console.log('get cards');
    return this.httpClient.get<Card[]>('/cards/ganopolycards.json');
  }

  get PlayerHuman(): BehaviorSubject<Player> {
    return this.playerHuman$;
  }

  get PlayerComputer1(): BehaviorSubject<Player> {
    return this.playerComputer1$;
  }

  get PlayerComputer2(): BehaviorSubject<Player> {
    return this.playerComputer2$;
  }

  get PlayerComputer3(): BehaviorSubject<Player> {
    return this.playerComputer3$;
  }

  get isHumanTurn(): BehaviorSubject<boolean> {
    return this.isHumanTurn$;
  }

  get Players(): Observable<{ human: Player, computer1: Player, computer2: Player, computer3: Player }> {
    return combineLatest([
      this.PlayerHuman,
      this.PlayerComputer1,
      this.PlayerComputer2,
      this.PlayerComputer3
    ]).pipe(
      map(([human, c1, c2, c3]) => ({
        human,
        computer1: c1,
        computer2: c2,
        computer3: c3
      }))
    );
  }

  get RequestDiceRoll$() {
    return this.requestDiceRoll$.asObservable();
  }
  resetDiceRequest() {
    this.requestDiceRoll$.next(false);
  }



  get PlayerToPlay(): BehaviorSubject<Player> {
    return this.playerToPlay$;
  }

  async addProperty(ganocase: number, player: BehaviorSubject<Player>) {
    // Pay Before
    console.log('BEFORE TO CHECK !! : ', this.banque);
    console.log('BEFORE TO CHECK !! : ',  player.value);
    const result = await this.payToBank(ganocase, player);

    if (result === false) {
      console.warn("Le joueur n'a pas assez d'argent pour acheter la propriété");
      return;
    }

    console.log('AFTER TO CHECK !! : ', this.banque);
    console.log('AFTER TO CHECK !! : ',  player.value);

    const current = structuredClone(player.value);
    current.properties.push(ganocase);
    // currentProperties.push(ganocase);
    // const updatedPlayer = { ...currentPlayer, properties: currentProperties };
    player.next(current);
  }



  async payToBank(ganocase: number, player: BehaviorSubject<Player>): Promise<false | Billet[]> {
  console.log('Billets du joueur avant paiement :', player.value.billets);

  const checkCards$ = this.getCards().pipe(
    map(cards => cards.filter(card => card.case === ganocase))
  );

  const checkCards = await firstValueFrom(checkCards$);

  if (checkCards.length === 0) {
    console.warn('Aucune carte trouvée dans les propriétés du joueur');
    return false;
  }

  const lastCard = checkCards[checkCards.length - 1];
  const montant = lastCard.prix;
  console.log('Dernière carte :', lastCard);

  const billetsPlayer: Billet[] = structuredClone(player.value.billets);
  const billetsBanque: Billet[] = structuredClone(this.banque);
  let reste = montant;

  // Trier les billets du joueur du plus grand au plus petit
  const sortedBillets = [...billetsPlayer].sort((a, b) => b.euro - a.euro);

  const paiement: Billet[] = [];

  for (const billet of sortedBillets) {
    if (reste <= 0) break;

    const maxUtilisables = Math.min(Math.floor(reste / billet.euro), billet.quantity);
    if (maxUtilisables > 0) {
      paiement.push({
        euro: billet.euro,
        quantity: maxUtilisables,
        color: billet.color
      });
      reste -= maxUtilisables * billet.euro;
    }
  }

  if (reste > 0) {
    console.warn('Le joueur ne peut pas payer le montant demandé');
    return false; // Il ne peut pas payer
  }

  // Mise à jour des billets joueur et banque
  const updatedBilletsPlayer: Billet[] = billetsPlayer.map(bp => {
    const billetPaiement = paiement.find(p => p.euro === bp.euro);
    if (billetPaiement) {
      return {
        ...bp,
        quantity: bp.quantity - billetPaiement.quantity
      };
    }
    return bp;
  });

  const updatedBanque: Billet[] = billetsBanque.map(bb => {
    const billetPaiement = paiement.find(p => p.euro === bb.euro);
    if (billetPaiement) {
      return {
        ...bb,
        quantity: bb.quantity + billetPaiement.quantity
      };
    }
    return bb;
  });

  // Appliquer les changements
  this.banque = updatedBanque;
  player.next({ ...player.value, billets: updatedBilletsPlayer });

  console.log('Paiement effectué :', paiement);

  return updatedBilletsPlayer;
}


  // async payToBank(player: BehaviorSubject<Player>): Promise<Billet[]> {
  //    console.log('billets player ', player.value.billets);
  //    //const total = player.value.properties;
  //    const billetsPlayer: Billet[] = player.value.billets;
  //    let newBilletsPlayer: Billet[] = structuredClone(player.value.billets);
  //    const checkCards$ = combineLatest([
  //       player,
  //       this.getCards() // La liste des cartes
  //     ]).pipe(
  //       map(([player, cards]) =>
  //         cards.filter(card => player.properties.includes(card.case))
  //       )
  //     );
  //     const checkCards = await firstValueFrom(checkCards$);
  //     console.log('checkCards :', checkCards);
  //     const lastCard = checkCards[checkCards.length - 1];
  //     console.log('lastCard :', lastCard);

  //     let reste = lastCard.prix;
  //     billetsPlayer.forEach((billet: Billet) => {
  //       if(billet.euro * billet.quantity > 0 ) {
  //         const newquantity = reste / (billet.euro * billet.quantity);
  //         reste = reste % (billet.euro * billet.quantity);
  //         newBilletsPlayer.filter(newbillet => newbillet.euro === billet.euro);
  //       }
  //     });

  //    return newBilletsPlayer;
  // }


  // testAddProperties() {
  //   this.addProperty([3,6], this.playerHuman$);
  //   this.addProperty([4,6,5], this.playerComputer1$);
  //   this.addProperty([9,10,11], this.playerComputer2$);
  //   this.addProperty([13,15,16], this.playerComputer3$);
  // }


}


