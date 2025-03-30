import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Form } from '@/components/common';
import { userService } from '@/services';
import { useUserStore } from '@/store/user';
import { cn, filterAndNotifyError, filterDirtyFields } from '@/utils';
import { addToast, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormSchema, default as UserForm } from './form';

export const testIds = {
  createDialog: 'user-create-dialog'
};

export default function CreateOrUpdateDialog() {
  const isOpen = useUserStore((state) => state.isUserDialogOpen);
  const setIsOpen = useUserStore((state) => state.setIsUserDialogOpen);
  const selectedUser = useUserStore((state) => state.selectedUser);
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateOrUpdateDialogContent key={selectedUser?.id} />
    </Modal>
  );
}

function CreateOrUpdateDialogContent() {
  const setIsOpen = useUserStore((state) => state.setIsUserDialogOpen);
  const selectedUser = useUserStore((state) => state.selectedUser);

  const client = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: selectedUser?.first_name ?? '',
      last_name: selectedUser?.last_name ?? '',
      username: selectedUser?.username ?? '',
      details: {
        department: selectedUser?.details?.department
      }
    },
    mode: 'onBlur'
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedUser) {
        return userService.updateUser({ id: selectedUser.id, data });
      }
      return userService.createUser({ data });
    },
    onSuccess: (result) => {
      setIsOpen(false);
      form.reset();
      client.invalidateQueries({ queryKey: ['users'] });
      addToast({
        title: result.message,
        endContent: !selectedUser ? (
          <Button onPress={() => navigator.clipboard.writeText(result.data.password!)}>Copy Password</Button>
        ) : undefined,
        color: 'success'
      });
    },
    onError: filterAndNotifyError
  });

  const onSubmit: SubmitHandler<Partial<IUser>> = (data) => {
    mutation.mutate(selectedUser ? filterDirtyFields(form.formState.dirtyFields, data) : data);
  };

  return (
    <ModalContent data-testid={testIds.createDialog}>
      {(onClose) => (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ModalHeader>
                <h4>{selectedUser ? 'Edit' : 'Add'} Employee</h4>
              </ModalHeader>
              <ModalBody>
                <UserForm form={form} className={cn(mutation.isPending && 'opacity-50 pointer-events-none')} />
              </ModalBody>
              <ModalFooter>
                <Button type="button" color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={mutation.isPending}
                  isDisabled={!form.formState.isValid || mutation.isPending}
                  type="submit">
                  {selectedUser ? 'Save' : 'Create'}
                </Button>
              </ModalFooter>
            </form>
          </Form>
        </>
      )}
    </ModalContent>
  );
}
