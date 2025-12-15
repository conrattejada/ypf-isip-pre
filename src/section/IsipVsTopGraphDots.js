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

export default function IsipVsTopGraphDots({ data, isOpen, well, config, paletteColor, setSeriesNumber }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const { width, height } = useContainerSize(containerRef);

    const defaultOptions = ({ yTitle, scale }) => ({
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

    const titleOptions = {
        'isip_pre': 'ISIP PreFrac',
        'isip_post': 'ISIP Post'
    };


    useEffect(() => {
        const dataType = config?.dataType;
        if (data && dataType) {
            let dataToUse = data;
            if (well?.length > 0) {
                dataToUse = dataToUse.filter(item => well.includes(Number(item.well.id)))
            }
            const series = dataToUse.map((item, index) => {
                const dataSeries = [];

                Object.values(item?.stages)?.forEach(({ [dataType]: value, top_perforation, stage_number }) => {
                    
                    if (value !== undefined && top_perforation !== undefined) {
                        const top_perforation_m = top_perforation / 3.28084;
                        
                        dataSeries.push({ y: value, x: top_perforation_m, stage_number });
                    }
                });

                return {
                    type: 'scatter',
                    name: item.well.name,
                    color: paletteColor[index],
                    data: dataSeries
                };
            });

            setOptions({ ...defaultOptions({ yTitle: titleOptions[dataType], scale: { min: config.min, max: config.max } }), series });
        }
    }, [data, config, well]);

    useLayoutEffect(() => {
        if (chartRef.current?.chart && width && height) {
            chartRef.current.chart.setSize(width - (Number(isOpen) * 100), height, false);
        }
    }, [width, height, isOpen]);

    // Extra fallback (opcional): reflow após options atualizados
    useEffect(() => {
        if (chartRef.current?.chart && width && height) {
            setTimeout(() => {
                chartRef.current.chart.reflow();
            }, 300);
        }
        if (paletteColor.length != options?.series?.length) {
            setSeriesNumber(options?.series?.length)
        }

    }, [options]);

    return (
        <div ref={containerRef} className={styles.Crossplot}>
            {options && width && height && (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartRef}
                />
            )}
        </div>
    );
}
