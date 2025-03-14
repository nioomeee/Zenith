import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import {
  interests,
  userInterests,
  users,
  interestGroupPosts,
  interestGroupPostLikes,
} from '@/db/schema';
import { eq, and, desc, sql, isNull } from 'drizzle-orm';

const app = new Hono().basePath('/api/interest-groups');

// Get all interest groups with member counts
app.get('/', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all interests with member counts and check if user is a member
    const interestGroups = await db.query.interests.findMany({
      with: {
        users: {
          columns: {
            userId: true,
          },
        },
      },
    });

    const groupsWithStats = await Promise.all(
      interestGroups.map(async (group) => {
        const memberCount = group.users.length;
        const isUserMember = group.users.some((u) => u.userId === userId);

        // Get latest post for preview
        const latestPost = await db.query.interestGroupPosts.findFirst({
          where: and(
            eq(interestGroupPosts.interestId, group.id),
            isNull(interestGroupPosts.parentId)
          ),
          orderBy: [desc(interestGroupPosts.createdAt)],
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        });

        return {
          id: group.id,
          name: group.name,
          category: group.category,
          memberCount,
          isUserMember,
          latestPost: latestPost
            ? {
                content: latestPost.content,
                createdAt: latestPost.createdAt,
                author: latestPost.user,
              }
            : null,
        };
      })
    );

    return c.json({ groups: groupsWithStats });
  } catch (error) {
    console.error('Error in interest groups API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single interest group details with posts and members
app.get('/:id', async (c) => {
  try {
    const groupId = c.req.param('id');
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get group details
    const group = await db.query.interests.findFirst({
      where: eq(interests.id, groupId),
      with: {
        users: {
          with: {
            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                role: true,
                currentRole: true,
                company: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }

    // Get top-level posts with user info and reply counts
    const posts = await db.query.interestGroupPosts.findMany({
      where: and(
        eq(interestGroupPosts.interestId, groupId),
        isNull(interestGroupPosts.parentId)
      ),
      orderBy: [desc(interestGroupPosts.createdAt)],
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true,
            currentRole: true,
            company: true,
          },
        },
        replies: true,
        likes: {
          where: eq(interestGroupPostLikes.userId, userId),
        },
      },
    });

    const postsWithStats = posts.map((post) => ({
      ...post,
      replyCount: post.replies.length,
      hasLiked: post.likes.length > 0,
      replies: undefined, // Remove the replies array from response
    }));

    return c.json({
      group: {
        ...group,
        memberCount: group.users.length,
        members: group.users.map((u) => u.user),
        isUserMember: group.users.some((u) => u.user.id === userId),
      },
      posts: postsWithStats,
    });
  } catch (error) {
    console.error('Error in interest group details API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Join/leave an interest group
app.post('/:id/membership', async (c) => {
  try {
    const groupId = c.req.param('id');
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { action } = await c.req.json();
    if (!['join', 'leave'].includes(action)) {
      return c.json({ error: 'Invalid action' }, 400);
    }

    if (action === 'join') {
      await db.insert(userInterests).values({
        userId,
        interestId: groupId,
      });
    } else {
      await db
        .delete(userInterests)
        .where(
          and(
            eq(userInterests.userId, userId),
            eq(userInterests.interestId, groupId)
          )
        );
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating membership:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create a post in an interest group
app.post('/:id/posts', async (c) => {
  try {
    const groupId = c.req.param('id');
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is a member
    const membership = await db.query.userInterests.findFirst({
      where: and(
        eq(userInterests.userId, userId),
        eq(userInterests.interestId, groupId)
      ),
    });

    if (!membership) {
      return c.json({ error: 'Must be a group member to post' }, 403);
    }

    const { content, parentId } = await c.req.json();
    if (!content) {
      return c.json({ error: 'Content is required' }, 400);
    }

    // If parentId is provided, verify it exists and belongs to this group
    if (parentId) {
      const parentPost = await db.query.interestGroupPosts.findFirst({
        where: and(
          eq(interestGroupPosts.id, parentId),
          eq(interestGroupPosts.interestId, groupId)
        ),
      });

      if (!parentPost) {
        return c.json({ error: 'Parent post not found' }, 404);
      }
    }

    const [post] = await db
      .insert(interestGroupPosts)
      .values({
        interestId: groupId,
        userId,
        content,
        parentId: parentId || null,
      })
      .returning();

    const postWithUser = await db.query.interestGroupPosts.findFirst({
      where: eq(interestGroupPosts.id, post.id),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true,
            currentRole: true,
            company: true,
          },
        },
      },
    });

    return c.json({ post: postWithUser });
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get replies for a post
app.get('/:groupId/posts/:postId/replies', async (c) => {
  try {
    const { groupId, postId } = c.req.param();
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const replies = await db.query.interestGroupPosts.findMany({
      where: eq(interestGroupPosts.parentId, postId),
      orderBy: [desc(interestGroupPosts.createdAt)],
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true,
            currentRole: true,
            company: true,
          },
        },
        likes: {
          where: eq(interestGroupPostLikes.userId, userId),
        },
      },
    });

    const repliesWithLikes = replies.map((reply) => ({
      ...reply,
      hasLiked: reply.likes.length > 0,
      likes: undefined,
    }));

    return c.json({ replies: repliesWithLikes });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Like/unlike a post
app.post('/:groupId/posts/:postId/like', async (c) => {
  try {
    const { postId } = c.req.param();
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { action } = await c.req.json();
    if (!['like', 'unlike'].includes(action)) {
      return c.json({ error: 'Invalid action' }, 400);
    }

    if (action === 'like') {
      await db.insert(interestGroupPostLikes).values({
        postId,
        userId,
      });

      await db
        .update(interestGroupPosts)
        .set({ likes: sql`${interestGroupPosts.likes} + 1` })
        .where(eq(interestGroupPosts.id, postId));
    } else {
      await db
        .delete(interestGroupPostLikes)
        .where(
          and(
            eq(interestGroupPostLikes.postId, postId),
            eq(interestGroupPostLikes.userId, userId)
          )
        );

      await db
        .update(interestGroupPosts)
        .set({ likes: sql`${interestGroupPosts.likes} - 1` })
        .where(eq(interestGroupPosts.id, postId));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating like:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
