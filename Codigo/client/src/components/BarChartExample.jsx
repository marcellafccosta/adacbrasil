import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const BarChartExample = () => (
  <div className="chart-container bar-chart">
    <h3>Pets e Adoções por Mês</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="mes" stroke="#333" />
        <YAxis stroke="#333" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '5px', borderColor: '#ccc' }} />
        <Legend />
        <Bar dataKey="pets" fill="#8884d8" barSize={30} />
        <Bar dataKey="adocoes" fill="#82ca9d" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartExample;
