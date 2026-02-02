import React, { useMemo, useState } from 'react';
import { Card, Elevation, H3, HTMLTable, Button, InputGroup } from "@blueprintjs/core";
import { JvmSnapshot } from "../../constants/requestBody";

interface ClassHistogramProps {
    snapshot: JvmSnapshot;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ClassHistogram: React.FC<ClassHistogramProps> = ({ snapshot }) => {
    const { histogram } = snapshot;
    const [showAll, setShowAll] = useState(false);
    const [filter, setFilter] = useState("");

    const displayedData = useMemo(() => {
        let data = histogram;
        if (filter) {
            data = data.filter(Entry => Entry.className.toLowerCase().includes(filter.toLowerCase()));
        }
        // Sort by bytes desc by default
        data = [...data].sort((a, b) => b.bytes - a.bytes);

        return showAll ? data : data.slice(0, 20);
    }, [histogram, showAll, filter]);

    return (
        <Card elevation={Elevation.TWO} className="p-4 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                <H3>Class Histogram</H3>
                <div className="flex gap-2">
                    <InputGroup
                        leftIcon="search"
                        placeholder="Filter class name..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-64"
                    />
                    <Button
                        icon={showAll ? "eye-off" : "eye-open"}
                        text={showAll ? "Show Top 20" : "Show All"}
                        onClick={() => setShowAll(!showAll)}
                    />
                </div>
            </div>
            <div className="overflow-auto max-h-[500px]">
                <HTMLTable compact interactive striped className="w-full">
                    <thead>
                        <tr className="dark:text-gray-100">
                            <th>Class Name</th>
                            <th>Instances</th>
                            <th>Bytes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedData.map((entry, idx) => (
                            <tr key={idx} className="dark:text-gray-100">
                                <td className="font-mono text-sm">{entry.className}</td>
                                <td>{entry.instances.toLocaleString()}</td>
                                <td>{formatBytes(entry.bytes)}</td>
                            </tr>
                        ))}
                    </tbody>
                </HTMLTable>
            </div>
            {!showAll && histogram.length > 20 && (
                <div className="text-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
                    Showing top 20 of {histogram.length} classes
                </div>
            )}
        </Card>
    );
};

export default ClassHistogram;
