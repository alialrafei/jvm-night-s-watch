import React from 'react';
import { Card, Elevation, H3, H5 } from "@blueprintjs/core";
import { JvmSnapshot } from "../../constants/requestBody";

interface GcDashboardProps {
    snapshot: JvmSnapshot;
}

const GcDashboard: React.FC<GcDashboardProps> = ({ snapshot }) => {
    const { gc } = snapshot;

    return (
        <Card elevation={Elevation.TWO} className="p-4 dark:bg-gray-800">
            <H3>Garbage Collection</H3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gc.map((stats, index) => (
                    <Card key={index} elevation={Elevation.ONE} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <H5>{stats.name}</H5>
                        <div className="flex flex-col gap-2 mt-2">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm block">Collections</span>
                                <span className="text-xl font-bold dark:text-gray-100">{stats.collectionCount}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm block">Total Time</span>
                                <span className="text-xl font-bold dark:text-gray-100">{stats.collectionTimeMillis} ms</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
};

export default GcDashboard;
