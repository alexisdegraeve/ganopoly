export class ccCard {
  id : number = 0;
  text: string = '';
  valeur: number = 0;
  type: CommunityType = CommunityType.none;
}

 export enum CommunityType {
  none = 'none',
  gostart = 'gostart',
  earn10 = 'earn10',
  earn20 = 'earn20',
  earn25 = 'earn25',
  earn50 = 'earn50',
  earn100 = 'earn100',
  earn200 = 'earn200',
  pay50 = 'pay50',
  pay100 = 'pay100',
  jailfree = 'jailfree',
  gotojail = 'gotojail',
  eachplayer10 = 'eachplayer10',
  house40hotel115 = 'house40hotel115'
 }
