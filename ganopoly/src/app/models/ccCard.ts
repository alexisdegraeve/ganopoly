export class ccCard {
  id : number = 0;
  text: string = '';
  valeur: number = 0;
  type: CommunityType = CommunityType.none;
}

 export enum CommunityType {
  none = 'none',
  backthree= 'backthree',
  gostart = 'gostart',
  gotajmahal = 'gotajmahal',
  goajantacaves200 = 'goajantacaves200',
  goelephantnord200 = 'goelephantnord200',
  goelephant = 'goelephant',
  gomysore200 = 'gomysore200',
  servicepublicpay10 = 'servicepublicpay10',
  earn10 = 'earn10',
  earn20 = 'earn20',
  earn25 = 'earn25',
  earn50 = 'earn50',
  earn100 = 'earn100',
  earn150 = 'earn150',
  earn200 = 'earn200',
  pay15 = 'pay15',
  pay50 = 'pay50',
  pay100 = 'pay100',
  jailfree = 'jailfree',
  gotojail = 'gotojail',
  eachplayer10 = 'eachplayer10',
  payeachplayer50 = 'payeachplayer50',
  house40hotel115 = 'house40hotel115',
  house25hotel100 = 'house25hotel100'
 }
