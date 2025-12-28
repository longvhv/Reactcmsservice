import { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Save, Play, Pause, GitBranch, 
  Users, Mail, Clock, CheckCircle2, XCircle, Settings,
  ArrowRight, Copy, Eye, Code, Zap, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

// Workflow Node Types
export type NodeType = 'start' | 'approval' | 'notification' | 'condition' | 'action' | 'end';
export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config?: {
    // For approval nodes
    approvers?: string[];
    requiredApprovals?: number;
    
    // For notification nodes
    recipients?: string[];
    template?: string;
    
    // For condition nodes
    field?: string;
    operator?: ConditionOperator;
    value?: string;
    
    // For action nodes
    action?: 'publish' | 'archive' | 'notify' | 'assign';
    target?: string;
  };
  position: { x: number; y: number };
  connections: string[]; // IDs of connected nodes
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused';
  articleTypes: string[];
  nodes: WorkflowNode[];
  createdAt: Date;
  updatedAt: Date;
}

export function WorkflowBuilder() {
  const { t } = useLanguage();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock initial workflow
  const mockWorkflow: Workflow = {
    id: '1',
    name: 'Standard Article Review',
    description: 'Two-level approval process for standard articles',
    status: 'active',
    articleTypes: ['news', 'blog', 'tutorial'],
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Start',
        position: { x: 100, y: 100 },
        connections: ['approval1'],
      },
      {
        id: 'approval1',
        type: 'approval',
        label: 'Level 1 Approval',
        config: {
          approvers: ['editor1', 'editor2'],
          requiredApprovals: 1,
        },
        position: { x: 300, y: 100 },
        connections: ['condition1'],
      },
      {
        id: 'condition1',
        type: 'condition',
        label: 'Check Priority',
        config: {
          field: 'priority',
          operator: 'equals',
          value: 'high',
        },
        position: { x: 500, y: 100 },
        connections: ['approval2', 'publish'],
      },
      {
        id: 'approval2',
        type: 'approval',
        label: 'Level 2 Approval',
        config: {
          approvers: ['senior-editor'],
          requiredApprovals: 1,
        },
        position: { x: 700, y: 50 },
        connections: ['publish'],
      },
      {
        id: 'publish',
        type: 'action',
        label: 'Publish Article',
        config: {
          action: 'publish',
        },
        position: { x: 700, y: 150 },
        connections: ['notify'],
      },
      {
        id: 'notify',
        type: 'notification',
        label: 'Send Notification',
        config: {
          recipients: ['author', 'subscribers'],
          template: 'article_published',
        },
        position: { x: 900, y: 150 },
        connections: ['end'],
      },
      {
        id: 'end',
        type: 'end',
        label: 'End',
        position: { x: 1100, y: 150 },
        connections: [],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  useState(() => {
    if (workflows.length === 0) {
      setWorkflows([mockWorkflow]);
      setSelectedWorkflow(mockWorkflow);
    }
  });

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'start': return Play;
      case 'approval': return CheckCircle2;
      case 'notification': return Mail;
      case 'condition': return GitBranch;
      case 'action': return Zap;
      case 'end': return XCircle;
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'start': return 'from-green-500 to-emerald-500';
      case 'approval': return 'from-blue-500 to-purple-500';
      case 'notification': return 'from-yellow-500 to-orange-500';
      case 'condition': return 'from-pink-500 to-rose-500';
      case 'action': return 'from-indigo-500 to-blue-500';
      case 'end': return 'from-red-500 to-rose-500';
    }
  };

  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: 'New Workflow',
      description: 'Description',
      status: 'draft',
      articleTypes: [],
      nodes: [
        {
          id: 'start',
          type: 'start',
          label: 'Start',
          position: { x: 100, y: 200 },
          connections: [],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  };

  const duplicateWorkflow = (workflow: Workflow) => {
    const duplicate: Workflow = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkflows([...workflows, duplicate]);
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(workflows[0] || null);
    }
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Workflow Builder</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý luồng kiểm duyệt tùy chỉnh
          </p>
        </div>

        <button
          onClick={createNewWorkflow}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Workflow List */}
        <div className="col-span-3 space-y-3">
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Workflows ({workflows.length})
            </h3>

            <div className="space-y-2">
              {workflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all border
                    ${selectedWorkflow?.id === workflow.id
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                    }
                  `}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm line-clamp-1">{workflow.name}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWorkflowStatus(workflow.id);
                        }}
                        className="p-1 rounded hover:bg-background/50 transition-colors"
                        title={workflow.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {workflow.status === 'active' ? (
                          <Pause className="w-3 h-3 text-green-600" />
                        ) : (
                          <Play className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateWorkflow(workflow);
                        }}
                        className="p-1 rounded hover:bg-background/50 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWorkflow(workflow.id);
                        }}
                        className="p-1 rounded hover:bg-background/50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {workflow.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`
                      px-2 py-0.5 rounded-full
                      ${workflow.status === 'active' ? 'bg-green-500/10 text-green-600' : ''}
                      ${workflow.status === 'paused' ? 'bg-yellow-500/10 text-yellow-600' : ''}
                      ${workflow.status === 'draft' ? 'bg-gray-500/10 text-gray-600' : ''}
                    `}>
                      {workflow.status}
                    </span>
                    <span className="text-muted-foreground">
                      {workflow.nodes.length} nodes
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Node Palette */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Node
            </h3>

            <div className="space-y-2">
              {[
                { type: 'approval' as NodeType, label: 'Approval', icon: CheckCircle2 },
                { type: 'condition' as NodeType, label: 'Condition', icon: GitBranch },
                { type: 'notification' as NodeType, label: 'Notification', icon: Mail },
                { type: 'action' as NodeType, label: 'Action', icon: Zap },
              ].map((nodeType) => {
                const Icon = nodeType.icon;
                return (
                  <button
                    key={nodeType.type}
                    className="w-full flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all text-left border border-border/40"
                    title={`Add ${nodeType.label} node`}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{nodeType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="col-span-6">
          <div className="glass-card p-6 min-h-[600px] relative overflow-hidden">
            {selectedWorkflow ? (
              <>
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #666 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Workflow Info */}
                <div className="relative mb-6 pb-4 border-b border-border/40">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={selectedWorkflow.name}
                          onChange={(e) => setSelectedWorkflow({
                            ...selectedWorkflow,
                            name: e.target.value,
                          })}
                          className="text-xl font-medium bg-transparent border-b border-blue-500/50 outline-none mb-2"
                          autoFocus
                        />
                      ) : (
                        <h2 className="text-xl font-medium mb-1">{selectedWorkflow.name}</h2>
                      )}
                      
                      <p className="text-sm text-muted-foreground">
                        {selectedWorkflow.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
                        <Code className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nodes */}
                <div className="relative">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {/* Draw connections */}
                    {selectedWorkflow.nodes.map((node) =>
                      node.connections.map((targetId) => {
                        const target = selectedWorkflow.nodes.find(n => n.id === targetId);
                        if (!target) return null;

                        return (
                          <g key={`${node.id}-${targetId}`}>
                            <defs>
                              <marker
                                id={`arrow-${node.id}-${targetId}`}
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                                markerUnits="strokeWidth"
                              >
                                <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
                              </marker>
                            </defs>
                            <line
                              x1={node.position.x + 100}
                              y1={node.position.y + 30}
                              x2={target.position.x}
                              y2={target.position.y + 30}
                              stroke="#3B82F6"
                              strokeWidth="2"
                              markerEnd={`url(#arrow-${node.id}-${targetId})`}
                              className="opacity-50"
                            />
                          </g>
                        );
                      })
                    )}
                  </svg>

                  {/* Render nodes */}
                  <AnimatePresence>
                    {selectedWorkflow.nodes.map((node) => {
                      const Icon = getNodeIcon(node.type);
                      const isSelected = selectedNode?.id === node.id;

                      return (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSelectedNode(node)}
                          className={`
                            absolute cursor-pointer transition-all
                            ${isSelected ? 'z-10' : 'z-0'}
                          `}
                          style={{
                            left: node.position.x,
                            top: node.position.y,
                          }}
                        >
                          <div className={`
                            relative p-4 rounded-xl border-2 transition-all
                            ${isSelected 
                              ? 'border-blue-500 shadow-lg shadow-blue-500/30 bg-background' 
                              : 'border-border/40 bg-background/80 hover:shadow-lg'
                            }
                          `}>
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className={`
                                w-10 h-10 rounded-lg bg-gradient-to-br ${getNodeColor(node.type)} 
                                flex items-center justify-center text-white shadow-lg
                              `}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{node.label}</div>
                                <div className="text-xs text-muted-foreground capitalize">{node.type}</div>
                              </div>
                            </div>

                            {/* Config preview */}
                            {node.config && (
                              <div className="mt-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                                {node.config.approvers && (
                                  <div>👥 {node.config.approvers.length} approvers</div>
                                )}
                                {node.config.recipients && (
                                  <div>📧 {node.config.recipients.length} recipients</div>
                                )}
                                {node.config.field && (
                                  <div>🔀 {node.config.field} {node.config.operator} {node.config.value}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Select a workflow to edit</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {selectedWorkflow && `${selectedWorkflow.nodes.length} nodes`}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-all">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30">
                <Save className="w-4 h-4" />
                Save Workflow
              </button>
            </div>
          </div>
        </div>

        {/* Node Config Panel */}
        <div className="col-span-3">
          <div className="glass-card p-4 sticky top-6">
            {selectedNode ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Node Configuration</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded hover:bg-muted/60 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Label */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Label</label>
                    <input
                      type="text"
                      value={selectedNode.label}
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>

                  {/* Type-specific config */}
                  {selectedNode.type === 'approval' && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Approvers</label>
                        <select
                          multiple
                          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        >
                          <option>Editor Level 1</option>
                          <option>Editor Level 2</option>
                          <option>Senior Editor</option>
                          <option>Content Manager</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Required Approvals</label>
                        <input
                          type="number"
                          min="1"
                          value={selectedNode.config?.requiredApprovals || 1}
                          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'condition' && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Field</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                          <option>priority</option>
                          <option>category</option>
                          <option>author</option>
                          <option>word_count</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Operator</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                          <option>equals</option>
                          <option>not_equals</option>
                          <option>contains</option>
                          <option>greater_than</option>
                          <option>less_than</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Value</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        />
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'notification' && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Recipients</label>
                        <select
                          multiple
                          className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        >
                          <option>Author</option>
                          <option>Editors</option>
                          <option>Subscribers</option>
                          <option>Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Template</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                          <option>article_published</option>
                          <option>approval_needed</option>
                          <option>article_rejected</option>
                          <option>changes_requested</option>
                        </select>
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'action' && (
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Action</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/40 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                        <option>publish</option>
                        <option>archive</option>
                        <option>notify</option>
                        <option>assign</option>
                      </select>
                    </div>
                  )}

                  {/* Delete Node */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all border border-red-500/20">
                    <Trash2 className="w-4 h-4" />
                    Delete Node
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Select a node to configure
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}