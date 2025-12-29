/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import createStore, { StoreApi, UseBoundStore } from 'zustand';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import type { CustomSettings, TimePeriod } from '@/shared/models';
import { COLUMNS } from '@/shared/constants';

type AppStoreProps = {
  settings: {
    customSettings: Partial<CustomSettings>;
  };
  onSettingChange: (key: 'customSettings', value: Partial<CustomSettings>) => void;
  propsInfo: { wellId?: number; padId?: number; fracFleetId?: number; assetId?: number };
  children: ReactNode;
};

type Filters = {
  assetId?: number;
  fracFleetId?: number;
  currentPadId?: number;
  padId?: number;
  wellId?: number;
  period?: TimePeriod;
};

type AppStore = {
  filters: Filters;
  showPJR?: boolean;
  columns?: string[];
  graph?: string;
  stages?: number[];
  stagesList: { value: number, label: string}[] ;
  bottom_perforation?: number;
  top_perforation?: number;
  setStagesList: (valueArr: { value: number, label: string }[]) => void;
  setFilter: (key: keyof Filters, value: any) => void;
  setFilters: (value: Filters) => void;
  toggleShowPJR: () => void;
  toggleColumn: (field: string) => void;
  toggleGraph: (value: string) => void;
  toggleStages: (value: number[]) => void;
  toggleBottomPerforation: (value: number | undefined) => void;
  toggleTopPerforation: (value: number | undefined) => void;
};

const AppStoreContext = createContext(null);

export const AppStoreProvider = ({
  children,
  settings,
  propsInfo,
  onSettingChange,
}: AppStoreProps): JSX.Element => {
  const changeSettings = useCallback((s: Partial<CustomSettings>) => {
    onSettingChange('customSettings', s);
  }, []);

  const [store] = useState(() =>
    createStore<AppStore>(set => ({
      filters: {
        assetId: undefined,
        fracFleetId: settings?.customSettings?.fracFleetId || propsInfo?.fracFleetId,
        padId: settings?.customSettings?.padId || propsInfo?.padId,
        wellId: settings?.customSettings?.wellId || propsInfo?.wellId,
        period: settings?.customSettings?.period || '24h',
      },
      showPJR: settings?.customSettings?.showPJR,
      columns: settings?.customSettings?.columns || COLUMNS.map(c => c.field),
      graph: settings.customSettings?.graph || "Crossplot",
      stagesList: settings.customSettings?.stagesList || [],
      stages: settings.customSettings?.stages || [],
      bottom_perforation: settings.customSettings?.bottom_perforation,
      top_perforation: settings.customSettings?.top_perforation,


      setStagesList: (value: { value: number, label: string }[]) => set(state => ({ stagesList: value })),
      setFilter: (key: string, value: any) =>
        set(state => ({ filters: { ...state.filters, [key]: value } })),
      setFilters: (filters: Filters) => set(() => ({ filters })),
      toggleShowPJR: () => set(state => ({ showPJR: !state.showPJR })),
      toggleGraph: (value: string) => set(state => ({ graph: value })),
      toggleStages: (value: number[]) => set(state => ({ stages: value })),
      toggleBottomPerforation: (value: number | undefined) => set(state => ({ bottom_perforation: value })),
      toggleTopPerforation: (value: number | undefined) => set(state => ({ top_perforation: value })),
      toggleColumn: (field: string) =>
        set(state => ({
          columns: state.columns.includes(field)
            ? state.columns.filter(c => c !== field)
            : [...state.columns, field],
        })),
    }))
  );

  const fracFleetId = store(state => state.filters.fracFleetId);
  const padId = store(state => state.filters.padId);
  const wellId = store(state => state.filters.wellId);
  const period = store(state => state.filters.period);
  const showPJR = store(state => state.showPJR);
  const columns = store(state => state.columns);
  const graph = store(state => state.graph);
  const stages = store(state => state.stages);


  useEffect(() => {
    changeSettings({ fracFleetId, padId, wellId, period, showPJR, columns, graph, stages });
  }, [fracFleetId, padId, wellId, period, showPJR, columns, graph, stages]);

  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = <T extends keyof AppStore>(selector: T): AppStore[T] => {
  const store = useContext(AppStoreContext) as UseBoundStore<StoreApi<AppStore>>;

  if (!store) {
    throw new Error('Missing AppStoreProvider');
  }

  // @ts-ignore
  return store(state => state[selector]);
};
