import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Task from '../components/Task';

const mockTask = {
  _id: '1',
  titre: 'Test Task',
  description: 'Test description',
  priorite: 'haute',
  statut: 'a_faire',
  dateEcheance: '2024-12-31',
  creeLe: '2024-01-01',
  assigne: {
    nom: 'John Doe'
  }
};

describe('Task Component', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <Task
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <Task
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const editButton = screen.getByTitle('Modifier');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <Task
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const deleteButton = screen.getByTitle('Supprimer');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onStatusChange when status select changes', () => {
    render(
      <Task
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const statusSelect = screen.getByDisplayValue('À faire');
    fireEvent.change(statusSelect, { target: { value: 'en_cours' } });

    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'en_cours');
  });

  it('displays correct priority color', () => {
    render(
      <Task
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );

    const priorityBadge = screen.getByText('Haute');
    expect(priorityBadge).toHaveClass('bg-red-100', 'text-red-800');
  });
});
