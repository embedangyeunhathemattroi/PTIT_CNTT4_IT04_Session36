
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface TaskFormProps {
  onAdd: (title: string, priority: 'low' | 'medium' | 'high') => void;
  onUpdate: (id: string, title: string, priority: 'low' | 'medium' | 'high') => void;
  editingTask?: { id: string; title: string; priority: 'low' | 'medium' | 'high' } | null;
  existingTasks: { id: string; title: string }[];
}

export default function TaskForm({ onAdd, onUpdate, editingTask, existingTasks }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setPriority('medium');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!title.trim()) {
      alert('Tên công việc không được để trống');
      return;
    }
    if (
      existingTasks.some(
        (t) =>
          t.title.toLowerCase() === title.toLowerCase() &&
          (!editingTask || t.id !== editingTask.id)
      )
    ) {
      alert('Tên công việc đã tồn tại');
      return;
    }
    if (!priority) {
      alert('Phải chọn độ ưu tiên');
      return;
    }

    if (editingTask) {
      onUpdate(editingTask.id, title, priority);
    } else {
      onAdd(title, priority);
    }

    setTitle('');
    setPriority('medium');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-md"
    >
      <TextField
        label="Tên công việc"
        variant="outlined"
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <FormControl size="small" className="w-36">
        <InputLabel>Ưu tiên</InputLabel>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          label="Ưu tiên"
        >
          <MenuItem value="low">Thấp</MenuItem>
          <MenuItem value="medium">Trung bình</MenuItem>
          <MenuItem value="high">Cao</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {editingTask ? 'Cập nhật' : 'Thêm'}
      </Button>
    </form>
  );
}
