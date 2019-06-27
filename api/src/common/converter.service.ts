import { ShowCommentDTO } from '../comments/models/show-comment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentVote } from '../entities/com-like-dislike.entity';
import { Comment } from '../entities/comment.entity';
import { PostEntity } from '../entities/post.entity';
import { PostLikeDislike } from '../entities/post-like-dislike.entity';
import { ShowPostDTO } from '../posts/models/show-post.dto';
import { Activity } from '../entities/activity.entity';
import { ShowActivityDTO } from '../acitivities/models/activity.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class ConverterService {
  constructor(
    @InjectRepository(PostLikeDislike)
    private readonly votesRepository: Repository<PostLikeDislike>,

    @InjectRepository(CommentVote)
    private readonly votesCommentsRepository: Repository<CommentVote>,
  ) {}

  async convertToShowPostDTO(post: PostEntity): Promise<ShowPostDTO> {

    const postLikes = await this.votesRepository.findAndCount({
      where: {
        post,
        state: true,
      },
    });
    const postLikesCount = +postLikes[postLikes.length - 1];

    const postDislikes = await this.votesRepository.findAndCount({
      where: {
        post,
        state: false,
      },
    });
    const postDislikesCount = +postDislikes[postDislikes.length - 1];

    const covertedPost: ShowPostDTO = {
      id: post.id,
      title: post.title,
      content: post.content,
      user: (await post.user).username,
      userID: (await post.user).id,
      postLikes: postLikesCount,
      postDislikes: postDislikesCount,
      createdOn: post.createdOn,
      touchDateColumn: post.touchDateColumn,
    };

    return covertedPost;
  }

  async convertToShowCommentDTO(comment: Comment): Promise<ShowCommentDTO> {
    const commentLikes = await this.votesCommentsRepository.findAndCount({
      where: {
        comment,
        state: true,
      },
    });
    const commentLikesCount = +commentLikes[commentLikes.length - 1];

    const commentDislikes = await this.votesCommentsRepository.findAndCount({
      where: {
        comment,
        state: false,
      },
    });
    const commentDislikesCount = +commentDislikes[commentDislikes.length - 1];

    const convertedComment: ShowCommentDTO = {
      id: comment.id,
      message: comment.message,
      user: (await comment.user).username,
      userID: (await comment.user).id,
      commentLikes: commentLikesCount,
      commentDislikes: commentDislikesCount,
      createdOn: comment.createdOn,
      UpdatedDateColumn: comment.UpdatedDateColumn,
    };

    return convertedComment;
  }
  async convertToShowActivityDTO(activity:Activity):Promise<ShowActivityDTO>{
    const user:User = await activity.user;
    const email:string = user.email
    const convertedActivity: ShowActivityDTO = {
      id: activity.id,
      user: email,
      date: activity.date,
      description: activity.description,
    };
    return convertedActivity;
  }
}
