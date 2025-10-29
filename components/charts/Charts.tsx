
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Brush } from 'recharts';
import { PieChartData, BarChartData } from '../../types';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];
const BAR_COLORS = ['#10b981', '#f97316'];

const formatValueForTooltip = (value: any) => {
    if (typeof value !== 'number') return value;
    // Assume small floats are ratios/rates, format with 2 decimal places
    if (value % 1 !== 0 && Math.abs(value) < 1000) { 
        return value.toFixed(2);
    }
    // Format large numbers with locale-specific separators
    return value.toLocaleString('tr-TR');
}

const CustomPieTooltip = ({ active, payload, data }: any) => {
    if (active && payload && payload.length && data) {
        const totalValue = data.reduce((acc: number, entry: { value: number }) => acc + entry.value, 0);
        const currentData = payload[0];
        const percent = totalValue > 0 ? ((currentData.value / totalValue) * 100).toFixed(2) : 0;

        return (
            <div className="bg-slate-700 p-3 rounded-lg border border-slate-600 shadow-xl">
                <p className="font-bold text-white flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: currentData.color }}></span>
                    {currentData.name}
                </p>
                <p className="text-sm text-gray-300 mt-1">Değer: {formatValueForTooltip(currentData.value)}</p>
                <p className="text-sm text-cyan-400">Genel İçindeki Pay: {percent}%</p>
            </div>
        );
    }
    return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-3 rounded-lg border border-slate-600 shadow-xl text-sm">
        <p className="font-bold text-white mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} className="flex items-center justify-between space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.fill }}></div>
              <span className="text-gray-400 mr-2">{pld.name}:</span>
            </div>
            <span className="font-semibold text-white">
              {formatValueForTooltip(pld.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface SimplePieChartProps {
    data: PieChartData[];
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    content={(props) => <CustomPieTooltip {...props} data={data} />}
                    cursor={{fill: 'rgba(100,116,139,0.1)'}}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};


interface SimpleBarChartProps {
    data: any[];
    keys: string[];
    layout?: 'horizontal' | 'vertical';
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, keys, layout = 'horizontal' }) => {
    const formatYAxis = (tickItem: number) => {
        if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(0)}M`;
        if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}K`;
        return tickItem.toString();
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart 
                data={data} 
                layout={layout} 
                margin={{ 
                    top: 5, 
                    right: layout === 'vertical' ? 30 : 20, 
                    left: 10, 
                    bottom: layout === 'horizontal' ? 25 : 5 
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                {layout === 'horizontal' ? (
                    <>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#d1d5db' }} interval={0} />
                        <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#d1d5db' }} tickFormatter={formatYAxis} />
                    </>
                ) : (
                    <>
                        <XAxis type="number" stroke="#9ca3af" fontSize={12} tick={{ fill: '#d1d5db' }} tickFormatter={formatYAxis} />
                        <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tick={{ fill: '#d1d5db' }} width={120} />
                    </>
                )}
                <Tooltip 
                    content={<CustomBarTooltip />}
                    cursor={{fill: 'rgba(100,116,139,0.1)'}}
                />
                <Legend iconSize={10} />
                {keys.map((key, index) => (
                    <Bar key={key} dataKey={key} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
                
                {layout === 'horizontal' && data.length > 5 && (
                  <Brush 
                    dataKey="name" 
                    height={20} 
                    stroke="#8b5cf6" 
                    fill="rgba(55, 65, 81, 0.5)"
                    tickFormatter={() => ''}
                  />
                )}
                 {layout === 'vertical' && data.length > 5 && (
                  <Brush 
                    dataKey="name" 
                    width={20} 
                    stroke="#8b5cf6" 
                    fill="rgba(55, 65, 81, 0.5)"
                    layout="vertical"
                    tickFormatter={() => ''}
                  />
                )}
            </BarChart>
        </ResponsiveContainer>
    );
};
