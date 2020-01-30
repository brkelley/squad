import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { ThemeProvider } from '@material-ui/styles';

export default function Dropdown (props) {
    let { options, value, onChange } = props;

    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
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
        </ThemeProvider>
    );
}
