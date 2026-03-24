import { useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../store/useStore';

export const Diagramas = () => {
  const { procesosTrabajo, procesosPeligrosos, procesosPositivos, activeEmpresaId } = useStore();

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    let yOffset = 50;

    const filteredPT = procesosTrabajo.filter(pt => !activeEmpresaId || pt.empresaId === activeEmpresaId);

    filteredPT.forEach((pt) => {
      // Create PT Node
      nodes.push({
        id: `pt-${pt.id}`,
        position: { x: 400, y: yOffset },
        data: { label: `${pt.codigo}: ${pt.denominacion}` },
        style: { 
          background: 'var(--bg-primary)', 
          color: 'var(--text-primary)', 
          border: '2px solid var(--accent-primary)',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 'bold',
          width: 200
        }
      });

      const peligrosos = procesosPeligrosos.filter(pp => pp.procesoTrabajoId === pt.id);
      const positivos = procesosPositivos.filter(po => po.procesoTrabajoId === pt.id);

      // Create Peligrosos Nodes (Left)
      peligrosos.forEach((pp, pIndex) => {
        const pId = `pp-${pp.id}`;
        nodes.push({
          id: pId,
          position: { x: 50, y: yOffset + (pIndex * 70) },
          data: { label: `${pp.codigo}: ${pp.peligro}\n(${pp.elemento})` },
          style: { 
            background: 'var(--bg-primary)', 
            color: '#ef4444', 
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            width: 250
          }
        });

        edges.push({
          id: `e-pp-${pp.id}-pt-${pt.id}`,
          source: pId,
          target: `pt-${pt.id}`,
          animated: true,
          style: { stroke: '#ef4444' }
        });
      });

      // Create Positivos Nodes (Right)
      positivos.forEach((po, pIndex) => {
        const poId = `po-${po.id}`;
        nodes.push({
          id: poId,
          position: { x: 750, y: yOffset + (pIndex * 70) },
          data: { label: `${po.codigo}: ${po.medida}` },
          style: { 
            background: 'var(--bg-primary)', 
            color: '#10b981', 
            border: '2px solid #10b981',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            width: 250
          }
        });

        edges.push({
          id: `e-pt-${pt.id}-po-${po.id}`,
          source: `pt-${pt.id}`,
          target: poId,
          animated: true,
          style: { stroke: '#10b981' }
        });
      });

      // Adjust yOffset for next PT
      const maxChildren = Math.max(peligrosos.length, positivos.length, 1);
      yOffset += maxChildren * 90 + 50;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [procesosTrabajo, procesosPeligrosos, procesosPositivos]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // When store updates, we want to update the nodes, but useNodesState initial values only set once.
  // We're just keeping it read-only for visualization essentially or they can drag.

  return (
    <div className="flex-col gap-4" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <div>
          <h2>Diagramas de Relación</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Mapa visual de las influencias (Peligrosas y Positivas) sobre cada Proceso de Trabajo.
          </p>
        </div>
      </div>

      <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {procesosTrabajo.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Añade Procesos de Trabajo para visualizar el diagrama.
          </div>
        ) : (
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Controls />
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.id.startsWith('pt')) return 'var(--accent-primary)';
                if (n.id.startsWith('pp')) return '#ef4444';
                if (n.id.startsWith('po')) return '#10b981';
                return '#eee';
              }}
              nodeColor={(n) => {
                if (n.id.startsWith('pt')) return 'var(--accent-primary)';
                if (n.id.startsWith('pp')) return '#ef4444';
                if (n.id.startsWith('po')) return '#10b981';
                return '#fff';
              }}
            />
            <Background gap={12} size={1} />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
