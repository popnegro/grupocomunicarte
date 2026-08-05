
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortablePageItem from './mediakit-builder/SortablePageItem';

// This would be in a types file
interface MediaKitAsset {
    id: string;
    assetId: string;
    assetType: string;
    order: number;
}

interface MediaKitSection {
    id: string;
    type: string;
    order: number;
    settings: any;
    assets: MediaKitAsset[];
}

interface MediaKitPage {
    id: string;
    pageNumber: number;
    title: string | null;
    sections: MediaKitSection[];
}

interface MediaKit {
    id:string;
    name: string;
    status: string;
    version: number;
    pages: MediaKitPage[];
    // other fields
}


const MediaKitBuilderView = () => {
    const { id } = useParams<{ id: string }>();
    const [mediaKit, setMediaKit] = useState<MediaKit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchMediaKit = async () => {
            try {
                setLoading(true);
                // Using the new p7 endpoint
                const response = await fetch(`/api/v1/p7/mediakits/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Media Kit data.');
                }
                const result = await response.json();
                if (result.success) {
                    setMediaKit(result.data);
                } else {
                    throw new Error(result.message || 'Failed to load Media Kit.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMediaKit();
        }
    }, [id]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        setMediaKit((kit) => {
            if (!kit) return null;

            // Scenario 1: Dragging a Page over another Page
            if (activeType === 'page' && overType === 'page') {
                const oldIndex = kit.pages.findIndex((p) => p.id === active.id);
                const newIndex = kit.pages.findIndex((p) => p.id === over.id);
                const newPages = arrayMove(kit.pages, oldIndex, newIndex);
                const finalPages = newPages.map((page, index) => ({ ...page, pageNumber: index + 1 }));
                return { ...kit, pages: finalPages };
            }

            // Scenario 2: Dragging a Section over another Section (within the same or different page)
            if (activeType === 'section' && overType === 'section') {
                let newPages = [...kit.pages];
                const activeSection = active.data.current.section;
                const overSection = over.data.current.section;

                // Find parent pages
                const activePageIdx = newPages.findIndex(p => p.sections.some(s => s.id === active.id));
                const overPageIdx = newPages.findIndex(p => p.sections.some(s => s.id === over.id));
                
                if (activePageIdx === -1 || overPageIdx === -1) return kit;

                // Reordering within the same page
                if (activePageIdx === overPageIdx) {
                    const page = newPages[activePageIdx];
                    const oldSectionIndex = page.sections.findIndex(s => s.id === active.id);
                    const newSectionIndex = page.sections.findIndex(s => s.id === over.id);
                    
                    const reorderedSections = arrayMove(page.sections, oldSectionIndex, newSectionIndex);
                    const finalSections = reorderedSections.map((section, index) => ({ ...section, order: index + 1}));

                    newPages[activePageIdx] = { ...page, sections: finalSections };
                } else {
                    // Moving section to a different page
                    const activePage = newPages[activePageIdx];
                    const overPage = newPages[overPageIdx];

                    // Remove from old page
                    const activeSectionIndex = activePage.sections.findIndex(s => s.id === active.id);
                    const [movedSection] = activePage.sections.splice(activeSectionIndex, 1);

                    // Add to new page
                    const overSectionIndex = overPage.sections.findIndex(s => s.id === over.id);
                    overPage.sections.splice(overSectionIndex, 0, movedSection);
                    
                    // Update orders
                    newPages[activePageIdx] = { ...activePage, sections: activePage.sections.map((s, i) => ({ ...s, order: i + 1})) };
                    newPages[overPageIdx] = { ...overPage, sections: overPage.sections.map((s, i) => ({ ...s, order: i + 1})) };
                }

                return { ...kit, pages: newPages };
            }

            // TODO: Handle dragging a Section over a Page (to add it to the end)

            return kit; // Return original kit if no logic matches
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <Skeleton className="h-12 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/4 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{mediaKit?.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Version: {mediaKit?.version} | Status: <span className="font-semibold">{mediaKit?.status}</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium mb-4">Pages & Sections</h3>
                        <SortableContext items={mediaKit?.pages.map(p => p.id) || []} strategy={verticalListSortingStrategy}>
                            {mediaKit?.pages.map(page => (
                                <SortablePageItem key={page.id} page={page} />
                            ))}
                        </SortableContext>
                    </div>
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium mb-2">Live Preview</h3>
                            {/* Live preview will go here */}
                             <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg min-h-[400px] text-center text-gray-500 dark:text-gray-400">
                                Live preview area
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-black text-white p-4 rounded-lg font-mono text-xs">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">Raw Data (for testing)</h3>
                    <pre>
                        {JSON.stringify(mediaKit, null, 2)}
                    </pre>
                </div>
            </div>
        </DndContext>
    );
};

export default MediaKitBuilderView;
