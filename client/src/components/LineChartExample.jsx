import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { mes: 'Jan', pets: 50, adocoes: 20 },
  { mes: 'Fev', pets: 45, adocoes: 18 },
  { mes: 'Mar', pets: 60, adocoes: 25 },
  { mes: 'Abr', pets: 55, adocoes: 22 },
  { mes: 'Mai', pets: 70, adocoes: 30 },
  { mes: 'Jun', pets: 65, adocoes: 28 },
  { mes: 'Jul', pets: 75, adocoes: 35 },
  { mes: 'Ago', pets: 80, adocoes: 40 },
  { mes: 'Set', pets: 85, adocoes: 42 },
  { mes: 'Out', pets: 90, adocoes: 45 },
  { mes: 'Nov', pets: 95, adocoes: 50 },
  { mes: 'Dez', pets: 100, adocoes: 55 },
];
const LineChartExample = () => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={data} style={{overflow: 'hidden'}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pets" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="adocoes" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartExample;
