import { Handle, Position } from 'reactflow';
import { Host } from '../lib/nmap-parser';

interface HostNodeProps {
    data: {
        host: Host;
    };
}

export function HostNode({ data }: HostNodeProps) {
    const { host } = data;

    return (
        <div className="bg-slate-800 border-2 border-emerald-500 rounded-lg shadow-lg p-4 min-w-[200px] text-slate-200">
            <div className="flex flex-col items-center border-b border-slate-700 pb-2 mb-2">
                <div className="text-emerald-400 font-bold text-lg mb-1">{host.ip}</div>
                {host.os && (
                    <div className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                        {host.os}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">Total Ports:</span>
                    <span className="font-mono text-emerald-400">{host.ports.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Open Ports:</span>
                    <span className="font-mono text-emerald-400">
                        {host.ports.filter(p => p.state === 'open').length}
                    </span>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500 border-2 border-slate-800" />
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500 border-2 border-slate-800" />
        </div>
    );
}
