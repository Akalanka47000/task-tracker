import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Form } from '@/components/common';
import { taskService } from '@/services';
import { useTaskStore } from '@/store/task';
import { cn, filterAndNotifyError, filterDirtyFields } from '@/utils';
import { addToast, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormSchema, default as TaskForm } from './form';

export const testIds = {
  createDialog: 'task-create-dialog'
};

export default function CreateOrUpdateDialog({ employeeId }: { employeeId?: string | null }) {
  const isOpen = useTaskStore((state) => state.isTaskDialogOpen);
  const setIsOpen = useTaskStore((state) => state.setIsTaskDialogOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateOrUpdateDialogContent key={selectedTask?.id} employeeId={employeeId} />
    </Modal>
  );
}

function CreateOrUpdateDialogContent({ employeeId }: { employeeId?: string | null }) {
  const setIsOpen = useTaskStore((state) => state.setIsTaskDialogOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);

  const client = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: selectedTask?.name ?? '',
      description: selectedTask?.description,
      due_date: (selectedTask ? new Date(selectedTask!.due_date).toISOString().slice(0, 10) : undefined) as any,
      priority: selectedTask?.priority
    },
    mode: 'onBlur'
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedTask) {
        return taskService.updateTask({ id: selectedTask.id, data });
      }
      return taskService.createTask({
        data: {
          ...data,
          employee_id: employeeId
        }
      });
    },
    onSuccess: (result) => {
      setIsOpen(false);
      form.reset();
      client.invalidateQueries({ queryKey: ['tasks'] });
      addToast({
        title: result.message,
        color: 'success'
      });
    },
    onError: filterAndNotifyError
  });

  const onSubmit: SubmitHandler<Partial<ITask>> = (data) => {
    mutation.mutate(selectedTask ? filterDirtyFields(form.formState.dirtyFields, data) : data);
  };

  return (
    <ModalContent data-testid={testIds.createDialog}>
      {(onClose) => (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ModalHeader>
                <h4>{selectedTask ? 'Edit' : 'Add'} Task</h4>
              </ModalHeader>
              <ModalBody>
                <TaskForm form={form} className={cn(mutation.isPending && 'opacity-50 pointer-events-none')} />
              </ModalBody>
              <ModalFooter>
                <Button type="button" color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={mutation.isPending}
                  isDisabled={!form.formState.isValid || mutation.isPending}
                  type="submit">
                  {selectedTask ? 'Save' : 'Create'}
                </Button>
              </ModalFooter>
            </form>
          </Form>
        </>
      )}
    </ModalContent>
  );
}
