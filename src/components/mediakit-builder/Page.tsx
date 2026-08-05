
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableSectionItem from './SortableSectionItem';

// This would be in a types file
interface MediaKitSection {
    id: string;
    type: string;
    order: number;
    settings: any;
}

interface MediaKitPage {
    id: string;
    pageNumber: number;
    title: string | null;
    sections: MediaKitSection[];
}

interface PageProps {
    page: MediaKitPage;
}

const Page: React.FC<PageProps> = ({ page }) => {
    return (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-4 border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{page.title || `Page ${page.pageNumber}`}</h4>
                <div className="text-sm text-gray-500 dark:text-gray-400">Page {page.pageNumber}</div>
            </div>
            
            <SortableContext items={page.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg">
                    {page.sections.map(section => (
                        <SortableSectionItem key={section.id} section={section} />
                    ))}
                    {page.sections.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                            Drag sections here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default Page;
