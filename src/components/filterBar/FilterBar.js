import { AssetsMultipleSelector, ColorPicker, MenuItem, Select, StyledDropdownEditor } from '@corva/ui/components';
import { TextInput } from '@corva/ui/componentsV2';
import { useEffect, useState } from 'react';
import styles from './FilterBar.css'
import { DEFAULT_SETTINGS } from '../../constants';
export default function FilterBar({ setConfig, config, stages, cpDataFiltered, setSource, source, setPaletteColor, paletteColor, settings }) {
    const [stageList, setStageList] = useState([])
    const handleConfig = ({ param, value }) => {
        if (param == "stageMode" && value == "all") {
            setConfig("stages", [])
        }
        setConfig(param, value)
    }
    useEffect(() => {
        if (stages && Object.keys(stages)?.length > 0) {
            let stageListAux = []
            Object.keys(stages).map((param) => {
                if (stages[param].isip_post != undefined && stages[param].isip_pre != undefined && stages[param].tvd != undefined) {
                    stageListAux.push({ label: `Stage ${stages[param].stage_number}`, value: stages[param].stage_number })
                }
            })
            setStageList(stageListAux)
        }
    }, [stages])
    useEffect(() => {
        if (config?.padSelected?.mode == "pad") {
            handleConfig({ param: "stageMode", value: "all" })
            handleConfig({ param: "stages", value: [] })
        }
    }, [config?.padSelected?.mode])

    return <div className={styles.FilterBar}>
        <Select label="Plot type" defaultValue={config?.graph} onChange={e => handleConfig({ param: "graph", value: e.target.value })}>
            <MenuItem value="Crossplot">Isip pre-post Crossplot</MenuItem>
            <MenuItem value="Isip">Isip Lineplot</MenuItem>
            <MenuItem value="Isip_dots">Isip vs Depth Crossplot</MenuItem>
        </Select>
        {config?.graph == "Isip_dots" && <Select label="Data" defaultValue={config?.dataType} onChange={e => handleConfig({ param: "dataType", value: e.target.value })}>
            <MenuItem value="isip_post">Isip Post</MenuItem>
            <MenuItem value="isip_pre">Isip Pre</MenuItem>
        </Select>}
        <Select defaultValue={"Corva"} label="Source" onChange={e => setSource(e.target.value)}>
            <MenuItem value="Corva">Corva</MenuItem>
            <MenuItem value="PJR">PJR</MenuItem>
        </Select>
        {config?.graph == "Crossplot" && <Select defaultValue={config?.stageMode} label="Stages" onChange={e => handleConfig({ param: "stageMode", value: e.target.value })}>
            <MenuItem value="all">All Stages</MenuItem>
            {config?.padSelected?.mode != "pad" && cpDataFiltered?.length > 0 && <MenuItem value="manual">Manual Stages</MenuItem>}
        </Select>}
        {config?.graph == "Crossplot" && config?.padSelected?.mode != "pad" && config?.stageMode == "manual" && (
            <StyledDropdownEditor
                currentValue={config?.stages}
                placeholder="Select Stages"
                options={stageList}
                onChange={val => handleConfig({ param: "stages", value: val })}
                multiple={true}
                renderValue={(selected) => {
                    if (!selected || selected.length === 0) return '';
                    const labels = stageList
                        .filter(option => selected.includes(option.value))
                        .map(option => option.label);
                    return labels.join(', ');
                }}
            />
        )}
        {config?.graph == "Crossplot" &&
            <TextInput label="Top MD (m)" type='number' value={config.top_perforation} onChange={(e) => handleConfig({ param: "top_perforation", value: e })} />}
        {config?.graph == "Crossplot" && <TextInput label="Bottom MD (m)" type='number' value={config.bottom_perforation} onChange={(e) => handleConfig({ param: "bottom_perforation", value: e })} />}
        {config?.graph == "Isip_dots" &&
            <div>
                <TextInput label="Scale max" type='number' value={config.max} onChange={(e) => { handleConfig({ param: "max", value: e?.length > 0 ? e : undefined }) }} />
                <TextInput label="Scale min" type='number' value={config.min} onChange={(e) => handleConfig({ param: "min", value: e })} />
            </div>
        }
        {config?.graph != 'Isip' && <div className={styles.ColorPicker}>
            {paletteColor.map((color, index) => (
                <ColorPicker
                    key={index}
                    value={color}
                    onChange={(newColor) => {
                        const updated = [...paletteColor];
                        updated[index] = newColor;
                        const defaultPallet = settings?.paletteColors || DEFAULT_SETTINGS.paletteColors
                        defaultPallet[index]= newColor
                        setConfig("paletteColors", defaultPallet)
                        setPaletteColor(updated);
                    }}
                />
            ))}
        </div>}
    </div>
}