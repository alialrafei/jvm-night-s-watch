import React, { useMemo, useState } from 'react';
import { Card, Elevation, H3, HTMLTable, InputGroup } from "@blueprintjs/core";
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { JvmSnapshot, ThreadInfo } from "../../constants/requestBody";

interface ThreadDashboardProps {
    snapshot: JvmSnapshot;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const ThreadDashboard: React.FC<ThreadDashboardProps> = ({ snapshot }) => {
    const { threadsInfos } = snapshot;
    const [filter, setFilter] = useState("");

    // Aggregate thread states for Pie Chart
    const stateData = useMemo(() => {
        const counts: Record<string, number> = {};
        threadsInfos.forEach(t => {
            counts[t.threadState] = (counts[t.threadState] || 0) + 1;
        });
        return Object.keys(counts).map(state => ({
            name: state,
            value: counts[state]
        }));
    }, [threadsInfos]);

    // Filter threads
    const filteredThreads = useMemo(() => {
        if (!filter) return threadsInfos;
        const lowerFilter = filter.toLowerCase();
        return threadsInfos.filter(t =>
            t.threadName.toLowerCase().includes(lowerFilter) ||
            t.threadState.toLowerCase().includes(lowerFilter)
        );
    }, [threadsInfos, filter]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Thread State Chart */}
            <Card elevation={Elevation.TWO} className="p-4 dark:bg-gray-800">
                <H3>Thread States</H3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={stateData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {stateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    Total Threads: <strong>{threadsInfos.length}</strong>
                </div>
            </Card>

            {/* Thread List Table */}
            <Card elevation={Elevation.TWO} className="p-4 flex flex-col h-[400px] dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <H3>Threads</H3>
                    <InputGroup
                        leftIcon="search"
                        placeholder="Filter threads..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="overflow-auto flex-1">
                    <HTMLTable compact interactive striped className="w-full">
                        <thead>
                            <tr>
                                <th className="sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm dark:text-gray-100">Name</th>
                                <th className="sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm dark:text-gray-100">State</th>
                                <th className="sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm dark:text-gray-100">Blocked (ms)</th>
                                <th className="sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm dark:text-gray-100">Waited (ms)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredThreads.map(thread => (
                                <tr key={thread.threadId} className="dark:text-gray-100">
                                    <td className="truncate max-w-[200px]" title={thread.threadName}>{thread.threadName}</td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${thread.threadState === 'RUNNABLE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                            thread.threadState === 'BLOCKED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                                                thread.threadState === 'WAITING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            }`}>
                                            {thread.threadState}
                                        </span>
                                    </td>
                                    <td>{thread.blockedTime}</td>
                                    <td>{thread.waitedTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </div>
            </Card>

            {/* Thread Dump */}
            <Card elevation={Elevation.TWO} className="p-4 col-span-1 lg:col-span-2 dark:bg-gray-800">
                <H3>Thread Dump</H3>
                <div className="mt-2 bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-auto max-h-[500px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap dark:text-gray-300">{snapshot.dump}</pre>
                </div>
            </Card>
        </div>
    );
};

export default ThreadDashboard;
