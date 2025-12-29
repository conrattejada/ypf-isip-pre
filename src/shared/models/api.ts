/* eslint-disable camelcase */
export type FracFleet = {
  id?: number;
  name?: string;
  activePad?: number;
};

export type Pad = {
  id?: number;
  name?: string;
  active?: boolean;
};

export type Well = {
  id?: number;
  assetId?: number;
  name?: string;
};

export type PJRData = {
  tapon_prof?: number | null;
  isip_post?: number | null;
  arena_bombeada?: number | null;
  volumen_flush?: number | null;
  liquid_friction_reducer?: number | null;
  powder_friction_reducer?: number | null;
  powder_breaker?: number | null;
  tope?: number | null;
  base?: number | null;
};

export type FracData = {
  compania_nombre?: string | null;
  set?: number | null;
  pad_nombre?: string | null;
  pozo_nombre?: string | null;
  etapa_numero?: number | null;
  tech?: string[] | null;
  tapon_prof?: number | null;
  etapa_cluster?: number | null;
  rih_inicio?: number | null;
  tapon_fija?: number | null;
  pooh_fin?: number | null;
  tee_wl_time?: number | null;
  p_p_time?: number | null;
  wireline_run_time?: number | null;
  frac_inicio?: number | null;
  frac_fin?: number | null;
  frac_tiempo_total?: number | null;
  tee?: {
    total?: number;
    cia?: number;
    wireline?: number;
    ypf?: number;
    nogest?: number;
  };
  detalle_tee?: string | null;
  caudal_promedio?: number | null;
  presion_promedio?: number | null;
  isip_pre?: number | null;
  isip_pre_invalid_reason?: string | null;
  isip_post?: number | null;
  arena_plan?: number | null;
  arena_bombeada?: number | null;
  arena_tipo?: string | null;
  volumen_flush?: number | null;
  liquid_friction_reducer?: number | null;
  powder_friction_reducer?: number | null;
  powder_breaker?: number | null;
  slurry_total?: number | null;
  fluido?: 'LFR' | 'DFR' | null;
  secuencia?: number | null;
  mpa_primary?: string | null;
  mpa_secondary?: string | null;
  sala?: string | null;
  van?: string | null;
  tope?: number | null;
  base?: number | null;
  evento_tapon?: string | null;
  disparos?: number | null;
  modificacion_fp?: string | null;
  conc_arena_primary?: string | null;
  conc_arena_secondary?: string | null;
  opt?: string | null;
  falla_operativa?: string | null;
  mf?: string | null;
  mr?: string | null;
  er?: string | null;
  so?: string | null;
  overflush?: number | null;
  ramp_up_60?: number | null;
  ramp_up_60_inicio?: number | null;
  ramp_up_as?: number | null;
  ramp_up_as_inicio?: number | null;
  agua_total?: number | null;
  equipo?: string | null;
  tipo_tapon?: string | null;
  marca_tapon?: string | null;
  bombas_inicio?: number | null;
  bombas_final?: number | null;
  mantenimiento?: string | null;
  sd?: string | null;
  lde?: number | null;
  agua_plan?: number | null;
  slurry_plan?: number | null;
  comentario_wl?: string | null;
  comentarios: string[];
  pjr?: PJRData;
};

export type FracMetadata = {
  frac_fleet_id?: number | null;
  pad_id?: number | null;
  well_id?: number | null;
  stage?: number | null;
  last_updated?: number | null;
  user_changes?: FracData;
};

export type MasterFracRecord = {
  _id?: string | null;
  id?: string | number;
  company_id?: number | null;
  asset_id?: number | null;
  version?: number | null;
  timestamp?: number | null;
  data: FracData;
  metadata?: FracMetadata | null;
};
