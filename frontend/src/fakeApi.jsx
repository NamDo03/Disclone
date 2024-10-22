const servers = [
  {
    id: "1",
    name: "Tech Community",
    imageUrl:
      "https://img.pikbest.com/wp/202348/discord-modern-minimalistic-gradient-background-image-for-corporate-social-media_9779628.jpg!sw800",
    channels: [
      {
        id: "101",
        name: "general-chat",
        type: "text", // Text Channel
        messages: [
          {
            id: "1",
            author: {
              id: "a1",
              name: "Alice",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
            },
            message: "Hey, does anyone know how to solve this bug?",
            timestamp: "2024-09-24 10:30",
          },
          {
            id: "2",
            author: {
              id: "a2",
              name: "Bob",
              avatar: "https://avatarfiles.alphacoders.com/367/367019.png",
            },
            message: "Have you checked the logs? They might give a clue.",
            timestamp: "2024-09-24 10:31",
          },
          {
            id: "3",
            author: {
              id: "a3",
              name: "Charlie",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHG4SnY4acTaYnWLXBJemI76ge-SjSt41mxQ&s",
            },
            message: "What bug are you dealing with, Alice?",
            timestamp: "2024-09-24 10:32",
          },
          {
            id: "4",
            author: {
              id: "a1",
              name: "Alice",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
            },
            message: "It's a null pointer exception in the API response.",
            timestamp: "2024-09-24 10:33",
          },
          {
            id: "5",
            author: {
              id: "a4",
              name: "David",
              avatar: "https://i.imgur.com/HS61yNC.png",
            },
            message: "Maybe you're missing a null check in your code?",
            timestamp: "2024-09-24 10:34",
          },
          {
            id: "6",
            author: {
              id: "a1",
              name: "Alice",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
            },
            message: "I did add the check, but the error still happens.",
            timestamp: "2024-09-24 10:35",
          },
          {
            id: "7",
            author: {
              id: "a5",
              name: "Eve",
              avatar: "https://avatarfiles.alphacoders.com/367/367020.png",
            },
            message:
              "Have you tried debugging step by step to see where it fails?",
            timestamp: "2024-09-24 10:36",
          },
          {
            id: "8",
            author: {
              id: "a2",
              name: "Bob",
              avatar: "https://avatarfiles.alphacoders.com/367/367019.png",
            },
            message: "Yeah, sometimes it's helpful to trace the flow.",
            timestamp: "2024-09-24 10:37",
          },
          {
            id: "9",
            author: {
              id: "a1",
              name: "Alice",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
            },
            message: "Good idea! I'll try debugging and get back to you all.",
            timestamp: "2024-09-24 10:38",
          },
          {
            id: "10",
            author: {
              id: "a6",
              name: "Frank",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ1qRM_DFPuIOiEmuIWg9QvJEcj3uBkxsIUg&s",
            },
            message:
              "Also, make sure your API response has valid data before parsing it.",
            timestamp: "2024-09-24 10:39",
          },
          {
            id: "11",
            author: {
              id: "a3",
              name: "Charlie",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHG4SnY4acTaYnWLXBJemI76ge-SjSt41mxQ&s",
            },
            message: "Let us know if you need more help!",
            timestamp: "2024-09-24 10:40",
          },
        ],
      },
      {
        id: "102",
        name: "coding-help",
        type: "text", // Text Channel
      },
      {
        id: "103",
        name: "voice-room-1",
        type: "voice", // Voice Channel
      },
      {
        id: "104",
        name: "gaming-room",
        type: "voice", // Voice Channel
      },
    ],
    members: [
      {
        id: "a1",
        name: "Alice",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
      },
      {
        id: "a2",
        name: "Bob",
        avatar: "https://avatarfiles.alphacoders.com/367/367019.png",
      },
      {
        id: "a3",
        name: "Charlie",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHG4SnY4acTaYnWLXBJemI76ge-SjSt41mxQ&s",
      },
      {
        id: "a4",
        name: "David",
        avatar: "https://i.imgur.com/HS61yNC.png",
      },
      {
        id: "a5",
        name: "Eve",
        avatar: "https://avatarfiles.alphacoders.com/367/367020.png",
      },
      {
        id: "a6",
        name: "Frank",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ1qRM_DFPuIOiEmuIWg9QvJEcj3uBkxsIUg&s",
      },
    ],
  },
  {
    id: "2",
    name: "Gaming Friends",
    imageUrl:
      "https://img.freepik.com/free-photo/futuristic-moon-background_23-2150930800.jpg",
    channels: [
      {
        id: "201",
        name: "game-chat",
        type: "text", // Text Channel
      },
      {
        id: "202",
        name: "strategy-discussion",
        type: "text", // Text Channel
      },
      {
        id: "203",
        name: "voice-room-2",
        type: "voice", // Voice Channel
      },
      {
        id: "204",
        name: "party-voice",
        type: "voice", // Voice Channel
      },
    ],
  },
  {
    id: "3",
    name: "Music Lovers",
    imageUrl:
      "https://pbs.twimg.com/media/EhL0hv4XsAIpNI2?format=jpg&name=large",
    channels: [
      {
        id: "301",
        name: "music-chat",
        type: "text", // Text Channel
      },
      {
        id: "302",
        name: "playlist-sharing",
        type: "text", // Text Channel
      },
      {
        id: "303",
        name: "karaoke-room",
        type: "voice", // Voice Channel
      },
      {
        id: "304",
        name: "jam-session",
        type: "voice", // Voice Channel
      },
    ],
  },
];

