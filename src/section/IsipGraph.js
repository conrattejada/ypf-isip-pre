import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Crossplot.css';

function useContainerSize(ref) {
    const [size, setSize] = useState({ width: null, height: null });

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

export default function IsipGraph({ data, isOpen, well, paletteColor, setSeriesNumber }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const { width, height } = useContainerSize(containerRef);
    const defaultOptions = (limitAxis, dataLength) => ({
        chart: {
            zoomType: 'y',
            backgroundColor: 'var(--palette-background-b-4)',
            plotBackgroundColor: 'var(--palette-background-b-3)',
            marginLeft: 70,
            marginRight: 100,
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
        yAxis: [
            {
                title: {
                    text: 'Pressure <span style="color: #B0B0B0">(psi)</span>',
                    style: { color: 'var(--palette-primary-text-1)' }
                },
                labels: {
                    style: { color: 'var(--palette-primary-text-7)' }
                },
                gridLineColor: 'var(--palette-background-b-8)',
                lineColor: 'var(--palette-background-b-8)',
                gridLineWidth: 1,
                alignTicks: true,
                ...limitAxis?.yAxies?.[0]
            },
            {
                title: {
                    text: 'Promedio de Presión neta <span style="color: #B0B0B0">(psi)</span>',
                    style: { color: 'var(--palette-primary-text-1)' }
                },
                labels: {
                    style: { color: 'var(--palette-primary-text-7)' }
                },
                gridLineColor: 'var(--palette-background-b-8)',
                lineColor: 'var(--palette-background-b-8)',
                gridLineWidth: 1,
                opposite: true,
                alignTicks: true,
                ...limitAxis?.yAxies?.[1]
            }
        ],
        legend: {
            itemStyle: { color: 'var(--palette-primary-text-7)' }
        },
        tooltip: {
            formatter: function () {
                return `
                    <b>${this.series.name}</b><br/>
                    Stage Number: ${this?.point?.stage_number}<br/>
                    Y: ${this.y.toFixed(1)}<br/>
                    X: ${this.x.toFixed(1)}
                `;
            }
        },
        plotOptions: {
            column: {
                grouping: false, // evita sobreposição de colunas
                pointPadding: 0.2, // padding entre as colunas
                groupPadding: 0.1, // padding entre grupos de colunas
                maxPointWidth: (width * 0.5) / dataLength, // largura máxima da coluna (responsivo)
                minPointLength: 2, // comprimento mínimo para visualização
                borderWidth: 1,
                borderRadius: 2,
                // A largura será automaticamente ajustada pelo Highcharts conforme o espaço disponível
            },
            scatter: {
                tooltip: {
                    pointFormat: 'ISIP POST (psi/ft): {point.x}, ISIP PRE (psi/ft): {point.y}'
                }
            }
        },
        title: { text: null },
        credits: { enabled: false }
    });

    const [options, setOptions] = useState(null);

    useEffect(() => {
        const wellData = data?.find((item) => item.well.id == well?.[0]?.toString());

        if (wellData) {
            let postData = [], preData = [], promedioData = [];
            let leftMin = Infinity, leftMax = -Infinity;
            let rightMin = Infinity, rightMax = -Infinity;

            Object.values(wellData.stages || {}).forEach(({ isip_pre, isip_post, tvd, top_perforation, stage_number }) => {
                if (isip_pre != null && isip_post != null && tvd != null && top_perforation != null) {
                    const top_perforation_m = top_perforation / 3.28084;
                    const delta = isip_post - isip_pre;

                    leftMax = Math.max(leftMax, isip_post, isip_pre);
                    leftMin = Math.min(leftMin, isip_post, isip_pre);
                    rightMax = Math.max(rightMax, delta);
                    rightMin = Math.min(rightMin, delta);

                    postData.push({ y: isip_post, x: top_perforation_m, stage_number });
                    preData.push({ y: isip_pre, x: top_perforation_m, stage_number });
                    promedioData.push({ y: delta, x: top_perforation_m, stage_number });
                }
            });

            const limitAxis = {
                yAxies: [
                    { min: leftMin - 4000, max: leftMax + 1000 },
                    { min: rightMin - 50, max: rightMax + 200 }
                ]
            };

            const series = [
                {
                    type: 'column',
                    name: 'Promedio de Presión neta',
                    data: promedioData,
                    color: '#8796C8',
                    yAxis: 1,
                    pointPlacement: 'between'
                },
                {
                    type: 'line',
                    name: 'ISIP PostFrac',
                    data: postData,
                    color: '#007bff',
                    yAxis: 0
                },
                {
                    type: 'line',
                    name: 'ISIP PreFrac',
                    data: preData,
                    color: '#28a745',
                    yAxis: 0
                }
            ];

            setOptions({ ...defaultOptions(limitAxis, promedioData.length), series });
        } else {
            setOptions({ ...defaultOptions({}), series: [] });
        }
    }, [data, well]);

    useLayoutEffect(() => {
        if (chartRef.current?.chart && width && height) {
            chartRef.current.chart.setSize(width - (Number(isOpen) * 200), height, false);
        }
    }, [width, height, isOpen, well]);

    useEffect(() => {
        if (chartRef.current?.chart && width && height) {
            setTimeout(() => {
                chartRef.current.chart.reflow();
            }, 300);
        }
        if (paletteColor.length != options?.series?.length){
            setSeriesNumber(options?.series?.length)
        }
    }, [options]);

    return (
        <div ref={containerRef} className={styles.Crossplot}>
            {well && options && width && height ? (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartRef}
                />
            ) : (
                <div className={styles.Crossplot}>
                    "Select a Well"
                </div>
            )}
        </div>
    );
}
