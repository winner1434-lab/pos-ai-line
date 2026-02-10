
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MOM_DATA = [
  { month: '10月', amount: 45000 },
  { month: '11月', amount: 52000 },
  { month: '12月', amount: 48000 },
  { month: '1月', amount: 61000 },
];

const CATEGORY_DATA = [
  { name: '海鮮', value: 45 },
  { name: '肉類', value: 30 },
  { name: '蔬菜', value: 25 },
];

const COLORS = ['#059669', '#10b981', '#6ee7b7'];

export const ReportDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
          <span className="w-1 h-4 bg-green-500 mr-2 rounded-full"></span>
          採購金額 MoM 趨勢 (本月 vs 上月)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOM_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center text-xs">
          <div className="text-gray-500">本月預估增長: <span className="text-green-600 font-bold">+21.4%</span></div>
          <button className="text-green-600 font-medium">下載 PDF 報表</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
          <span className="w-1 h-4 bg-green-500 mr-2 rounded-full"></span>
          本月採購佔比
        </h3>
        <div className="flex items-center">
          <div className="h-40 w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2">
            {CATEGORY_DATA.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-2xl text-white shadow-lg">
        <h4 className="font-bold text-sm mb-1">💡 採購建議</h4>
        <p className="text-[11px] opacity-90 leading-relaxed">
          系統偵測到「大西洋鮭魚」目前處於產季高峰，市場報價較上月下降 12%，建議可以適度增加進貨量以利後續春節促銷。
        </p>
      </div>
    </div>
  );
};
