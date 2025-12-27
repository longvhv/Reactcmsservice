import React, { useState } from 'react';
import { useFetch, useMutate } from '@longvhv/query';
import { useNotifications } from '@longvhv/notifications';
import { useAuth } from '@longvhv/auth';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Send, 
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Edit,
  Trash2
} from 'lucide-react';
import { Article } from '@/types/article';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    email: string;
  };
  approvedAt?: string;
  rejectedAt?: string;
  comment?: string;
}

interface WorkflowApprovalProps {
  article: Article;
  onApprove?: () => void;
  onReject?: () => void;
  onUpdate?: () => void;
}

export const WorkflowApproval: React.FC<WorkflowApprovalProps> = ({
  article,
  onApprove,
  onReject,
  onUpdate,
}) => {
  const { user } = useAuth();
  const notifications = useNotifications();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  // Fetch workflow steps
  const { data: workflow, isLoading } = useFetch<WorkflowStep[]>(
    ['workflow', article.id],
    async () => {
      // Mock workflow
      return [
        {
          id: '1',
          name: 'Content Review',
          status: 'approved',
          assignee: { id: '1', name: 'John Doe', email: 'john@example.com' },
          approvedBy: { id: '1', name: 'John Doe', email: 'john@example.com' },
          approvedAt: '2024-01-18T10:30:00Z',
          comment: 'Content looks good. Minor typos fixed.',
        },
        {
          id: '2',
          name: 'SEO Review',
          status: 'approved',
          assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          approvedBy: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          approvedAt: '2024-01-18T14:20:00Z',
          comment: 'SEO optimization complete.',
        },
        {
          id: '3',
          name: 'Editor Approval',
          status: 'pending',
          assignee: { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
        },
        {
          id: '4',
          name: 'Final Publication',
          status: 'pending',
          assignee: { id: '4', name: 'Sarah Williams', email: 'sarah@example.com' },
        },
      ];
    }
  );

  // Approve mutation
  const { mutate: approve, isPending: isApproving } = useMutate(
    async ({ comment }: { comment: string }) => {
      // API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Article approved successfully!');
        setShowCommentModal(false);
        setComment('');
        onApprove?.();
        onUpdate?.();
      },
    }
  );

  // Reject mutation
  const { mutate: reject, isPending: isRejecting } = useMutate(
    async ({ comment }: { comment: string }) => {
      // API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    {
      onSuccess: () => {
        notifications.success('Article rejected with feedback');
        setShowCommentModal(false);
        setComment('');
        onReject?.();
        onUpdate?.();
      },
    }
  );

  // Handle action
  const handleAction = (type: 'approve' | 'reject') => {
    setActionType(type);
    setShowCommentModal(true);
  };

  // Submit action
  const handleSubmit = () => {
    if (actionType === 'approve') {
      approve({ comment });
    } else if (actionType === 'reject') {
      reject({ comment });
    }
  };

  // Get step status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get step status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
      skipped: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
    };
    const config = configs[status as keyof typeof configs];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  // Check if current user can approve
  const canApprove = workflow?.some(
    step => step.status === 'pending' && step.assignee?.id === user?.id
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {workflow?.filter(s => s.status === 'approved').length || 0} of {workflow?.length || 0} steps
            </span>
            <span className="text-sm font-medium">
              {Math.round(((workflow?.filter(s => s.status === 'approved').length || 0) / (workflow?.length || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((workflow?.filter(s => s.status === 'approved').length || 0) / (workflow?.length || 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {workflow?.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {index < workflow.length - 1 && (
                <div className="absolute left-[10px] top-[40px] w-0.5 h-[calc(100%+1rem)] bg-gray-200 dark:bg-gray-700" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{step.name}</h4>
                        {getStatusBadge(step.status)}
                      </div>
                      {step.assignee && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-3 h-3" />
                          {step.assignee.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Info */}
                  {step.status === 'approved' && step.approvedBy && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Approved by {step.approvedBy.name}
                        </span>
                      </div>
                      {step.approvedAt && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(step.approvedAt).toLocaleString()}
                        </div>
                      )}
                      {step.comment && (
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          {step.comment}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Info */}
                  {step.status === 'rejected' && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Rejected
                        </span>
                      </div>
                      {step.comment && (
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          {step.comment}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending - Current user can act */}
                  {step.status === 'pending' && step.assignee?.id === user?.id && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-3 text-sm text-blue-600 dark:text-blue-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Your action required</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction('approve')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction('reject')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Workflow History</h3>
        <div className="space-y-3">
          {workflow
            ?.filter(step => step.status !== 'pending')
            .reverse()
            .map((step) => (
              <div key={step.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {getStatusIcon(step.status)}
                <div className="flex-1">
                  <div className="font-medium">{step.name}</div>
                  {step.approvedBy && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {step.status === 'approved' ? 'Approved' : 'Rejected'} by {step.approvedBy.name}
                      {step.approvedAt && ` on ${new Date(step.approvedAt).toLocaleDateString()}`}
                    </div>
                  )}
                  {step.comment && (
                    <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 italic">
                      "{step.comment}"
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">
              {actionType === 'approve' ? 'Approve Article' : 'Reject Article'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Comment {actionType === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder={
                  actionType === 'approve'
                    ? 'Optional: Add approval comments...'
                    : 'Required: Explain why you are rejecting...'
                }
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  (isApproving || isRejecting) ||
                  (actionType === 'reject' && !comment.trim())
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {(isApproving || isRejecting) ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
