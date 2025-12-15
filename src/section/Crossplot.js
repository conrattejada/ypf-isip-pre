import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import styles from './Crossplot.css';

function useContainerSize(ref) {
    const [size, setSize] = useState({ width: 400, height: 400 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);

    return size;
}

export default function Crossplot({ data, config, dataFiltered, isOpen, paletteColor, setSeriesNumber }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const { width, height } = useContainerSize(containerRef);
    const [options, setOptions] = useState();
    const [series, setSeries] = useState([]);
    const [maxValue, setMaxValue] = useState(2);
    const serieMock = [
        { symbol: 'square', radius: 4, fillColor: '#6464FF80', lineColor: '#6464FF', lineWidth: 1 },
        { symbol: 'triangle', radius: 4, fillColor: '#FFCC0080', lineColor: '#FFCC00', lineWidth: 1 },
        { symbol: 'circle', radius: 4, fillColor: '#00CC6680', lineColor: '#00CC66', lineWidth: 1 },
        { symbol: 'diamond', radius: 4, fillColor: '#FF668080', lineColor: '#FF6680', lineWidth: 1 },
        { symbol: 'triangle-down', radius: 4, fillColor: '#FF990080', lineColor: '#FF9900', lineWidth: 1 },
        { symbol: 'triangle-left', radius: 4, fillColor: '#0099FF80', lineColor: '#0099FF', lineWidth: 1 },
        { symbol: 'triangle-right', radius: 4, fillColor: '#9900FF80', lineColor: '#9900FF', lineWidth: 1 },
        { symbol: 'rect', radius: 4, fillColor: '#00CCCC80', lineColor: '#00CCCC', lineWidth: 1 },
    ];



    const handleOptions = (seriesData) => ({
        chart: {
            zoomType: 'xy',
            type: 'scatter',
            backgroundColor: 'var(--palette-background-b-4)',
            plotBackgroundColor: 'var(--palette-background-b-3)',
            marginLeft: 70,
            marginRight: 50,
            marginBottom: 100,
            spacing: [10, 10, 10, 10],
            resetZoomButton: {
                position: { align: 'right', verticalAlign: 'top', x: 0, y: 0 }
            },
            events: {
                redraw: function () {
                    const chart = this;
                    if (chart.customDiagonal) chart.customDiagonal.destroy();

                    const xAxis = chart.xAxis[0];
                    const yAxis = chart.yAxis[0];

                    const start = Math.max(xAxis.min, yAxis.min);
                    const end = Math.min(xAxis.max, yAxis.max);

                    const x1 = xAxis.toPixels(start);
                    const y1 = yAxis.toPixels(start);
                    const x2 = xAxis.toPixels(end);
                    const y2 = yAxis.toPixels(end);

                    chart.customDiagonal = chart.renderer
                        .path(["M", x1, y1, "L", x2, y2])
                        .attr({
                            stroke: "red",
                            "stroke-width": 2,
                            "stroke-dasharray": "5,5",
                            zIndex: 5
                        })
                        .add();
                }
            }
        },
        xAxis: {
            title: {
                text: 'ISIP PRE(psi/ft)',
                style: { color: 'var(--palette-primary-text-7)' }
            },
            min: 0,
            max: maxValue,
            tickInterval: maxValue / 5,
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
            min: 0,
            max: maxValue,
            tickInterval: maxValue / 5,
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
                    Stage Number: ${this?.point?.stage_number}<br/>
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
        title: { text: null },
        series: seriesData,
        credits: { enabled: false }
    });

    useEffect(() => {
        if (!data?.length) return;
        const dataToUse = dataFiltered?.length > 0 ? dataFiltered : data;
        let maxAxieValue = 2;
        const seriesBuild = dataToUse.map((serie, key) => {
            const serieData = Object.keys(serie.stages).map((stg) => {
                const d = serie.stages[stg];
                const y = (d.isip_post + (0.433 * d.tvd)) / d.tvd;
                const x = (d.isip_pre + (0.433 * d.tvd)) / d.tvd;
                if (Number.isNaN(x) || Number.isNaN(y)) return null;

                const show =
                    (!config?.top_perforation || (config.top_perforation * 3.28084) < d.top_perforation) &&
                    (!config?.bottom_perforation || (config.bottom_perforation * 3.28084) > d.bottom_perforation);
                if (show) {
                    maxAxieValue = Math.max(x, y, maxAxieValue);
                }
                return show
                    ? { x: +x.toFixed(3), y: +y.toFixed(3), stage_number: d?.stage_number }
                    : null;
            }).filter(Boolean);
            if (paletteColor[key]) {
                serieMock[key].fillColor = `${paletteColor[key]}80`,
                    serieMock[key].lineColor = `${paletteColor[key]}`
            }
            return {
                name: serie.well.name,
                data: serieData,
                enabled: true,
                marker: serieMock[key]
            };
        });
        setMaxValue(maxAxieValue);
        setSeries(seriesBuild);
    }, [data, dataFiltered, config?.top_perforation, config?.bottom_perforation, paletteColor]);
    useEffect(() => {
        if (series.length > 0) {
            setOptions(handleOptions(series));
        }
    }, [series, maxValue]);

    useEffect(() => {
        if (options && chartRef.current && width && height) {
            chartRef.current.chart.setSize(width - (Number(isOpen) * 200), height, false);

        }
    }, [width, height, isOpen, chartRef.current?.chart]);

    useEffect(() => {
        if (chartRef.current && width && height) {
            setTimeout(() => {
                chartRef.current.chart.setSize(width - (Number(isOpen) * 200), height, false);
            }, 500);
        }
        if (paletteColor.length != options?.series?.length) {
            setSeriesNumber(options?.series?.length)
        }
    }, [options]);
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
