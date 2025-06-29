import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ccCard, CommunityType } from '../models/ccCard';
import { BehaviorSubject, combineLatest, firstValueFrom, forkJoin, map, Observable, Subject } from 'rxjs';
import { Billet } from '../models/billet';
import { Player } from '../models/player';
import { Card, CardType } from '../models/card';
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
  private allCards: Card[] = [];
  private static playerNextId = 1;



  constructor(private httpClient: HttpClient) {
    this.usedFirstnames = new Set();
    this.playerHuman$ = this.createNewPlayer(Pawn.trident, '#FF0000');
    this.playerComputer1$ = this.createNewPlayer(Pawn.honey, '#F4D35E');
    this.playerComputer2$ = this.createNewPlayer(Pawn.ax, '#4ABDAC');
    this.playerComputer3$ = this.createNewPlayer(Pawn.lotus, '#FF6F59');
//    console.log('player human ', this.playerHuman$.value);
//    console.log('player computer 1 ', this.playerComputer1$.value);
//    console.log('player computer 2 ', this.playerComputer2$.value);
//    console.log('player Computer 3 ', this.playerComputer3$.value);
    this.playerToPlay$ = new BehaviorSubject<Player>({ ...this.playerHuman$.value });
    this.getCards().subscribe(cards => {
      this.allCards = cards;
    });
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
    // const nextCase = 2; // communauté
    // const nextCase = 7; // chance
    // const nextCase = 30; // go to jail
    const nextCase = (current.currentCase + this.dice1 + this.dice2);
    current.currentCase = nextCase < 40 ? nextCase : nextCase % 40;
    player.next(current);

    this.analyseGame(player);

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
    const pawns = [Pawn.lotus, Pawn.trident, Pawn.honey, Pawn.ax];
    const pawnsShuffle = this.shuffleArrayGeneric(pawns);
    const filterPawnsShuffle = pawnsShuffle.filter(pawn => pawn !== pawnPlayer);
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
    currentPlayer.currentCase = nextCase < 40 ? nextCase : nextCase % 40;
    player.next(currentPlayer);
  }


  updatePropertiesPlayer(player: BehaviorSubject<Player>, propertyCase: number) {
    const currentPlayer = structuredClone(player.value);

    // Vérifie si le joueur possède déjà cette propriété
    const alreadyOwned = currentPlayer.properties.some(p => p.index === propertyCase);

    if (!alreadyOwned) {
      currentPlayer.properties.push({ index: propertyCase, house: 0 }); // Ajoute avec 0 maison
      player.next(currentPlayer);
    } else {
      console.warn(`Le joueur ${currentPlayer.name} possède déjà la propriété ${propertyCase}`);
    }
  }

  shuffleArrayGeneric<T>(array: T[]): T[] {
    const arr = [...array]; // pour ne pas modifier l'original
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  createNewPlayer(pawnShape: Pawn, playerColor: string): BehaviorSubject<Player> {
    return new BehaviorSubject<Player>({
      id: Player.nextId++,
      name: this.getRandomFirstname(),
      pawnShape,
      playerColor: playerColor,
      currentCase: 0,
      jail: false,
      jailDice: 0,
      communityCards: [],
      chanceCards: [],
      properties: [], //{index: 1, house: 3}, {index: 3,  house: 0}, {index: 6,  house: 5}],
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

  async payToPlayerFromPlayer(
    montant: number,
    source: BehaviorSubject<Player>,
    cible: BehaviorSubject<Player>
  ): Promise<boolean> {
    const billetsValeurs = [500, 100, 50, 20, 10, 5, 1];

    // Clone l'état actuel pour manipuler les données
    let reste = montant;

    // Vérifier que le joueur a assez d'argent au total
    const totalArgent = source.value.billets.reduce((sum, b) => sum + b.euro * b.quantity, 0);
    if (totalArgent < montant) {
      console.warn(`${source.value.name} n'a pas assez d'argent pour payer ${montant}`);
      return false;
    }

    // Payer avec les billets disponibles (du plus grand au plus petit)
    for (const valeur of billetsValeurs) {
      if (reste <= 0) break;

      // On récupère la quantité dispo **à jour** dans source.value
      const quantiteDispo = source.value.billets.find(b => b.euro === valeur)?.quantity || 0;
      if (quantiteDispo === 0) continue;

      const quantite = Math.min(Math.floor(reste / valeur), quantiteDispo);

      if (quantite > 0) {
        const success = await this.transferBilletsBetweenPlayers(valeur, quantite, source, cible);
        if (success) {
          reste -= quantite * valeur;
        } else {
          break;
        }
      }
    }

    // Si reste > 0, tenter de payer avec un billet plus grand (et rendre la monnaie)
    if (reste > 0) {
      // Chercher le plus petit billet qui couvre la dette restante
      const billetPlusGrand = billetsValeurs.find(v =>
        v >= reste &&
        (source.value.billets.find(b => b.euro === v)?.quantity || 0) > 0
      );

      if (billetPlusGrand) {
        const success = await this.transferBilletsBetweenPlayers(billetPlusGrand, 1, source, cible);
        if (success) {
          const rendu = billetPlusGrand - reste;
          if (rendu > 0) {
            await this.addBilletsToPlayer(rendu, source);
            console.log(`${source.value.name} a payé ${billetPlusGrand} pour une dette de ${montant}, rendu ${rendu}`);
          } else {
            console.log(`${source.value.name} a payé exactement ${montant}`);
          }
          return true;
        }
      }

      // Pas pu payer le reste
      console.warn(`${source.value.name} n'a pas pu compléter le paiement de ${montant}`);
      return false;
    }

    return true;
  }

  // Ajoute des billets au joueur (utilisé pour rendre la monnaie)
  async addBilletsToPlayer(montant: number, player: BehaviorSubject<Player>): Promise<boolean> {
    const billetsValeurs = [500, 100, 50, 20, 10, 5, 1];
    let reste = montant;
    const current = structuredClone(player.value);

    for (const valeur of billetsValeurs) {
      if (reste <= 0) break;
      const quantite = Math.floor(reste / valeur);
      if (quantite > 0) {
        const billet = current.billets.find(b => b.euro === valeur);
        if (billet) {
          billet.quantity += quantite;
        } else {
          // Si jamais billet inexistant (pas censé arriver), on le crée
          current.billets.push({ euro: valeur, quantity: quantite, color: this.banque.find(b => b.euro === valeur)?.color || 'grey' });
        }
        reste -= quantite * valeur;
      }
    }

    player.next(current);
    return true;
  }


  async transferBilletsBetweenPlayers(euro: number, quantite: number, srcPlayer: BehaviorSubject<Player>, dstPlayer: BehaviorSubject<Player>): Promise<boolean> {
    const source = structuredClone(srcPlayer.value);
    const cible = structuredClone(dstPlayer.value);

    const billetSrc = source.billets.find(b => b.euro === euro);
    const billetDst = cible.billets.find(b => b.euro === euro);

    if (!billetSrc || billetSrc.quantity < quantite) {
      return false; // Pas assez de billets à transférer
    }

    // Déduire des billets du joueur source
    billetSrc.quantity -= quantite;

    // Ajouter au joueur cible
    if (billetDst) {
      billetDst.quantity += quantite;
    } else {
      cible.billets.push({ euro, quantity: quantite, color: billetSrc.color });
    }

    srcPlayer.next(source);
    dstPlayer.next(cible);
    return true;
  }


  async takeMoneyFromBank(dstEuro: number, dstQuantity: number, dstPlayer: BehaviorSubject<Player>) {
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
  }

  calcTotal(player: Player): number {
    let total = 0;
    player.billets.forEach(billet => {
      total += (billet.euro * billet.quantity);
    })
    return total;
  }
  getCards(): Observable<Card[]> {
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

  async rollDiceGetOutJail(player: BehaviorSubject<Player>) {
    console.log('rollDiceGetOutJail');
    const current = structuredClone(player.value);

    if (current.jailDice === 3) {
      console.log('PAY JAIL');
      await this.payGetOutJail(player);
    } else {
      console.log('check dé 1', this.dice1);
      console.log('check dé 1', this.dice2);
      if (this.dice1 === this.dice2) {
        // success
        current.jailDice = 0;
        current.jail = false;
        console.log('SORTIR DE PRISON');
      } else {
        current.jailDice++;
        console.log('current: ', current.jailDice);
      }
      console.log('update current');
      player.next(current);
    }


    console.log('end rollDiceGetOutJail');

    // currentProperties.push(ganocase);
    // const updatedPlayer = { ...currentPlayer, properties: currentProperties };
    // player.next(current);
  }


  async payGetOutJail(player: BehaviorSubject<Player>, montantJailOut = 50) {
    const result = await this.payToBank(montantJailOut, player);

    if (result === false) {
      console.warn("Le joueur n'a pas assez d'argent pour sortir de prison");
      return;
    }

    console.log('AFTER TO CHECK !! : ', this.banque);
    console.log('AFTER TO CHECK !! : ', player.value);

    const current = structuredClone(player.value);
    current.jailDice = 0;
    current.jail = false;
    player.next(current);
  }

  async addProperty(ganocase: number, player: BehaviorSubject<Player>) {
    // Pay Before
    console.log('BEFORE TO CHECK !! : ', this.banque);
    console.log('BEFORE TO CHECK !! : ', player.value);
    const montant = await this.propertyPrice(ganocase);
    const result = await this.payToBank(montant, player);

    if (result === false) {
      console.warn("Le joueur n'a pas assez d'argent pour acheter la propriété");
      return;
    }

    console.log('AFTER TO CHECK !! : ', this.banque);
    console.log('AFTER TO CHECK !! : ', player.value);

    const current = structuredClone(player.value);

    // Vérifie que la propriété n'existe pas déjà
    const alreadyOwned = current.properties.some(p => p.index === ganocase);
    if (!alreadyOwned) {
      current.properties.push({ index: ganocase, house: 0 }); // Ajout avec 0 maison
      player.next(current);
    } else {
      console.warn(`La propriété ${ganocase} est déjà possédée par le joueur ${current.name}`);
    }
  }


  async propertyPrice(ganocase: number): Promise<number> {
    const checkCards$ = this.getCards().pipe(
      map(cards => cards.filter(card => card.case === ganocase))
    );

    const checkCards = await firstValueFrom(checkCards$);

    if (checkCards.length === 0) {
      console.warn('Aucune carte trouvée dans les propriétés du joueur');
      return 0;
    }

    const lastCard = checkCards[checkCards.length - 1];
    console.log('Dernière carte :', lastCard);
    return lastCard.prix;
  }


  async payToBank(montant: number, player: BehaviorSubject<Player>): Promise<false | Billet[]> {
    console.log('Billets du joueur avant paiement :', player.value.billets);

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


  async payToPlayer(montant: number, player: BehaviorSubject<Player>) {
    const billetsValeurs = [500, 100, 50, 20, 10, 5, 1];
    let reste = montant;

    for (const valeur of billetsValeurs) {
      if (reste <= 0) break;

      const quantite = Math.floor(reste / valeur);
      if (quantite > 0) {
        await this.takeMoneyFromBank(valeur, quantite, player);
        reste -= quantite * valeur;
      }
    }
  }

  async analyseGame(player: BehaviorSubject<Player>) {
    // Analyse Game
    console.log('Player start ', player.value.name);
    console.log("⏳ Étape 0 : Cartes");
    let card = this.checkCardGanopoly(player);
    if (card) {
      console.log(card);
      await this.analyseCard(player, card);
    }

    console.log("⏳ Étape 4 : Fin du tour de l’ordinateur.");
  }

  async analyseCard(player: BehaviorSubject<Player>, card: Card) {
    if (card.type == CardType.impots) {
      // Pay
      this.playerPayTaxes(card.prix, player);
    }
    if (card.type == CardType.toprison) {
      // To go to JAIL
      // this.rollDiceGetOutJail(player);
    }
    if (card.type == CardType.caisse) {
      console.log('Community card computer - ', player.value.name);
      console.log('before ', this.communauteCards);
      let communityCard = this.pickCommunityCard();
      console.log('communityCard ', communityCard);
      this.playCommunityCard(communityCard, player, true);
      console.log('after ', this.communauteCards);
    }
    if (card.type == CardType.chance) {
      // To go to JAIL
      // communityCard
      //this.playChanceCard(this.communityCard, player);
      console.log('Chance card computer - ', player.value.name);
      console.log('before ', this.chanceCards);
      let chanceCard = this.pickChanceCard();
      console.log('chanceCard ', chanceCard);
      this.playChanceCard(chanceCard, player);
      console.log('after ', this.chanceCards);
    }
    if (card.type == CardType.start) {
      // CHECK START
      this.checkStart(player);
    }

    if ([CardType.immobilier, CardType.elec, CardType.gare, CardType.eaux].includes(card.type)) {
      console.log("⏳ Étape 1 : Vérifie si la carte appartient à un joueur...");
      let canBuyHouse = await this.checkBuyHouse(player);
      console.log("⏳ Étape 3 : Décide s’il veut acheter la propriété...");
      if (canBuyHouse) {
        await this.computerBuyHouse(player);
      }
    }
  }

  checkOwnerCardForHuman(player: BehaviorSubject<Player>, card: Card): boolean | undefined {
    if ([CardType.immobilier, CardType.elec, CardType.gare, CardType.eaux].includes(card.type)) {
      console.log('checkOwnerCardForHuman ', card.type);
      let canBuyHouse = this.checkBuyHouse(player);
      return canBuyHouse;
    }
    return undefined;
  }

  checkCardGanopoly(player: BehaviorSubject<Player>): Card | undefined {
    const cellNb = player.value.currentCase;
    return this.allCards.find(card => card.case === cellNb);
  }

  checkBuyHouse(player: BehaviorSubject<Player>): boolean {
    const cellNb = player.value.currentCase;
    let canBuy = true;
    console.log(player.value);
    console.log(this.playerHuman$.value);

    console.log('check human');
    canBuy = this.checkPlayerIsOwnerAndPay(player, this.playerHuman$, cellNb);
    if (canBuy) {
      console.log('check computer1');
      canBuy = this.checkPlayerIsOwnerAndPay(player, this.playerComputer1$, cellNb);
    }
    if (canBuy) {
      console.log('check computer2');
      canBuy = this.checkPlayerIsOwnerAndPay(player, this.playerComputer2$, cellNb);
    }
    if (canBuy) {
      console.log('check computer3');
      canBuy = this.checkPlayerIsOwnerAndPay(player, this.playerComputer3$, cellNb);
    }

    return canBuy;
  }

  checkPlayerIsOwnerAndPay(playerSrc: BehaviorSubject<Player>, playerDest: BehaviorSubject<Player>, cellNb: number): boolean {
    const ownedProperty = playerDest.value.properties.find(p => p.index === cellNb);
    // console.log('ownedProperty', ownedProperty);
    //  console.log('playerSrc ', playerSrc.value);
    //  console.log('playerDest ', playerDest.value);
    // console.log('cellNb ', cellNb);

    if (ownedProperty) {
      if (playerSrc.value.id !== playerDest.value.id) {
        this.payRentPlayer(playerSrc, this.playerHuman$, ownedProperty);
      }
      return false;
    }
    return true;
  }


  async payRentPlayer(playersrc: BehaviorSubject<Player>, playerdest: BehaviorSubject<Player>, ownedProperty: { index: number, house: number }) {
    let card = this.allCards.find(card => card.case === ownedProperty.index);
    if (card) {
      switch (ownedProperty.house) {
        case 0:
          await this.payToPlayerFromPlayer(card.prix, playersrc, playerdest);
          break;
        case 1:
          await this.payToPlayerFromPlayer(card.house1, playersrc, playerdest);
          break;
        case 2:
          await this.payToPlayerFromPlayer(card.house2, playersrc, playerdest);
          break;
        case 3:
          await this.payToPlayerFromPlayer(card.house3, playersrc, playerdest);
          break;
        case 4:
          await this.payToPlayerFromPlayer(card.house4, playersrc, playerdest);
          break;
        case 5:
          await this.payToPlayerFromPlayer(card.hotel1, playersrc, playerdest);
          break;
        default:
          break;
      }
    }

  }

  async computerBuyHouse(player: BehaviorSubject<Player>) {
    const cellNb = player.value.currentCase;
    await this.addProperty(cellNb, player);
  }

  pickChanceCard(): ccCard | undefined {
    console.log('pickChanceCard');
    console.log(this.chanceCards);
    let lastCard = this.chanceCards.pop();
    if (lastCard) {
      this.chanceCards = [lastCard, ...this.chanceCards];
    }
    console.log(this.chanceCards);
    console.log(lastCard);
    return lastCard;
  }

  pickCommunityCard(): ccCard | undefined {
    console.log(this.communauteCards);
    console.log('pickCommunityCard');
    let lastCard = this.communauteCards.pop();
    if (lastCard) {
      this.communauteCards = [lastCard, ...this.communauteCards];
    }
    console.log(this.communauteCards);
    return lastCard;
  }

  async playChanceCard(chanceCard: ccCard | undefined, player: BehaviorSubject<Player>) {
    await this.playCommunityCard(chanceCard, player, false);
  }

  async playCommunityCard(communityCard: ccCard | undefined, player: BehaviorSubject<Player>, isCommunityCard = true) {
    console.log('PlayCommunityCard', communityCard);
    console.log(communityCard?.type);
    // if (communityCard) communityCard.type = CommunityType.payeachplayer50;
    if (communityCard?.type === CommunityType.earn10) {
      await this.payToPlayer(10, player);
    }

    if (communityCard?.type === CommunityType.earn20) {

      await this.payToPlayer(20, player);
    }
    if (communityCard?.type === CommunityType.earn25) {
      await this.payToPlayer(25, player);
    }

    if (communityCard?.type === CommunityType.earn50) {
      await this.payToPlayer(50, player);
    }

    if (communityCard?.type === CommunityType.earn100) {
      await this.payToPlayer(100, player);
    }

    if (communityCard?.type === CommunityType.earn150) {
      await this.payToPlayer(150, player);
    }

    if (communityCard?.type === CommunityType.earn200) {
      await this.payToPlayer(200, player);
    }

    if (communityCard?.type === CommunityType.pay15) {
      const result = await this.payToBank(15, player);

      if (result === false) {
        console.warn("Le joueur n'a pas assez d'argent pour payer 15");
        return;
      }
    }

    if (communityCard?.type === CommunityType.pay50) {
      const result = await this.payToBank(50, player);

      if (result === false) {
        console.warn("Le joueur n'a pas assez d'argent pour payer 50");
        return;
      }
    }

    if (communityCard?.type === CommunityType.pay100) {
      const result = await this.payToBank(100, player);

      if (result === false) {
        console.warn("Le joueur n'a pas assez d'argent pour payer 100");
        return;
      }
    }

    if (communityCard?.type === CommunityType.jailfree) {
      if (isCommunityCard) {
        await this.addCommunityCard(communityCard, player);
      } else {
        await this.addChanceCard(communityCard, player);
      }
    }

    if (communityCard?.type === CommunityType.gotojail) {
      await this.goToJail(player);
    }

    if (communityCard?.type === CommunityType.backthree) {
      // await this.goToJail(player);
    }

    if (communityCard?.type === CommunityType.eachplayer10) {
      await this.payToPlayerFromPlayer(10, this.playerComputer1$, player);
      await this.payToPlayerFromPlayer(10, this.playerComputer2$, player);
      await this.payToPlayerFromPlayer(10, this.playerComputer3$, player);
    }

    if (communityCard?.type === CommunityType.payeachplayer50) {
      console.log('playerHuman$ ', this.playerHuman$.value)
      console.log('playerComputer1$ ', this.playerComputer1$.value)
      console.log('playerComputer2$ ', this.playerComputer2$.value)
      console.log('playerComputer3$ ', this.playerComputer3$.value)
      await this.payToPlayerFromPlayer(50, player, this.playerComputer1$);
      await this.payToPlayerFromPlayer(50, player, this.playerComputer2$);
      await this.payToPlayerFromPlayer(50, player, this.playerComputer3$);
    }

    if (communityCard?.type === CommunityType.house40hotel115) {
      // TO DO from me the player to the bank
    }

    if (communityCard?.type === CommunityType.house25hotel100) {
      // TO DO from me the player to the bank
    }

    if (communityCard?.type === CommunityType.gostart) {
      await this.payToPlayer(200, player);
      await this.goTocase(0, player);
    }

    if (communityCard?.type === CommunityType.gotajmahal) {
      await this.goTocase(39, player);
    }

    if (communityCard?.type === CommunityType.goajantacaves200) {
      if (player.value.currentCase > 21) {
        await this.payToPlayer(200, player);
      }
      await this.goTocase(21, player);
    }

    if (communityCard?.type === CommunityType.goelephantnord200) {
      if (player.value.currentCase > 5) {
        await this.payToPlayer(200, player);
      }
      await this.goTocase(5, player);
    }

    if (communityCard?.type === CommunityType.gomysore200) {
      if (player.value.currentCase > 24) {
        await this.payToPlayer(200, player);
      }
      await this.goTocase(24, player);
    }

    if (communityCard?.type === CommunityType.servicepublicpay10) {
      // service public plus proche
      // A quelqu'un lancer les dés et multiplier par 10

      // "case": 12
      // "case": 28
      const currentcase = player.value.currentCase;
      if (currentcase <= 12) {
        await this.goTocase(12, player);
      } else if (currentcase <= 28) {
        await this.goTocase(28, player);
      } else {
        await this.goTocase(12, player);
      }
    }

    if (communityCard?.type === CommunityType.goelephant) {
      const currentcase = player.value.currentCase;
      if (currentcase <= 5) {
        await this.goTocase(5, player);
      } else if (currentcase <= 15) {
        await this.goTocase(15, player);
      } else if (currentcase <= 25) {
        await this.goTocase(25, player);
      } else if (currentcase <= 35) {
        await this.goTocase(35, player);
      } else {
        await this.goTocase(5, player);
      }
    }


  }

  async checkStart(player: BehaviorSubject<Player>) {
    console.log('checkStart +200');
    await this.payToPlayer(200, player);
  }

  async goTocase(numCase: number, player: BehaviorSubject<Player>) {
    const current = structuredClone(player.value);
    current.currentCase = numCase;
    player.next(current);
  }

  async goToJail(player: BehaviorSubject<Player>) {
    const current = structuredClone(player.value);
    current.jail = true;
    current.currentCase = 10;
    player.next(current);
  }

  async addCommunityCard(communityCard: ccCard, player: BehaviorSubject<Player>) {
    const current = structuredClone(player.value);
    current.communityCards.push(communityCard);
    this.communauteCards = this.communauteCards.filter(card => card.id !== communityCard.id);
    player.next(current);
  }

  async addChanceCard(chanceCard: ccCard, player: BehaviorSubject<Player>) {
    const current = structuredClone(player.value);
    current.chanceCards.push(chanceCard);
    this.chanceCards = this.chanceCards.filter(card => card.id !== chanceCard.id);
    player.next(current);
  }

  async useFreedCardJail(player: BehaviorSubject<Player>) {
    const current = structuredClone(player.value);
    let freeJailCard = current.communityCards.find(card => card.type === CommunityType.jailfree);
    if (freeJailCard) {
      current.jail = false;
      this.communauteCards.push(freeJailCard);
      current.communityCards = current.communityCards.filter(card => card.type !== CommunityType.jailfree);
      player.next(current);
    } else {
      console.warn(`${current.name} a tenté d'utiliser une carte sortie de prison, mais n'en avait pas.`);
    }
  }

  async playerPayTaxes(montant: number, player: BehaviorSubject<Player>) {
    const result = await this.payToBank(montant, player);
    if (result === false) {
      console.warn("Le joueur n'a pas assez d'argent pour payer les taxes");
      return;
    }
  }


  getTotalHouse(cellCase: number): number {
    // TEST House
    // if(cellCase ==1 ) {
    //   return 4;
    // }
    // if(cellCase == 3 ) {
    //   return 4;
    // }
    // if(cellCase == 6 ) {
    //   return 5;
    // }
    const players = [
      this.playerHuman$.value,
      this.playerComputer1$.value,
      this.playerComputer2$.value,
      this.playerComputer3$.value
    ];

    for (const player of players) {
      const prop = player.properties.find(p => p.index === cellCase);
      if (prop) {
        return prop.house;
      }
    }

    return 0;
  }


}


