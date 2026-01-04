import { PigCategory, WeightStage, StandardRecipe, NutrientProfile } from './types';

export const APP_VERSION = 'v0.6';
export const COPYRIGHT_YEAR = '2026';

// 初始配方标准
export const INITIAL_STANDARD_RECIPES: Record<PigCategory, Record<WeightStage, StandardRecipe>> = {
  [PigCategory.EXTERNAL]: {
    [WeightStage.GROWER]: {
      desc: '160 斤以下 (中猪)',
      targetCp: 16.5,
      targetMe: 13.5,
      coreBags: 2
    },
    [WeightStage.FINISHER]: {
      desc: '160 斤以上 (大猪)',
      targetCp: 14.5,
      targetMe: 14.2,
      coreBags: 2
    }
  },
  [PigCategory.LOCAL]: {
    [WeightStage.GROWER]: {
      desc: '160 斤以下 (中猪)',
      targetCp: 15.0,
      targetMe: 13.0,
      coreBags: 1
    },
    [WeightStage.FINISHER]: {
      desc: '160 斤以上 (大猪)',
      targetCp: 13.5,
      targetMe: 13.8,
      coreBags: 2
    }
  }
};

export const DEFAULT_INGREDIENTS: Record<string, NutrientProfile> = {
  KITCHEN: {
    id: 'kitchen',
    name: '餐厨料',
    protein: 8.0, 
    moisture: 75,
    energy: 3.5, 
  },
  STANDARD_CORN: {
    id: 'corn',
    name: '标准玉米',
    protein: 8.5,
    moisture: 14.0,
    energy: 14.6, 
  },
  CUSTOM_ENERGY: {
    id: 'custom_energy',
    name: '自定义能量料',
    protein: 9.0,
    moisture: 13.0,
    energy: 15.0,
  },
  CORE: {
    id: 'core',
    name: '猪仙子核心料',
    protein: 0, 
    moisture: 5,
    energy: 0, 
  }
};

export const PIG_LABELS: Record<PigCategory, string> = {
  [PigCategory.EXTERNAL]: '外三元 / 杜长大',
  [PigCategory.LOCAL]: '本地猪 / 土黑猪',
};
