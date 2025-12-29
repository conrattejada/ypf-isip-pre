/* eslint-disable camelcase, no-use-before-define */

// ======================================================================================
// MAIN APP PROPS TYPES
// ======================================================================================

export interface AppProps {
  // Completion-specific properties
  fracFleet?: FracFleet;
  wells?: Well[];
  fracFleetId?: number;
  padId?: number;
  assets?: unknown;

  // Drilling-specific properties
  rig?: Rig;
  well?: Well;
  rigId?: number;
  wellId?: number;

  // Common properties
  app: AppInstance;
  package: string;
  coordinates: Coordinates;
  currentUser: User;
  devCenterRouter: DevCenterRouter;
  segment: string;
  appHeaderProps: AppHeaderData;
  isNative: boolean;
  layoutEnvironment: LayoutEnvironment;
  settingsByAsset?: AnyRecord;
  // Methods
  onSettingChange: (key: string, value: unknown) => void;
  onSettingsChange: (settings: Record<string, unknown>) => void;
  setIsFullscreenModalMode: (isFullscreenModalMode: boolean) => Promise<void>;
  setIsMaximized: (isMaximized: boolean) => void;
  setMainMenuItems: (mainMenuItems: MenuItem[]) => void;
  setSecondaryMenuItems: (secondaryMenuItems: MenuItem[]) => void;
}

// ======================================================================================
// APP SETTINGS PROPS TYPES
// ======================================================================================

export interface AppSettingsProps {
  app: AppInstance;
  appData: AppInstanceData;
  settings: Record<string, unknown>;
  layoutEnvironment: LayoutEnvironment;
  currentUser: User;

