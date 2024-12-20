import React from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { useTheme } from '@mui/material/styles';
import {FormControl, FormLabel, Select, Chip} from '@mui/material';
import { Box } from "@mui/system";
import { MenuItem } from "@mui/material";
 
const ITEM_HEIGHT = 45;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
 
const names = [
    'Stack',
    'Queue',
    'Array'
];
 
function getStyles(algo, algorithm, theme) {
    return {
        fontWeight:
            algorithm.indexOf(algo) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
 
function MultiSelect(props) {
    const { modalities } = props;
    console.log(modalities);
    const theme = useTheme();
    const [algorithm, setAlgorithm] = React.useState([]);
 
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setAlgorithm(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
 
    return (
                    <Select
                        labelId="demo-multiple-chip-label"
                        multiple
                        value={algorithm}
                        onChange={handleChange}
                    
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex',
                            flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} 
                                        label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {modalities?.map((data) => (
                            <MenuItem
                                key={data._id}
                                value={data._id}
                                // style={getStyles(algo, algorithm, theme)}
                            >
                                {data.term}({data.decription})
                            </MenuItem>
                        ))}
                    </Select>
    );
}
 
export default MultiSelect;