export default servers;
export const listfriend = [
  {
    id: "1",
    username: "Alice",
    email: "alice@example.com",
    avatarUrl:
      "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/01f7e1d821b09b9b09eb2621efe22c9068d8756c-200x200.jpg",
  },
  {
    id: "2",
    username: "Bob",
    email: "bob@example.com",
    avatarUrl:
      "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/01f7e1d821b09b9b09eb2621efe22c9068d8756c-200x200.jpg",
  },
  {
    id: "3",
    username: "Charlie",
    email: "charlie@example.com",
    avatarUrl:
      "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/01f7e1d821b09b9b09eb2621efe22c9068d8756c-200x200.jpg",
  },
];
export const directMessages = [
  {
    id: "dm1", 
    participants: [
      {
        id: "1",
        username: "Alice",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
      },
      {
        id: "2",
        username: "Bob",
        avatar: "https://avatarfiles.alphacoders.com/367/367019.png",
      }
    ],
    messages: [
      {
        id: "m1",
        user: {
          id: "1",
          username: "Alice",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
        },
        content: "Chào Bob, bạn khỏe không?",
        created_at: "2024-09-24T09:00:00",
      },
      {
        id: "m2",
        user: {
          id: "2",
          username: "Bob",
          avatar: "https://avatarfiles.alphacoders.com/367/367019.png",
        },
        content: "Chào Alice, mình khỏe. Còn bạn thì sao?",
        created_at: "2024-09-24T09:02:00",
      },
      {
        id: "m3",
        user: {
          id: "1",
          username: "Alice",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
        },
        content: "Mình cũng ổn, cảm ơn bạn!",
        created_at: "2024-09-24T09:05:00",
      },
      {
        id: "m4",
        user: {
          id: "2",
          username: "Bob",
          avatar: "https://avatarfiles.alphacoders.com/367/367019.png",
        },
        content: "Bạn đang làm gì vậy?",
        created_at: "2024-09-24T09:06:00",
      },
      {
        id: "m5",
        user: {
          id: "1",
          username: "Alice",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
        },
        content: "Mình đang tìm hiểu về cách sửa lỗi null pointer trong API.",
        created_at: "2024-09-24T09:10:00",
      },
    ],
  },
  {
    id: "dm2", 
    participants: [
      {
        id: "1",
        username: "Alice",
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
      },
      {
        id: "3",
        username: "Charlie",
        avatar: "https://avatarfiles.alphacoders.com/160/thumb-160594.png",
      }
    ],
    messages: [
      {
        id: "m1",
        user: {
          id: "1",
          username: "Alice",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
        },
        content: "Chào Charlie, dạo này bạn thế nào?",
        created_at: "2024-09-25T10:00:00",
      },
      {
        id: "m2",
        user: {
          id: "3",
          username: "Charlie",
          avatar: "https://avatarfiles.alphacoders.com/160/thumb-160594.png",
        },
        content: "Chào Alice, mình đang ổn. Còn bạn?",
        created_at: "2024-09-25T10:02:00",
      },
      {
        id: "m3",
        user: {
          id: "1",
          username: "Alice",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTwFFwBmxuGhvLHukLH4hXOT6EsQDhY4CbKw&s",
        },
        content: "Mình cũng vậy. Bạn có dự án gì mới không?",
        created_at: "2024-09-25T10:05:00",
      },
      {
        id: "m4",
        user: {
          id: "3",
          username: "Charlie",
          avatar: "https://avatarfiles.alphacoders.com/160/thumb-160594.png",
        },
        content: "Mình đang làm dự án mới về AI, khá thú vị!",
        created_at: "2024-09-25T10:06:00",
      },
    ],
  },
];