import { Priority } from '@shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '@/modules/users/models';

@Entity({ name: 'tasks', comment: 'Stores all tasks assigned to employees' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.Low
  })
  @Index('idx_priority')
  priority: Priority;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employee_id' })
  @Index('idx_employee_id')
  employee?: User;

  @Column({ nullable: false })
  employee_id: string;

  @Column({ default: false })
  @Index('idx_completed')
  completed: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date;
}

declare global {
  export type ITask = InstanceType<typeof Task>;
}
