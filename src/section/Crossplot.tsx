import Highcharts, { Chart as HighchartsChart, ChartOptions, Options, SVGElement } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import styles from './Crossplot.module.css';
import { useAppStore } from '@/shared/context';

type Stage = {
    stage_number?: number;
    isip_post?: number;
    isip_pre?: number;
    tvd?: number;
    top_perforation?: number;
    bottom_perforation?: number;
    [key: string]: any;
};

type CpSeries = {
    well: { name?: string };
    stages: Record<string, Stage>;
};

type CrossplotProps = {
    data?: CpSeries[];
    dataFiltered?: CpSeries[];
    config?: Record<string, any>;
    paletteColor: string[];
    setSeriesNumber: (count: number) => void;
    refresh?: boolean;
    size?: number,
};

export default function Crossplot({ data = [], dataFiltered, paletteColor, size }: CrossplotProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<any>(null);
    const top_perforation = useAppStore('top_perforation');
    const bottom_perforation = useAppStore('bottom_perforation');
    const [options, setOptions] = useState<Options | undefined>();
    const [series, setSeries] = useState<Highcharts.SeriesOptionsType[]>([]);
    const [midValue, setMidValue] = useState<number>(1);
    const [delta, setDelta] = useState<number>(1);
    /*const serieMock: Highcharts.PointMarkerOptionsObject[] = [
        { symbol: 'square', radius: 4, fillColor: '#6464FF80', lineColor: '#6464FF', lineWidth: 1 },
        { symbol: 'triangle', radius: 4, fillColor: '#FFCC0080', lineColor: '#FFCC00', lineWidth: 1 },
        { symbol: 'circle', radius: 4, fillColor: '#00CC6680', lineColor: '#00CC66', lineWidth: 1 },
        { symbol: 'diamond', radius: 4, fillColor: '#FF668080', lineColor: '#FF6680', lineWidth: 1 },
        { symbol: 'triangle-down', radius: 4, fillColor: '#FF990080', lineColor: '#FF9900', lineWidth: 1 },
        { symbol: 'triangle-left', radius: 4, fillColor: '#0099FF80', lineColor: '#0099FF', lineWidth: 1 },
        { symbol: 'triangle-right', radius: 4, fillColor: '#9900FF80', lineColor: '#9900FF', lineWidth: 1 },
        { symbol: 'rect', radius: 4, fillColor: '#00CCCC80', lineColor: '#00CCCC', lineWidth: 1 },
    ];*/



    const handleOptions = (seriesData: Highcharts.SeriesOptionsType[]): Options => ({
        chart: {
            ...({
                zoomType: 'xy',
            } as ChartOptions),
            type: 'scatter',
            backgroundColor: 'var(--palette-background-b-4)',
            plotBackgroundColor: 'var(--palette-background-b-3)',
            marginLeft: 70,
            marginRight: 50,
            marginBottom: 100,
            width: size,
            height: size,
            spacing: [10, 10, 10, 10],
            resetZoomButton: {
                position: { align: 'right', verticalAlign: 'top', x: 0, y: 0 }
            },
            events: {
                redraw: function () {
                    const chart = this as HighchartsChart & { customDiagonal?: SVGElement };
                    if (chart.customDiagonal) chart.customDiagonal.destroy();

                    const xAxis = chart.xAxis[0];
                    const yAxis = chart.yAxis[0];

                    const start = Math.max(xAxis.min ?? 0, yAxis.min ?? 0);
                    const end = Math.min(xAxis.max ?? 0, yAxis.max ?? 0);

                    const x1 = xAxis.toPixels(start, false);
                    const y1 = yAxis.toPixels(start, false);
                    const x2 = xAxis.toPixels(end, false);
                    const y2 = yAxis.toPixels(end, false);

                    const diagonal = (chart.renderer as any)
                        .path(["M", x1, y1, "L", x2, y2])
                        .attr({
                            stroke: "red",
                            "stroke-width": 2,
                            "stroke-dasharray": "5,5",
                            zIndex: 5
                        })
                        .add();
                    (chart as any).customDiagonal = diagonal;
                }
            }
        },
        xAxis: {
            title: {
                text: 'ISIP PRE(psi/ft)',
                style: { color: 'var(--palette-primary-text-7)' }
            },
            min: midValue - delta,
            max: midValue + delta,
            tickInterval: midValue / 5,
            gridLineColor: 'var(--palette-background-b-8)',
            lineColor: 'var(--palette-background-b-8)',
            labels: { style: { color: 'var(--palette-primary-text-7)' } },
            tickLength: 0,
            gridLineWidth: 1
        },
        yAxis: {
            title: {
                text: 'ISIP POST(psi/ft)',
                style: { color: 'var(--palette-primary-text-7)' }
            },
            min: midValue - delta,
            max: midValue + delta,
            tickInterval: midValue / 5,
            gridLineColor: 'var(--palette-background-b-8)',
            lineColor: 'var(--palette-background-b-8)',
            labels: { style: { color: 'var(--palette-primary-text-7)' } },
            gridLineWidth: 1
        },
        legend: {
            itemStyle: { color: 'var(--palette-primary-text-7)' }
        },
        tooltip: {
            formatter: function () {
                return `
                    <b>Well: ${this.series.name}</b><br/>
                    Stage Number: ${(this.point as any)?.stage_number}<br/>
                    ISIP POST (psi/ft): ${this.y}<br/>
                    ISIP PRE (psi/ft): ${this.x}
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
        series: seriesData,
        credits: { enabled: false }
    });

    useEffect(() => {
        if (!data?.length) return;
        const dataToUse = (dataFiltered && dataFiltered.length > 0 ? dataFiltered : data) ?? [];
        let maxAxieValue: number | undefined = undefined;
        let minAxieValue: number | undefined = undefined;
        const seriesBuild = dataToUse.map((serie, key) => {
            const serieData = Object.keys(serie.stages).map((stg) => {
                const d = serie.stages[stg];
                if (
                    d.isip_post === null ||
                    d.isip_pre === null ||
                    d.tvd === null
                ) {
                    return null;
                }
                const y = (d.isip_post + (0.433 * d.tvd)) / d.tvd;
                const x = (d.isip_pre + (0.433 * d.tvd)) / d.tvd;
                if (Number.isNaN(x) || Number.isNaN(y)) return null;

                const withinTop =
                    !top_perforation ||
                    (d.top_perforation !== null && (top_perforation * 3.28084) < d.top_perforation);
                const withinBottom =
                    !bottom_perforation ||
                    (d.bottom_perforation !== null && (bottom_perforation * 3.28084) > d.bottom_perforation);

                const show = withinTop && withinBottom;
                if (show) {
                    maxAxieValue = maxAxieValue !== undefined ? Math.max(x, y, maxAxieValue) : Math.max(x, y);
                    minAxieValue = minAxieValue !== undefined ? Math.min(x, y, minAxieValue) : Math.min(x, y);
                }
                return show
                    ? { x: +x.toFixed(3), y: +y.toFixed(3), stage_number: d?.stage_number }
                    : null;
            }).filter(Boolean) as Array<{ x: number; y: number; stage_number?: number }>;
            if (paletteColor[key]) {
                // serieMock[key].fillColor = `${paletteColor[key]}80`;
                //serieMock[key].lineColor = `${paletteColor[key]}`;
            }
            return {
                type: 'scatter',
                name: serie.well.name,
                data: serieData,
                enableMouseTracking: true,
                // marker: serieMock[key]
            } as Highcharts.SeriesScatterOptions;
        });
        if (maxAxieValue !== undefined && minAxieValue !== undefined) {
            const midle = (Math.ceil(((maxAxieValue + minAxieValue) / 2) * 10) / 10)
            if (maxAxieValue - midle > midle - minAxieValue) {
                setDelta(0.1 + (Math.ceil(((maxAxieValue - midle)) * 10)) / 10);
            } else {
                setDelta(0.1 + (Math.ceil(((midle - minAxieValue)) * 10)) / 10);
            }
            setMidValue(midle);
        }
        setSeries(seriesBuild as Highcharts.SeriesOptionsType[]);
    }, [data, dataFiltered, top_perforation, bottom_perforation, paletteColor, size]);
    useEffect(() => {
        if (series.length > 0) {
            setOptions(handleOptions(series));
        }
    }, [series, midValue, delta]);
    /*
        useEffect(() => {
            if (options && chartRef.current && width && height) {
                chartRef.current.chart.setSize(width - (Number(isOpen) * 200), height, false);
    
            }
        }, [width, height, isOpen, chartRef.current?.chart]);
    
        useEffect(() => {
            if (chartRef.current?.chart && width && height && options?.series) {
                setTimeout(() => {
                    chartRef.current?.chart.setSize(width - (Number(isOpen) * 200), height, 0);
                }, 500);
            }
            if (options?.series && paletteColor.length !== options.series.length) {
                setSeriesNumber(options.series.length);
            }
        }, [options, width, height, isOpen, paletteColor, setSeriesNumber]); 
        console.log(chartRef.current?.chart.setSize)*/
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


