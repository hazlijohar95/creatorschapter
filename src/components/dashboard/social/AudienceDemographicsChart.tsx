
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface DemographicsChartProps {
  data?: {
    gender?: { male: number; female: number; other: number };
    age?: Record<string, number>;
    location?: Record<string, number>;
  };
  className?: string;
}

const GENDER_COLORS = ["#9b87f5", "#33C3F0", "#D6BCFA"];
const AGE_COLORS = ["#E1306C", "#8A898C", "#1EAEDB", "#9b87f5", "#6E59A5"];

export function AudienceDemographicsChart({ data, className }: DemographicsChartProps) {
  const [activeChart, setActiveChart] = useState<"gender" | "age">("gender");
  
  // Default demo data if none provided
  const demoData = {
    gender: {
      male: 35,
      female: 55,
      other: 10
    },
    age: {
      "13-17": 5,
      "18-24": 35,
      "25-34": 40,
      "35-44": 15,
      "45+": 5
    }
  };
  
  const chartData = data || demoData;
  
  // Transform data for charts
  const genderData = chartData.gender ? 
    Object.entries(chartData.gender).map(([name, value]) => ({ name, value })) : 
    Object.entries(demoData.gender).map(([name, value]) => ({ name, value }));
    
  const ageData = chartData.age ? 
    Object.entries(chartData.age).map(([name, value]) => ({ name, value })) : 
    Object.entries(demoData.age).map(([name, value]) => ({ name, value }));

  return (
    <Card className={`backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20 shadow-lg transition-all ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2 text-primary" />
            Audience Demographics
          </CardTitle>
          <div className="flex space-x-1 text-xs">
            <button 
              className={`px-3 py-1 rounded-full transition-colors ${
                activeChart === "gender" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/30 hover:bg-muted/50 text-muted-foreground"
              }`}
              onClick={() => setActiveChart("gender")}
            >
              Gender
            </button>
            <button 
              className={`px-3 py-1 rounded-full transition-colors ${
                activeChart === "age" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/30 hover:bg-muted/50 text-muted-foreground"
              }`}
              onClick={() => setActiveChart("age")}
            >
              Age
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] mt-2 animate-fade-in">
          {activeChart === "gender" ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genderData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GENDER_COLORS[index % GENDER_COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {ageData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={AGE_COLORS[index % AGE_COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {activeChart === "gender" 
            ? genderData.map((item, index) => (
                <div key={item.name} className="flex items-center text-xs">
                  <span 
                    className="w-3 h-3 inline-block mr-1 rounded-full"
                    style={{ backgroundColor: GENDER_COLORS[index % GENDER_COLORS.length] }}
                  />
                  <span className="capitalize">{item.name}</span>
                  <span className="ml-1 text-muted-foreground">{item.value}%</span>
                </div>
              ))
            : ageData.map((item, index) => (
                <div key={item.name} className="flex items-center text-xs">
                  <span 
                    className="w-3 h-3 inline-block mr-1 rounded-full"
                    style={{ backgroundColor: AGE_COLORS[index % AGE_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                  <span className="ml-1 text-muted-foreground">{item.value}%</span>
                </div>
              ))
          }
        </div>
      </CardContent>
    </Card>
  );
}
