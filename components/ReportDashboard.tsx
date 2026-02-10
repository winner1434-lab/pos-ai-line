
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

interface ReportDashboardProps {
  orderCount: number;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ orderCount }) => {
  return (
    <div className="p-4 space-y-6">
      {/* Dynamic Summary Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">本月下單次數</p>
          <p className="text-2xl font-black text-green-600 mt-1">{12 + orderCount}</p>
          <p className="text-[10px] text-green-500 mt-1">↑ 15% vs 上月</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">本月總採購額</p>
          <p className="text-2xl font-black text-green-600 mt-1">${(61000).toLocaleString()}</p>
          <p className="text-[10px] text-green-500 mt-1">↑ 27% vs 上月</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
          <span className="w-1 h-4 bg-green-500 mr-2 rounded-full"></span>
          採購金額趨勢 (MoM)
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
          <div className="text-gray-500 font-medium">預估下月採購增幅: <span className="text-green-600 font-bold">+8.4%</span></div>
          <button className="text-green-600 font-bold border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50">下載報表</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
          <span className="w-1 h-4 bg-green-500 mr-2 rounded-full"></span>
          品類採購佔比分析
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
          <div className="w-1/2 space-y-3">
            {CATEGORY_DATA.map((item, idx) => (
              <div key={item.name} className="flex flex-col text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }}></span>
                    <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full" style={{ backgroundColor: COLORS[idx], width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-700 to-green-500 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <h4 className="font-bold text-base mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          AI 採購週報摘要
        </h4>
        <p className="text-xs opacity-90 leading-relaxed font-light">
          老闆，本月您的「肉類」採購頻率明顯提升。根據 ERP 預測，下週起豬肉報價將有小幅調漲，建議本週內可將常備品項補足，預估可節省約 3-5% 採購成本。
        </p>
      </div>
    </div>
  );
};
