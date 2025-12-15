export const getFracFleets = async () => {
    const response = await fetch('https://api.corva.ai/v2/frac_fleets/', {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
  
    return (result?.data || []).map(ff => ({
      id: parseInt(ff?.id, 10),
      name: ff?.attributes?.name,
      current: ff?.attributes?.current,
      active: ff?.attributes?.active,
    }));
  };

  export const getPads = async (fracFleetId) => {
    const response = await fetch(`https://api.corva.ai/v2/pads/?frac_fleet=${fracFleetId}&fields[]=pad.name&fields[]=pad.status&fields[]=pad.active&fields[]=pad.current&order=asc&per_page=10000&sort=name`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
  
    return (result?.data || []).map(pad => ({
      id: parseInt(pad?.id, 10),
      name: pad?.attributes?.name,
      active: pad?.attributes?.active,
      current: pad?.attributes?.current,
    }));
  };
  

  export const getWells = async (fracFleetId, padId) => {
    const query = { frac_fleet: fracFleetId.toString() };
  
    let url = ``;
    let result;
    let filteredWells = [];
  
    try {
      if (padId) {
        query.pad = padId.toString();
        url = `https://api.corva.ai/v2/pads/${query.pad}/app_wells?app_key=ypf.dc_completion_metrics.ui&fields=all`;
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (!response.ok) throw new Error(`Error fetching wells for padId ${padId}: ${response.statusText}`);
        
        result = await response.json();
        
        filteredWells = (result.data || []).filter(well => {
          return !well?.attributes?.name?.toLowerCase().includes('ydramill');
        });
  
      } else {
        const pads = await getPads(fracFleetId);
  
        for (const pad of pads) {
          url = `https://api.corva.ai/v2/pads/${pad.id}/app_wells?app_key=ypf.dc_completion_metrics.ui&fields=all`;
  
          const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
          });
  
          if (!response.ok) throw new Error(`Error fetching wells for padId ${padId}: ${response.statusText}`);
  
          result = await response.json();
  
          let padWells = (result.data || []).filter(well => {
            return !well?.attributes?.name?.toLowerCase().includes('ydramill');
          });
  
          filteredWells.push(...padWells);
        }
  
        url = `https://api.corva.ai/v2/wells/?${new URLSearchParams(query).toString()}`;
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (!response.ok) throw new Error(`Error fetching wells for fracFleetId ${fracFleetId}: ${response.statusText}`);
  
        result = await response.json();
      }
  
    } catch (error) {
      console.error(error);
      return [];
    }
  
    return filteredWells.map(well => ({
      id: parseInt(well?.id, 10),
      assetId: well?.attributes?.asset_id,
      name: well?.attributes?.name,
      parent_id: well?.attributes?.pad_id,
      parent_parent_id: well?.attributes?.current_frac_fleet_id,
      status: well?.attributes?.status,
    }));
  };
  