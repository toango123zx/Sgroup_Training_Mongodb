import Post from '../../../../../internal/model/post';
import User from '../../../../../internal/model/user';
import { UserFollowing } from '../../user/types';
import { PostEntity, PostCreationDto, PostService, PutUpdateDto } from '../types';

export class PostServiceImpl implements PostService {
  async getPost(id: string): Promise<PostEntity> {
    const post = await Post.findOne({ _id: id });

    if (!post) {
      throw new Error('Post not found');
    }

    const user = await User.findOne({ _id: post.author });

    return {
      id: String(post._id),
      image: String(post.image),
      authorID: String(post.author),
      markdown: post.markdown,
      title: post.title,
      tags: post.tags,
      summary: post.summary,
      createdAt: Number(post.createdAt),
      author: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        followings: user.followings.map((following) => ({
          id: String(following._id),
        })),
        followers: user.followers.map((follower) => ({
          id: String(follower._id),
        })),
      },
    };
  }

  async fetchPostsByUser(id: string): Promise<PostEntity[]> {
    const results = await Post.find({ author: id })
      .lean(true);

    return results.map(r => ({
      id: String(r._id),
      title: String(r.title || ''),
      markdown: r.markdown,
      image: r.image,
      authorID: id,
      tags: r.tags,
      summary: String(r.summary || ''),
      createdAt: Number(r.createdAt),
    }));
  }

  async createPost(postCreationDto: PostCreationDto): Promise<PostEntity> {
    const codeRegex = /<code>(.*?)<\/code>/g;
    const withoutCode = postCreationDto.markdown.replace(codeRegex, '');
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    const summary = withoutCode.replace(htmlRegexG, '');

    const insertResult = await Post.create({
      author: postCreationDto.authorID,
      title: postCreationDto.title,
      markdown: postCreationDto.markdown,
      image: postCreationDto.image,
      tags: postCreationDto.tags,
      summary: summary,
    });

    return {
      id: String(insertResult._id),
      image: String(insertResult.image),
      authorID: String(insertResult.author),
      markdown: insertResult.markdown,
      title: insertResult.title,
      tags: insertResult.tags,
      summary: insertResult.summary,
      createdAt: Number(insertResult.createdAt),
    }
  }

  async updatePost(id: string, updatePost: PutUpdateDto): Promise<PostEntity> {
    const post = await Post.findOne({ _id: id });
    if (!post) {
      throw new Error('Post not found');
    }
    const a = await Post.updateOne({
      _id: id,
    },
      {
        $set: {
          title: updatePost.title,
          markdown: updatePost.markdown,
          image: updatePost.image,
          tags: updatePost.tags,
        }
      });

    console.log(`🚀 ~ PostServiceImpl ~ updatePost ~ a:`, a)

    const updatedPost = await Post.findOne({ _id: id });

    if (!updatedPost) {
      throw new Error('Post not found after update');
    }

    return {
      id: String(updatedPost._id),
      image: String(updatedPost.image),
      authorID: String(updatedPost.author),
      markdown: updatedPost.markdown,
      title: updatedPost.title,
      tags: updatedPost.tags,
      summary: updatedPost.summary,
      createdAt: Number(updatedPost.createdAt),
    };
  }
}