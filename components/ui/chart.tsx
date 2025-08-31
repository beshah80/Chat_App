"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `\n${prefix} [data-chart=${id}] {\n${colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                  itemConfig.color;
                return color ? `  --color-${key}: ${color};` : null;
              })
              .filter(Boolean)
              .join("\n")}\n}\n`
          )
          .join("\n"),
      }}
    />
  );
};

// --------------------------
// Tooltip & Legend types
// --------------------------
type TooltipPayloadItem = {
  dataKey?: string | number;
  name?: string;
  value?: string | number | null;
  payload?: Record<string, unknown>;
  color?: string;
  fill?: string;
};

type LegendItem = {
  value?: string | number | null;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
  fill?: string;
};

// Helper: convert any value to ReactElement safely
function toElement(value: React.ReactNode): React.ReactElement {
  return <>{value ?? ""}</>;
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent(props: {
  active?: boolean;
  payload?: TooltipPayloadItem[] | null;
  label?: string | number | null;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { active, payload, label } = props;
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      {label != null && <div className="font-medium">{toElement(label)}</div>}

      <div className="grid gap-1.5">
        {payload.map((item, idx) => {
          const key =
            item?.dataKey !== undefined ? String(item.dataKey) : item.name ?? `value-${idx}`;
          const cfg = key in config ? config[key] : undefined;

          const displayLabel =
            cfg && typeof cfg === "object" && "label" in cfg && cfg.label != null
              ? React.isValidElement(cfg.label)
                ? cfg.label
                : toElement(cfg.label)
              : toElement(item.name ?? key);

          const bgColor =
            typeof item.payload?.fill === "string"
              ? item.payload.fill
              : item.fill ?? item.color ?? undefined;

          return (
            <div
              key={`${item.dataKey ?? item.name ?? idx}`}
              className="flex w-full flex-wrap items-stretch gap-2 items-center"
            >
              <div
                className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                style={{ backgroundColor: bgColor }}
                aria-hidden
              />
              <div className="flex flex-1 justify-between leading-none items-center">
                <div className="grid gap-1.5">{displayLabel}</div>
                {item.value != null && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {typeof item.value === "number" ? item.value.toLocaleString() : toElement(item.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent(props: {
  payload?: LegendItem[] | null;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { payload } = props;
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      {payload.map((item, idx) => {
        const key = item?.dataKey !== undefined
          ? String(item.dataKey)
          : item.value != null
          ? String(item.value)
          : `item-${idx}`;
        const cfg = key in config ? config[key] : undefined;

        const displayLabel =
          cfg && typeof cfg === "object" && "label" in cfg && cfg.label != null
            ? React.isValidElement(cfg.label)
              ? cfg.label
              : toElement(cfg.label)
            : toElement(item.value ?? key);

        const bgColor = item.fill ?? item.color ?? undefined;

        return (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: bgColor }}
              aria-hidden
            />
            {displayLabel}
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent
};
