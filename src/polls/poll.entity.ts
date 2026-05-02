import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, ForeignKey } from 'typeorm';
import { User } from '../users/user.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { Vote } from '../votes/vote.entity';

export enum PollStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: PollStatus,
    default: PollStatus.ACTIVE,
  })
  status: PollStatus;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.polls, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options: PollOption[];

  @OneToMany(() => Vote, (vote) => vote.poll, { cascade: true })
  votes: Vote[];
}
