import { UserRole } from '@shared/constants';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users', comment: 'Stores all users within the system' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Employee
  })
  role: UserRole;

  @Column({ type: 'jsonb', default: {}, comment: 'Stores role specific fields' })
  details: UserDetails[UserRole];

  @Column({ type: 'timestamp', nullable: true })
  last_login_time?: Date;

  @Column({ nullable: true })
  fcm_token?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date;

  static cleanse(user: IUser) {
    user.password = undefined as any;
    return user;
  }
}

declare global {
  export type IUser = InstanceType<typeof User>;
}
