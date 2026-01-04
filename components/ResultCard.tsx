import React from 'react';
import { FormulationResult } from '../types';
import { Share2, AlertTriangle, CheckCircle2, Utensils, Wheat } from 'lucide-react';
import { COPYRIGHT_YEAR } from '../constants';

interface Props {
  result: FormulationResult;
  batchSize: number;
  pigLabel: string;
  stageLabel: string;
}

export const ResultCard: React.FC<Props> = ({ result, batchSize, pigLabel, stageLabel }) => {
  
  const handleShare = async () => {
    const text = `【猪仙子专业配方建议书】\n` +
      `品种: ${pigLabel} | 阶段: ${stageLabel}\n` +
      `标准料总量: ${batchSize}kg (10%水分折算)\n` +
      `----------------\n` +
      result.recipe.map(r => 
        r.name.includes('核心料')
        ? `• ${r.name}: ${r.weight.toFixed(1)}包` 
        : `• ${r.name}: 称重 ${r.weight.toFixed(1)}kg`
      ).join('\n') + `\n` +
      `----------------\n` +
      `成品营养: 蛋白${result.analysis.protein.toFixed(1)}% | 能量${result.analysis.energy.toFixed(2)}kj/g\n` +
      `注意：内容由AI生成，请查证后再使用。\n` +
      `© ${COPYRIGHT_YEAR} 广东猪仙子生物科技有限公司`;

    if (navigator.share) {
      try { await navigator.share({ title: '猪仙子配方单', text: text }); } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('配方已复制到剪贴板！');
      } catch (err) {
        alert('请手动截图分享。');
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden sticky top-24 z-10">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                   配方建议
                </h2>
                <p className="text-[10px] opacity-80 mt-1 italic">
                   内容由AI生成，请查证后再使用
                </p>
                <div className="mt-3 flex gap-2">
                    <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{pigLabel}</span>
                    <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{stageLabel}</span>
                </div>
            </div>
            <button onClick={handleShare} className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-all">
                <Share2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="p-6 relative">
        {/* Card Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden">
             <div className="transform -rotate-12 text-3xl font-black text-black">
                猪仙子 18926264642
             </div>
        </div>

        {/* Warnings & Notices */}
        <div className="space-y-2 mb-6 relative z-10">
            {result.warnings.length > 0 ? (
                result.warnings.map((msg, idx) => (
                    <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{msg}</span>
                    </div>
                ))
            ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold">营养平衡：该配方符合标准化营养需求。</span>
                </div>
            )}
        </div>

        {/* Recipe List */}
        <div className="space-y-3 mb-8 relative z-10">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">混合称重清单 (实际投放)</h4>
            {result.recipe.map((item, idx) => {
                const isCore = item.name.includes('核心料');
                const isKitchen = item.name.includes('餐厨');
                const isCorn = !isCore && !isKitchen;

                let itemColorClass = "bg-blue-50 text-blue-700 border-blue-100"; // Default
                let icon = <Utensils className="w-6 h-6" />;
                
                if (isCore) {
                  itemColorClass = "bg-rose-50 text-rose-700 border-rose-100";
                  icon = (
                    <img 
                      src="https://zxz1001c.cnpig.ai/zhuxianzi%20logo%20white%20small.png" 
                      className="w-8 h-8 object-contain" 
                      style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(85%) border(1px solid transparent)' }} 
                      alt="core"
                    />
                  );
                } else if (isCorn) {
                  itemColorClass = "bg-amber-50 text-amber-700 border-amber-100";
                  icon = <Wheat className="w-6 h-6" />;
                } else if (isKitchen) {
                  icon = <Utensils className="w-6 h-6" />;
                }

                return (
                    <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl border ${itemColorClass}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/50 shadow-sm`}>
                                {icon}
                            </div>
                            <div>
                                <div className="font-bold text-sm">{item.name}</div>
                                <div className="text-[10px] opacity-70">
                                    {item.note}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black">
                                {item.weight.toFixed(1)} 
                                <span className="text-xs ml-1 font-normal opacity-70">
                                    {isCore ? '包' : 'kg'}
                                </span>
                            </div>
                            {item.percent > 0 && (
                                <div className="text-[10px] font-bold opacity-60">
                                    标准占比: {item.percent.toFixed(1)}%
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Analysis Grid */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white relative z-10 shadow-lg shadow-blue-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-blue-100 uppercase tracking-tighter">10%水分标料营养评估</h3>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-bold backdrop-blur-sm">精准计算</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-[9px] text-blue-100 mb-1">粗蛋白</div>
                    <div className={`text-lg font-black ${result.analysis.protein < 14 ? 'text-rose-200' : 'text-white'}`}>
                        {result.analysis.protein.toFixed(1)}<small className="text-[10px] font-normal">%</small>
                    </div>
                </div>
                <div className="text-center border-x border-white/20">
                    <div className="text-[9px] text-blue-100 mb-1">能量</div>
                    <div className="text-lg font-black text-amber-200">
                        {result.analysis.energy.toFixed(2)}<small className="text-[10px] font-normal">kj/g</small>
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-[9px] text-blue-100 mb-1">混合水分</div>
                    <div className="text-lg font-black text-emerald-200">
                        {result.analysis.moisture.toFixed(0)}<small className="text-[10px] font-normal">%</small>
                    </div>
                </div>
            </div>
        </div>
        
        <p className="mt-4 text-[9px] text-gray-400 text-center leading-relaxed italic">
            配方师：猪仙子 | 微信同号：18926264642
        </p>
      </div>
    </div>
  );
};
