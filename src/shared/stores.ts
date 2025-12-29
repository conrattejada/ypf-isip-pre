import create from 'zustand';

import { MasterFracRecord } from '@/shared/models';

type SelectionStore = {
  selectedRecords: string[];
  toggleRecord: (id: string) => void;
  updateRecords: (ids: string[]) => void;
  clearRecords: () => void;
};

export const useSelectionStore = create<SelectionStore>(set => ({
  selectedRecords: [],

  toggleRecord: (id: string) =>
    set(state => ({
      selectedRecords: state.selectedRecords.includes(id)
        ? state.selectedRecords.filter(r => r !== id)
        : [...state.selectedRecords, id],
    })),
  updateRecords: (ids: string[]) => set(() => ({ selectedRecords: ids })),
  clearRecords: () => set(() => ({ selectedRecords: [] })),
}));

type RecordStore = {
  records: MasterFracRecord[];
  isLoading: boolean;
  setRecords: (records: MasterFracRecord[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  refetchRecords?: () => void;
  setRefetchRecords: (fn: () => void) => void;
};

export const useRecordStore = create<RecordStore>(set => ({
  records: [],
  refetchRecords: undefined,
  isLoading: false,
  setRecords: (records: MasterFracRecord[]) => set(() => ({ records })),
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  setRefetchRecords: (refetchRecords: () => void) => set(() => ({ refetchRecords })),
}));

type UnitStore = {
  units: Record<string, any>;
  setUnits: (units: Record<string, any>) => void;
};

export const useUnitStore = create<UnitStore>(set => ({
  units: {},
  setUnits: (units: Record<string, any>) => set(() => ({ units })),
}));
