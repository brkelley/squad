import groupBy from 'lodash/groupBy';
import moment from 'moment';

export const groupMatchesByDay = predictions => {
    const { matches } = predictions;
    return groupBy(matches, ({ time }) => {
        return moment(time).format('M-D');
    });
};
