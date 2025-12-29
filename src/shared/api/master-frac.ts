/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import {
  getDataAppStorage,
  postTaskAndWaitResult,
  putDataAppStorage,
} from '@corva/ui/clients/jsonApi';
import moment from 'moment';

import {
  MASTER_FRAC_DATASET,
  YPF_PROVIDER,
  RECORD_LIMIT,
  YPF_COMPANY_ID,
  YPF_MF_TASK,
  COLLECTION_METADATA,
} from '@/shared/constants';
import { MasterFracRecord, TimePeriod } from '@/shared/models';

export const getMasterFracData = async (
  fracFleetId: number,
  padId?: number,
  wellId?: number,
  period: TimePeriod = '24h'
): Promise<MasterFracRecord[]> => {
  let timestamp;
  switch (period) {
    case '6h':
      timestamp = { $gte: moment().add(-6, 'hours').unix() };
      break;
    case '12h':
      timestamp = { $gte: moment().add(-12, 'hours').unix() };
      break;
    case '24h':
      timestamp = { $gte: moment().add(-24, 'hours').unix() };
      break;
    case '48h':
      timestamp = { $gte: moment().add(-48, 'hours').unix() };
      break;
    default:
      timestamp = { $exists: true };
  }

  const query: { [key: string]: any } = {
    company_id: YPF_COMPANY_ID,
    asset_id: { $exists: true },
    'metadata.frac_fleet_id': fracFleetId,
    'data.frac_inicio': timestamp,
  };
  if (padId) {
    query['metadata.pad_id'] = padId;
  }
  if (wellId) {
    query['metadata.well_id'] = wellId;
  }

  const response = await getDataAppStorage(YPF_PROVIDER, MASTER_FRAC_DATASET, {
    query: JSON.stringify(query),
    sort: JSON.stringify({ 'data.secuencia': 1 }),
    limit: RECORD_LIMIT,
  });

  return response;
};

export const recalculateRecords = async (
  assetId: number,
  record_ids: string[]
): Promise<{ processed_ids: string[]; failed_ids: string[] }> => {
  const chunkSize = 10;

  const chunks = [];
  for (let i = 0; i < record_ids.length; i += chunkSize) {
    chunks.push(record_ids.slice(i, i + chunkSize));
  }

  const processChunk = async (chunk: string[]) => {
    try {
      const response = await postTaskAndWaitResult({
        provider: 'ypf',
        asset_id: assetId,
        app_key: YPF_MF_TASK,
        properties: { record_ids: chunk },
      });

      if (response.state === 'failed') {
        throw new Error(response.fail_reason);
      }

      return response.payload;
    } catch (error) {
      console.error(`Error processing chunk: ${error.message}`);
      return {
        processed_ids: [],
        failed_ids: chunk,
      };
    }
  };

  const results = await Promise.all(chunks.map(processChunk));

  const aggregatedResults = results.reduce(
    (acc, result) => {
      acc.processed_ids.push(...result.processed_ids);
      acc.failed_ids.push(...result.failed_ids);
      return acc;
    },
    { processed_ids: [], failed_ids: [] } as { processed_ids: string[]; failed_ids: string[] }
  );

  return aggregatedResults;
};

export const updateMasterFracRecord = async (
  data: MasterFracRecord
): Promise<{ [key: string]: unknown }> => {
  const response = await putDataAppStorage(
    YPF_PROVIDER,
    MASTER_FRAC_DATASET,
    `${data._id}/`,
    data,
    {}
  );
  return response;
};

export const getMasterFracUnits = async (): Promise<unknown> => {
  const result = await getDataAppStorage(YPF_PROVIDER, COLLECTION_METADATA, {
    query: JSON.stringify({ company_id: YPF_COMPANY_ID, 'data.dataset_name': MASTER_FRAC_DATASET }),
    sort: JSON.stringify({ timestamp: 1 }),
    limit: 1,
  });

  if (result.length === 0) return Promise.reject(new Error('There was a problem getting metadata'));

  return result[0];
};
