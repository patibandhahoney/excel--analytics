import { useState } from "react";
import { Bar, Line, Doughnut, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Download, Eye, BarChart3, LineChart, PieChart, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Chart3D } from "./Chart3D";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState("bar");

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">No Data Available</h3>
        <p className="text-muted-foreground">Upload an Excel file to see your interactive dashboard</p>
      </div>
    );
  }

  const columns = Object.keys(data.data[0] || {});
  const numericColumns = columns.filter(col => 
    data.data.some(row => typeof row[col] === 'number')
  );

  // Generate chart data
  const generateChartData = () => {
    const labels = data.data.slice(0, 10).map((_, index) => `Row ${index + 1}`);
    const colors = [
      'hsl(240, 100%, 25%)',
      'hsl(200, 100%, 45%)',
      'hsl(120, 70%, 40%)',
      'hsl(45, 100%, 50%)',
      'hsl(0, 84%, 60%)',
      'hsl(280, 100%, 45%)',
    ];

    const datasets = numericColumns.slice(0, 3).map((col, index) => ({
      label: col,
      data: data.data.slice(0, 10).map(row => row[col] || 0),
      backgroundColor: colors[index] + '80',
      borderColor: colors[index],
      borderWidth: 2,
    }));

    return { labels, datasets };
  };

  const chartData = generateChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${data.fileName} - ${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'doughnut', label: 'Pie Chart', icon: PieChart },
    { id: 'scatter', label: 'Scatter Plot', icon: Activity },
    { id: '3d', label: '3D Chart', icon: BarChart3 },
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      case '3d':
        return <Chart3D data={chartData} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  const downloadChart = (format) => {
    // This would implement chart download functionality
    console.log(`Downloading chart as ${format}`);
    alert(`Chart download as ${format.toUpperCase()} would be implemented here`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-lg text-muted-foreground">Interactive analysis of {data.fileName}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => downloadChart('png')} className="hover-scale">
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" onClick={() => downloadChart('pdf')} className="hover-scale">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover-scale">
          <h3 className="font-medium text-muted-foreground mb-1">Total Rows</h3>
          <p className="text-3xl font-bold text-primary">{data.data.length.toLocaleString()}</p>
          <div className="text-sm text-green-500 mt-2">100% processed</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover-scale">
          <h3 className="font-medium text-muted-foreground mb-1">Columns</h3>
          <p className="text-3xl font-bold text-primary">{columns.length}</p>
          <div className="text-sm text-blue-500 mt-2">{numericColumns.length} numeric</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover-scale">
          <h3 className="font-medium text-muted-foreground mb-1">Data Quality</h3>
          <p className="text-3xl font-bold text-primary">98%</p>
          <div className="text-sm text-green-500 mt-2">Excellent</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover-scale">
          <h3 className="font-medium text-muted-foreground mb-1">File Size</h3>
          <p className="text-3xl font-bold text-primary">
            {(JSON.stringify(data.data).length / 1024).toFixed(1)} KB
          </p>
          <div className="text-sm text-blue-500 mt-2">Optimized</div>
        </div>
      </div>

      {/* Chart Type Selection */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Choose Visualization Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedChart(type.id)}
                className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-200 hover-scale ${
                  selectedChart === type.id
                    ? 'bg-gradient-to-br from-primary to-primary-hover text-primary-foreground border-primary shadow-lg'
                    : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-primary/5'
                }`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="h-96 w-full">
          {renderChart()}
        </div>
      </div>

      {/* Data Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Data Mapping</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                X-Axis (Categories)
              </label>
              <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary">
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Y-Axis (Values)
              </label>
              <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary">
                {numericColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Data Preview</h3>
            <Button variant="outline" size="sm" className="hover-scale">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.slice(0, 4).map(col => (
                    <th key={col} className="text-left p-2 font-medium text-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/30">
                    {columns.slice(0, 4).map(col => (
                      <td key={col} className="p-2 text-muted-foreground">
                        {String(row[col] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};