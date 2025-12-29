import Highcharts, { Options, SeriesColumnOptions, SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import styles from './Crossplot.module.css';

type IsipGraphProps = {
    data?: Array<{ well: { id: string }; stages: Record<string, any> }>;
    well?: Array<string | number>;
    paletteColor: string[];
    setSeriesNumber: (count: number) => void;
    config?: any;
    wellId?: number;
    size?: number;
};



export default function IsipGraph({ data = [], wellId, paletteColor, setSeriesNumber, size }: IsipGraphProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<any>(null);
    const defaultOptions = (limitAxis: any, dataLength: number): Options => ({
        chart: {
            ...({ zoomType: 'y' } as Highcharts.ChartOptions),
            backgroundColor: 'var(--palette-background-b-4)',
            plotBackgroundColor: 'var(--palette-background-b-3)',
            marginLeft: 70,
            width: size,
            height: size,
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
                    Stage Number: ${(this.point as any)?.stage_number}<br/>
                    Y: ${Number(this.y).toFixed(1)}<br/>
                    X: ${Number(this.x).toFixed(1)}
                `;
            }
        },
        plotOptions: {
            column: {
                grouping: false, // evita sobreposição de colunas
                pointPadding: 0.2, // padding entre as colunas
                groupPadding: 0.1, // padding entre grupos de colunas
                maxPointWidth: ((size as number) * 0.5) / dataLength, // largura máxima da coluna (responsivo)
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
        title: { text: undefined },
        credits: { enabled: false }
    });

    const [options, setOptions] = useState<Options | null>(null);

    useEffect(() => {
        const wellData = data?.[0];

        if (wellData) {
            const postData: SeriesColumnOptions['data'] = [];
            const preData: SeriesLineOptions['data'] = [];
            const promedioData: SeriesColumnOptions['data'] = [];
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

                    postData.push({ y: isip_post, x: top_perforation_m, stage_number } as any);
                    preData.push({ y: isip_pre, x: top_perforation_m, stage_number } as any);
                    promedioData.push({ y: delta, x: top_perforation_m, stage_number } as any);
                }
            });

            const limitAxis = {
                yAxies: [
                    { min: leftMin - 4000, max: leftMax + 1000 },
                    { min: rightMin - 50, max: rightMax + 200 }
                ]
            };
            const series: Highcharts.SeriesOptionsType[] = [
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
            setOptions({ ...defaultOptions({}, 0), series: [] });
        }
    }, [data, wellId]);


    useEffect(() => {
        if (options?.series && paletteColor.length !== options.series.length) {
            setSeriesNumber(options.series.length)
        }
    }, [options, paletteColor, setSeriesNumber]);
    return (
        <div ref={containerRef} className={styles.Crossplot}>
            {wellId && data?.length === 1 && options ? (
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


