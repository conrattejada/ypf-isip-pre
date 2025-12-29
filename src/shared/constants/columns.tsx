import { Tooltip } from '@corva/ui/components';
import { CautionIcon } from '@corva/ui/icons';
import { convertValue } from '@corva/ui/utils';
import { get, round, isNumber, capitalize, toUpper } from 'lodash';
import moment from 'moment';

import { DATETIMEINPUT_FORMAT, DATETIMEPICKER_FORMAT } from './values';
import { getColors } from './colors';

import { Column, MasterFracRecord } from '@/shared/models';

const COLORS = getColors();

const getFieldValue = (data: MasterFracRecord, fieldName: string): any => {
  const calculatedValue = get(data.data, fieldName);
  return get(data.metadata.user_changes, fieldName, calculatedValue);
};

export const COLUMNS: Column<MasterFracRecord>[] = [
  {
    name: 'table.columns.cia',
    field: 'data.compania_nombre',
    size: 1,
    inputType: 'text',
    getValue: data => getFieldValue(data, 'compania_nombre'),
    formatValue: data => getFieldValue(data, 'compania_nombre') || '',
  },
  {
    name: 'table.columns.set',
    field: 'data.set',
    size: 1,
    inputType: 'text',
    getValue: data => getFieldValue(data, 'set'),
    formatValue: data => getFieldValue(data, 'set') || '',
  },
  {
    name: 'table.columns.equipo',
    field: 'data.equipo',
    size: 1,
    inputType: 'text',
    getValue: data => getFieldValue(data, 'equipo'),
    formatValue: data => getFieldValue(data, 'equipo') || '',
  },
  {
    name: 'table.columns.pad',
    field: 'data.pad_nombre',
    size: 2,
    inputType: 'text',
    getValue: data => getFieldValue(data, 'pad_nombre'),
    formatValue: (data: MasterFracRecord): string => {
      const value = getFieldValue(data, 'pad_nombre');
      return value ? toUpper(value) : '';
    },
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.well',
    field: 'data.pozo_nombre',
    inputType: 'text',
    size: 3,
    getValue: (data: MasterFracRecord): string | number => {
      const value = getFieldValue(data, 'pozo_nombre');
      return (value as string)?.split('.')?.at(-1) || value;
    },
    formatValue: data =>
      data?.data?.pozo_nombre?.split('.')?.at(-1) || data?.data?.pozo_nombre || '',
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.stage',
    field: 'data.etapa_numero',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'etapa_numero'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'etapa_numero');
      return isNumber(value) ? round(value, 0) : '';
    },
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.tec',
    field: 'data.tech',
    size: 1,
    getValue: data => getFieldValue(data, 'tech'),
    formatValue: (data: MasterFracRecord): string => {
      const value = getFieldValue(data, 'tech');
      return (value as string[])?.join(', ');
    },
  },
  {
    name: 'table.columns.tope',
    field: 'data.tope',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tope'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tope');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.tope',
    field: 'data.pjr.tope',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.tope,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.tope;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.base',
    field: 'data.base',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'base'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'base');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.base',
    field: 'data.pjr.base',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.base,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.base;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.plug',
    field: 'data.tapon_prof',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tapon_prof'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tapon_prof');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.plug',
    field: 'data.pjr.tapon_prof',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.tapon_prof,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.tapon_prof;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.tipo_tapon',
    field: 'data.tipo_tapon',
    inputType: 'text',
    size: 1,
    getValue: data => getFieldValue(data, 'tipo_tapon'),
    formatValue: data => getFieldValue(data, 'tipo_tapon') || '',
  },
  {
    name: 'table.columns.marca_tapon',
    field: 'data.marca_tapon',
    inputType: 'text',
    size: 1,
    getValue: data => getFieldValue(data, 'marca_tapon'),
    formatValue: data => getFieldValue(data, 'marca_tapon') || '',
  },
  {
    name: 'table.columns.evento_tapon',
    field: 'data.evento_tapon',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'evento_tapon'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'evento_tapon');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.cluster',
    field: 'data.etapa_cluster',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'etapa_cluster'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'etapa_cluster');
      return isNumber(value) ? round(value, 0) : '';
    },
  },
  {
    name: 'table.columns.disparos',
    field: 'data.disparos',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'disparos'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'disparos');
      return isNumber(value) ? round(value, 0) : '';
    },
  },
  {
    name: 'table.columns.lde',
    field: 'data.lde',
    inputType: 'number',
    size: 1,
    getValue: (data: MasterFracRecord): number | undefined => {
      const tope = getFieldValue(data, 'tope');
      const base = getFieldValue(data, 'base');
      return isNumber(tope) && isNumber(base) ? round(Math.abs(tope - base) + 5, 2) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const tope = getFieldValue(data, 'tope');
      const base = getFieldValue(data, 'base');
      return isNumber(tope) && isNumber(base) ? round(Math.abs(tope - base) + 5, 2) : '';
    },
    readOnly: true,
  },
  {
    name: 'table.columns.rih_start',
    field: 'data.rih_inicio',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'rih_inicio');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'rih_inicio');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.plug_start',
    field: 'data.tapon_fija',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tapon_fija');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tapon_fija');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.pooh_end',
    field: 'data.pooh_fin',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'pooh_fin');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'pooh_fin');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.tee_wl_time',
    field: 'data.tee_wl_time',
    inputType: 'number',
    size: 2,
    getValue: data => getFieldValue(data, 'tee_wl_time'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tee_wl_time');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.wl_time',
    field: 'data.p_p_time',
    inputType: 'number',
    size: 2,
    getValue: data => getFieldValue(data, 'p_p_time'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'p_p_time');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.comentario_wl',
    field: 'data.comentario_wl',
    inputType: 'text',
    size: 1,
    getValue: data => getFieldValue(data, 'comentario_wl'),
    formatValue: data => getFieldValue(data, 'comentario_wl') || '',
  },
  {
    name: 'table.columns.frac_start',
    field: 'data.frac_inicio',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'frac_inicio');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'frac_inicio');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.frac_end',
    field: 'data.frac_fin',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'frac_fin');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'frac_fin');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.frac_time',
    field: 'data.frac_tiempo_total',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'frac_tiempo_total'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'frac_tiempo_total');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.stage_time',
    field: 'data.tee.total',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tee.total'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tee.total');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.stage_time_cia',
    field: 'data.tee.cia',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tee.cia'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tee.cia');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.stage_time_wireline',
    field: 'data.tee.wireline',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tee.wireline'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tee.wireline');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.stage_time_ypf',
    field: 'data.tee.ypf',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tee.ypf'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tee.ypf');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.stage_time_nogest',
    field: 'data.tee.nogest',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'tee.nogest'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'tee.nogest');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.tee_detail',
    field: 'data.detalle_tee',
    inputType: 'text',
    size: 1,
    getValue: data => getFieldValue(data, 'detalle_tee'),
    formatValue: data => getFieldValue(data, 'detalle_tee') || '',
  },
  {
    name: 'table.columns.isip_pre',
    field: 'data.isip_pre',
    inputType: 'number',
    size: 1,
    getValue: (data: MasterFracRecord): number => {
      const isipPre = getFieldValue(data, 'isip_pre');
      const invalidReason = getFieldValue(data, 'isip_pre_invalid_reason');
      return !invalidReason && isipPre ? isipPre : null;
    },
    formatValue: (
      data: MasterFracRecord,
      options: { forExcel: boolean } = { forExcel: false }
    ): string | number | JSX.Element => {
      const value = getFieldValue(data, 'isip_pre');
      const message = data.data.isip_pre_invalid_reason;

      if (value) {
        return isNumber(value) ? round(value, 2) : '';
      }

      if (options.forExcel) {
        return 'NCP';
      }

      return (
        <Tooltip title={message || 'NCP'} placement="top" aria-label={message}>
          <div>
            <CautionIcon size="small" style={{ color: COLORS.warningMain }} />
          </div>
        </Tooltip>
      );
    },
    readOnly: true,
  },
  {
    name: 'table.columns.isip_post',
    field: 'data.isip_post',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'isip_post'),
    formatValue: data => getFieldValue(data, 'isip_post') || '',
  },
  {
    name: 'table.columns.isip_post',
    field: 'data.pjr.isip_post',
    size: 1,
    getValue: data => data?.data?.pjr?.isip_post,
    formatValue: data => data?.data?.pjr?.isip_post || '',
    isPJR: true,
  },
  {
    name: 'table.columns.ramp_up_60_inicio',
    field: 'data.ramp_up_60_inicio',
    inputType: 'datetime-local',
    size: 2,
    getValue: (data: MasterFracRecord): string => {
      const value = getFieldValue(data, 'ramp_up_60_inicio');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): string => {
      const value = getFieldValue(data, 'ramp_up_60_inicio');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.ramp_up_as_inicio',
    field: 'data.ramp_up_as_inicio',
    inputType: 'datetime-local',
    size: 2,
    getValue: (data: MasterFracRecord): string => {
      const value = getFieldValue(data, 'ramp_up_as_inicio');
      return value ? moment.unix(value as number).format(DATETIMEINPUT_FORMAT) : undefined;
    },
    formatValue: (data: MasterFracRecord): string => {
      const value = getFieldValue(data, 'ramp_up_as_inicio');
      return value ? moment.unix(value as number).format(DATETIMEPICKER_FORMAT) : '';
    },
  },
  {
    name: 'table.columns.ramp_up_60',
    field: 'data.ramp_up_60',
    inputType: 'number',
    size: 2,
    getValue: data => getFieldValue(data, 'ramp_up_60'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'ramp_up_60');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.ramp_up_as',
    field: 'data.ramp_up_as',
    inputType: 'number',
    size: 2,
    getValue: data => getFieldValue(data, 'ramp_up_as'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'ramp_up_as');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.avg_flow',
    field: 'data.caudal_promedio',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'caudal_promedio'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'caudal_promedio');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.avg_pressure',
    field: 'data.presion_promedio',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'presion_promedio'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'presion_promedio');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.sand_type',
    field: 'data.arena_tipo',
    inputType: 'text',
    size: 1,
    getValue: data => getFieldValue(data, 'arena_tipo'),
    formatValue: data => getFieldValue(data, 'arena_tipo') || '',
  },
  {
    name: 'table.columns.planned_sand',
    field: 'data.arena_plan',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'arena_plan'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'arena_plan');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.pumped_sand',
    field: 'data.arena_bombeada',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'arena_bombeada'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'arena_bombeada');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.pumped_sand',
    field: 'data.pjr.arena_bombeada',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.arena_bombeada,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.arena_bombeada;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.agua_plan',
    field: 'data.agua_plan',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'agua_plan'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'agua_plan');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.agua_total',
    field: 'data.agua_total',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'agua_total'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'agua_total');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.slurry_plan',
    field: 'data.slurry_plan',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'slurry_plan'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'slurry_plan');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.slurry_total',
    field: 'data.slurry_total',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'slurry_total'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'slurry_total');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.flow',
    field: 'data.fluido',
    size: 1,
    getValue: data => getFieldValue(data, 'fluido'),
    formatValue: data => getFieldValue(data, 'fluido') || '',
  },
  {
    name: 'table.columns.powder_friction_reducer',
    field: 'data.powder_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'powder_friction_reducer'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'powder_friction_reducer');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.powder_friction_reducer',
    field: 'data.pjr.powder_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.powder_friction_reducer,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.powder_friction_reducer;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.liquid_friction_reducer',
    field: 'data.liquid_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'liquid_friction_reducer'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'liquid_friction_reducer');
      return isNumber(value) ? convertValue(value * 1000, 'volume', 'gal', 'm3', 2) : '';
    },
  },
  {
    name: 'table.columns.liquid_friction_reducer',
    field: 'data.pjr.liquid_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.liquid_friction_reducer,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.liquid_friction_reducer;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.modificacion_fp',
    field: 'data.modificacion_fp',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'modificacion_fp'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'modificacion_fp');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.sd',
    field: 'data.sd',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'sd'),
    formatValue: (data: MasterFracRecord): string | number => {
      const value = getFieldValue(data, 'sd');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.sequence',
    field: 'data.secuencia',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'secuencia'),
    formatValue: data => getFieldValue(data, 'secuencia') || '',
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.mpa_secondary',
    field: 'data.mpa_secondary',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'mpa_secondary'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'mpa_secondary');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.conc_arena_secondary',
    field: 'data.conc_arena_secondary',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'conc_arena_secondary'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'conc_arena_secondary');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.mpa_primary',
    field: 'data.mpa_primary',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'mpa_primary'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'mpa_primary');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.conc_arena_primary',
    field: 'data.conc_arena_primary',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'conc_arena_primary'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'conc_arena_primary');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.opt',
    field: 'data.opt',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'opt'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'opt');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.falla_operativa',
    field: 'data.falla_operativa',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'falla_operativa'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'falla_operativa');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.comentarios',
    field: 'data.comentarios.0',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'comentarios.0'),
    formatValue: data => getFieldValue(data, 'comentarios.0') ?? '',
  },
  {
    name: 'table.columns.sala',
    field: 'data.sala',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'sala'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'sala');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.van',
    field: 'data.van',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'van'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'van');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.mf',
    field: 'data.mf',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'mf'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'mf');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.mr',
    field: 'data.mr',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'mr'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'mr');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.er',
    field: 'data.er',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'er'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'er');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.so',
    field: 'data.so',
    inputType: 'text',
    size: 2,
    getValue: data => getFieldValue(data, 'so'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'so');
      return value ? capitalize(value as string) : '';
    },
  },
  {
    name: 'table.columns.bombas_inicio',
    field: 'data.bombas_inicio',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'bombas_inicio'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'bombas_inicio');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.bombas_fin',
    field: 'data.bombas_final',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'bombas_final'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'bombas_final');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.mantenimiento',
    field: 'data.mantenimiento',
    inputType: 'text',
    size: 1,
    getValue: data => getFieldValue(data, 'mantenimiento'),
    formatValue: data => getFieldValue(data, 'mantenimiento') || '',
  },
  {
    name: 'table.columns.powder_breaker',
    field: 'data.powder_breaker',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'powder_breaker'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'powder_breaker');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.powder_breaker',
    field: 'data.pjr.powder_breaker',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.powder_breaker,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.powder_breaker;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.volumen_flush',
    field: 'data.volumen_flush',
    inputType: 'number',
    size: 1,
    getValue: data => getFieldValue(data, 'volumen_flush'),
    formatValue: (data: MasterFracRecord): number | string => {
      const value = getFieldValue(data, 'volumen_flush');
      return isNumber(value) ? round(value, 2) : '';
    },
  },
  {
    name: 'table.columns.volumen_flush',
    field: 'data.pjr.volumen_flush',
    inputType: 'number',
    size: 1,
    getValue: data => data?.data?.pjr?.volumen_flush,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.volumen_flush;
      return isNumber(value) ? round(value, 2) : '';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.caudal_por_cluster',
    field: 'data.caudal_por_cluster',
    inputType: 'number',
    size: 1,
    getValue: (data: MasterFracRecord): number | undefined => {
      const caudal = getFieldValue(data, 'caudal_promedio');
      const clusters = getFieldValue(data, 'etapa_cluster');
      return isNumber(caudal) && isNumber(clusters) ? round(caudal / clusters, 2) : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const caudal = getFieldValue(data, 'caudal_promedio');
      const clusters = getFieldValue(data, 'etapa_cluster');
      return isNumber(caudal) && isNumber(clusters) ? round(caudal / clusters, 2) : '';
    },
    readOnly: true,
  },
];
