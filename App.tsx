import React, { useState, useMemo, useEffect } from 'react';
import { PigCategory, WeightStage, StandardRecipe } from './types';
import { PIG_LABELS, INITIAL_STANDARD_RECIPES, DEFAULT_INGREDIENTS, APP_VERSION, COPYRIGHT_YEAR } from './constants';
import { calculateFeedMix } from './utils/feedCalculator';
import { NutrientInput } from './components/NutrientInput';
import { ResultCard } from './components/ResultCard';

// Icons
import { Calculator, Database, Droplets, Info, Settings2, Lock, Save, X, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  // --- Global Config State (Admin Editable) ---
  const [currentRecipes, setCurrentRecipes] = useState(() => {
    const saved = localStorage.getItem('zxz_recipes');
    return saved ? JSON.parse(saved) : INITIAL_STANDARD_RECIPES;
  });

  // --- View State ---
  const [view, setView] = useState<'home' | 'login' | 'admin'>('home');
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [adminClickCount, setAdminClickCount] = useState(0);

  // --- Calculation State ---
  const [activeCategory, setActiveCategory] = useState<PigCategory>(PigCategory.EXTERNAL);
  const [activeStage, setActiveStage] = useState<WeightStage>(WeightStage.GROWER);
  const [batchSize, setBatchSize] = useState<number>(1000);
  const [kitchen, setKitchen] = useState({ ...DEFAULT_INGREDIENTS.KITCHEN });
  const [corn, setCorn] = useState({ ...DEFAULT_INGREDIENTS.STANDARD_CORN }); 

  const [kitchenMode, setKitchenMode] = useState<'standard' | 'custom'>('standard');
  const [energyMode, setEnergyMode] = useState<'standard' | 'custom'>('standard');

  useEffect(() => {
    if (energyMode === 'standard') {
      setCorn({ ...DEFAULT_INGREDIENTS.STANDARD_CORN });
    }
  }, [energyMode]);

  const updateIngredient = (setter: React.Dispatch<React.SetStateAction<any>>) => (_id: string, field: string, value: number | string) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const calculationResult = useMemo(() => {
    // Custom calculator to use live currentRecipes
    return calculateFeedMix(activeCategory, activeStage, batchSize, kitchen, corn, currentRecipes);
  }, [activeCategory, activeStage, batchSize, kitchen, corn, currentRecipes]);

  // --- Admin Logic ---
  const handleAdminTrigger = () => {
    const newCount = adminClickCount + 1;
    setAdminClickCount(newCount);
    if (newCount >= 2) {
      setView('login');
      setAdminClickCount(0);
    }
    setTimeout(() => setAdminClickCount(0), 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'admin' && loginForm.pass === 'zxz2026') {
      setView('admin');
    } else {
      alert('用户名或密码错误');
    }
  };

  const saveAdminRecipes = (newRecipes: any) => {
    setCurrentRecipes(newRecipes);
    localStorage.setItem('zxz_recipes', JSON.stringify(newRecipes));
    alert('配方公式已更新');
    setView('home');
  };

  // --- Render Admin View ---
  if (view === 'admin') {
    return (
      <AdminPanel 
        recipes={currentRecipes} 
        onSave={saveAdminRecipes} 
        onCancel={() => setView('home')} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 relative bg-[#f3f4f6]">
      {/* Login Modal Overlay */}
      {view === 'login' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><Lock className="w-4 h-4" /> 后台管理登录</h3>
              <button onClick={() => setView('home')}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">用户名</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={loginForm.user}
                  onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">密码</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={loginForm.pass}
                  onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">确认进入</button>
            </form>
          </div>
        </div>
      )}

      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex flex-wrap content-center justify-center opacity-[0.06] select-none">
        {[...Array(30)].map((_, i) => (
           <div key={i} className="w-1/2 md:w-1/3 lg:w-1/4 h-40 flex items-center justify-center transform -rotate-[25deg]">
              <span className="text-lg font-bold text-gray-600 whitespace-nowrap">
                猪仙子 18926264642
              </span>
           </div>
        ))}
      </div>

      {/* --- Header --- */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-4 md:gap-5">
               <img 
                 src="https://pub-e31045ad63b049c090acdab00cc531c6.r2.dev/blue%20logo%20full.webp" 
                 alt="猪仙子 Logo 1" 
                 className="h-8 md:h-10 w-auto object-contain"
               />
               <img 
                 src="https://zxz1001c.cnpig.ai/zhuxianzi%20logo%20green.png" 
                 alt="猪仙子 Logo 2" 
                 className="h-8 md:h-10 w-auto object-contain hidden md:block"
               />
             </div>
             <div className="border-l border-gray-200 pl-4 md:pl-5">
               <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">餐厨料标准化配方系统</h1>
               <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Precision Feed Formulation {APP_VERSION}</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* 第一步：选择猪只 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            第一步：选择猪只品种与阶段
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <div className="flex p-1 bg-gray-200 rounded-xl">
                    {Object.values(PigCategory).map((cat) => (
                        <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                            activeCategory === cat ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        >
                        {PIG_LABELS[cat]}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(currentRecipes[activeCategory]) as unknown as [WeightStage, StandardRecipe][]).map(([stageKey, recipe]) => (
                        <button
                        key={stageKey}
                        onClick={() => setActiveStage(stageKey)}
                        className={`border-2 p-3 rounded-xl text-center transition-all flex flex-col justify-center min-h-[70px] ${
                            activeStage === stageKey 
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                            : 'border-white bg-white hover:border-blue-100 shadow-sm'
                        }`}
                        >
                            <div className={`text-sm font-bold ${activeStage === stageKey ? 'text-blue-700' : 'text-gray-700'}`}>{recipe.desc}</div>
                            <div className="text-[10px] text-gray-400 mt-1 italic">
                              目标CP: {recipe.targetCp}%
                            </div>
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </section>

        {/* 第二步：输入原料 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-500" />
            第二步：输入原料实测数据
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
                {/* 1. Kitchen Waste Input */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Droplets className="w-5 h-5" />
                            <h3 className="font-bold">核心原料：餐厨料</h3>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                           <button onClick={() => setKitchenMode('standard')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${kitchenMode === 'standard' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}>默认</button>
                           <button onClick={() => setKitchenMode('custom')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${kitchenMode === 'custom' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}>自定义</button>
                        </div>
                    </div>
                    <NutrientInput data={kitchen} onChange={updateIngredient(setKitchen)} showEnergy allowNameEdit={kitchenMode === 'custom'} readOnlyName={kitchenMode === 'standard'} />
                    <div className="mt-4 flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700 leading-relaxed">水分越高，实际所需重量越多。</p>
                    </div>
                </div>

                {/* 2. Energy Material Input */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Database className="w-5 h-5" />
                            <h3 className="font-bold">能量原料</h3>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                           <button onClick={() => setEnergyMode('standard')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${energyMode === 'standard' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'}`}>标准玉米</button>
                           <button onClick={() => setEnergyMode('custom')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${energyMode === 'custom' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'}`}>自定义</button>
                        </div>
                    </div>
                    <NutrientInput data={corn} onChange={updateIngredient(setCorn)} showEnergy readOnly={energyMode === 'standard'} allowNameEdit={energyMode === 'custom'} />
                </div>

                {/* Batch Size */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl"><Calculator className="w-5 h-5 text-white" /></div>
                        <div>
                            <div className="font-bold text-gray-800">标准料生产总量</div>
                            <div className="text-[10px] text-gray-400">基于10%水分标料总量计算</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        {[500, 1000, 2000].map(size => (
                            <button key={size} onClick={() => setBatchSize(size)} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${batchSize === size ? 'bg-white text-blue-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                                {size}kg
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* 结果展示 */}
            <div className="lg:col-span-5">
                <ResultCard 
                    result={calculationResult} 
                    batchSize={batchSize}
                    pigLabel={PIG_LABELS[activeCategory]}
                    stageLabel={currentRecipes[activeCategory][activeStage].desc}
                />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 z-40">
        <div className="max-w-6xl mx-auto px-4 flex flex-row items-end justify-between gap-4">
            <div className="text-[10px] text-gray-500 font-medium pb-1 flex-1 text-left hidden md:block">
                © {COPYRIGHT_YEAR} 广东猪仙子生物科技有限公司 猪仙子饲料配方研究所 | <span onClick={handleAdminTrigger} className="cursor-pointer hover:text-blue-500 transition-all">启明ai</span> {APP_VERSION}
            </div>
            <div className="flex-1 flex justify-center items-center gap-4 px-4 hidden md:flex">
              <img src="https://pub-e31045ad63b049c090acdab00cc531c6.r2.dev/blue%20logo%20full.webp" alt="Logo 1 Small" className="h-6 w-auto object-contain opacity-70" />
               <img src="https://zxz1001c.cnpig.ai/zhuxianzi%20logo%20green.png" alt="Logo 2 Small" className="h-6 w-auto object-contain opacity-70" />
            </div>
            <div className="text-[10px] text-gray-400 font-medium pb-1 flex-1 text-right">
                技术支持: 18926264642 (微信同号)
            </div>
        </div>
      </footer>
    </div>
  );
};

// --- Admin Panel Component ---
const AdminPanel: React.FC<{ recipes: any, onSave: (r: any) => void, onCancel: () => void }> = ({ recipes, onSave, onCancel }) => {
  const [data, setData] = useState(JSON.parse(JSON.stringify(recipes)));

  const updateField = (cat: string, stage: string, field: string, val: any) => {
    const newData = { ...data };
    newData[cat][stage][field] = val;
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg text-white"><Settings2 className="w-5 h-5" /></div>
             <h1 className="font-black text-gray-800">配方公式管理系统</h1>
           </div>
           <div className="flex gap-3">
             <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">取消</button>
             <button onClick={() => onSave(data)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100"><Save className="w-4 h-4" /> 保存修改</button>
           </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {Object.entries(PIG_LABELS).map(([catKey, catLabel]) => (
          <div key={catKey} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              {catLabel} 营养标准
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(data[catKey]).map(([stageKey, recipe]: [any, any]) => (
                <div key={stageKey} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="font-bold text-blue-600 flex items-center justify-between">
                    {recipe.desc}
                    <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded uppercase">阶段配平</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">目标粗蛋白 (%)</label>
                      <input 
                        type="number" step="0.1" 
                        className="w-full p-3 bg-white rounded-xl border border-gray-200 font-bold"
                        value={recipe.targetCp} 
                        onChange={e => updateField(catKey, stageKey, 'targetCp', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">目标消化能 (kj/g)</label>
                      <input 
                        type="number" step="0.1" 
                        className="w-full p-3 bg-white rounded-xl border border-gray-200 font-bold"
                        value={recipe.targetMe} 
                        onChange={e => updateField(catKey, stageKey, 'targetMe', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">核心料添加量 (包/吨标料)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-white rounded-xl border border-gray-200 font-bold"
                        value={recipe.coreBags} 
                        onChange={e => updateField(catKey, stageKey, 'coreBags', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <footer className="text-center py-10 text-gray-400 text-xs italic">
        * 请谨慎修改。错误的营养目标可能导致猪只生长缓慢或核心料浪费。
      </footer>
    </div>
  );
};

export default App;
