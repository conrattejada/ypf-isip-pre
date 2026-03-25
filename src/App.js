import { AppContainer, AppHeader } from '@corva/ui/componentsV2';
import { useAppCommons } from '@corva/ui/effects';
import { AppFilterPanelLayout, ColorPicker } from '@corva/ui/components';
import { CenterAlignmentIcon } from '@corva/ui/icons';

import styles from './App.css';
import Crossplot from './section/Crossplot';
import { useEffect, useState } from 'react';
import useWellsData from './effects/useWellsData';
import FilterBar from './components/filterBar/FilterBar';
import IsipGraph from './section/IsipGraph';
import IsipVsTopGraphDots from './section/IsipVsTopGraphDots';
import { DEFAULT_SETTINGS } from './constants';

/**
 * @param {Object} props
 * @param {boolean} props.isExampleCheckboxChecked
 * @param {Object} props.fracFleet
 * @param {Object} props.well
 * @param {Object[]} props.wells
 * @returns
 */
function App({ settingsByAsset, wells, padId, fracFleet, app: { settings }, onSettingChange, ...props }) {
  const { appKey } = useAppCommons();
  const [refresh, setRefresh] = useState(true)
  // NOTE: On general type dashboard app receives wells array
  // on asset type dashboard app receives well object
  const [source, setSource] = useState("Corva")
  const [paletteColor, setPaletteColor] = useState(settings.paletteColors || DEFAULT_SETTINGS.paletteColors)
  const setSeriesNumber = (e) => {
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


  const setConfig = (param, value) => {
    onSettingChange(param, value)
  }

  useEffect(() => {

    if (!settings?.graph) {
      Object.keys(DEFAULT_SETTINGS).forEach((param) => {
        if (!settings?.[param]) {
          onSettingChange(param, DEFAULT_SETTINGS[param])
        }
      })
    }
  }, [])
  const [wellList, setWellList] = useState(undefined)
  const [cpData, setCpData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [stages, setStages] = useState({})
  const [cpDataFiltered, setCpDataFiltered] = useState(undefined)
  const predictionStd = {
    stage_number: "stage_number",
    isip_post: "data.isip.wellhead_pressure",
    tvd: "data.mid_tvd"
  }

  const actualStagesStd = {
    stage_number: "data.stage_number",
    isip_post: "data.end_isip",
    top_perforation: "data.top_perforation",
    bottom_perforation: "data.bottom_perforation",
  }

  const ypfIsipStd = {
    stage_number: "data.stage_number",
    isip_pre: "data.corva_isip"
  }

  const datasetList = [
    { dataset: "corva#completion.data.actual-stages", query: {}, result: actualStagesStd },
    { dataset: "corva#completion.predictions", query: {}, result: predictionStd },
    { dataset: "ypf#dc-isip-events", query: { 'metadata.invalid': { $ne: true } }, result: ypfIsipStd }]

  const { loading, wellsData } = useWellsData({ wellList: wellList, datasetList: datasetList, padMode: settings?.padSelected?.mode })
  useEffect(() => {
    setWellList(wells)
  }, [wells])
  useEffect(() => {
    const padUsed = padId || fracFleet?.current_pad_id
    if (settingsByAsset?.[`pad--${padUsed}`] && settingsByAsset?.[`pad--${padUsed}`] != settings.padSelected) {
      if (settingsByAsset?.[`pad--${padUsed}`]?.mode == settings?.padSelected?.mode && settings?.padSelected?.mode == "pad") {

      } else {
        if (settings?.padSelected?.selectedAssets?.[0] != settingsByAsset?.[`pad--${padUsed}`]?.selectedAssets?.[0]) {
          setRefresh(true)
          setConfig("padSelected", settingsByAsset?.[`pad--${padUsed}`])
        }
      }
    }
  }, [settingsByAsset, fracFleet?.current_pad_id, padId])

  function getValueFromPath(obj, path) {
    if (path.includes(".")) {
      return path.split('.').reduce((acc, key) => {
        if (Array.isArray(acc)) {
          acc = acc[acc.length -1];
        }
        return acc?.[key];
      }, obj);
    } else {
      return obj[path]
    }
  }

  function readyForRender(wList, dList, data) {
    let ready = Object.keys(wList).length == Object.keys(data).length
    if (ready) {
      Object.keys(data).map((param) => {
        if (Object.keys(data[param]).length != dList.length) {
          ready = false
        }
      })
    }
    return ready
  }
  useEffect(() => {
    if (wellsData && readyForRender(wellList, datasetList, wellsData)) {

      let newCpData = [];

      Object.keys(wellsData).forEach((well) => {
        const stages = {};
        datasetList.forEach(({ dataset, result }) => {
          const data = wellsData[well][dataset];
          if (!data) return;
          data.forEach((item) => {
            // Extraímos o stage_number conforme o padrão
            const stageNumberPath = result.stage_number;
            const stageNumber = getValueFromPath(item, stageNumberPath);

            if (!stageNumber) return;

            // Inicializa se necessário
            if (!stages[stageNumber]) stages[stageNumber] = {};

            // Cria um objeto apenas com os dados transformados conforme o resultado padrão
            const parsed = {};
            for (const [key, path] of Object.entries(result)) {
              parsed[key] = getValueFromPath(item, path);
            }

            if (dataset == "corva#completion.data.actual-stages" && source == "Corva") {
              delete parsed.isip_post
            }
            if (dataset == "corva#completion.predictions" && source == "PJR") {
              delete parsed.isip_post
            }
            if ((stages?.[stageNumber] != undefined) || stages?.[stageNumber]?.stage_number == parsed.stage_number) {
              stages[stageNumber] = { ...stages?.[stageNumber], ...parsed };
            } else {
              console.log("stages_numbers doesn't match")
            }
          });
        });
        const wellInfo = wellList.find((w) => w?.asset_id == well)
        newCpData.push({ well: { name: wellInfo?.name, asset_id: wellInfo?.asset_id, id: wellInfo?.id }, stages });
      });

      setCpData(newCpData)
      // Aqui você pode usar setState ou fazer algo com newCpData
    }
  }, [wellsData, source]);

  useEffect(() => {
    if (settings?.padSelected?.selectedAssets?.length > 0) {
      let filtered = []
      cpData.map((item) => {
        if (settings?.padSelected?.selectedAssets?.includes(Number(item?.well?.id))) {
          filtered.push(item)
          setStages(item.stages)
        }
      })

      if (settings?.stages?.length > 0 && filtered?.[0]?.stages) {
        let filteredStages = {}
        Object.keys(filtered?.[0]?.stages).map((stage) => {
          if (settings?.stages.includes(filtered?.[0]?.stages[stage].stage_number)) {
            filteredStages[stage] = filtered?.[0]?.stages[stage]
          }
        })
        setCpDataFiltered([{ ...filtered[0], stages: filteredStages }])
      } else {
        setCpDataFiltered(filtered)
      }
    } else {
      setCpDataFiltered(undefined)
    }
    setRefresh(false)
  }, [settings?.stages, cpData, settings?.padSelected])
  return (
    <AppContainer header={<AppHeader />} testId={appKey}>
      <AppFilterPanelLayout
        sideBarProps={{
          isOpen,
          setIsOpen,
          header: "Sidebar",
          headerIcon: <CenterAlignmentIcon size={24} />
        }}
        appSettingsPopoverProps={{
          defaultScrollable: true,
          maxHeight: 480,
        }}
        sideBarContent={<FilterBar setConfig={setConfig} settings={settings} cpDataFiltered={cpDataFiltered} config={settings} stages={stages} setSource={setSource} source={source} setPaletteColor={setPaletteColor} paletteColor={paletteColor} />}
      > <div className={styles.container}>

          {settings?.graph == "Crossplot"
            ? <Crossplot isOpen={isOpen} data={cpData} refresh={refresh} dataFiltered={cpDataFiltered} config={settings} paletteColor={paletteColor} setSeriesNumber={setSeriesNumber} />
            : settings?.graph == "Isip" ? <IsipGraph isOpen={isOpen} config={settings} data={cpData} well={settings?.padSelected?.selectedAssets} paletteColor={paletteColor} setSeriesNumber={setSeriesNumber} />
              : settings?.graph == "Isip_dots" ? <IsipVsTopGraphDots isOpen={isOpen} config={settings} data={cpData} well={settings?.padSelected?.selectedAssets} paletteColor={paletteColor} setSeriesNumber={setSeriesNumber} /> : null}
        </div>
      </AppFilterPanelLayout>
    </AppContainer >
  );
}

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;
