
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Page from './Page'; // Assuming Page component is in the same directory

// This would be in a types file
interface MediaKitPage {
    id: string;
    pageNumber: number;
    title: string | null;
    sections: any[]; // Simplified for now
}

interface SortablePageItemProps {
    page: MediaKitPage;
}

const SortablePageItem: React.FC<SortablePageItemProps> = ({ page }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: page.id,
        data: {
            type: 'page',
            page: page,
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
            <Page page={page} />
        </div>
    );
};

export default SortablePageItem;
