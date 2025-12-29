import Highcharts, { Options, SeriesScatterOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import styles from './Crossplot.module.css';

type Stage = { stage_number?: number; top_perforation?: number; [key: string]: any };
type SeriesItem = { well: { name?: string; id?: number | string }; stages: Record<string, Stage> };

type IsipVsTopGraphDotsProps = {
    data?: SeriesItem[];
    config?: Record<string, any>;
    paletteColor: string[];
    setSeriesNumber: (count: number) => void;
    size?: number,
};

export default function IsipVsTopGraphDots({
    data = [],
    config,
    paletteColor,
    setSeriesNumber,
    size
}: IsipVsTopGraphDotsProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<any>(null);

    const defaultOptions = ({
        yTitle,
        scale
    }: { yTitle?: string; scale?: Record<string, number | undefined> }): Options => ({
        chart: {
            ...( { zoomType: 'xy' } as Highcharts.ChartOptions),
            type: 'scatter',
            backgroundColor: 'var(--palette-background-b-4)',
            plotBackgroundColor: 'var(--palette-background-b-3)',
            width: size,
            height: size,
            marginLeft: 70,
            marginRight: 50,
            marginBottom: 100,
            spacing: [10, 10, 10, 10],
            resetZoomButton: {
                position: { align: 'right', verticalAlign: 'top', x: 0, y: 0 }
            }
        },
        xAxis: {
            title: {
                text: 'Tope <span style="color: #B0B0B0">(m)</span>',
                style: { color: 'var(--palette-primary-text-1)' },
                useHTML: true
            },
            labels: {
                style: { color: 'var(--palette-primary-text-7)' }
            },
            gridLineColor: 'var(--palette-background-b-8)',
            lineColor: 'var(--palette-background-b-8)',
            tickLength: 0,
            gridLineWidth: 1
        },
        yAxis: {
            title: {
                text: `${yTitle || "ISIP Post"} <span style="color: #B0B0B0">(psi)</span>`,
                style: { color: 'var(--palette-primary-text-1)' }
            },
            labels: {
                style: { color: 'var(--palette-primary-text-7)' }
            },
            gridLineColor: 'var(--palette-background-b-8)',
            lineColor: 'var(--palette-background-b-8)',
            gridLineWidth: 1,
            ...scale
        },
        legend: {
            itemStyle: { color: 'var(--palette-primary-text-7)' as string }
        },
        tooltip: {
            formatter: function () {
                return `
                    <b>${this.series.name}</b><br/>
                    Stage Number: ${(this.point as any)?.stage_number}<br/>
                    Y: ${Number(this.y).toFixed(1)}<br/>
                    X: ${Number(this.x).toFixed(1)}
                `;
            }
        },
        plotOptions: {
            scatter: {
                tooltip: {
                    pointFormat: 'ISIP POST (psi/ft): {point.x}, ISIP PRE (psi/ft): {point.y}'
                }
            }
        },
        title: { text: undefined },
        credits: { enabled: false }
    });

    const [options, setOptions] = useState<Options | null>(null);

    const titleOptions = {
        'isip_pre': 'ISIP PreFrac',
        'isip_post': 'ISIP Post'
    };

    // Use a separate effect for options and another for palette color update to avoid infinite rendering
    useEffect(() => {
        const dataType = config?.dataType;
        if (data && dataType) {
            const dataToUse = data;
            const series = dataToUse.map((item, index) => {
                const dataSeries: SeriesScatterOptions['data'] = [];

                Object.values(item?.stages || {})?.forEach(({ [dataType]: value, top_perforation, stage_number }) => {
                    if (value !== undefined && top_perforation !== undefined) {
                        const top_perforation_m = top_perforation / 3.28084;
                        dataSeries.push({ y: value as number, x: top_perforation_m, stage_number } as any);
                    }
                });
                return {
                    type: 'scatter',
                    name: item.well.name,
                    color: paletteColor[index],
                    data: dataSeries
                } as SeriesScatterOptions;
            });

            setOptions({
                ...defaultOptions({
                    yTitle: titleOptions[dataType as keyof typeof titleOptions],
                    scale: { min: config.min, max: config.max }
                }),
                series
            });

        } else {
            setOptions(null);
        }
        // Only run when data, well, config, and paletteColor change (not setSeriesNumber or isOpen)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, paletteColor, size, setOptions]);
    useEffect(() => {
        if (options?.series) {
            // Only call setSeriesNumber if the number of series differs
            if (paletteColor.length !== options.series.length) {
                setSeriesNumber(options.series.length);
            }
        }
        // Only run when options?.series or paletteColor.length changes, not on every "isOpen"
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options?.series, paletteColor.length, setSeriesNumber]);

    return (
        <div ref={containerRef} className={styles.Crossplot}>
            {options && (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartRef}
                />
            )}
        </div>
    );
}

