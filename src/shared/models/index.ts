import { TIME_PERIODS } from '@/shared/constants';

export type { FracFleet, Pad, Well, MasterFracRecord, FracData, FracMetadata } from './api';

export type TimePeriod = (typeof TIME_PERIODS)[number];

export type CustomSettings = {
  language?: string;
  fracFleetId?: number;
  padId?: number;
  wellId?: number;
  period?: TimePeriod;
  columns?: string[];
  showPJR?: boolean;
  graph?: string;
  stages?: number[];
  stagesList?:{ value: number, label: string }[] ;
  bottom_perforation?: number | undefined;
  top_perforation?: number | undefined;
};

export type AppProps = {
  appHeaderProps: {
    [key: string]: any;
    app: {
      [key: string]: any;
      settings: {
        [key: string]: any;
        customSettings: CustomSettings;
      };
    };
  };
  app: {
    settings: {
      customSettings: Partial<CustomSettings>;
      fracFleetId?: number;
      padId?: number;
    } & { [key: string]: any };
  } & { [key: string]: any };
  onSettingChange: (key: 'customSettings', value: any) => void;
} & { [key: string]: any };

export type AppSettingsProps = {
  settings: { [key: string]: any };
  app: { [key: string]: any };
  appData: { [key: string]: any };
  company: { [key: string]: any };
  onSettingChange: (key: string, value: any) => void;
  onSettingsChange: (value: { [key: string]: any }) => void;
  user: { [key: string]: any };
  layoutEnvironment: { [key: string]: any };
};

export type Column<T> = {
  field: string;
  name: string;
  size: number;
  inputType?: 'number' | 'text' | 'datetime-local';
  isPJR?: boolean;
  sticky?: 'left' | 'right' | undefined;
  getValue: (data: T) => number | string | string[] | undefined;
  formatValue: (data: T, options?: { [key: string]: any }) => JSX.Element | string | number;
  readOnly?: boolean;
};
