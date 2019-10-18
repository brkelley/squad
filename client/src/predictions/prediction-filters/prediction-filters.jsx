import React from 'react';
import Dropdown from '../../components/dropdown/dropdown.jsx';
import isEmpty from 'lodash/isEmpty';

export default class PredictionFilters extends React.Component {
    constructor (props) {
        super(props);

        this.componentDidUpdate();
        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate () {
        let filtersValid = true;
        Object.values(this.props.filters, filter => {
            filtersValid = filtersValid && isEmpty(filter);
        });
        if (filtersValid) {
            this.props.onValidFilters();
        }
    }

    onChange (event, type) {
        this.props.setPredictionFilters(type, event.target.value);
    }

    render () {
        return (
            <div className="predictions-filters">
                <div className="prediction-dropdown">
                    <Dropdown
                        value={this.props.filters.section}
                        options={[
                            {
                                value: 'playins',
                                label: 'Play-Ins'
                            },
                            {
                                value: 'main',
                                label: 'Main'
                            }
                        ]}
                        onChange={event => this.onChange(event, 'section')} />
                </div>
                <div className="prediction-dropdown">
                    <Dropdown
                        value={this.props.filters.stage}
                        options={[
                            {
                                value: 'groups',
                                label: 'Groups'
                            },
                            {
                                value: 'knockout',
                                label: 'Knockout'
                            }
                        ]}
                        onChange={event => this.onChange(event, 'stage')} />
                </div>
                <div className="prediction-dropdown">
                    <Dropdown
                        value={this.props.filters.round}
                        options={[
                            {
                                value: 'round1',
                                label: 'Round 1'
                            },
                            {
                                value: 'round2',
                                label: 'Round 2'
                            }
                        ]}
                        onChange={event => this.onChange(event, 'round')} />
                </div>
            </div>
        );
    }
}
