
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Section from './Section';

// This would be in a types file
interface MediaKitSection {
    id: string;
    type: string;
    order: number;
    settings: any;
}

interface SortableSectionItemProps {
    section: MediaKitSection;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({ section }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: section.id,
        data: {
            type: 'section',
            section: section,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Section section={section} />
        </div>
    );
};

export default SortableSectionItem;
