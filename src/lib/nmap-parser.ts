export interface Host {
    ip: string;
    ports: Port[];
    os?: string;
}

export interface Port {
    portId: number;
    protocol: string;
    state: string;
    service: string;
    version?: string;
    scripts?: Record<string, string>;
}

export class NmapParser {
    static parse(rawText: string): Host[] {
        const lines = rawText.split('\n');
        const hosts: Host[] = [];
        let currentHost: Host | null = null;
        let currentPort: Port | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trimEnd();

            // Nmap scan report for <host> (<ip>)
            const hostMatch = line.match(/^Nmap scan report for (.*?)(?:\s+\((.*?)\))?$/);
            if (hostMatch) {
                if (currentHost) hosts.push(currentHost);
                currentHost = {
                    ip: hostMatch[2] || hostMatch[1], // User IP if available, fallback to hostname
                    ports: [],
                };
                continue;
            }

            if (!currentHost) continue;

            // PORT     STATE SERVICE VERSION
            // 80/tcp   open  http    nginx 1.18.0
            const portMatch = line.match(/^(\d+)\/([a-zA-Z0-9_-]+)\s+([a-zA-Z0-9_-]+)\s+([^\s]+)(?:\s+(.*))?$/);
            const isPortHeader = line.startsWith('PORT') && line.includes('STATE');

            if (portMatch && !isPortHeader) {
                currentPort = {
                    portId: parseInt(portMatch[1], 10),
                    protocol: portMatch[2],
                    state: portMatch[3],
                    service: portMatch[4],
                    version: portMatch[5] || '',
                    scripts: {},
                };
                currentHost.ports.push(currentPort);
                continue;
            }

            // Script output handling
            // |_script-name: result
            // | script-name:
            // |   nested-key: value
            if (line.startsWith('|')) {
                const scriptMatch = line.match(/^\|\s+([^:]+):\s*(.*)/);
                const scriptInlineMatch = line.match(/^\|_?\s*([^:]+):\s+(.*)/);

                if (currentPort) {
                    if (scriptInlineMatch || scriptMatch) {
                        const match = scriptInlineMatch || scriptMatch;
                        if (match) {
                            const key = match[1].trim();
                            const value = match[2].trim();
                            if (!currentPort.scripts) currentPort.scripts = {};
                            currentPort.scripts[key] = value;
                        }
                    } else {
                        // Continuation or nested data
                        const rawMatch = line.match(/^\|\s*(.*)/);
                        if (rawMatch && currentPort.scripts) {
                            const keys = Object.keys(currentPort.scripts);
                            if (keys.length > 0) {
                                const lastKey = keys[keys.length - 1];
                                currentPort.scripts[lastKey] += '\n' + rawMatch[1].trimEnd();
                            }
                        }
                    }
                }
            }
        }

        if (currentHost) {
            hosts.push(currentHost);
        }

        return hosts;
    }
}
