/* eslint-disable camelcase */
import type { FracFleet, Pad, Well } from '@/shared/models';

export const getFracFleets = async (): Promise<FracFleet[]> => {
  const response = await fetch(
    'https://api.corva.ai/v2/frac_fleets/?fields[]=frac_fleet.name&fields[]=frac_fleet.current_pad_id',
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const result = await response.json();
  return (result?.data || [])
    .filter((ff: { [key: string]: any }) => !ff?.attributes?.name?.includes('Viewer'))
    .map((ff: { [key: string]: any }) => ({
      id: parseInt(ff?.id, 10),
      name: ff?.attributes?.name,
      activePad: ff?.attributes?.current_pad_id,
    }));
};

export const getPads = async (fracFleetId: number): Promise<Pad[]> => {
  const response = await fetch(
    `https://api.corva.ai/v2/pads/?frac_fleet=${fracFleetId}&fields=pad.active,pad.name`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const result = await response.json();

  return (result?.data || []).map((pad: { [key: string]: any }) => ({
    id: parseInt(pad?.id, 10),
    name: pad?.attributes?.name,
  }));
};

export const getWells = async (fracFleetId: number, padId?: number): Promise<Well[]> => {
  const query: { frac_fleet: string; pad?: string } = { frac_fleet: fracFleetId.toString() };
  if (padId) {
    query.pad = padId.toString();
    query.frac_fleet = '';
  }
  const response = await fetch(
    `https://api.corva.ai/v2/wells/?${new URLSearchParams(query).toString()}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const result = await response.json();

  return (result?.data || []).map((well: { [key: string]: any }) => ({
    id: parseInt(well?.id, 10),
    assetId: well?.attributes?.asset_id,
    name: well?.attributes?.name?.split('.')?.at(-1) || well?.attributes?.name,
  }));
};
