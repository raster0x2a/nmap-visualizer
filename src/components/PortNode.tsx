import { Handle, Position } from 'reactflow';
import { Port } from '../lib/nmap-parser';

interface PortNodeProps {
    data: {
        port: Port;
    };
}

export function PortNode({ data }: PortNodeProps) {
    const { port } = data;
    const isOpen = port.state === 'open';

    return (
        <div className={`bg-slate-800 border-2 rounded-lg shadow-lg p-3 min-w-[150px] text-slate-200 ${isOpen ? 'border-sky-500' : 'border-slate-600'}`}>
            <Handle type="target" position={Position.Left} className={`w-3 h-3 border-2 border-slate-800 ${isOpen ? 'bg-sky-500' : 'bg-slate-600'}`} />

            <div className="flex items-center gap-2 mb-2">
                <div className={`font-mono font-bold text-lg ${isOpen ? 'text-sky-400' : 'text-slate-400'}`}>
                    {port.portId}
                </div>
                <div className="text-xs text-slate-500 lowercase">
                    /{port.protocol}
                </div>
                <div className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isOpen ? 'bg-sky-900/50 text-sky-400' : 'bg-slate-700 text-slate-400'}`}>
                    {port.state}
                </div>
            </div>

            <div className="text-sm font-semibold text-slate-300">
                {port.service || 'unknown'}
            </div>

            {port.version && (
                <div className="text-xs text-slate-400 mt-1 truncate" title={port.version}>
                    {port.version}
                </div>
            )}

            <Handle type="source" position={Position.Right} className={`w-3 h-3 border-2 border-slate-800 ${isOpen ? 'bg-sky-500' : 'bg-slate-600'}`} />
        </div>
    );
}
