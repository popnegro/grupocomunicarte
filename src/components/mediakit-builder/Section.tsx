
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

// This would be in a types file
interface MediaKitSection {
    id: string;
    type: string;
    order: number;
    settings: any;
    // assets: MediaKitAsset[];
}

interface SectionProps {
    section: MediaKitSection;
}

const Section: React.FC<SectionProps> = ({ section }) => {
    return (
        <Card className="mb-4 bg-gray-50 dark:bg-gray-800">
            <CardHeader className="p-4">
                <CardTitle className="text-md flex justify-between items-center">
                    <span>{section.type}</span>
                    <span className="text-xs font-normal text-gray-400">Order: {section.order}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm text-gray-600 dark:text-gray-300">
                {/* Content of the section based on its type will go here */}
                <pre className="bg-black text-white p-2 rounded-md text-xs">
                    {JSON.stringify(section.settings, null, 2)}
                </pre>
            </CardContent>
        </Card>
    );
};

export default Section;
