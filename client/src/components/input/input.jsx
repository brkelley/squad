import './input.scss';
import React, { useState } from 'react';

const Input = props => {
    const { placeholder, change, value } = props;
    const [localValue, setLocalValue] = useState(value);

    const onChange = event => {
        setLocalValue(event.target.value);
        change(event.target.value);
    };

    return (
        <div className="input-wrapper">
            <input
                type="text"
                value={localValue}
                className="input-box"
                placeholder={placeholder}
                onChange={onChange} />
        </div>
    );
};

export default Input;
