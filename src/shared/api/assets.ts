import { corvaAPI } from '@corva/ui/clients';

export const getPadId = async (wellId: string | number): Promise<number> => {
  const response = await corvaAPI.get(`/v2/wells/${wellId}`, { fields: ['well.pad_id'].join(',') });
  return response?.data?.attributes?.pad_id;
};

export const getFracFleetId = async (padId: string | number): Promise<number> => {
  const response = await corvaAPI.get(`/v2/pads/${padId}`, {
    fields: ['pad.current_frac_fleet_id'].join(','),
  });
  return response?.data?.attributes?.current_frac_fleet_id;
};
