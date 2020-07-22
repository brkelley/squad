import './input.scss';
import React, { useState } from 'react';

const Input = props => {
    const { placeholder, change, value, prefix, suffix, blur } = props;
    const [localValue, setLocalValue] = useState(value);

    const onChange = event => {
        setLocalValue(event.target.value);
        change(event.target.value);
    };

    return (
        <div className="input-wrapper">
            <div className="input-prefix">
                {prefix ? prefix : ''}
            </div>
            <input
                type="text"
                value={localValue}
                className="input-box"
                placeholder={placeholder}
                onBlur={blur}
                onChange={onChange} />
            <div className="input-suffix">
                {suffix ? suffix : ''}
            </div>
        </div>
    );
};

export default Input;
