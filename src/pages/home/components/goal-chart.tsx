import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface GoalChartProps {
  name: string;
  consumed: number;
  target: number;
  color: string;
  unit: string;
}

export function GoalChart({
  name,
  consumed,
  target,
  color,
  unit = "g"
}: GoalChartProps) {
  const percentage = Math.round((consumed / target) * 100);

  const chartData = [
    {
      label: name.toLowerCase(),
      value: consumed,
      fill: color,
      target: target,
    },
  ];

  const chartConfig = {
    value: {
      label: name,
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-nowrap">Consumo de {name}</CardTitle>
        <CardDescription>Progresso Diário</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360 * (consumed / target)}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />

            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
              maxBarSize={20}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {consumed}{unit} / {target}{unit}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {consumed >= target ? (
            <>
              Meta atingida! <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>Faltam {(target - consumed).toFixed(2)}{unit} para a meta</>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Consumo diário de {name.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}
