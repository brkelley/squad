import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function Dropdown (props) {
    let { options, value, onChange } = props;

    return (
        <FormControl className="form-control-wrapper">
            <Select
                value={value}
                onChange={onChange}
                className="dropdown-wrapper"
                autoWidth={false}>
                {options.map(option => (
                    <MenuItem
                        key={option.value}
                        value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
