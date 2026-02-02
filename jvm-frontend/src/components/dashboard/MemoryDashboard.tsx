import React from 'react';
import { Card, Elevation, H3, H5, ProgressBar, Intent } from "@blueprintjs/core";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { JvmSnapshot, MemoryPool } from "../../constants/requestBody";
import { useTheme } from "../../contexts/ThemeContext";

interface MemoryDashboardProps {
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

const MemoryDashboard: React.FC<MemoryDashboardProps> = ({ snapshot }) => {
    const { isDarkMode } = useTheme();
    const { memory, pools } = snapshot;

    // Define chart colors
    const axisColor = isDarkMode ? '#D1D5DB' : '#374151'; // gray-300 : gray-700
    const tooltipStyle = isDarkMode ? { backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' } : {};

    // Prepare data for the main memory chart (Heap vs Non-Heap)
    const memoryData = [
        {
            name: 'Heap',
            used: memory.heapUsed,
            committed: memory.heapCommitted,
            max: memory.heapMax,
        },
        {
            name: 'Non-Heap',
            used: memory.nonHeapUsed,
            committed: memory.nonHeapCommitted,
            // nonHeapMax might be -1 if undefined, handle accordingly. 
            // Often non-heap max is -1 (undefined), so we can default to something or just show committed
            max: memory.heapMax === -1 ? memory.nonHeapCommitted * 1.2 : memory.heapMax,
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Memory Overview Chart */}
            <Card elevation={Elevation.TWO} className="p-4 dark:bg-gray-800">
                <H3>Memory Overview</H3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={memoryData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                            <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor }} />
                            <YAxis tickFormatter={(value) => formatBytes(value, 0)} stroke={axisColor} tick={{ fill: axisColor }} />
                            <Tooltip
                                formatter={(value: any) => formatBytes(value)}
                                contentStyle={tooltipStyle}
                                cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                            />
                            <Legend wrapperStyle={{ color: axisColor }} />
                            <Bar dataKey="used" fill="#8884d8" name="Used" />
                            <Bar dataKey="committed" fill="#82ca9d" name="Committed" />
                            <Bar dataKey="max" fill="#ffc658" name="Max" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Memory Pools Breakdown */}
            <Card elevation={Elevation.TWO} className="p-4 dark:bg-gray-800">
                <H3>Memory Pools</H3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {pools.map((pool: MemoryPool) => {
                        const percentUsed = pool.max > 0 ? pool.used / pool.max : (pool.committed > 0 ? pool.used / pool.committed : 0);
                        const intent = percentUsed > 0.9 ? Intent.DANGER : (percentUsed > 0.7 ? Intent.WARNING : Intent.PRIMARY);

                        return (
                            <div key={pool.name} className="w-full">
                                <div className="flex justify-between mb-1">
                                    <H5 className="mb-0 dark:text-gray-200">{pool.name}</H5>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                                        {formatBytes(pool.used)} / {formatBytes(pool.max > 0 ? pool.max : pool.committed)}
                                    </span>
                                </div>
                                <ProgressBar value={percentUsed} intent={intent} animate={false} stripes={false} />
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default MemoryDashboard;
