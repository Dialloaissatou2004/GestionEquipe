import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    expect(screen.getByLabelText(/Titre/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priorité/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Statut/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date d'échéance/)).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    const submitButton = screen.getByText('Créer');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    const titleInput = screen.getByLabelText(/Titre/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const submitButton = screen.getByText('Créer');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        titre: 'Test Task',
        description: 'Test Description',
        priorite: 'moyenne',
        statut: 'a_faire',
        dateEcheance: null,
        assigne: null
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('populates form when editing existing task', () => {
    const existingTask = {
      _id: '1',
      titre: 'Existing Task',
      description: 'Existing Description',
      priorite: 'haute',
      statut: 'en_cours',
      dateEcheance: '2024-12-31'
    };

    render(
      <TaskForm
        task={existingTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('haute')).toBeInTheDocument();
    expect(screen.getByDisplayValue('en_cours')).toBeInTheDocument();
    expect(screen.getByText('Modifier')).toBeInTheDocument();
  });
});
