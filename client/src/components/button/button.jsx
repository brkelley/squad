import './button.scss';
import React from 'react';
import Button from '@material-ui/core/Button';

export default function SquadButton (props) {
    const { buttonLabel, loading, click } = props;

    const renderButtonText = () => {
        if (loading) {
            return (
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            );
        } else {
            return buttonLabel;
        }
    }

    return (
        <Button
            className="squad-button"
            variant="contained"
            onClick={click}>
            {renderButtonText()}
        </Button>
    );
}
