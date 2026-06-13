import { IPost } from '@types';

// Static mock data for the post feed UI. No backend involved.
// All body text is lorem-ipsum placeholder — intentionally nonsense.
const AVATAR = '/avatar.jpg';
const PHOTO = '/background.png';

export const posts: IPost[] = [
  {
    id: 'p1',
    authorName: 'Lorem Ipsum',
    authorAvatar: AVATAR,
    createdAt: '12m',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    likes: 128,
    shares: 7,
    comments: [
      {
        id: 'c1',
        authorName: 'Dolor Sit',
        authorAvatar: AVATAR,
        content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
        createdAt: '8m',
        likes: 12,
        replies: [
          {
            id: 'c1-r1',
            authorName: 'Lorem Ipsum',
            authorAvatar: AVATAR,
            content: 'Duis aute irure dolor in reprehenderit in voluptate velit.',
            createdAt: '6m',
            likes: 3,
            replies: [
              {
                id: 'c1-r1-r1',
                authorName: 'Dolor Sit',
                authorAvatar: AVATAR,
                content: 'Excepteur sint occaecat cupidatat non proident.',
                createdAt: '4m',
                likes: 1
              }
            ]
          },
          {
            id: 'c1-r2',
            authorName: 'Amet Consectetur',
            authorAvatar: AVATAR,
            content: 'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
            createdAt: '3m',
            likes: 5
          }
        ]
      },
      {
        id: 'c2',
        authorName: 'Adipiscing Elit',
        authorAvatar: AVATAR,
        content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur.',
        createdAt: '5m',
        likes: 2
      }
    ]
  },
  {
    id: 'p2',
    authorName: 'Dolor Sit',
    authorAvatar: AVATAR,
    createdAt: '1h',
    content: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet 📷',
    image: PHOTO,
    likes: 342,
    shares: 21,
    comments: [
      {
        id: 'c3',
        authorName: 'Lorem Ipsum',
        authorAvatar: AVATAR,
        content: 'Quis autem vel eum iure reprehenderit qui in ea voluptate.',
        createdAt: '50m',
        likes: 8,
        replies: [
          {
            id: 'c3-r1',
            authorName: 'Dolor Sit',
            authorAvatar: AVATAR,
            content: 'At vero eos et accusamus et iusto odio dignissimos.',
            createdAt: '45m',
            likes: 2
          }
        ]
      }
    ]
  },
  {
    id: 'p3',
    authorName: 'Amet Consectetur',
    authorAvatar: AVATAR,
    createdAt: '3h',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium?',
    likes: 56,
    shares: 3,
    comments: [
      {
        id: 'c4',
        authorName: 'Adipiscing Elit',
        authorAvatar: AVATAR,
        content: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
        createdAt: '2h',
        likes: 15,
        replies: [
          {
            id: 'c4-r1',
            authorName: 'Amet Consectetur',
            authorAvatar: AVATAR,
            content: 'Et quasi architecto beatae vitae dicta sunt explicabo 👍',
            createdAt: '1h',
            likes: 4
          }
        ]
      }
    ]
  },
  {
    id: 'p4',
    authorName: 'Adipiscing Elit',
    authorAvatar: AVATAR,
    createdAt: '5h',
    content: 'Consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt 🌄',
    image: PHOTO,
    likes: 210,
    shares: 11,
    comments: [
      {
        id: 'c5',
        authorName: 'Lorem Ipsum',
        authorAvatar: AVATAR,
        content: 'Neque porro quisquam est qui dolorem ipsum quia dolor.',
        createdAt: '4h',
        likes: 6
      }
    ]
  }
];
