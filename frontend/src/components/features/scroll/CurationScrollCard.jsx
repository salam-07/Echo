import React from 'react';
import { BookOpen } from 'lucide-react';
import ScrollCard from './ScrollCard';

const CurationScrollCard = ({ scroll, compact = false }) => {
    return (
        <ScrollCard
            scroll={scroll}
            compact={compact}
            showIcon={true}
            icon={BookOpen}
            showTags={false}
        />
    );
};

export default CurationScrollCard;