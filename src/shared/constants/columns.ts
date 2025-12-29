import { round, isNumber, capitalize } from 'lodash';
import moment from 'moment';

import { DATETIMEINPUT_FORMAT, DATETIMEPICKER_FORMAT } from './values';

import { Column, MasterFracRecord } from '@/shared/models';

export const COLUMNS: Column<MasterFracRecord>[] = [
  {
    name: 'table.columns.cia',
    field: 'data.compania_nombre',
    size: 1,
    inputType: 'text',
    getValue: (data) => data?.data?.compania_nombre,
    formatValue: (data) => data?.data?.compania_nombre || '-',
  },
  {
    name: 'table.columns.set',
    field: 'data.set',
    size: 1,
    inputType: 'text',
    getValue: (data) => data?.data?.set,
    formatValue: (data) => data?.data?.set || '-',
  },
  {
    name: 'table.columns.equipo',
    field: 'data.equipo',
    size: 1,
    inputType: 'text',
    getValue: (data) => data?.data?.equipo,
    formatValue: (data) => data?.data?.equipo || '',
  },
  {
    name: 'table.columns.pad',
    field: 'data.pad_nombre',
    size: 2,
    inputType: 'text',
    getValue: (data) => data?.data?.pad_nombre,
    formatValue: (data) => data?.data?.pad_nombre || '-',
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.well',
    field: 'data.pozo_nombre',
    inputType: 'text',
    size: 3,
    getValue: (data) => data?.data?.pozo_nombre,
    formatValue: (data) => data?.data?.pozo_nombre || '-',
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.stage',
    field: 'data.etapa_numero',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.etapa_numero,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.etapa_numero;
      return isNumber(value) ? round(value, 0) : '-';
    },
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.tec',
    field: 'data.tech',
    size: 1,
    getValue: (data) => data?.data?.tech,
    formatValue: (data) => data?.data?.tech?.join(', '),
  },
  {
    name: 'table.columns.tope',
    field: 'data.tope',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tope,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tope;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.tope',
    field: 'data.pjr.tope',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.tope,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.tope;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.base',
    field: 'data.base',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.base,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.base;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.base',
    field: 'data.pjr.base',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.base,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.base;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.plug',
    field: 'data.tapon_prof',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tapon_prof,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tapon_prof;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.plug',
    field: 'data.pjr.tapon_prof',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.tapon_prof,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.tapon_prof;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.tipo_tapon',
    field: 'data.tipo_tapon',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.tipo_tapon,
    formatValue: (data) => data?.data?.tipo_tapon || '',
  },
  {
    name: 'table.columns.marca_tapon',
    field: 'data.marca_tapon',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.marca_tapon,
    formatValue: (data) => data?.data?.marca_tapon || '',
  },
  {
    name: 'table.columns.evento_tapon',
    field: 'data.evento_tapon',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.evento_tapon,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.evento_tapon;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.cluster',
    field: 'data.etapa_cluster',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.etapa_cluster,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.etapa_cluster;
      return isNumber(value) ? round(value, 0) : '-';
    },
  },
  {
    name: 'table.columns.disparos',
    field: 'data.disparos',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.disparos,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.disparos;
      return isNumber(value) ? round(value, 0) : '-';
    },
  },
  {
    name: 'table.columns.lde',
    field: 'data.lde',
    inputType: 'number',
    size: 1,
    getValue: (data) => {
      const tope = data?.data?.tope;
      const base = data?.data?.base;
      return isNumber(tope) && isNumber(base)
        ? round(Math.abs(tope - base) + 5, 2)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const tope = data?.data?.tope;
      const base = data?.data?.base;
      return isNumber(tope) && isNumber(base)
        ? round(Math.abs(tope - base) + 5, 2)
        : '-';
    },
    readOnly: true,
  },
  {
    name: 'table.columns.rih_start',
    field: 'data.rih_inicio',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.rih_inicio;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.rih_inicio;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.plug_start',
    field: 'data.tapon_fija',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tapon_fija;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tapon_fija;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.pooh_end',
    field: 'data.pooh_fin',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pooh_fin;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pooh_fin;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.tee_wl_time',
    field: 'data.tee_wl_time',
    inputType: 'number',
    size: 2,
    getValue: (data) => data?.data?.tee_wl_time,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tee_wl_time;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.wl_time',
    field: 'data.p_p_time',
    inputType: 'number',
    size: 2,
    getValue: (data) => data?.data?.p_p_time,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.p_p_time;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.comentario_wl',
    field: 'data.comentario_wl',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.comentario_wl,
    formatValue: (data) => data?.data?.comentario_wl || '',
  },
  {
    name: 'table.columns.frac_start',
    field: 'data.frac_inicio',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.frac_inicio;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.frac_inicio;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.frac_end',
    field: 'data.frac_fin',
    inputType: 'datetime-local',
    size: 3,
    getValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.frac_fin;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.frac_fin;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.frac_time',
    field: 'data.frac_tiempo_total',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.frac_tiempo_total,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.frac_tiempo_total;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.stage_time',
    field: 'data.tee.total',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tee?.total,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tee?.total;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.stage_time_cia',
    field: 'data.tee.cia',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tee?.cia,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tee?.cia;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.stage_time_wireline',
    field: 'data.tee.wireline',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tee?.wireline,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tee?.wireline;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.stage_time_ypf',
    field: 'data.tee.ypf',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tee?.ypf,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tee?.ypf;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.stage_time_nogest',
    field: 'data.tee.nogest',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.tee?.nogest,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.tee?.nogest;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.tee_detail',
    field: 'data.detalle_tee',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.detalle_tee,
    formatValue: (data) => data?.data?.detalle_tee || '-',
  },
  {
    name: 'table.columns.isip_pre',
    field: 'data.isip_pre',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.isip_pre,
    formatValue: (data) => data?.data?.isip_pre || '-',
  },
  {
    name: 'table.columns.isip_post',
    field: 'data.isip_post',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.isip_post,
    formatValue: (data) => data?.data?.isip_post || '-',
  },
  {
    name: 'table.columns.isip_post',
    field: 'data.pjr.isip_post',
    size: 1,
    getValue: (data) => data?.data?.pjr?.isip_post,
    formatValue: (data) => data?.data?.pjr?.isip_post || '-',
    isPJR: true,
  },
  {
    name: 'table.columns.ramp_up_60_inicio',
    field: 'data.ramp_up_60_inicio',
    size: 2,
    getValue: (data: MasterFracRecord): string => {
      const value = data?.data?.ramp_up_60_inicio;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): string => {
      const value = data?.data?.ramp_up_60_inicio;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.ramp_up_as_inicio',
    field: 'data.ramp_up_as_inicio',
    size: 2,
    getValue: (data: MasterFracRecord): string => {
      const value = data?.data?.ramp_up_as_inicio;
      return value
        ? moment.unix(value).format(DATETIMEINPUT_FORMAT)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): string => {
      const value = data?.data?.ramp_up_as_inicio;
      return value ? moment.unix(value).format(DATETIMEPICKER_FORMAT) : '-';
    },
  },
  {
    name: 'table.columns.ramp_up_60',
    field: 'data.ramp_up_60',
    inputType: 'number',
    size: 2,
    getValue: (data) => data?.data?.ramp_up_60,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.ramp_up_60;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.ramp_up_as',
    field: 'data.ramp_up_as',
    inputType: 'number',
    size: 2,
    getValue: (data) => data?.data?.ramp_up_as,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.ramp_up_as;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.avg_flow',
    field: 'data.caudal_promedio',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.caudal_promedio,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.caudal_promedio;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.avg_pressure',
    field: 'data.presion_promedio',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.presion_promedio,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.presion_promedio;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.sand_type',
    field: 'data.arena_tipo',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.arena_tipo,
    formatValue: (data) => data?.data?.arena_tipo || '',
  },
  {
    name: 'table.columns.planned_sand',
    field: 'data.arena_plan',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.arena_plan,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.arena_plan;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.pumped_sand',
    field: 'data.arena_bombeada',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.arena_bombeada,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.arena_bombeada;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.pumped_sand',
    field: 'data.pjr.arena_bombeada',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.arena_bombeada,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.arena_bombeada;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.agua_plan',
    field: 'data.agua_plan',
    size: 1,
    getValue: (data) => data?.data?.agua_plan,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.agua_plan;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.agua_total',
    field: 'data.agua_total',
    size: 1,
    getValue: (data) => data?.data?.agua_total,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.agua_total;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.slurry_plan',
    field: 'data.slurry_plan',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.slurry_plan,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.slurry_plan;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.slurry_total',
    field: 'data.slurry_total',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.slurry_total,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.slurry_total;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.flow',
    field: 'data.fluido',
    size: 1,
    getValue: (data) => data?.data?.fluido,
    formatValue: (data) => data?.data?.fluido || '-',
  },
  {
    name: 'table.columns.powder_friction_reducer',
    field: 'data.powder_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.powder_friction_reducer,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.powder_friction_reducer;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.powder_friction_reducer',
    field: 'data.pjr.powder_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.powder_friction_reducer,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.powder_friction_reducer;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.liquid_friction_reducer',
    field: 'data.liquid_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.liquid_friction_reducer,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.liquid_friction_reducer;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.liquid_friction_reducer',
    field: 'data.pjr.liquid_friction_reducer',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.liquid_friction_reducer,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.liquid_friction_reducer;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.modificacion_fp',
    field: 'data.modificacion_fp',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.modificacion_fp,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.modificacion_fp;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.sd',
    field: 'data.sd',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.sd,
    formatValue: (data) => data?.data?.sd,
  },
  {
    name: 'table.columns.sequence',
    field: 'data.secuencia',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.secuencia,
    formatValue: (data) => data?.data?.secuencia || '-',
    sticky: 'left' as const,
  },
  {
    name: 'table.columns.mpa_secondary',
    field: 'data.mpa_secondary',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.mpa_secondary,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.mpa_secondary;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.conc_arena_secondary',
    field: 'data.conc_arena_secondary',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.conc_arena_secondary,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.conc_arena_secondary;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.mpa_primary',
    field: 'data.mpa_primary',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.mpa_primary,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.mpa_primary;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.conc_arena_primary',
    field: 'data.conc_arena_primary',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.conc_arena_primary,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.conc_arena_primary;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.opt',
    field: 'data.opt',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.opt,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.opt;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.falla_operativa',
    field: 'data.falla_operativa',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.falla_operativa,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.falla_operativa;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.comentarios',
    field: 'data.comentarios',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.comentarios?.[0],
    formatValue: (data) => data?.data?.comentarios?.[0] ?? '-',
  },
  {
    name: 'table.columns.sala',
    field: 'data.sala',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.sala,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.sala;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.van',
    field: 'data.van',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.van,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.van;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.mf',
    field: 'data.mf',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.mf,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.mf;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.mr',
    field: 'data.mr',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.mr,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.mr;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.er',
    field: 'data.er',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.er,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.er;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.so',
    field: 'data.so',
    inputType: 'text',
    size: 2,
    getValue: (data) => data?.data?.so,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.so;
      return value ? capitalize(value) : '-';
    },
  },
  {
    name: 'table.columns.bombas_inicio',
    field: 'data.bombas_inicio',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.bombas_inicio,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.bombas_inicio;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.bombas_fin',
    field: 'data.bombas_final',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.bombas_final,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.bombas_final;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.mantenimiento',
    field: 'data.mantenimiento',
    inputType: 'text',
    size: 1,
    getValue: (data) => data?.data?.mantenimiento,
    formatValue: (data) => data?.data?.mantenimiento || '',
  },
  {
    name: 'table.columns.powder_breaker',
    field: 'data.powder_breaker',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.powder_breaker,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.powder_breaker;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.powder_breaker',
    field: 'data.pjr.powder_breaker',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.powder_breaker,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.powder_breaker;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.volumen_flush',
    field: 'data.volumen_flush',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.volumen_flush,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.volumen_flush;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
  {
    name: 'table.columns.volumen_flush',
    field: 'data.pjr.volumen_flush',
    inputType: 'number',
    size: 1,
    getValue: (data) => data?.data?.pjr?.volumen_flush,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.pjr?.volumen_flush;
      return isNumber(value) ? round(value, 2) : '-';
    },
    isPJR: true,
  },
  {
    name: 'table.columns.longitud_de_etapa',
    field: 'data.longitud_de_etapa',
    inputType: 'number',
    size: 1,
    getValue: (data) => {
      const tope = data?.data?.tope;
      const base = data?.data?.base;
      return isNumber(tope) && isNumber(base)
        ? round(Math.abs(tope - base) + 5, 2)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const tope = data?.data?.tope;
      const base = data?.data?.base;
      return isNumber(tope) && isNumber(base)
        ? round(Math.abs(tope - base) + 5, 2)
        : '-';
    },
    readOnly: true,
  },
  {
    name: 'table.columns.caudal_por_cluster',
    field: 'data.caudal_por_cluster',
    inputType: 'number',
    size: 1,
    getValue: (data) => {
      const caudal = data?.data?.caudal_promedio;
      const clusters = data?.data?.etapa_cluster;
      return isNumber(caudal) && isNumber(clusters)
        ? round(caudal / clusters, 2)
        : undefined;
    },
    formatValue: (data: MasterFracRecord): number | string => {
      const caudal = data?.data?.caudal_promedio;
      const clusters = data?.data?.etapa_cluster;
      return isNumber(caudal) && isNumber(clusters)
        ? round(caudal / clusters, 2)
        : '-';
    },
    readOnly: true,
  },
  {
    name: 'table.columns.overflush',
    field: 'data.overflush',
    inputType: 'number',
    size: 2,
    getValue: (data) => data?.data?.overflush,
    formatValue: (data: MasterFracRecord): number | string => {
      const value = data?.data?.overflush;
      return isNumber(value) ? round(value, 2) : '-';
    },
  },
];
