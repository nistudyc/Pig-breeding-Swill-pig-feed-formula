import React from 'react';
import { NutrientProfile } from '../types';

interface Props {
  data: NutrientProfile;
  onChange: (id: string, field: keyof NutrientProfile, value: number | string) => void;
  icon?: React.ReactNode;
  showEnergy?: boolean;
  readOnly?: boolean; 
  allowNameEdit?: boolean; 
  readOnlyName?: boolean;
}

export const NutrientInput: React.FC<Props> = ({ 
  data, 
  onChange, 
  icon, 
  showEnergy = false, 
  readOnly = false,
  allowNameEdit = false,
  readOnlyName = false
}) => {
  return (
    <div className={`transition-colors ${readOnly ? 'opacity-75' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full">
          {allowNameEdit && !readOnlyName ? (
            <input 
              type="text"
              value={data.name}
              onChange={(e) => onChange(data.id, 'name', e.target.value)}
              className="font-bold text-gray-700 border-b-2 border-blue-100 focus:border-blue-500 outline-none w-full bg-transparent py-1"
              placeholder="点击输入原料名称"
            />
          ) : (
            <h3 className="font-bold text-gray-700 py-1">{data.name}</h3>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">粗蛋白 (%)</label>
          <input
            type="number"
            value={data.protein}
            onChange={(e) => onChange(data.id, 'protein', parseFloat(e.target.value) || 0)}
            disabled={readOnly}
            className={`w-full font-bold text-lg outline-none bg-transparent ${
              readOnly ? 'text-gray-400' : 'text-blue-600'
            }`}
          />
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">水分 (%)</label>
          <input
            type="number"
            value={data.moisture}
            onChange={(e) => onChange(data.id, 'moisture', parseFloat(e.target.value) || 0)}
            disabled={readOnly}
            className={`w-full font-bold text-lg outline-none bg-transparent ${
              readOnly ? 'text-gray-400' : 'text-blue-600'
            }`}
          />
        </div>
        {showEnergy && (
             <div className="col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
             <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">消化能 (kj/g)</label>
             <input
               type="number"
               value={data.energy}
               onChange={(e) => onChange(data.id, 'energy', parseFloat(e.target.value) || 0)}
               disabled={readOnly}
               className={`w-full font-bold text-lg outline-none bg-transparent ${
                readOnly ? 'text-gray-400' : 'text-blue-600'
              }`}
             />
           </div>
        )}
      </div>
    </div>
  );
};
