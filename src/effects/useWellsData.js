import { useState, useEffect } from 'react';
import { corvaDataAPI } from '@corva/ui/clients';


async function fetchData({ assetId, dataset, query = {}, fields = [], result = {} }) {
    const [provider, collection] = dataset.split("#");
    if (result && Object.values(result).length > 0) fields = [...fields, ...Object.values(result)]

    try {
        const data = await corvaDataAPI.get(`/api/v1/data/${provider}/${collection}/`, {
            limit: 1000,
            skip: 0, // NOTE: Required for pagination
            // NOTE: Make sure the sort field hit database indexes. Otherwise the request will take too long
            sort: JSON.stringify({ timestamp: -1 }),
            query: JSON.stringify({ asset_id: assetId, company_id: 375, ...query }),
            // NOTE: To make efficient request - fetch only fields used by the app
            fields: fields.join(','),
        });
        
        return data

    } catch (e) {
        return [];
    }
}

export default function useWellsData({ wellList = [], datasetList = [] }) {
    const [wellsData, setWellsData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (loading) {
            wellList?.forEach(well => {
                const asset_id = well?.asset_id
                if (asset_id) {
                    datasetList.forEach(({ dataset, query, result }) => {
                        fetchData({ assetId: asset_id, dataset, query, result })
                            .then(response => {
                                setWellsData(prev => ({
                                    ...prev, [asset_id]: {
                                        ...prev?.[asset_id],
                                        [dataset]: response
                                    }
                                }));
                            })
                    })
                }
            });
        }
    }, [loading]);

    useEffect(() => {
        setLoading(wellList?.length > 0 && datasetList?.length > 0)
    }, [wellList?.length, datasetList?.length])


    return { loading, wellsData };

}