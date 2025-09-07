import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskList from '../components/TaskList';

const mockTasks = [
  {
    _id: '1',
    titre: 'Task 1',
    description: 'Description 1',
    priorite: 'haute',
    statut: 'a_faire',
    dateEcheance: '2024-12-31',
    creeLe: '2024-01-01'
  },
  {
    _id: '2',
    titre: 'Task 2',
    description: 'Description 2',
    priorite: 'moyenne',
    statut: 'en_cours',
    dateEcheance: '2024-11-30',
    creeLe: '2024-01-02'
  }
];

describe('TaskList Component', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tasks correctly', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        loading={false}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(
      <TaskList
        tasks={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        loading={true}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('filters tasks by status', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        loading={false}
      />
    );

    const enCoursFilter = screen.getByText(/En cours/);
    fireEvent.click(enCoursFilter);

    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
        loading={false}
      />
    );

    expect(screen.getByText('Aucune tâche')).toBeInTheDocument();
  });
});
