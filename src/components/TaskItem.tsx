import { Checkbox, Chip, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';


interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, priority: 'low' | 'medium' | 'high') => void;
}

const priorityColor: Record<'low' | 'medium' | 'high', 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

export default function TaskItem({
  id,
  title,
  completed,
  priority,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm mb-2">
      <div className="flex items-center gap-3">
        <Checkbox checked={completed} onChange={() => onToggle(id)} />
        <span className={`text-sm ${completed ? 'line-through text-gray-400' : ''}`}>
          {title}
        </span>
        <Chip
          label={priority.toUpperCase()}
          color={priorityColor[priority]}
          size="small"
          className="ml-2"
        />
      </div>
      <div>
        <IconButton onClick={() => onDelete(id)} color="error">
          <Delete />
        </IconButton>
        <IconButton color="primary" onClick={() => onEdit(id, title, priority)}>
          <Edit />
        </IconButton>
      </div>
    </div>
  );
}
