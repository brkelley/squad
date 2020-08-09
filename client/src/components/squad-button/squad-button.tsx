import './squad-button.scss';
import React from 'react';
import Button from '@material-ui/core/Button';

interface SquadButtonProps {
    label: string
    loading?: boolean
    click: Function
}
export default function SquadButton ({
    label,
    loading,
    click
}: SquadButtonProps) {
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
            return label;
        }
    }

    return (
        <Button
            variant="contained"
            className="squad-button"
            onClick={() => click()}>
            {renderButtonText()}
        </Button>
    );
};
