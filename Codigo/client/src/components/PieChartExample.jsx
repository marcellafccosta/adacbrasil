import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Pets', value: 100 },
  { name: 'Adoções', value: 55 },
  { name: 'Resgates', value: 30 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ff8042'];

const PieChartExample = () => (
  <div className="chart-container pie-chart">
    <h3>Distribuição de Pets, Adoções e Resgates</h3>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={130} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieChartExample;
