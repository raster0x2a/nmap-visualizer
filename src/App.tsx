import { useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    MarkerType,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

import { NmapParser, Host, Port } from './lib/nmap-parser';
import { HostNode } from './components/HostNode';
import { PortNode } from './components/PortNode';
import { DetailDrawer } from './components/DetailDrawer';

const nodeTypes = {
    host: HostNode,
    port: PortNode,
};

function App() {
    const [nmapOutput, setNmapOutput] = useState('');
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedData, setSelectedData] = useState<Host | Port | null>(null);

    const handleParse = useCallback(() => {
        if (!nmapOutput.trim()) return;

        const data = NmapParser.parse(nmapOutput);
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        let hostY = 50;

        data.forEach((host: Host) => {
            const hostNodeId = `host-${host.ip}`;

            // Host Node
            newNodes.push({
                id: hostNodeId,
                type: 'host',
                position: { x: 50, y: hostY },
                data: { host },
            });

            // Port Nodes
            let portYOffset = -((host.ports.length - 1) * 120) / 2;
            host.ports.forEach((port: Port, index: number) => {
                const portNodeId = `port-${host.ip}-${port.portId}`;

                newNodes.push({
                    id: portNodeId,
                    type: 'port',
                    position: { x: 400, y: hostY + portYOffset + index * 120 },
                    data: { port },
                });

                newEdges.push({
                    id: `edge-${hostNodeId}-${portNodeId}`,
                    source: hostNodeId,
                    target: portNodeId,
                    type: 'smoothstep',
                    animated: port.state === 'open',
                    style: { stroke: port.state === 'open' ? '#38bdf8' : '#475569', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: port.state === 'open' ? '#38bdf8' : '#475569',
                    },
                });
            });

            hostY += Math.max(300, host.ports.length * 120 + 100);
        });

        setSelectedData(null);
        setNodes(newNodes);
        setEdges(newEdges);
    }, [nmapOutput, setNodes, setEdges]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        if (node.type === 'host') {
            setSelectedData(node.data.host);
        } else if (node.type === 'port') {
            setSelectedData(node.data.port);
        }
    }, []);

    return (
        <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
            <div className="w-1/3 min-w-[300px] max-w-[500px] flex flex-col border-r border-slate-700 bg-slate-800 p-4 shrink-0 shadow-2xl z-10">
                <h1 className="text-2xl font-bold mb-2 text-emerald-400 flex items-center gap-2">
                    <span className="text-3xl">🌐</span> Nmap Visualizer
                </h1>
                <p className="text-slate-400 text-sm mb-4">
                    Paste your raw Nmap scan output below to visualize the network topology.
                </p>
                <textarea
                    className="flex-1 w-full bg-slate-950 text-slate-300 p-4 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none font-mono text-sm leading-relaxed"
                    placeholder="Nmap scan report for 192.168.1.1&#10;PORT    STATE SERVICE&#10;22/tcp  closed ssh&#10;80/tcp  open  http&#10;443/tcp open  https"
                    value={nmapOutput}
                    onChange={(e) => setNmapOutput(e.target.value)}
                />
                <button
                    className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleParse}
                    disabled={!nmapOutput.trim()}
                >
                    Visualize Network
                </button>
            </div>
            <div className="flex-1 flex flex-col bg-slate-950 relative">
                {nodes.length > 0 ? (
                    <>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick}
                            nodeTypes={nodeTypes}
                            fitView
                            className="bg-slate-950"
                            minZoom={0.2}
                        >
                            <Background color="#334155" gap={24} size={2} />
                            <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
                            <MiniMap
                                nodeStrokeColor={(n) => n.type === 'host' ? '#10b981' : n.data?.port?.state === 'open' ? '#0ea5e9' : '#475569'}
                                nodeColor={() => '#1e293b'}
                                maskColor="rgba(15, 23, 42, 0.7)"
                                className="bg-slate-900 border border-slate-800"
                            />
                        </ReactFlow>
                        <DetailDrawer
                            data={selectedData}
                            onClose={() => setSelectedData(null)}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                        <div className="text-6xl mb-4 opacity-50">🗺️</div>
                        <h2 className="text-xl font-semibold text-slate-400">Waiting for data...</h2>
                        <p className="text-sm max-w-md text-center leading-relaxed">
                            Paste your Nmap scan results in the left panel and click visualize to see your network structure mapped out here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
