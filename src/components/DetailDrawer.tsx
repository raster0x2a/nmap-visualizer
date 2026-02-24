import { Host, Port } from '../lib/nmap-parser';
import { X, Globe, Cpu, Terminal, Shield } from 'lucide-react';

interface DetailDrawerProps {
    data: Host | Port | null;
    onClose: () => void;
}

export function DetailDrawer({ data, onClose }: DetailDrawerProps) {
    if (!data) return null;

    const isHost = 'ip' in data;
    const title = isHost ? (data as Host).ip : `Port ${(data as Port).portId}/${(data as Port).protocol}`;

    return (
        <div className="absolute top-0 right-0 h-full w-96 bg-slate-800 border-l border-slate-700 shadow-2xl flex flex-col z-20 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-2">
                    {isHost ? <Globe className="text-emerald-400" /> : <Shield className="text-sky-400" />}
                    <h2 className="text-lg font-bold text-slate-100">{title}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6 custom-scrollbar">
                {isHost ? (
                    <HostDetails host={data as Host} />
                ) : (
                    <PortDetails port={data as Port} />
                )}
            </div>
        </div>
    );
}

function HostDetails({ host }: { host: Host }) {
    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Cpu size={14} /> System Information
                </h3>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-slate-400">IP Address</div>
                        <div className="text-emerald-400 font-mono">{host.ip}</div>
                        <div className="text-slate-400">OS (Detected)</div>
                        <div className="text-slate-200">{host.os || 'Unknown'}</div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Port Summary</h3>
                <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-center">
                        <div className="text-xl font-bold text-emerald-400">{host.ports.filter(p => p.state === 'open').length}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Open</div>
                    </div>
                    <div className="flex-1 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-center">
                        <div className="text-xl font-bold text-slate-400">{host.ports.filter(p => p.state !== 'open').length}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Closed/Other</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PortDetails({ port }: { port: Port }) {
    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield size={14} /> Service Info
                </h3>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-slate-400">Port</div>
                        <div className="text-sky-400 font-mono font-bold">{port.portId}/{port.protocol}</div>
                        <div className="text-slate-400">Status</div>
                        <div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${port.state === 'open' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {port.state}
                            </span>
                        </div>
                        <div className="text-slate-400">Service</div>
                        <div className="text-slate-100 font-semibold">{port.service}</div>
                        <div className="text-slate-400">Version</div>
                        <div className="text-slate-300 text-xs italic">{port.version || 'No version info'}</div>
                    </div>
                </div>
            </section>

            {port.scripts && Object.keys(port.scripts).length > 0 && (
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Terminal size={14} /> Script Execution Results
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(port.scripts).map(([name, output]) => (
                            <div key={name} className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                                <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-sky-400 font-bold">{name}</span>
                                </div>
                                <pre className="p-3 text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
                                    {output}
                                </pre>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
