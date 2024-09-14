import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'UserData' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: '20' })
  firstName!: string;

  @Column({ type: 'varchar', nullable: false, length: '20' })
  lastName!: string;

  @Column({ type: 'varchar', nullable: false, length: '50' })
  displayName!: string;

  @Column({ type: 'varchar', nullable: false, length: '50', unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: false, length: '300' })
  password!: string;

  @Column({ type: 'int', nullable: false, default: 3 })
  role!: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'bit', default: 1 })
  isEnabled: number;
}
