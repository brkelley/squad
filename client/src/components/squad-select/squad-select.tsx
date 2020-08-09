import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme } from '@material-ui/core';
import get from 'lodash/get';

const useStyles = makeStyles((theme: Theme) => {
    return ({
        select: {
            width: 150,
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main
        },
        icon: {
            fill: theme.palette.primary.main
        }
    });
});

export interface SquadSelectOptions {
    label: string;
    value: string;
};
interface SquadSelectProps {
    options: SquadSelectOptions[];
    value: string;
    onChange: Function;
};
const SquadSelect = ({
    options,
    value,
    onChange
}: SquadSelectProps) => {
    const classes = useStyles()
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div className="squad-select">
            <Select
                classes={{
                    root: classes.select,
                    icon: classes.icon
                }}
                value={value || ''}
                onChange={handleChange}>
                {
                    ...options.map((option) => (
                        <MenuItem
                            value={option.value}
                            key={option.value}>
                            {option.label}
                        </MenuItem>
                    ))
                }
            </Select>
        </div>
    )
};

export default SquadSelect;
