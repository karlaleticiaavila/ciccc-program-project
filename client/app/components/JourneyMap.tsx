"use client";

import {
    ReactFlow,Background,Controls,MiniMap,} from "@xyflow/react";


    import "@xyflow/react/dist/style.css";

    const nodes = [
        {
            id: "1",
            position: { x: 100, y: 100 },
            data: { label: "Started Web Development" },
        },
        {
            id: "2",
            position: { x: 450, y: 100 },
            data: { label: "Learned HTML, CSS, and JavaScript" },
        },
        {
            id: "3",
            position: { x: 850, y: 150 },
            data: { label: "Built First Web App Who are you becoming?" },
        },
    ];

    const edges = [
        { id: "e1-2", source: "1", target: "2" ,animated:true},
        { id: "e2-3", source: "2", target: "3" ,animated:true},
    ];

    export default function JourneyMap() {
        return (
            <div style={{ width: "100%", height: "700px", color: "black" }}>
                <ReactFlow nodes={nodes} edges={edges} fitView>
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        );
    }