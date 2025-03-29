import { Button } from '@/components';
import { userService } from '@/services';
import { useUserStore } from '@/store/user';
import { filterAndNotifyError } from '@/utils';
import { addToast, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DeleteDialog() {
  const isOpen = useUserStore((state) => state.isUserDeleteDialogOpen);
  const setIsOpen = useUserStore((state) => state.setIsUserDeleteDialogOpen);
  const selectedUser = useUserStore((state) => state.selectedUser);

  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => userService.deleteUser({ id: selectedUser!.id }),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: ['users'] });
      addToast({ title: result.message });
    },
    onError: filterAndNotifyError,
    onSettled: () => setIsOpen(false)
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="p-6">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 p-0">Delete Employee</ModalHeader>
            <ModalBody className="px-0">
              <p>This action cannot be undone</p>
            </ModalBody>
            <ModalFooter className="p-0">
              <Button color="default" disabled={mutation.isPending} onPress={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={mutation.isPending}
                disabled={mutation.isPending}
                onPress={mutation.mutate as any}
                color="danger">
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
