export enum PigCategory {
  EXTERNAL = 'EXTERNAL', // 外三元/大白
  LOCAL = 'LOCAL', // 土猪/黑猪
}

export enum WeightStage {
  GROWER = 'GROWER', // 160斤以下 (高蛋白需求)
  FINISHER = 'FINISHER', // 160斤以上 (高能量需求)
}

export interface NutrientProfile {
  protein: number; // % (As-is)
  moisture: number; // %
  energy: number; // kj/g (As-is)
  name: string;
  id: string;
}

export interface NutritionalTarget {
  cp: number; // 目标粗蛋白 %
  me: number; // 目标能量 kj/g
}

export interface FormulationResult {
  recipe: {
    name: string;
    weight: number; // 实际称重 (湿重)
    standardWeight: number; // 10%水分折算重
    percent: number; // 在标准料中的比例
    color: string;
    note?: string;
  }[];
  analysis: {
    protein: number;
    energy: number;
    moisture: number;
    dryMatter: number;
  };
  warnings: string[];
}

export interface StandardRecipe {
  targetCp: number;
  targetMe: number;
  coreBags: number; // 每吨添加量
  desc: string;
}
