import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';

@Entity('votes')
@Unique(['userId', 'pollId'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  pollId: string;

  @Column()
  optionId: string;

  @Column()
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes, { onDelete: 'CASCADE' })
  poll: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes, { onDelete: 'CASCADE' })
  option: PollOption;
}