  // Methods
  onSettingChange: (key: string, value: unknown) => void;
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

export interface CustomAppSettings {
  isExampleCheckboxChecked?: boolean;
}

// ======================================================================================
// COMMON TYPES
// ======================================================================================

export interface MenuItem {
  icon: string;
  title: string;
  priority: boolean;
  onClick: () => void;
}

export interface Coordinates {
  w: number;
  h: number;
  x: number;
  y: number;
  pixelHeight: number;
  pixelWidth: number;
}

export interface LayoutEnvironment {
  type: string;
  pdfReportMode: boolean;
}

export interface DevCenterRouter {
  location: {
    pathname: string;
    query: Record<string, unknown>;
  };
}

// ======================================================================================
// APP PACKAGE TYPES
// ======================================================================================

export interface AppManifestLicense {
  type: string;
  url: string;
}

export interface AppManifestDeveloper {
  name: string;
  identifier: string;
  authors: unknown[];
}

export interface AppManifestUI {
  initial_size: {
    w: number;
    h: number;
  };
  multi_rig: boolean;
  full_screen_report: boolean;
  use_app_header_v3: boolean;
}

export interface AppManifestEntrypoint {
  file: string;
  function: string;
}

export interface AppManifestSettings {
  entrypoint: AppManifestEntrypoint;
  environment: Record<string, unknown>;
  runtime: string;
  app: {
    log_type: string;
  };
  enable_isolation: boolean;
}

export interface AppManifestApplication {
  type: string;
  key: string;
  visibility: string;
  name: string;
  description: string;
  summary: string;
  category: string;
  website: string;
  segments: string[];
  ui: AppManifestUI;
}

export interface AppManifest {
  format: number;
  license: AppManifestLicense;
  developer: AppManifestDeveloper;
  application: AppManifestApplication;
  settings: AppManifestSettings;
  datasets: Record<string, unknown>;
}

export interface AppManifestPackage {
  manifest: AppManifest;
  build: string;
  version: string;
}

export interface AppMetadata {
  app_key: string;
  platform: string;
}

export interface AppInstance {
  app: AppMetadata;
  id: number;
  package: AppManifestPackage;
  segment: string[];
  settings: Record<string, unknown>;
}

// ======================================================================================
// ASSET TYPES
// ======================================================================================

export interface LonLat {
  longitude: number;
  latitude: number;
}

export interface Company {
  type: string;
  id: string;
}

export interface Asset {
  type: string;
  id: string;
}

export interface DataConnection {
  type: string;
  id: string;
}

// ======================================================================================
// DATA STREAM TYPES
// ======================================================================================

export interface DataStream {
  type: string;
  id: number;
  company_id: number;
  asset_id: number;
  name: string;
  status: string;
  configuration: Record<string, unknown>;
  visibility: string;
  segment: string;
  source_type: string;
  data_source: string;
  log_type: string;
  log_identifier: unknown;
  log_display_name: unknown;
  settings: Record<string, unknown>;
  first_active_at: string;
  last_active_at: string;
  data_received_at: string;
  created_at: string;
  updated_at: string;
  consumer_strategy: string;
  company: Company;
  asset: Asset;
  app_connections: DataConnection[];
  relationshipNames: string[];
}

// ======================================================================================
// RIG TYPES (Drilling)
// ======================================================================================

export interface Rig {
  name: string;
  id: string;
  asset_id: number;
}

// ======================================================================================
// WELL TYPES
// ======================================================================================

export interface WellStats {
  well_end: number;
  total_cost: number;
  total_time: number;
  well_start: number;
  total_depth: number;
  first_active_at: number;
  witsml_data_frequency: number | null;
}

export interface WellCustomProperties {
  'auto-stage'?: string;
  is_asset_viewer?: boolean;
}

export interface WellArchivation {
  status: string;
  status_reasons: unknown[];
  performer: unknown;
  archivation_date: unknown;
  abilities: string[];
}

export interface SpudRelease {
  id: string;
  spud: string;
  rig_up: string;
  release: string;
}

export interface WellSettings {
  basin?: string;
  qc_at?: number;
  qc_by?: number;
  county?: string;
  air_gap?: number;
  timezone?: string;
  top_hole?: {
    raw: string;
    coordinates: number[];
  };
  api_number?: string;
  bottom_hole?: Record<string, unknown>;
  mud_company?: string;
  spud_release?: SpudRelease[];
  string_design?: string;
  contractor_name?: string;
  ground_elevation?: number;
  target_formation?: string;
  visible_rerun_id?: number;
  last_mongo_refresh?: string;
  rig_classification?: string;
  directional_driller?: string;
  drilling_afe_number?: string;
  day_shift_start_time?: string;
  off_bottom_tolerance?: number;
  target_formation_standard?: string;
  completion_day_shift_start_time?: string;
  associations_last_active_at_updated_at?: string;
  enable_alerts?: boolean;
}

export interface Well {
  name: string;
  settings?: WellSettings;
  asset_id: number;
  last_active_at: string;
  status: string;
  archivation?: WellArchivation;
  id: string;
  companyId?: string;
  type?: string;
  stats?: WellStats;
  custom_properties?: WellCustomProperties;
  is_active?: boolean;
  app_streams?: DataStream[];
  rig?: {
    type: string;
    id: string;
  };
  relationshipNames?: string[];
  last_frac_at?: string;
}

// ======================================================================================
// FRAC FLEET TYPES (Completion)
// ======================================================================================

export interface ProgramEmpty {
  rigs: boolean;
  pads: boolean;
  frac_fleets: boolean;
}

export interface Program {
  type: string;
  id: string;
  asset_id: number;
  name: string;
  lon_lat: LonLat | null;
  created_at: string;
  updated_at: string;
  empty: ProgramEmpty;
  company: Company;
  relationshipNames: string[];
}

export interface Pad {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  program_id: number;
  lon_lat: LonLat;
  drillout_unit_id: number | null;
  last_active_at: string;
  viewer_well_id: number | null;
}

export interface FracFleetBasic {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  program_id: number;
  lon_lat: LonLat;
  frac_fleet_vendor: unknown;
  last_active_at: string;
}

export interface PadFracFleet {
  type: string;
  id: number;
  current: boolean;
  last_current_at: string;
  created_at: string;
  updated_at: string;
  pad: Pad;
  frac_fleet: FracFleetBasic;
  contract_data: Record<string, unknown>;
  frac_fleet_lines: unknown[];
  relationshipNames: string[];
}

export interface FracFleet {
  type: string;
  id: string;
  name: string;
  current_pad_id: number;
  program: Program;
  pad_frac_fleets: PadFracFleet[];
  relationshipNames: string[];
}

// ======================================================================================
// USER TYPES
// ======================================================================================

export interface UserFavorite {
  id: string;
  asset_type: string;
}

export interface UserHomePage {
  selected_assets_tab: string;
}

export interface UISetting {
  key: string;
  message: string;
}

export interface UserUISettings {
  [key: string]: UISetting;
}

export interface UserSingleAsset {
  padId: number;
  rigId: number;
  wellId: number | null;
  rigAssetId: number;
  fracFleetId: number;
  wellAssetId: number | null;
  drilloutUnitId: number;
  completionWellAssetId: number;
}

export interface UserFeedFilters {
  company_id: unknown;
  start_date: string;
  content_types: string[];
  selected_rigs_ids: unknown[];
  selected_user_ids: unknown[];
  users_radio_value: string;
  assets_radio_value: string;
  date_range_radio_value: string;
}

export interface UserAlertsListFilters {
  end_date: string;
  segments: string[];
  alert_name: string;
  start_date: string;
  validation: string;
  alert_levels: string[];
  subscription: string;
  classification: string;
  assets_radio_value: string;
  date_range_radio_value: string;
}

export interface UserNotificationsFilters {
  end_date: string;
  start_date: string;
  content_types: string[];
  date_range_radio_value: string;
}

export interface UserDirectionalAppSettings {
  curve_to_lat_threshold: number;
  vert_to_curve_threshold: number;
}

export interface UserSettings {
  favorites: UserFavorite[];
  home_page: UserHomePage;
  onboarded: boolean;
  beta_2_158: Record<string, unknown>;
  uiSettings: UserUISettings;
  singleAsset: UserSingleAsset;
  feed_filters: UserFeedFilters;
  sms_blacklisted: boolean;
  favorit_asset_ids: number[];
  restricted_assets: unknown[];
  alerts_list_filters: UserAlertsListFilters;
  restricted_programs: unknown[];
  is_dnd_feature_shown: boolean;
  last_new_alerts_check: string;
  notifications_filters: UserNotificationsFilters;
  directional_app_settings: UserDirectionalAppSettings;
  last_new_feed_items_check: string;
  participates_in_beta_apps: boolean;
  'cross-plot__gradient-manager': unknown[];
  last_new_dashboard_shares_check: string;
  formation_evaluation_lithology_types: Record<string, unknown>;
  formation_evaluation_custom_gradients: unknown[];
}

export interface CompanyInfo {
  id: number;
  name: string;
  time_zone: string;
  language: string;
  provider: string;
  unit_system: Record<string, string>;
  custom_unit_system: Record<string, unknown>;
  custom_units: Record<string, unknown>;
  dev_center_enabled: boolean;
  with_subscription: boolean;
  competitor_analysis_enabled: boolean;
  ai_model_scope: string;
}

export interface UserGroup {
  id: number;
  name: string;
  company_id: number;
}

export interface UserPreference {
  id: number;
  push_notifications_enabled: boolean;
  emails_enabled: boolean;
  sms_enabled: boolean;
  alert_levels: string[];
  play_alerts_sound: boolean;
  show_intercom_icon: boolean;
  segment: string[];
  disable_create_dashboard: boolean;
  disable_costs: boolean;
  disable_documents: boolean;
  realtime_operation_mode: boolean;
  disable_file_upload: boolean;
  stay_on_app_store: boolean;
  new_navigation_beta: boolean;
  new_mobile_app_enabled: boolean;
}

export interface User {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  created_at: string;
  terms_acceptance_at: string;
  profile_photo: unknown;
  recently_viewed_asset_ids: number[];
  unit_system: unknown;
  custom_unit_system: unknown;
  role: string;
  title: unknown;
  group: unknown;
  favorite_asset_id: unknown;
  current_segment: string;
  theme: string;
  messaging_id: string;
  restricted_assets: unknown[];
  restricted_programs: unknown[];
  settings: UserSettings;
  last_sign_in_at: string;
  locked_access: boolean;
  unit_ids: unknown[];
  intercom_admin_id: unknown;
  resource: unknown[];
  consent_to_process_data: boolean;
  identity_verification_enabled: unknown;
  intercom_user_hash: string;
  impersonating: boolean;
  profile_groups: unknown[];
  preference: UserPreference;
  company: CompanyInfo;
  groups: UserGroup[];
}

// ======================================================================================
// APP HEADER TYPES
// ======================================================================================

export interface AppHeaderData {
  app: AppInstance;
  appLastAnnotation: unknown;
  appSettings: Record<string, unknown>;
  coordinates: Coordinates;
  currentUser: User;
  isMaximized: boolean;
  layoutEnvironment: LayoutEnvironment;
  fracFleet?: FracFleet;
  wells?: Well[];
  rig?: Rig;
  well?: Well;
}

// ======================================================================================
// APP DATA TYPES (Settings)
// ======================================================================================

export interface CompletionWellInfo {
  fracFleet: {
    id: number | null;
    name: string | null;
  };
  pad: {
    id: number | null;
    name: string | null;
  };
}
type AnyRecord = Record<string, any>;
export interface AppInstanceData {
  id: number;
  rig: Rig | null;
  well: Well | null;
  fracFleet: FracFleet | null;
  program: {
    id: string | null;
    name: string | null;
  };
  completionWellInfo?: CompletionWellInfo;
  wells: Well[] | null;
  isLoading: boolean;
  appHash: string;
  settingsByAsset?: AnyRecord;
  
  padId?: number;
  onSettingChange: (key: string, value: any) => void;
}
