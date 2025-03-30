import { NOTIFICATION_TOPICS } from '@shared/constants';
import { traced } from '@sliit-foss/functions';
import { sendPushNotification, sendPushNotificationToTopic } from '@/integrations/firebase';
import { UserService } from '@/modules/users/api/v1/service';
import { Injectable } from '@nestjs/common';

const layer = 'repository';

@Injectable()
export class NotificationService {
  constructor(private userService: UserService) {}
  registerToken(user: IUser, token: string) {
    return traced[layer](preserveContext(this.userService, 'updateById'))(user.id, {
      fcm_token: token
    });
  }

  async sendTaskAssignmentNotification(task: ITask) {
    const employee = await traced[layer](preserveContext(this.userService, 'getById'))(task.employee_id);
    if (employee?.fcm_token) {
      return traced(sendPushNotification)(
        employee.fcm_token,
        'Task assigned',
        `You have been assigned a new task: ${task.name}`
      );
    }
  }

  sendTaskCompletionNotification(task: ITask) {
    return traced(sendPushNotificationToTopic)(
      NOTIFICATION_TOPICS.ADMINS,
      'Task completed',
      `Task ${task.name} has been completed`
    );
  }
}
