import { useState, useEffect } from 'react';
import { corvaDataAPI } from '@corva/ui/clients';

type DatasetConfig = {
    dataset: string;
    query?: Record<string, any>;
    fields?: string[];
    result?: Record<string, string>;
};

type UseWellsDataArgs = {
    wellList?: Array<{ asset_id?: number | string }>;
    datasetList?: DatasetConfig[];
    padMode?: string;
};

async function fetchData({ assetId, dataset, query = {}, fields = [], result = {} }: DatasetConfig & { assetId: number | string }) {
    const [provider, collection] = dataset.split("#");
    if (result && Object.values(result).length > 0) fields = [...fields, ...Object.values(result)]

    try {
        const data = await corvaDataAPI.get(`/api/v1/data/${provider}/${collection}/`, {
            limit: 1000,
            skip: 0, 
            sort: JSON.stringify({ timestamp: -1 }),
            query: JSON.stringify({ asset_id: assetId, company_id: 375, ...query }),
            fields: fields.join(','),
        });
        return data

    } catch (e) {
        console.error(e)
        return [];
    }
}

export default function useWellsData({ wellList = [], datasetList = [] }: UseWellsDataArgs) {
    const [wellsData, setWellsData] = useState<Record<string, Record<string, any[]>> | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (loading && wellList?.length > 0) {
            wellList?.forEach(well => {
                const asset_id = well?.asset_id
                if (asset_id) {
                    const fetchPromises = datasetList.map(({ dataset, query, result }) =>
                        fetchData({ assetId: asset_id, dataset, query, result })
                            .then(response => ({
                                dataset,
                                response
                            }))
                    );
                    Promise.all(fetchPromises)
                        .then(results => {
                            setWellsData(prev => ({
                                ...(prev || {}),
                                [asset_id]: {
                                    ...(prev?.[asset_id] || {}),
                                    ...results.reduce((acc, { dataset, response }) => ({
                                        ...acc,
                                        [dataset]: response
                                    }), {})
                                }
                            }));
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }
            });
        }
    }, [loading]);
    useEffect(() => {
        setLoading(wellList?.length > 0 && datasetList?.length > 0)
    }, [wellList, datasetList?.length])


    return { loading, wellsData };

}


