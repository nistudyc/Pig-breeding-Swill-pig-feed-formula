import { PigCategory, WeightStage, NutrientProfile, FormulationResult, StandardRecipe } from '../types';

/**
 * 将“原样”营养数据折算为“10%水分标准”下的营养数据
 */
const toStandardBasis = (profile: NutrientProfile) => {
  const k = (100 - profile.moisture) / 90;
  return {
    protein: profile.protein / k,
    energy: profile.energy / k,
    standardFactor: k
  };
};

export const calculateFeedMix = (
  category: PigCategory,
  stage: WeightStage,
  batchSize: number, 
  kitchenInput: NutrientProfile, 
  cornInput: NutrientProfile,
  recipes: Record<PigCategory, Record<WeightStage, StandardRecipe>> // Added parameter for admin custom recipes
): FormulationResult => {
  
  const std = recipes[category][stage];
  
  // 1. 数据标准化 (10% 水分)
  const kitchenStd = toStandardBasis(kitchenInput);
  const cornStd = toStandardBasis(cornInput);
  
  // 2. 核心算法：基于能量缺口倒推比例
  let cornRatio = 0;
  const energyDiff = cornStd.energy - kitchenStd.energy;
  
  if (Math.abs(energyDiff) < 0.1) {
    cornRatio = 0.5; 
  } else {
    cornRatio = (std.targetMe - kitchenStd.energy) / energyDiff;
  }

  cornRatio = Math.max(0.15, Math.min(0.85, cornRatio));
  const kitchenRatio = 1 - cornRatio;

  // 3. 计算标准重
  const cornStdWeight = cornRatio * batchSize;
  const kitchenStdWeight = kitchenRatio * batchSize;

  // 4. 折算回实际称重
  const cornActualWeight = cornStdWeight / cornStd.standardFactor;
  const kitchenActualWeight = kitchenStdWeight / kitchenStd.standardFactor;
  
  // 5. 核心料计算
  const coreBags = (std.coreBags / 1000) * batchSize;

  // 6. 营养分析
  const finalProtein = (kitchenRatio * kitchenStd.protein) + (cornRatio * cornStd.protein);
  const finalEnergy = (kitchenRatio * kitchenStd.energy) + (cornRatio * cornStd.energy);
  
  const totalActualWeight = cornActualWeight + kitchenActualWeight;
  const finalMoisture = ((cornActualWeight * cornInput.moisture) + (kitchenActualWeight * kitchenInput.moisture)) / totalActualWeight;

  // 7. 警告系统
  const warnings: string[] = [];
  if (finalProtein < std.targetCp - 0.5) {
    warnings.push(`🔴 蛋白缺口：当前配方蛋白为 ${finalProtein.toFixed(1)}%，低于目标 ${std.targetCp}%。建议补充豆粕或优质蛋白源。`);
  }
  if (finalEnergy < std.targetMe - 0.2) {
    warnings.push(`🟠 能量不足：当前配方能量为 ${finalEnergy.toFixed(2)}kj/g，低于目标 ${std.targetMe}kj/g。建议增加玉米或面包粉比例。`);
  }
  if (finalMoisture > 50) {
    warnings.push(`ℹ️ 高水分提示：混合料总水分达 ${finalMoisture.toFixed(0)}%，建议现配现喂，严防酸败。`);
  }

  return {
    recipe: [
      { 
        name: kitchenInput.name, 
        weight: kitchenActualWeight, 
        standardWeight: kitchenStdWeight,
        percent: kitchenRatio * 100, 
        color: '#3b82f6',
        note: `原水分 ${kitchenInput.moisture}%`
      },
      { 
        name: cornInput.name, 
        weight: cornActualWeight, 
        standardWeight: cornStdWeight,
        percent: cornRatio * 100, 
        color: '#fbbf24',
        note: `原水分 ${cornInput.moisture}%`
      },
      {
        name: '猪仙子核心料',
        weight: coreBags, 
        standardWeight: coreBags, 
        percent: 0, 
        color: '#f43f5e', 
        note: `必填项：${std.coreBags}包 / 吨标料`
      }
    ],
    analysis: {
      protein: finalProtein,
      energy: finalEnergy,
      moisture: finalMoisture,
      dryMatter: 100 - finalMoisture
    },
    warnings
  };
};
