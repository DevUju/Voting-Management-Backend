import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';

@Entity('votes')
@Unique(['user', 'poll'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes, { onDelete: 'CASCADE' })
  poll: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes, { onDelete: 'CASCADE' })
  option: PollOption;

  @Column()
  state: string;

  @CreateDateColumn()
  createdAt: Date;
}
