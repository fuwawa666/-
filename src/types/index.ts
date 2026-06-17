export type Area =
  | '萩'
  | '山口市'
  | '下関'
  | '宇部'
  | '周南'
  | '岩国'
  | '長門'
  | '美祢'
  | '防府'
  | '柳井';

export type Category =
  | '歴史・文化'
  | '自然・絶景'
  | '食・体験'
  | '温泉・癒し'
  | '工芸・ものづくり'
  | '海・水辺';

export interface RichScore {
  connection: number;  // 人との接点
  slowness: number;    // 余白
  takehome: number;    // 持ち帰り
  senses: number;      // 五感
}

export interface Spot {
  id: string;
  name: string;
  area: Area;
  category: Category;
  description: string;
  imageUrl: string;
  richScore: RichScore;
  rainOk: boolean;
  tags: string[];
}

export type SwipeDirection = 'left' | 'right' | null;
