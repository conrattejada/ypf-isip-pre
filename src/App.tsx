// @typescript-eslint/no-explicit-any
import { AppContainer, AppHeader } from '@corva/ui/componentsV2';
import { useAppCommons } from '@corva/ui/effects';

import styles from './App.module.css';
import Crossplot from './section/Crossplot';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWellsData from './effects/useWellsData';
import IsipGraph from './section/IsipGraph';
import IsipVsTopGraphDots from './section/IsipVsTopGraphDots';
import { DEFAULT_SETTINGS } from './constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetFilters, useGetPropsInfo } from './shared/hooks';
import { AppStoreProvider, useAppStore } from './shared/context';
import { AppProps, CustomSettings } from './shared/models';
import Filters from './section/filters';
import { LoadingIndicator } from '@corva/ui/components';

type AnyRecord = Record<string, any>;

type StageData = {
  stage_number?: number;
  isip_post?: number;
  isip_pre?: number;
  tvd?: number;
  top_perforation?: number;
  bottom_perforation?: number;
  [key: string]: any;
};

type CpItem = {
  well: { name?: string; asset_id?: number | string; id: string };
  stages: Record<string, StageData>;
};

type DatasetConfig = {
  dataset: string;
  query: AnyRecord;
  result: Record<string, string>;
};


