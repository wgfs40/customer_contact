"use client";
interface StatProps {
  icon: string;
  value: string;
  label: string;
  change: string;
  trend: "up" | "down";
}
const StatAdmin = ({ stat }: { stat: StatProps }) => {
  return (
    <>
      <div        
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl">{stat.icon}</div>
          <div
            className={`text-sm font-semibold ${
              stat.trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {stat.change}
          </div>
        </div>
        <div className="font-display text-3xl font-bold text-gray-800 mb-2">
          {stat.value}
        </div>
        <div className="text-gray-600 font-medium">{stat.label}</div>
      </div>
    </>
  );
}

export default StatAdmin