function AppContent({ appHeaderProps, app, onSettingChange }: AppProps): JSX.Element {
  const settings = app.settings
  const { customSettings } = settings;
  const changeSettings = useCallback((s: Partial<CustomSettings>) => {
    onSettingChange('customSettings', s);
  }, []);
  const refGraph = useRef(null)
  const { wells } = useGetFilters();
  const { wellId, padId } = useAppStore('filters')
  const setStagesList = useAppStore('setStagesList')
  const stages = useAppStore('stages')

  const { appKey } = useAppCommons();
  const [refresh, setRefresh] = useState<boolean>(true);
  // NOTE: On general type dashboard app receives wells array
  // on asset type dashboard app receives well object
  const showPJR = useAppStore('showPJR');
  const [paletteColor, setPaletteColor] = useState<string[]>(settings.paletteColors || DEFAULT_SETTINGS.paletteColors);
  const setSeriesNumber = (e: number) => {
    setPaletteColor((prev) => {
      let updated = [...prev];

      if (updated.length > e) {
        updated = updated.slice(0, e);
      } else if (updated.length < e) {
        const diff = e - updated.length;
        const defaultPallet = settings.paletteColors || DEFAULT_SETTINGS.paletteColors;

        const extraColors = Array.from({ length: diff }, (_, i) => {
          const index = updated.length + i;
          return defaultPallet[index % defaultPallet.length];
        });

        updated = [...updated, ...extraColors];
      }

      return updated;
    });
  };


  useEffect(() => {
    if (!settings?.graph) {
      (Object.keys(DEFAULT_SETTINGS) as Array<keyof typeof DEFAULT_SETTINGS>).forEach((param) => {
        if (settings?.[param] === undefined) {
          changeSettings({ [param]: DEFAULT_SETTINGS[param] });
        }
      });
    }
  }, [changeSettings, settings])
  const [cpData, setCpData] = useState<CpItem[]>([])

  const [cpDataFiltered, setCpDataFiltered] = useState<CpItem[] | undefined>(undefined)
  const [size, setSize] = useState<number>(0)

  const predictionStd: Record<string, string> = {
    stage_number: "stage_number",
    isip_post: "data.isip.wellhead_pressure",
    tvd: "data.mid_tvd"
  }

  const actualStagesStd: Record<string, string> = {
    stage_number: "data.stage_number",
    isip_post: "data.end_isip",
    top_perforation: "data.top_perforation",
    bottom_perforation: "data.bottom_perforation",
  }

  const ypfIsipStd: Record<string, string> = {
    stage_number: "data.stage_number",
    isip_pre: "data.corva_isip"
  }

  const datasetList: DatasetConfig[] = [
    { dataset: "corva#completion.data.actual-stages", query: {}, result: actualStagesStd },
    { dataset: "corva#completion.predictions", query: {}, result: predictionStd },
    { dataset: "ypf#dc-isip-events", query: { 'metadata.invalid': { $ne: true } }, result: ypfIsipStd }]
  const { wellsData, loading } = useWellsData({ wellList: wells, datasetList: datasetList })
  function getValueFromPath(obj: AnyRecord, path: string) {
    if (path.includes(".")) {
      return path.split('.').reduce((acc, key) => {
        if (Array.isArray(acc)) {
          acc = acc[acc.length - 1];
        }
        return acc?.[key];
      }, obj);
    } else {
      return obj?.[path]
    }
  }

  useEffect(() => {

    if (wellsData) {

      const newCpData: CpItem[] = [];
      Object.keys(wellsData).forEach((wellId) => {
        if (!wells.some(w => String(w.asset_id) === wellId)) return
        const stagesAux: Record<string, StageData> = {};
        datasetList.forEach(({ dataset, result }) => {
          const data = wellsData[wellId]?.[dataset];
          if (!data) return;
          data.forEach((item) => {
            const stageNumberPath = result.stage_number;
            const stageNumberRaw = getValueFromPath(item, stageNumberPath);
            const stageNumberValue = Number(stageNumberRaw);

            if (!stageNumberRaw || Number.isNaN(stageNumberValue)) return;

            const stageKey = String(stageNumberValue);
            if (!stagesAux[stageKey]) stagesAux[stageKey] = {};

            const parsed: StageData = {};
            for (const [key, path] of Object.entries(result)) {
              parsed[key] = getValueFromPath(item, path);
            }
            parsed.stage_number = stageNumberValue;

            if (dataset === "corva#completion.data.actual-stages" && !showPJR) {
              delete parsed.isip_post
            }
            if (dataset === "corva#completion.predictions" && showPJR) {
              delete parsed.isip_post
            }
            const existingStage = stagesAux?.[stageKey];
            if (Object.keys(existingStage).length < 1 || existingStage.stage_number === parsed.stage_number) {
              stagesAux[stageKey] = { ...existingStage, ...parsed };
            } else {
              console.log("stages_numbers doesn't match")
            }
          });
        });
        const wellInfo = wells?.find((w) => String(w?.asset_id) === String(wellId));
        const wellIdentifier = wellInfo?.value?.toString?.() ?? String(wellId);
        newCpData.push({ well: { name: wellInfo?.label, asset_id: wellInfo?.asset_id, id: wellIdentifier }, stages: stagesAux });
      });

      const stagesSet: { [value: number]: { value: number, label: string } } = {};
      newCpData.map((dataStage) => {
        Object.keys(dataStage.stages).forEach((n) => {
          const stageNum = Number(n);
          if (!Number.isNaN(stageNum)) {
            // Add only if not present
            if (!stagesSet[stageNum]) {
              stagesSet[stageNum] = { value: stageNum, label: `Stage ${stageNum}` };
            }
          }
        });
      })

      const stagesList = Object.values(stagesSet);
      setStagesList(stagesList);
      setCpData(newCpData)
    }
  }, [wellsData, showPJR, wells]);

  useEffect(() => {
    if (padId) {
      const selectedAssets = wellId ? [wellId] : wells.map(w => w.value);

      const filtered: CpItem[] = cpData
        .filter(item => selectedAssets?.includes(Number(item?.well?.id)))
        .map(item => {
          let stagesFiltered = { ...item.stages };
          if (stages && stages.length > 0) {
            stagesFiltered = Object.fromEntries(
              Object.entries(stagesFiltered).filter(([stageNum]) => stages.includes(Number(stageNum)))
            );
          }
          return {
            ...item,
            stages: stagesFiltered
          };
        });

      setCpDataFiltered(filtered);
    } else {
      setCpDataFiltered(undefined);
    }
    setRefresh(false);
  }, [stages, cpData, padId, wellId, wells]);
  const headerProps = useMemo(
    () => ({
      app: {
        app: { ...appHeaderProps?.app?.app },
        package: { ...appHeaderProps?.app?.package },
      },
    }),
    [appHeaderProps]
  );
  useEffect(() => {
    const widthAux = refGraph?.current?.getBoundingClientRect().width
    const heightAux = refGraph?.current?.getBoundingClientRect().height
    const minSize = Math.min(widthAux, heightAux)

    if (minSize !== size) {
      setSize(minSize)

    }
  }, [refGraph.current])
  return (
    <AppContainer testId={appKey}>
      <AppHeader {...headerProps} />
      <div className={styles.containerWithFilter}>
        <Filters />
        <div className={styles.container} ref={refGraph}>
          {loading ? <LoadingIndicator />: customSettings?.graph === "Crossplot"
            ? <Crossplot size={size} data={cpData} refresh={refresh} dataFiltered={cpDataFiltered} config={settings} paletteColor={paletteColor} setSeriesNumber={setSeriesNumber} />
            : customSettings?.graph === "Isip" ? <IsipGraph size={size} config={settings} data={cpDataFiltered} wellId={wellId} paletteColor={paletteColor} setSeriesNumber={setSeriesNumber} />
              : customSettings?.graph === "Isip_dots" ? <IsipVsTopGraphDots size={size} config={settings} data={cpDataFiltered} well={settings?.padSelected?.selectedAssets} paletteColor={paletteColor} setSeriesNumber={setSeriesNumber} /> : null}
        </div></div>
    </AppContainer >
  );
}


function App(props: AppProps): JSX.Element {
  const queryClient = new QueryClient();
  const propsInfo = useGetPropsInfo(props);
  return (
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider
        propsInfo={propsInfo}
        settings={props.appHeaderProps.app.settings}
        onSettingChange={props.onSettingChange}
      >
        <AppContent {...props} />
      </AppStoreProvider>

    </QueryClientProvider>
  );
}

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;


